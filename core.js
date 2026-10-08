/* AutoPicker Pro core — deterministic, DOM-free business rules. Currency: 10,000 KRW. */
(function(root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.AutoCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';
  const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
  function purchase(vehicle, config={}) {
    const actual = Number(config.actualPrice);
    const base = Number.isFinite(actual) && actual>0 ? actual : Number(vehicle.price || 0);
    const chosenOptions = Array.isArray(config.options) ? config.options : [];
    const optionCost = chosenOptions.reduce((sum,o)=>sum+Math.max(0,Number(o.price)||0),0);
    const manualExtras = Math.max(0,Number(config.extraBudget)||0);
    const vehiclePrice = base + optionCost + manualExtras;
    const taxRate = clamp(Number(config.taxRate ?? (vehicle.body==='경차'?4:7)),0,15);
    // Estimate: Korean acquisition taxable amount approximated as VAT-exclusive sales price.
    const taxBeforeCredit = Math.round((vehiclePrice / 1.1) * taxRate / 100);
    const taxCredit = clamp(Number(config.taxCredit)||0,0,taxBeforeCredit);
    const tax = Math.max(0,taxBeforeCredit-taxCredit);
    const fees = clamp(Number(config.fees ?? 15),0,2000);
    const subsidy = clamp(Number(config.subsidy)||0,0,vehicle.power==='EV' ? vehiclePrice : 0);
    const total = Math.max(0,vehiclePrice + tax + fees - subsidy);
    const upfrontPercent = clamp(Number(config.downPayment ?? 30),0,100);
    const principal = Math.max(0,vehiclePrice * (1-upfrontPercent/100));
    const months = clamp(Math.round(Number(config.months ?? 48)),1,120);
    const annualRate = clamp(Number(config.apr ?? 4.8),0,50) / 100;
    const r=annualRate/12;
    const monthly = r ? principal*r*Math.pow(1+r,months)/(Math.pow(1+r,months)-1) : principal/months;
    const cash = Math.max(0,total-principal);
    return {base,optionCost,manualExtras,vehiclePrice,taxBeforeCredit,taxCredit,tax,taxRate,fees,subsidy,total,principal,monthly,cash,months,annualRate};
  }
  function evaluate(v,p={}) {
    const reasons=[], flags=[]; let points=0, max=0;
    const push=(weight,fraction,positive,bad)=>{
      max+=weight; points+=weight*clamp(fraction,0,1);
      if(fraction>=0.75&&positive)reasons.push(positive);
      if(fraction<0.5&&bad)flags.push(bad);
    };
    const seats=Number(p.seats)||0;
    if(seats>0 && Number.isFinite(v.seats) && v.seats<seats) return null; // hard constraint when seats confirmed
    if(seats>=4) push(12, v.size>=3?1:v.size===2?0.72:0.3, v.size>=3?'동승자를 위한 공간을 고려할 수 있어요':'', v.size===1?'5인승이라도 작은 차체로 뒷좌석이 좁을 수 있어요':'');
    if(p.budget>0 && Number.isFinite(v.price) && v.price>0){
      const baseTotal=purchase(v,{extraBudget:0,subsidy:0}).total;
      const ratio=baseTotal/p.budget;
      push(26,ratio<=1?1:ratio<=1.1?0.5:ratio<=1.25?0.15:0,baseTotal<=p.budget?'입력 예산 안에서 기본 구매비용을 고려할 수 있어요':'', '예산을 넘길 가능성이 높아요');
    }
    if(p.budget>0 && (!Number.isFinite(v.price)||v.price<=0))flags.push('공식 가격이 확인되지 않아 총예산 충족 여부를 판단할 수 없습니다');
    if(seats>0 && !Number.isFinite(v.seats))flags.push('인승 정보 미검증 · 반드시 제조사에서 확인');
    if(p.body&&p.body!=='any') push(13,v.body===p.body?1:0, '선호하는 '+v.body+' 형태예요','원하는 차체 형태가 아니에요');
    if(p.power&&p.power!=='any') push(20,v.power===p.power?1:0,'선호하는 동력방식에 부합해요','동력방식 선호와 달라요');
    if(p.origin&&p.origin!=='any') push(9,v.origin===p.origin?1:0,'선호하는 '+v.origin+' 브랜드예요','국산/수입 선호와 달라요');
    if(p.parking==='tight') push(11,v.size<=2?1:v.size===3?0.35:0, v.size<=2?'좁은 주차공간에 상대적으로 유리해요':'','차체 크기가 주차에 부담될 수 있어요');
    else if(p.parking==='normal') push(6,v.size<=3?1:0.5, v.size<=3?'보편적인 크기의 차량이에요':'','차체가 큰 편이에요');
    if(p.charger==='none' && v.power==='EV') {push(22,0,'','생활권 충전 환경이 부족해요');}
    if((p.charger==='home'||p.charger==='work')&&v.power==='EV') push(8,1,'충전 여건이 있어 전기차를 고려할 수 있어요');
    if(p.km>=15000) push(10,['EV','HEV','PHEV'].includes(v.power)?1:0.35,['EV','HEV','PHEV'].includes(v.power)?'장거리 이용 시 에너지 비용을 줄일 가능성이 있어요':'');
    if(Array.isArray(p.priorities)&&p.priorities.length){
      for(const tag of p.priorities){
        let fit=v.tags.includes(tag)?1:0.15;
        if(tag==='safety') continue; // no unverified crash-test safety scoring
        push(6,fit,fit===1?{economy:'경제성',cargo:'적재 공간',comfort:'안락함',tech:'디지털 기능',city:'도심 활용',thirdrow:'다인승',performance:'주행 성능',family:'가족 활용',beginner:'초보 운전' }[tag]+'에 맞춘 후보예요':'');
      }
    }
    if(max===0) return {score:65,reasons:['선택 조건이 적어 폭넓게 보여드려요'],flags:[]};
    return {score:Math.round(clamp(points/max*100,0,100)),reasons:[...new Set(reasons)].slice(0,4),flags:[...new Set(flags)].slice(0,4)};
  }
  function rank(vehicles, p={}) {
    return vehicles.map(v=>{const rating=evaluate(v,p);return rating?{...v,...rating}:null;})
      .filter(Boolean).sort((a,b)=>b.score-a.score || (a.price||Number.POSITIVE_INFINITY)-(b.price||Number.POSITIVE_INFINITY));
  }
  function sanitizeOptions(options,selection) {
    let picked=new Set(selection||[]);
    let changed=true;
    while(changed){
      changed=false;
      for(const option of options){
        if(picked.has(option.id) && option.requires && !option.requires.every(req=>picked.has(req))) {picked.delete(option.id);changed=true;}
      }
    }
    return options.filter(o=>picked.has(o.id));
  }
  function money(value) {return (Math.round(Number(value||0)*10)/10).toLocaleString('ko-KR',{maximumFractionDigits:1})+'만 원';}
  return {purchase,evaluate,rank,sanitizeOptions,money};
});
