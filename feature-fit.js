/* AutoPicker Pro v2.2.0 — verified feature-level matching, no fabricated trim availability. */
(function(root,factory){const api=factory(root.AutoCore,root.AutoVerified);if(typeof module!=='undefined'&&module.exports)module.exports=api;root.AutoFeatureFit=api;})(typeof globalThis!=='undefined'?globalThis:this,function(core,verified){
'use strict';
const FEATURES=[
 ['surround','어라운드뷰(360°)','주차 시 주변을 화면으로 확인'],
 ['cruise','스마트 크루즈','앞차 간격 유지·정차/재출발 (자율주행 아님)'],
 ['lane','차로 유지 보조','차선 중앙 유지 지원, 운전자 주시 필수'],
 ['hda','고속도로 주행 보조','고속도로 운전 보조 (자율주행 아님)'],
 ['vent','앞좌석 통풍 시트','여름철 시트 통풍'],
 ['hud','헤드업 디스플레이','전방 유리에 주행 정보 표시'],
 ['trunk','전동 트렁크','버튼으로 트렁크 개폐'],
 ['sunroof','파노라마 선루프','넓은 유리 지붕'],
 ['awd','사륜구동(AWD/4WD)','네 바퀴 구동'],
 ['park','주차 거리 경고','장애물 거리 알림']
].map(([id,name,description])=>({id,name,description}));
const RULES={
 seltos:{
  trendy:{seats:5,base:['cruise','lane','park'],opt:{monitor:['surround'],hud:['hud'],roof:['sunroof'],awd:['awd']}},
  prestige:{seats:5,base:['cruise','lane','hda','vent','park'],opt:{monitor:['surround'],hud:['hud'],roof:['sunroof'],awd:['awd']}},
  signature:{seats:5,base:['cruise','lane','hda','vent','park'],opt:{monitor:['surround'],hud:['hud'],roof:['sunroof'],awd:['awd']}}
 },
 carnival:{p9:{seats:9,base:['cruise','lane','hda','vent','trunk','park'],opt:{monitor:['surround']}}}
};
// Only positively corroborated features are matched. A feature missing from this mapping = unverified, not absent.
function featuresFor(vehicleId,trim,optionIds){const rule=RULES[vehicleId]?.[trim.id];if(!rule)return null;const set=new Set(rule.base);for(const id of optionIds){for(const f of (rule.opt[id]||[]))set.add(f);}return [...set];}
function optionClosure(options,selected){const byId=new Map(options.map(o=>[o.id,o]));const out=new Set(selected);let changed=true;while(changed){changed=false;for(const id of [...out]){const o=byId.get(id);if(!o)return null;for(const dep of o.requires||[]){if(!byId.has(dep))return null;if(!out.has(dep)){out.add(dep);changed=true;}}}}
return options.filter(o=>out.has(o.id));}
function fitVerified(v,p={},wanted=[]){const audit=verified.get(v.id);if(!audit)return null;const required=[...new Set(wanted)].filter(id=>FEATURES.some(f=>f.id===id));let best=null;let possible=false;
for(const trim of audit.trims){const rule=RULES[v.id]?.[trim.id];if(!rule || rule.seats<(Number(p.seats)||1))continue;
const baseSet=new Set(rule.base);const requiredOpt=required.filter(f=>!baseSet.has(f));
const ids=trim.options.filter(o=>requiredOpt.some(f=>(rule.opt[o.id]||[]).includes(f))).map(o=>o.id);
const noCoverage=requiredOpt.some(f=>!ids.some(id=>(rule.opt[id]||[]).includes(f)));
if(noCoverage)continue;
// Bounded exhaustive search of covering selections; dependencies are added to total precisely once.
const limit=1<<ids.length;for(let mask=0;mask<limit;mask++){
 const selected=ids.filter((_,i)=>mask&(1<<i));const opts=optionClosure(trim.options,selected);if(!opts)continue;
 const optionIds=opts.map(o=>o.id);const available=new Set(featuresFor(v.id,trim,optionIds)||[]);
 if(!required.every(f=>available.has(f)))continue;possible=true;
 const estimate=core.purchase(v,{actualPrice:trim.price,options:opts,fees:15,subsidy:0,taxCredit:0});
 const candidate={status:'verified',vehicleId:v.id,trimId:trim.id,trimName:trim.name,seats:rule.seats,optionIds,optionNames:opts.map(o=>o.name),features:[...available],estimate,priceDate:audit.priceDate,source:audit.url,withinBudget:!Number(p.budget)||estimate.total<=Number(p.budget)};
 if(!best || (!candidate.withinBudget===!best.withinBudget ? candidate.estimate.total<best.estimate.total : candidate.withinBudget))best=candidate;
 }
}
if(!best)return {status:'unavailable',vehicleId:v.id,reason:'검증된 트림에서 선택 기능을 모두 확인할 수 없습니다.',required};
return {...best,reason:best.withinBudget?'':'필수 옵션을 포함하면 최대 예산을 초과합니다.',required,possible};
}
function recommend(vehicles,p={},coreRank){const wanted=Array.isArray(p.requiredFeatures)?p.requiredFeatures:[];const ranked=coreRank(vehicles,p);let confirmed=[],pending=[],overBudget=[],unavailable=[];
for(const v of ranked){const exact=fitVerified(v,p,wanted);if(exact){if(exact.status==='unavailable')unavailable.push({...v,fit:exact});else if(!exact.withinBudget)overBudget.push({...v,fit:exact});else confirmed.push({...v,fit:exact});}
else {const rough=core.purchase(v,{fees:15}).total; if(!p.budget || rough<=Number(p.budget))pending.push({...v,fit:{status:'pending',vehicleId:v.id,reason:wanted.length?'요청 옵션의 트림별 기본/추가 적용 여부 미검증':'트림별 실제 가격과 기본 옵션 미검증',estimatedBaseTotal:rough}});}
}
confirmed.sort((a,b)=>b.score-a.score || a.fit.estimate.total-b.fit.estimate.total);
pending.sort((a,b)=>b.score-a.score || a.price-b.price);
overBudget.sort((a,b)=>a.fit.estimate.total-b.fit.estimate.total);
return {confirmed,pending,overBudget,unavailable,ordered:[...confirmed,...pending]};}
return {FEATURES,RULES,featuresFor,optionClosure,fitVerified,recommend};
});
