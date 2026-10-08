/* AutoPicker Pro v2.3.0 — manufacturer package optimizer. Currency in 10,000 KRW. */
(function(root,factory){const api=factory(root.AutoCore,root.AutoVerified);if(typeof module!=='undefined'&&module.exports)module.exports=api;root.AutoFeatureFit=api;})(typeof globalThis!=='undefined'?globalThis:this,function(core,verified){
'use strict';
const FEATURES=[
 ['surround','어라운드뷰(360°)','주변을 카메라 화면으로 확인'],
 ['cruise','스마트 크루즈','앞차 간격 유지·정차/출발 보조 (자율주행 아님)'],
 ['lane','차로 유지 보조','차선 중앙 유지 지원, 운전자 주시 필수'],
 ['hda','고속도로 주행 보조','고속도로 운전 보조 (자율주행 아님)'],
 ['vent','앞좌석 통풍 시트','앞좌석 시트 통풍'],
 ['hud','헤드업 디스플레이','전방 유리에 정보 표시'],
 ['trunk','전동 트렁크','전동식 테일게이트'],
 ['sunroof','파노라마 선루프','넓은 유리 지붕(동급 대체 포함)'],
 ['awd','사륜구동(AWD/4WD)','네 바퀴 구동'],
 ['park','주차 거리 경고','장애물 거리 알림'],
 ['audio','프리미엄 오디오','제조사 프리미엄 오디오 시스템']
].map(([id,name,description])=>({id,name,description}));
const FEATURE_IDS=new Set(FEATURES.map(x=>x.id));
function optionClosure(options, selected){
 const byId=new Map(options.map(o=>[o.id,o]));const picked=new Set(selected||[]);
 for(let i=0;i<options.length+1;i++){
  let changed=false;
  for(const id of [...picked]){
   const o=byId.get(id);if(!o)return null;
   for(const dep of o.requires||[]){if(!byId.has(dep))return null;if(!picked.has(dep)){picked.add(dep);changed=true;}}
  }
  if(!changed)break;
  if(i===options.length)return null;
 }
 for(const id of picked){const item=byId.get(id);if((item.excludes||[]).some(x=>picked.has(x)))return null;if(item.group&&[...picked].some(x=>x!==id&&byId.get(x).group===item.group))return null;}
 return options.filter(x=>picked.has(x.id));
}
function appliedFeatures(trim, options){return [...new Set([...(trim.baseFeatures||[]),...options.flatMap(o=>o.features||[])])];}
function appliedSeats(trim,options){return options.find(o=>o.seatCount)?.seatCount || trim.seats || 0;}
function fitVerified(v,p={},wanted=[],config={}){
 const audit=verified.get(v.id);if(!audit)return null;
 const required=[...new Set(wanted)].filter(id=>FEATURE_IDS.has(id));
 const people=Math.max(1,Number(p.seats)||1),maxBudget=Number(p.budget)||0;
 const trims=audit.trims.filter(t=>!config.trimId||t.id===config.trimId);
 let best=null;
 for(const trim of trims){
  const locked=new Set(config.lockedOptionIds||[]);
  const relevant=trim.options.filter(o=>locked.has(o.id)||(o.features||[]).some(id=>required.includes(id))||(o.seatCount&&people>trim.seats));
  const choices=relevant.filter(o=>!locked.has(o.id));
  if(choices.length>18)continue;
  for(let bits=0;bits<(1<<choices.length);bits++){
   const selected=[...locked,...choices.filter((o,i)=>bits&(1<<i)).map(o=>o.id)];
   const opts=optionClosure(trim.options,selected);if(!opts)continue;
   const features=appliedFeatures(trim,opts),seats=appliedSeats(trim,opts);
   if(seats<people||required.some(id=>!features.includes(id)))continue;
   const estimate=core.purchase(v,{actualPrice:trim.price,options:opts,fees:15,subsidy:0,taxCredit:0});
   const withinBudget=!maxBudget||estimate.total<=maxBudget;
   const candidate={status:'verified',vehicleId:v.id,trimId:trim.id,trimName:trim.name,seats,optionIds:opts.map(o=>o.id),optionNames:opts.map(o=>o.name),options:opts,features,baseFeatures:[...(trim.baseFeatures||[])],estimate,withinBudget,priceDate:audit.priceDate,source:audit.url,required,manualOptionIds:[...locked],automaticOptionIds:opts.filter(o=>!locked.has(o.id)).map(o=>o.id)};
   if(!best||(candidate.withinBudget&&!best.withinBudget)||candidate.withinBudget===best.withinBudget&&candidate.estimate.total<best.estimate.total)best=candidate;
  }
 }
 if(!best)return {status:'unavailable',vehicleId:v.id,required,reason:config.trimId?'현재 선택한 트림에서 해당 좌석 수·필수 기능·옵션 조합을 공식 자료로 확인하지 못했습니다.':'공식 등록된 트림에서 해당 좌석 수·필수 기능 조합을 확인하지 못했습니다.'};
 return {...best,reason:best.withinBudget?'':'선택한 필수 옵션을 포함하면 최대 예산을 초과합니다.'};
}
function recommend(vehicles,p={},coreRank){const wanted=Array.isArray(p.requiredFeatures)?p.requiredFeatures:[];const ranked=coreRank(vehicles,p);let confirmed=[],pending=[],overBudget=[],unavailable=[];
 for(const v of ranked){const exact=fitVerified(v,p,wanted);
  if(exact){if(exact.status==='unavailable')unavailable.push({...v,fit:exact});else if(!exact.withinBudget)overBudget.push({...v,fit:exact});else confirmed.push({...v,fit:exact});}
  else {const rough=core.purchase(v,{fees:15}).total;if(!p.budget||rough<=Number(p.budget))pending.push({...v,fit:{status:'pending',vehicleId:v.id,reason:'공식 트림별 옵션/패키지와 실제 가격이 아직 매핑되지 않아 확정 불가',estimatedBaseTotal:rough}});}
 }
 confirmed.sort((a,b)=>b.score-a.score||a.fit.estimate.total-b.fit.estimate.total);pending.sort((a,b)=>b.score-a.score||a.price-b.price);overBudget.sort((a,b)=>a.fit.estimate.total-b.fit.estimate.total);
 return {confirmed,pending,overBudget,unavailable,ordered:[...confirmed,...pending]};
}
return {FEATURES,optionClosure,appliedFeatures,appliedSeats,fitVerified,recommend};
});

