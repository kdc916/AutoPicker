/* Audited manufacturer subset. Prices in KRW 10,000 units, manufacturer price tables dated 2026-10-01. */
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;root.AutoVerified=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const o=(id,name,price,requires)=>({id,name,price,...(requires?{requires}:{})});
const white=o('white','스노우 화이트 펄',8), cluster=o('cluster','12.3인치 클러스터',40),connect=o('connect','스마트 커넥트',69,['cluster']),drive=o('drive','드라이브 와이즈',119,['cluster']);
const catalog={
seltos:{reviewed:'2026-10-08',priceDate:'2026-10-01',url:'https://www.kia.com/kr/vehicles/seltos/price',note:'1.6 가솔린 터보 기준. 선택품목은 제조사 공개 가격표의 일부를 반영합니다.',trims:[
{id:'trendy',name:'트렌디',price:2512,options:[white,o('style','스타일',109),o('convenience','컨비니언스',64),o('nav','12.3인치 내비게이션',109),o('camera','빌트인 캠 2 플러스',45,['nav']),o('cluster','12.3인치 클러스터',40,['nav']),connect,drive,o('awd','전자식 4WD',198,['style'])]},
{id:'prestige',name:'프레스티지',price:2880,options:[white,o('style','스타일',89),o('awd','전자식 4WD',198),o('camera','빌트인 캠 2 플러스',45),cluster,connect,drive,o('monitor','모니터링',104,['cluster']),o('hud','헤드업 디스플레이',59,['cluster']),o('comfort','컴포트',104),o('roof','파노라마 선루프',109)]},
{id:'signature',name:'시그니처',price:3145,options:[white,o('style','스타일',89),o('awd','전자식 4WD',198),o('camera','빌트인 캠 2 플러스',45),o('drive','드라이브 와이즈',79),o('monitor','모니터링',104),o('hud','헤드업 디스플레이',59),o('comfort','컴포트',45),o('roof','파노라마 선루프',109)]}
]},
carnival:{reviewed:'2026-10-08',priceDate:'2026-10-01',url:'https://www.kia.com/kr/vehicles/carnival/price',note:'2027 카니발 3.5 가솔린 9인승 프레스티지 기준. 다른 인승/트림은 제조사 견적에서 확인하세요.',trims:[
{id:'p9',name:'3.5 가솔린 프레스티지 · 9인승',price:3686,options:[white,o('convenience','컨비니언스',110),o('style','스타일',70),o('cluster','12.3인치 클러스터',60),o('drive','드라이브 와이즈',120,['cluster']),o('monitor','모니터링 팩',90,['cluster'])]}
]}};
function get(vehicleId){return catalog[vehicleId]||null;}
function trim(vehicleId,trimId){const spec=get(vehicleId);return spec?spec.trims.find(t=>t.id===trimId)||spec.trims[0]:null;}
function normalize(vehicleId,config={}){const t=trim(vehicleId,config.trimId);if(!t)return {...config,optionIds:[]};const allowed=new Map(t.options.map(x=>[x.id,x]));const picked=new Set((config.optionIds||[]).filter(id=>allowed.has(id)));let changed=true;while(changed){changed=false;for(const id of [...picked])if((allowed.get(id)?.requires||[]).some(dep=>!picked.has(dep))){picked.delete(id);changed=true;}}return {...config,trimId:t.id,optionIds:[...picked]};}
function options(vehicleId,config={}){const t=trim(vehicleId,config.trimId);return t?normalize(vehicleId,config).optionIds.map(id=>t.options.find(o=>o.id===id)):[];}
return {catalog,get,trim,normalize,options};
});