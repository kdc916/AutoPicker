/* AutoPicker Pro v2.3.0: manufacturer price-table subset; KRW in units of 10,000.
   A supported vehicle/trim is not a promise of every unlisted option being available.
   Features are positively mapped from official standard equipment or listed packages only.
*/
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;root.AutoVerified=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const o=(id,name,price,extra={})=>({id,name,price,...extra});
const f=(...xs)=>xs;
const seat=(n,price)=>o('seat'+n,n+'인승 좌석 구성',price,{seatCount:n,group:'seats'});
const catalog={
 seltos:{reviewed:'2026-10-08',priceDate:'2026-10-01',url:'https://www.kia.com/kr/vehicles/seltos/price/',note:'1.6 가솔린 터보 가격표의 트림 및 일부 주요 선택품목. 사진/파워트레인 옵션과 연식 확인 필요.',trims:[
  {id:'trendy',name:'1.6T 트렌디 (5인승)',price:2512,seats:5,baseFeatures:f('cruise','lane','park'),options:[o('white','스노우 화이트 펄',8),o('style','스타일',109),o('convenience','컨비니언스',64),o('nav','12.3인치 내비게이션',109),o('camera','빌트인 캠 2 플러스',45,{requires:['nav']}),o('cluster','12.3인치 클러스터',40,{requires:['nav']}),o('connect','스마트 커넥트',69,{requires:['cluster']}),o('drive','드라이브 와이즈',119,{requires:['cluster']}),o('awd','전자식 4WD',198,{requires:['style'],features:['awd']})]},
  {id:'prestige',name:'1.6T 프레스티지 (5인승)',price:2880,seats:5,baseFeatures:f('cruise','lane','hda','vent','park'),options:[o('white','스노우 화이트 펄',8),o('style','스타일',89),o('awd','전자식 4WD',198,{features:['awd']}),o('camera','빌트인 캠 2 플러스',45),o('cluster','12.3인치 클러스터',40),o('connect','스마트 커넥트',69,{requires:['cluster']}),o('drive','드라이브 와이즈',79),o('monitor','모니터링',104,{features:['surround']}),o('hud','헤드업 디스플레이',59,{features:['hud']}),o('comfort','컴포트',45),o('roof','파노라마 선루프',109,{features:['sunroof']})]},
  {id:'signature',name:'1.6T 시그니처 (5인승)',price:3145,seats:5,baseFeatures:f('cruise','lane','hda','vent','park'),options:[o('white','스노우 화이트 펄',8),o('style','스타일',89),o('awd','전자식 4WD',198,{features:['awd']}),o('camera','빌트인 캠 2 플러스',45),o('drive','드라이브 와이즈',79),o('monitor','모니터링',104,{features:['surround']}),o('hud','헤드업 디스플레이',59,{features:['hud']}),o('comfort','컴포트',45),o('roof','파노라마 선루프',109,{features:['sunroof']})]}
 ]},
 carnival:{reviewed:'2026-10-08',priceDate:'2026-10-01',url:'https://www.kia.com/kr/vehicles/carnival/price/',note:'3.5 가솔린 9인승 프레스티지 기준. 다른 엔진 및 7인승 가격과 혼용 금지.',trims:[
  {id:'p9',name:'3.5 가솔린 프레스티지 (9인승)',price:3686,seats:9,baseFeatures:f('cruise','lane','hda','vent','trunk','park'),options:[o('white','스노우 화이트 펄',8),o('convenience','컨비니언스',110),o('style','스타일',70),o('cluster','12.3인치 클러스터',60),o('drive','드라이브 와이즈',120,{requires:['cluster']}),o('monitor','모니터링 팩',90,{requires:['cluster'],features:['surround']})]}
 ]},
 'santafe-hev':{reviewed:'2026-10-08',priceDate:'2026-10-01',url:'https://www.hyundai.com/kr/ko/e/vehicles/santafe-hybrid/price',note:'싼타페 Hybrid 2WD 세제혜택 후 차량가. 5인승 기본, 6·7인승 유료 선택. AWD·액세서리는 별도 확인.',trims:[
  {id:'ex2wd',name:'1.6 HEV 2WD 익스클루시브',price:4022,seats:5,baseFeatures:f('cruise','lane','hda','vent','trunk','park'),options:[seat(6,104),seat(7,69),o('cam','빌트인 캠 2 · 증강현실 내비',45),o('roof','듀얼 와이드 선루프 + 루프랙',99,{features:['sunroof']}),o('passenger','동승석 8way 전동시트',20),o('hud','헤드업 디스플레이',59,{features:['hud']}),o('parking','파킹 어시스트 플러스Ⅰ',119,{features:['surround'],excludes:['best']}),o('platinum','플래티넘Ⅰ',45,{excludes:['best']}),o('best','베스트 셀렉션Ⅰ',150,{features:['surround'],excludes:['parking','platinum']})]},
  {id:'pre2wd',name:'1.6 HEV 2WD 프레스티지',price:4309,seats:5,baseFeatures:f('cruise','lane','hda','vent','trunk','park'),options:[seat(6,104),seat(7,69),o('cam','빌트인 캠 2 · 증강현실 내비',45),o('roof','듀얼 와이드 선루프',89,{features:['sunroof']}),o('hud','헤드업 디스플레이',59,{features:['hud']}),o('seatplus','시트플러스',74),o('parking','파킹 어시스트 플러스Ⅰ',119,{features:['surround']}),o('design','디자인 플러스Ⅱ',85),o('wheel','20인치 휠 & 타이어',49)]},
  {id:'hp2wd',name:'1.6 HEV 2WD H-Pick',price:4573,seats:5,baseFeatures:f('cruise','lane','hda','vent','trunk','park','surround','hud'),options:[seat(6,104),seat(7,69),o('cam','빌트인 캠 2 · 증강현실 내비',45),o('roof','듀얼 와이드 선루프',89,{features:['sunroof']}),o('bose','BOSE 프리미엄 사운드',64,{features:['audio']}),o('wheel','20인치 휠 & 타이어',49)]},
  {id:'cal2wd',name:'1.6 HEV 2WD 캘리그래피',price:4877,seats:5,baseFeatures:f('cruise','lane','hda','vent','trunk','park','surround','hud'),options:[seat(6,104),seat(7,69),o('cam','빌트인 캠 2 · 증강현실 내비',45),o('roof','듀얼 와이드 선루프',89,{features:['sunroof']}),o('bose','BOSE 프리미엄 사운드',64,{features:['audio']})]}
 ]},
 palisade:{reviewed:'2026-10-08',priceDate:'2026-10-01',url:'https://www.hyundai.com/kr/ko/e/vehicles/palisade/price',note:'신형 팰리세이드 가솔린 2.5T 9인승 기준 확인 트림만 수록. 다른 7인승/하이브리드와 가격 혼합 금지.',trims:[
  {id:'exclusive9',name:'2.5T 가솔린 익스클루시브 · 9인승',price:4478,seats:9,baseFeatures:f('cruise','lane','hda','park'),options:[o('awd','HTRAC · 험로주행모드',228,{features:['awd']}),o('roof','듀얼 와이드 선루프',85,{features:['sunroof']}),o('cam','빌트인 캠 2 Plus · 증강현실 내비',66),o('comfort','컴포트',133),o('parking','파킹 어시스트',113,{features:['surround']})]},
  {id:'hpick9',name:'2.5T 가솔린 H-Pick · 9인승',price:5040,seats:9,baseFeatures:f('cruise','lane','hda','park','surround','hud','trunk'),options:[o('awd','HTRAC · 험로주행모드',228,{features:['awd']}),o('roof','듀얼 와이드 선루프',85,{features:['sunroof']}),o('cam','빌트인 캠 2 Plus · 증강현실 내비',66),o('comfortplus','컴포트 플러스(9인승)',185)]}
 ]}
};
function get(id){return catalog[id]||null;}
function trim(id,trimId){const spec=get(id);return spec?.trims.find(t=>t.id===trimId)||spec?.trims[0]||null;}
function normalize(id,config={}){const t=trim(id,config.trimId);if(!t)return {...config,optionIds:[]};const by=new Map(t.options.map(o=>[o.id,o]));const picked=new Set((config.optionIds||[]).filter(x=>by.has(x)));let changed=true;while(changed){changed=false;for(const id of [...picked]){const item=by.get(id);if(item.requires?.some(dep=>!picked.has(dep))||item.excludes?.some(ex=>picked.has(ex))||(item.group&&t.options.some(x=>x.id!==id&&x.group===item.group&&picked.has(x.id)))){picked.delete(id);changed=true;}}}return {...config,trimId:t.id,optionIds:t.options.filter(o=>picked.has(o.id)).map(o=>o.id)};}
function options(id,config={}){const t=trim(id,config.trimId);return t?normalize(id,config).optionIds.map(key=>t.options.find(o=>o.id===key)):[];}
return {catalog,get,trim,normalize,options};
});

