/* AutoPicker Pro v2.6.0: manufacturer price-table subset; KRW in units of 10,000.
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

 ]},
 sportage:{reviewed:'2026-10-08',priceDate:'2026-09-01',url:'https://www.kia.com/kr/vehicles/sportage/price',note:'2027 스포티지 1.6 가솔린 터보 공식 표기 3개 트림만 반영. 2.0 LPG/하이브리드 가격 제외.',trims:[
  {id:'gas-prestige',name:'1.6T 가솔린 프레스티지 2WD · 5인승',price:2944,seats:5,baseFeatures:f('cruise','lane','hda','park'),options:[o('white','스노우 화이트 펄',8),o('awd','전자식 4WD',223,{features:['awd']}),o('style','스타일',69),o('comfort','컴포트Ⅰ',104),o('cam','빌트인 캠 2',45),o('roof','파노라마 선루프',119,{features:['sunroof']})]},
  {id:'gas-noblesse',name:'1.6T 가솔린 노블레스 2WD · 5인승',price:3322,seats:5,baseFeatures:f('cruise','lane','hda','park','vent','trunk'),options:[o('white','스노우 화이트 펄',8),o('awd','전자식 4WD',223,{features:['awd']}),o('monitor','모니터링',114,{features:['surround']}),o('hud','헤드업 디스플레이',59,{features:['hud']}),o('audio','KRELL 프리미엄 사운드',59,{features:['audio']}),o('roof','파노라마 선루프',109,{features:['sunroof']}),o('cam','빌트인 캠 2',45)]},
  {id:'gas-signature',name:'1.6T 가솔린 시그니처 2WD · 5인승',price:3557,seats:5,baseFeatures:f('cruise','lane','hda','park','vent','trunk','hud'),options:[o('white','스노우 화이트 펄',8),o('awd','전자식 4WD',223,{features:['awd']}),o('monitor','모니터링',114,{features:['surround']}),o('audio','KRELL 프리미엄 사운드',59,{features:['audio']}),o('roof','파노라마 선루프',109,{features:['sunroof']}),o('cam','빌트인 캠 2',45)]}
 ]},
 'sportage-hev':{reviewed:'2026-10-08',priceDate:'2026-09-01',url:'https://www.kia.com/kr/vehicles/sportage/price',note:'2027 스포티지 1.6 터보 HEV 세제혜택 후 2WD 트림가. 4WD 유료 옵션은 해당 트림 표기만 반영.',trims:[
  {id:'hev-prestige',name:'1.6 HEV 프레스티지 2WD · 5인승',price:3436,seats:5,baseFeatures:f('cruise','lane','hda','park'),options:[o('white','스노우 화이트 펄',8),o('awd','전자식 4WD',223,{features:['awd']}),o('style','스타일',69),o('comfort','컴포트Ⅰ',104),o('cam','빌트인 캠 2',45),o('roof','파노라마 선루프',119,{features:['sunroof']})]},
  {id:'hev-noblesse',name:'1.6 HEV 노블레스 2WD · 5인승',price:3803,seats:5,baseFeatures:f('cruise','lane','hda','park','vent','trunk'),options:[o('white','스노우 화이트 펄',8),o('awd','전자식 4WD',223,{features:['awd']}),o('monitor','모니터링',114,{features:['surround']}),o('hud','헤드업 디스플레이',59,{features:['hud']}),o('audio','KRELL 프리미엄 사운드',59,{features:['audio']}),o('roof','파노라마 선루프',109,{features:['sunroof']}),o('cam','빌트인 캠 2',45)]},
  {id:'hev-signature',name:'1.6 HEV 시그니처 2WD · 5인승',price:4038,seats:5,baseFeatures:f('cruise','lane','hda','park','vent','trunk','hud'),options:[o('white','스노우 화이트 펄',8),o('awd','전자식 4WD',223,{features:['awd']}),o('monitor','모니터링',114,{features:['surround']}),o('audio','KRELL 프리미엄 사운드',59,{features:['audio']}),o('roof','파노라마 선루프',109,{features:['sunroof']}),o('cam','빌트인 캠 2',45)]}
 ]},
 sorento:{reviewed:'2026-10-08',priceDate:'2026-10-01',url:'https://www.kia.com/kr/vehicles/sorento/price',note:'2027 쏘렌토 2.5 가솔린 터보 5인승 2WD 시작 트림 및 좌석·옵션 가격. 모니터링은 노블레스 이상 기본사양.',trims:[
  {id:'gas-prestige',name:'2.5T 가솔린 프레스티지 2WD',price:3641,seats:5,baseFeatures:f('cruise','lane','hda','vent','trunk','park'),options:[seat(6,84),seat(7,69),o('white','스노우 화이트 펄',8),o('awd','전자식 4WD',232,{features:['awd']}),o('style','스타일',124),o('cluster','12.3인치 클러스터',59),o('drive','드라이브 와이즈',129,{requires:['cluster']}),o('hud','HUD + 빌트인 캠 2',119,{requires:['cluster'],features:['hud']}),o('roof','파노라마 선루프',109,{features:['sunroof']})]},
  {id:'gas-noblesse',name:'2.5T 가솔린 노블레스 2WD',price:3966,seats:5,baseFeatures:f('cruise','lane','hda','vent','trunk','park','surround'),options:[seat(6,84),seat(7,69),o('white','스노우 화이트 펄',8),o('awd','전자식 4WD',232,{features:['awd']}),o('style','스타일',114),o('drive','드라이브 와이즈',129),o('hud','HUD + 빌트인 캠 2',119,{features:['hud']}),o('audio','KRELL 프리미엄 사운드',64,{features:['audio']}),o('roof','파노라마 선루프',109,{features:['sunroof']})]}
 ]},
 'sorento-hev':{reviewed:'2026-10-08',priceDate:'2026-10-01',url:'https://www.kia.com/kr/vehicles/sorento/price',note:'2027 쏘렌토 1.6 터보 하이브리드 2WD 세제혜택 후 판매가. AWD는 별도 모델군으로 이 트림 선택에서 제외.',trims:[
  {id:'hev-prestige',name:'1.6 HEV 프레스티지 2WD',price:3963,seats:5,baseFeatures:f('cruise','lane','hda','vent','trunk','park'),options:[seat(6,84),seat(7,69),o('white','스노우 화이트 펄',8),o('style','스타일',124),o('cluster','12.3인치 클러스터',59),o('drive','드라이브 와이즈',129,{requires:['cluster']}),o('hud','HUD + 빌트인 캠 2',119,{requires:['cluster'],features:['hud']}),o('roof','파노라마 선루프',109,{features:['sunroof']})]},
  {id:'hev-noblesse',name:'1.6 HEV 노블레스 2WD',price:4299,seats:5,baseFeatures:f('cruise','lane','hda','vent','trunk','park','surround'),options:[seat(6,84),seat(7,69),o('white','스노우 화이트 펄',8),o('style','스타일',114),o('drive','드라이브 와이즈',129),o('hud','HUD + 빌트인 캠 2',119,{features:['hud']}),o('audio','KRELL 프리미엄 사운드',64,{features:['audio']}),o('roof','파노라마 선루프',109,{features:['sunroof']})]}
 ]}
,
'Tucson':{reviewed:'2026-10-08',priceDate:'2026-09-01',url:'https://www.hyundai.com/kr/ko/e/vehicles/tucson/price',note:'투싼 가솔린 1.6T 2WD 일부 트림. Modern/H-Pick의 기능 매핑은 확인한 기본품목만 긍정 판정합니다. 가격 단위: 만 원.',trims:[
 {id:'gas-modern',name:'1.6T 가솔린 모던 · 5인승',price:2844,seats:5,baseFeatures:f('lane'),options:[o('awd','HTRAC · 경사로 저속 주행장치',198,{features:['awd']}),o('roof','파노라마 선루프 + 루프랙',116,{features:['sunroof']}),o('nav','인포테인먼트 내비',89),o('smart','현대 스마트센스',40,{features:['cruise']}),o('comfort','컴포트Ⅰ',69,{features:['vent']})]},
 {id:'gas-premium',name:'1.6T 가솔린 프리미엄 · 5인승',price:3112,seats:5,baseFeatures:f('lane','vent','trunk'),options:[o('awd','HTRAC · 경사로 저속 주행장치',198,{features:['awd']}),o('roof','파노라마 선루프',109,{features:['sunroof']}),o('parking','파킹어시스트Ⅰ(가솔린)',123,{features:['surround']}),o('smart','현대 스마트센스',40,{features:['cruise','hda'],excludes:['comfort2']}),o('comfort2','컴포트Ⅱ',74,{excludes:['smart']}),o('platinum','플래티넘',109,{features:['audio']})]},
 {id:'gas-hpick',name:'1.6T 가솔린 H-Pick · 5인승',price:3201,seats:5,baseFeatures:f('lane','vent','trunk','cruise','hda'),options:[o('awd','HTRAC · 경사로 저속 주행장치',198,{features:['awd']}),o('roof','파노라마 선루프',109,{features:['sunroof']}),o('parking','파킹어시스트Ⅰ(가솔린)',123,{features:['surround']}),o('platinum','플래티넘',109,{features:['audio']})]}
]},
'avante':{reviewed:'2026-10-08',priceDate:'2026-08-05',url:'https://www.hyundai.com/kr/ko/e/vehicles/the-all-new-avante/price',note:'디 올 뉴 아반떼 가솔린 공식 사이트는 표 제목에서 1.6, 기본품목에서 2.0 엔진으로 다르게 표시하므로 엔진 배기량을 확인 전 확정하지 않습니다. 전 트림 5인승.',trims:[
 {id:'gas-modern',name:'디 올 뉴 아반떼 가솔린 모던 · 5인승',price:2398,seats:5,baseFeatures:f('cruise','lane'),options:[o('display','9.9인치 슬림 디스플레이',35),o('convenience','컨비니언스Ⅰ',65),o('smart','현대 스마트센스Ⅰ',96),o('wheel','17인치 알로이 휠 & 타이어Ⅰ',32)]},
 {id:'gas-premium',name:'디 올 뉴 아반떼 가솔린 프리미엄 · 5인승',price:2771,seats:5,baseFeatures:f('cruise','lane','hda','vent'),options:[o('roof','와이드 선루프',90,{features:['sunroof']}),o('screen','플레오스 커넥트 14.6인치 + 9.9인치',83),o('smart','현대 스마트센스Ⅱ',40),o('exterior','익스테리어 디자인',140),o('platinum','플래티넘Ⅰ',93),o('comfort','컴포트',76)]},
 {id:'gas-inspiration',name:'디 올 뉴 아반떼 가솔린 인스퍼레이션 · 5인승',price:3152,seats:5,baseFeatures:f('cruise','lane','hda','vent'),options:[]}
]},
'k5':{reviewed:'2026-10-08',priceDate:'2026-10-01',url:'https://www.kia.com/kr/vehicles/k5/price/private',note:'The 2027 K5 2.0 가솔린 자가용 프레스티지/노블레스만 등록. 스마트 트렁크(자동 열림)는 전동 트렁크 기능에 포함하지 않았습니다.',trims:[
 {id:'gas-prestige',name:'2.0 가솔린 프레스티지 · 5인승',price:2892,seats:5,baseFeatures:f('cruise','lane','hda','vent','park'),options:[o('white','스노우 화이트 펄',8),o('roof','파노라마 선루프',109,{features:['sunroof']}),o('hud','HUD + 빌트인 캠 2',109,{features:['hud']}),o('drive','드라이브 와이즈',45),o('style','스타일',89),o('comfort','컴포트',99)]},
 {id:'gas-noblesse',name:'2.0 가솔린 노블레스 · 5인승',price:3244,seats:5,baseFeatures:f('cruise','lane','hda','vent','park','surround','trunk'),options:[o('white','스노우 화이트 펄',8),o('roof','파노라마 선루프',109,{features:['sunroof']}),o('hud','HUD + 빌트인 캠 2',109,{features:['hud']}),o('drive','드라이브 와이즈',45),o('audio','KRELL 프리미엄 사운드',59,{features:['audio']})]}
]},
'k5-hev':{reviewed:'2026-10-08',priceDate:'2026-10-01',url:'https://www.kia.com/kr/vehicles/k5/price/private',note:'The 2027 K5 2.0 하이브리드 자가용 세제혜택 후 가격. 5인승, 일부 선택품목. 베스트 셀렉션의 모니터링은 본 데이터에서 제외.',trims:[
 {id:'hev-prestige',name:'2.0 HEV 프레스티지 · 5인승',price:3334,seats:5,baseFeatures:f('cruise','lane','hda','vent','park'),options:[o('white','스노우 화이트 펄',8),o('roof','파노라마 선루프',109,{features:['sunroof']}),o('hud','HUD + 빌트인 캠 2',109,{features:['hud']}),o('drive','드라이브 와이즈',45),o('style','스타일',109),o('comfort','컴포트',99)]},
 {id:'hev-best',name:'2.0 HEV 베스트 셀렉션 · 5인승',price:3443,seats:5,baseFeatures:f('cruise','lane','hda','vent','park'),options:[o('white','스노우 화이트 펄',8),o('roof','파노라마 선루프',109,{features:['sunroof']}),o('monitor','모니터링',115,{features:['surround']})]},
 {id:'hev-noblesse',name:'2.0 HEV 노블레스 · 5인승',price:3670,seats:5,baseFeatures:f('cruise','lane','hda','vent','park','surround','trunk'),options:[o('white','스노우 화이트 펄',8),o('roof','파노라마 선루프',109,{features:['sunroof']}),o('hud','HUD + 빌트인 캠 2',109,{features:['hud']})]}
]},
'new-grandeur':{reviewed:'2026-10-08',priceDate:'2026-07-01',url:'https://www.hyundai.com/kr/ko/e/vehicles/the-new-grandeur/price',note:'더 뉴 그랜저 2.5 가솔린 자가용 프리미엄/익스클루시브. 3.5 엔진/HTRAC은 별도 파워트레인이므로 목록에서 제외.',trims:[
 {id:'gas-premium',name:'2.5 가솔린 프리미엄 · 5인승',price:4245,seats:5,baseFeatures:f('cruise','lane','hda'),options:[o('roof','파노라마 선루프',120,{features:['sunroof']}),o('smart','현대 스마트센스Ⅰ',140),o('parking','파킹 어시스트',170,{features:['surround']}),o('choice','프리미엄 초이스',120),o('cam','빌트인 캠 2 Plus',65)]},
 {id:'gas-exclusive',name:'2.5 가솔린 익스클루시브 · 5인승',price:4694,seats:5,baseFeatures:f('cruise','lane','hda','surround','trunk'),options:[o('roof','파노라마 선루프',120,{features:['sunroof']}),o('smart','현대 스마트센스Ⅱ',140),o('bose','BOSE 프리미엄 사운드 패키지',120,{features:['audio']}),o('cam','빌트인 캠 2 Plus',65),o('platinum','플래티넘',205)]}
]},
'new-grandeur-hev':{reviewed:'2026-10-08',priceDate:'2026-07-01',url:'https://www.hyundai.com/kr/ko/e/vehicles/the-new-grandeur-hybrid/price',note:'더 뉴 그랜저 1.6T HEV 자가용 2WD, 세제혜택 후 판매가. 5인승. 프리미엄 일부 옵션, 익스클루시브 기본사양만 확정.',trims:[
 {id:'hev-premium',name:'1.6 HEV 프리미엄 · 5인승',price:4833,seats:5,baseFeatures:f('cruise','lane','hda'),options:[o('roof','파노라마 선루프',120,{features:['sunroof']}),o('smart','현대 스마트센스Ⅰ',140),o('parking','파킹 어시스트',170,{features:['surround']}),o('choice','프리미엄 초이스',120),o('cam','빌트인 캠 2 Plus',65)]},
 {id:'hev-exclusive',name:'1.6 HEV 익스클루시브 · 5인승',price:5282,seats:5,baseFeatures:f('cruise','lane','hda','surround','trunk'),options:[o('roof','파노라마 선루프',120,{features:['sunroof']})]}
]}


,
/* 2027 Kia K8: checked 2026-09-01 official manufacturer price table; only 2.5 GAS / 1.6T HEV 2WD subset. */
'k8':{reviewed:'2026-10-08',priceDate:'2026-09-01',url:'https://www.kia.com/kr/vehicles/k8/price/private',note:'2027 K8 2.5 가솔린 자가용 일부 트림. 노블레스 라이트 운전석 통풍만으로 앞좌석(2석) 통풍을 충족했다고 판정하지 않음. 스마트 트렁크와 스마트 파워 트렁크 구분.',trims:[
 {id:'gas-25-light',name:'2.5 가솔린 노블레스 라이트 · 5인승',price:3731,seats:5,baseFeatures:f('cruise','lane','hda','park'),options:[o('white','스노우 화이트 펄',8),o('roof','파노라마 선루프',109,{features:['sunroof']}),o('style','스타일',119),o('drive','드라이브 와이즈',109)]},
 {id:'gas-25-best',name:'2.5 가솔린 베스트 셀렉션 · 5인승',price:4172,seats:5,baseFeatures:f('cruise','lane','hda','park','surround','vent','trunk'),options:[o('roof','파노라마 선루프',109,{features:['sunroof']})]}
]},
'k8-hev':{reviewed:'2026-10-08',priceDate:'2026-09-01',url:'https://www.kia.com/kr/vehicles/k8/price/private',note:'2027 K8 1.6 터보 하이브리드 2WD 세제혜택 후 가격. 노블레스 라이트는 운전석 통풍만 확인되어 2석 앞좌석 통풍으로 분류하지 않음.',trims:[
 {id:'hev-light',name:'1.6T HEV 노블레스 라이트 · 5인승',price:4267,seats:5,baseFeatures:f('cruise','lane','hda','park'),options:[o('roof','파노라마 선루프',109,{features:['sunroof']}),o('premium','프리미엄',69)]},
 {id:'hev-best',name:'1.6T HEV 베스트 셀렉션 · 5인승',price:4420,seats:5,baseFeatures:f('cruise','lane','hda','park','surround','vent','trunk'),options:[o('roof','파노라마 선루프',109,{features:['sunroof']}),o('audio','메리디안 프리미엄 사운드',109,{features:['audio']}),o('premium','프리미엄',69)]}
]}

};
function get(id){return catalog[id]||null;}
function trim(id,trimId){const spec=get(id);return spec?.trims.find(t=>t.id===trimId)||spec?.trims[0]||null;}
function normalize(id,config={}){const t=trim(id,config.trimId);if(!t)return {...config,optionIds:[]};const by=new Map(t.options.map(o=>[o.id,o]));const picked=new Set((config.optionIds||[]).filter(x=>by.has(x)));let changed=true;while(changed){changed=false;for(const id of [...picked]){const item=by.get(id);if(item.requires?.some(dep=>!picked.has(dep))||item.excludes?.some(ex=>picked.has(ex))||(item.group&&t.options.some(x=>x.id!==id&&x.group===item.group&&picked.has(x.id)))){picked.delete(id);changed=true;}}}return {...config,trimId:t.id,optionIds:t.options.filter(o=>picked.has(o.id)).map(o=>o.id)};}
function options(id,config={}){const t=trim(id,config.trimId);return t?normalize(id,config).optionIds.map(key=>t.options.find(o=>o.id===key)):[];}
return {catalog,get,trim,normalize,options};
});

