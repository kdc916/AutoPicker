#!/usr/bin/env python3
"""Build AutoPicker's auditable, conservative 2026-10-08 Korea market index.
Never infer unknown prices, seating or option package details from a family name.
"""
import json,re,csv,datetime,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parent
SOURCES={
 '현대':'https://www.hyundai.com/kr/ko/e/all-vehicles',
 '기아':'https://www.kia.com/kr/vehicles/catalog-price',
 '제네시스':'https://www.genesis.com/kr/ko/shopping/quote.html',
 'KGM':'https://www.kg-mobility.com/pr/model',
 '쉐보레':'https://www.chevrolet.co.kr/',
 '르노코리아':'https://www.renault.co.kr/',
 'BMW':'https://www.bmw.co.kr/ko/all-models.html',
 '벤츠':'https://www.mercedes-benz.co.kr/passengercars/models.html?group=all&subgroup=see-all&view=BODYTYPE',
 '아우디':'https://www.audi.co.kr/ko/models/',
 '폭스바겐':'https://www.volkswagen.co.kr/ko/models.html',
 '테슬라':'https://www.tesla.com/ko_kr/models',
 '토요타':'https://toyota.co.kr/',
 '렉서스':'https://www.lexus.co.kr/',
 '볼보':'https://www.volvocars.com/kr/cars/',
 '폴스타':'https://www.polestar.com/kr/stock-cars/',
 '포르쉐':'https://www.porsche.com/korea/ko/models/',
 '지프':'https://www.jeep.co.kr/',
 'BYD':'https://www.bydauto.kr/',
 '혼다':'https://www.hondakorea.co.kr/',
 '미니':'https://www.mini.co.kr/',
 '랜드로버':'https://www.landrover.co.kr/',
 '포드':'https://www.ford.co.kr/',
 '링컨':'https://www.lincoln-korea.com/',
 '캐딜락':'https://www.cadillac.co.kr/',
 '푸조':'https://www.peugeot.co.kr/',
 '마세라티':'https://www.maserati.com/kr/ko',
 '람보르기니':'https://www.lamborghini.com/en-en',
 '롤스로이스':'https://www.rolls-roycemotorcars.com/en_GB/home.html',
 '벤틀리':'https://www.bentleymotors.com/en.html',
 'GMC':'https://www.gmckorea.co.kr/purchase/onlineshop/index.gm',
 '로터스':'https://www.lotuscars.com/ko-KR',
 '애스턴마틴':'https://astonmartinseoul.com/',
 '페라리':'https://www.ferrari.com/en-EN/auto',
}
# Update policy: snapshots of officially listed model families, NOT a complete live inventory.
# Legacy group builder intentionally requires confirmed source-check before converting guessed prices into published-start.
# Officials/brand configurators explicitly checked during 2026-10-08 research.
# Group entries are model FAMILIES, not all options or paint/engine trims.
# New families have null price and seats until model-specific documents verify both.
# format name|body|power|size|seats(optional)|price(optional)|marketState(optional)
GROUPS={
 '현대': '''2027 캐스퍼 Electric|경차|EV|1|||
2027 캐스퍼|경차|GAS|1|||
넥쏘|SUV|FCEV|3||7647|
아이오닉 5 N|SUV|EV|3|||
아이오닉 6 N|세단|EV|3|||
아이오닉 9 Calligraphy|SUV|EV|4|||
코나 N Line|SUV|GAS|2|||
투싼 N Line|SUV|GAS|3|||
2027 스타리아|MPV|GAS|4|||
더 뉴 스타리아 라운지|MPV|GAS|4|||
더 뉴 스타리아 라운지 Hybrid|MPV|HEV|4|||
더 뉴 스타리아 Electric|MPV|EV|4||5792|
더 뉴 스타리아 라운지 Electric|MPV|EV|4||6359|
더 뉴 스타리아 리무진 Electric|MPV|EV|4||8482|
스타리아 킨더|MPV|GAS|4||4166|
ST1 카고|상용|EV|4||5738|
포터 II|상용|DIESEL|3|||
포터 II Electric|상용|EV|3|||
쏠라티|상용|DIESEL|4|||''',
 '기아': '''K3|세단|GAS|2|||review
EV2|SUV|EV|2|||review
EV3 GT|SUV|EV|2|||
EV4 GT|세단|EV|3|||
EV5 GT|SUV|EV|3|||
EV6 GT|SUV|EV|3|||
EV9 GT|SUV|EV|4|||
셀토스 X-Line|SUV|GAS|2|||
니로 HEV|SUV|HEV|2|||
니로 EV|SUV|EV|2|||
카니발 하이리무진|MPV|GAS|4|||
카니발 하이리무진 Hybrid|MPV|HEV|4|||
타스만|픽업|DIESEL|4|||
봉고 III|상용|DIESEL|3|||
봉고 III EV|상용|EV|3|||
PV5 패신저|MPV|EV|3||4590|
PV5 카고 롱|상용|EV|3||4250|
PV5 카고 컴팩트|상용|EV|3||4100|
PV5 WAV|MPV|EV|3||5160|
PV5 프라임|MPV|EV|3||4945|
PV5 오픈베드|상용|EV|3||4395|''',
 '제네시스': '''G70 슈팅 브레이크|왜건|GAS|3|||
Electrified G80|세단|EV|4|||
G80 Black|세단|GAS|4|||
G90 Black|세단|GAS|4|||
G90 롱휠베이스|세단|GAS|4|||
G90 롱휠베이스 Black|세단|GAS|4|||
GV80 Coupe|SUV|GAS|4|||
GV80 Coupe Black|SUV|GAS|4|||
GV80 Black|SUV|GAS|4|||
Electrified GV70|SUV|EV|3|||
GV60 Magma|SUV|EV|3|||''',
 'KGM': '''액티언 하이브리드|SUV|HEV|3||3895|
토레스 하이브리드|SUV|HEV|3||3302|
토레스|SUV|GAS|3||2996|
토레스 EVX|SUV|EV|3||4602|
액티언|SUV|GAS|3||3617|
렉스턴 뉴 아레나|SUV|DIESEL|4||4106|
렉스턴 써밋|SUV|DIESEL|4||6150|
티볼리|SUV|GAS|2||2097|
무쏘|픽업|DIESEL|4||3040|
무쏘 EV|픽업|EV|4||4850|
토레스 밴|상용|GAS|3||2815|
토레스 EVX 밴|상용|EV|3||4520|''',
 '쉐보레': '''2026 트랙스 크로스오버|SUV|GAS|2|||
2026 트레일블레이저|SUV|GAS|2|||''',
 '르노코리아': '''그랑 콜레오스|SUV|GAS|3|||
그랑 콜레오스 하이브리드|SUV|HEV|3|||
필랑트|SUV|HEV|3|||
아르카나|SUV|GAS|2|||
아르카나 E-Tech|SUV|HEV|2|||
세닉 E-Tech Electric|SUV|EV|3|||''',
 'BMW': '''1 시리즈|해치백|GAS|2|||
2 시리즈 그란 쿠페|세단|GAS|2|||
2 시리즈 쿠페|쿠페|GAS|2|||
3 시리즈|세단|GAS|3|||
3 시리즈 투어링|왜건|GAS|3|||
4 시리즈 쿠페|쿠페|GAS|3|||
4 시리즈 그란 쿠페|세단|GAS|3|||
4 시리즈 컨버터블|컨버터블|GAS|3|||
5 시리즈|세단|GAS|4|||
5 시리즈 투어링|왜건|GAS|4|||
7 시리즈|세단|GAS|4|||
8 시리즈|쿠페|GAS|4|||
X1|SUV|GAS|2|||
X2|SUV|GAS|2|||
X3|SUV|GAS|3|||
X4|SUV|GAS|3|||
X5|SUV|GAS|4|||
X6|SUV|GAS|4|||
X7|SUV|GAS|4|||
XM|SUV|PHEV|4|||
i4|세단|EV|3|||
i5|세단|EV|4|||
i7|세단|EV|4|||
iX|SUV|EV|4|||
iX3|SUV|EV|3|||
Z4|컨버터블|GAS|3|||
M2|쿠페|GAS|3|||
M3|세단|GAS|3|||
M4|쿠페|GAS|3|||
M5|세단|PHEV|4|||
M8|쿠페|GAS|4|||''',
 '벤츠': '''A-Class Hatch|해치백|GAS|2|||
CLA 쿠페|세단|GAS|3|||
CLA Electric|세단|EV|3|||reserve
C-Class|세단|GAS|3|||
E-Class|세단|GAS|4|||
E-Class PHEV|세단|PHEV|4|||
S-Class|세단|GAS|4|||
S-Class Long|세단|GAS|4|||
Maybach S-Class|세단|GAS|4|||
GLA|SUV|GAS|2|||
GLB|SUV|GAS|3|||
GLC|SUV|GAS|3|||
GLC Coupe|SUV|GAS|3|||
GLC Electric|SUV|EV|3|||reserve
GLE|SUV|GAS|4|||
GLE Coupe|SUV|GAS|4|||
GLS|SUV|GAS|4|||
Maybach GLS|SUV|GAS|4|||
G-Class|SUV|GAS|4|||
G-Class Electric|SUV|EV|4|||
EQA|SUV|EV|2|||review
EQB|SUV|EV|3|||review
EQE|세단|EV|4|||
EQE SUV|SUV|EV|4|||
EQS|세단|EV|4|||review
EQS SUV|SUV|EV|4|||
Maybach EQS SUV|SUV|EV|4|||
CLE Coupe|쿠페|GAS|3|||
CLE Cabriolet|컨버터블|GAS|3|||
AMG GT Coupe|쿠페|GAS|4|||
AMG GT 4-Door|세단|GAS|4|||
AMG SL Roadster|컨버터블|GAS|4|||
Maybach SL|컨버터블|GAS|4|||''',
 '아우디': '''A3|세단|GAS|2|||
A3 Sportback|해치백|GAS|2|||
A5|세단|GAS|3|||
A5 Avant|왜건|GAS|3|||
A6|세단|GAS|4|||
A8|세단|GAS|4|||
Q3|SUV|GAS|2|||
Q3 Sportback|SUV|GAS|2|||
Q5|SUV|GAS|3|||
Q5 Sportback|SUV|GAS|3|||
Q7|SUV|GAS|4|||
Q8|SUV|GAS|4|||
RS Q8 performance|SUV|GAS|4|||
Q4 e-tron|SUV|EV|3|||
Q4 Sportback e-tron|SUV|EV|3|||
Q6 e-tron|SUV|EV|3|||
A6 e-tron|세단|EV|4|||
e-tron GT|세단|EV|4|||
RS e-tron GT performance|세단|EV|4|||''',
 '폭스바겐': '''Golf|해치백|GAS|2|||
Golf GTI|해치백|GAS|2|||
Atlas|SUV|GAS|4|||
Touareg|SUV|DIESEL|4|||
ID.5|SUV|EV|3|||''',
 '폴스타': '''Polestar 2|세단|EV|3||4390|
Polestar 3|SUV|EV|4||7790|
Polestar 4 coupé|SUV|EV|3||6690|''',
 '토요타': '''All New RAV4 HEV|SUV|HEV|3|||
All New RAV4 PHEV|SUV|PHEV|3|||
Crown|세단|HEV|4|||
Sienna Hybrid|MPV|HEV|4|||
Highlander Hybrid|SUV|HEV|4|||
GR Supra|쿠페|GAS|3|||review
GR86|쿠페|GAS|3|||review''',
 '렉서스': '''LBX|SUV|HEV|2|||
UX 300h|SUV|HEV|2|||
NX 350h|SUV|HEV|3|||
NX 450h+|SUV|PHEV|3|||
RX 350h|SUV|HEV|4|||
RX 450h+|SUV|PHEV|4|||
RX 500h|SUV|HEV|4|||
RZ|SUV|EV|3|||
LM 500h|MPV|HEV|4|||
LX|SUV|GAS|4|||
LS 500h|세단|HEV|4|||review''',
 '볼보': '''EX30|SUV|EV|2|||
EX40|SUV|EV|2|||
EC40|SUV|EV|2|||
EX90|SUV|EV|4|||
XC40|SUV|GAS|2|||
XC60|SUV|GAS|3|||
XC90|SUV|GAS|4|||
S60|세단|GAS|3|||review
S90|세단|GAS|4|||
V60 Cross Country|왜건|GAS|3|||
V90 Cross Country|왜건|GAS|4|||review
ES90|세단|EV|4|||review''',
 '테슬라': '''Model Y L|SUV|EV|4|||
Model S|세단|EV|4|||review
Model X|SUV|EV|4|||review
Cybertruck|픽업|EV|4|||review''',
 '포르쉐': '''911 Carrera|쿠페|GAS|4|||
911 Carrera Cabriolet|컨버터블|GAS|4|||
911 Turbo|쿠페|GAS|4|||
Taycan|세단|EV|4|||
Taycan Cross Turismo|왜건|EV|4|||
Panamera|세단|GAS|4|||
Panamera E-Hybrid|세단|PHEV|4|||
Macan Electric|SUV|EV|3|||
Cayenne|SUV|GAS|4|||
Cayenne Coupe|SUV|GAS|4|||
Cayenne E-Hybrid|SUV|PHEV|4|||''',
 '지프': '''Wrangler|SUV|GAS|3|||
Gladiator|픽업|GAS|4|||review
Grand Cherokee|SUV|GAS|4|||review
Avenger|SUV|EV|2|||review''',
 'BYD': '''Dolphin|해치백|EV|2|||review
Atto 3|SUV|EV|2|||
Seal|세단|EV|3|||
Sealion 7|SUV|EV|3|||''',
 '미니': '''MINI Cooper 3-Door|해치백|GAS|2|||
MINI Cooper 5-Door|해치백|GAS|2|||
MINI Cooper Electric|해치백|EV|2|||
MINI Countryman|SUV|GAS|3|||
MINI Countryman Electric|SUV|EV|3|||
MINI Aceman Electric|SUV|EV|2|||
MINI Convertible|컨버터블|GAS|2|||''',
 '랜드로버': '''Defender 90|SUV|GAS|4|||
Defender 110|SUV|GAS|4|||
Defender 130|SUV|GAS|4|||
Discovery|SUV|DIESEL|4|||
Discovery Sport|SUV|GAS|3|||
Range Rover Evoque|SUV|GAS|3|||
Range Rover Velar|SUV|GAS|3|||
Range Rover Sport|SUV|GAS|4|||
Range Rover|SUV|GAS|4|||''',
 '포드': '''Explorer|SUV|GAS|4|||
Bronco|SUV|GAS|4|||
Mustang|쿠페|GAS|3|||
Ranger|픽업|DIESEL|4|||review''',
 '링컨': '''Corsair|SUV|GAS|3|||
Nautilus|SUV|GAS|3|||
Aviator|SUV|GAS|4|||
Navigator|SUV|GAS|4|||''',
 '캐딜락': '''Escalade|SUV|GAS|4|||
Escalade IQ|SUV|EV|4|||
Lyriq|SUV|EV|3|||
Optiq|SUV|EV|3|||review''',
 '푸조': '''308|해치백|GAS|2|||
408|세단|GAS|3|||
2008|SUV|GAS|2|||
3008|SUV|GAS|3|||
5008|SUV|GAS|3|||
e-208|해치백|EV|2|||review''',
 '혼다': '''CR-V|SUV|GAS|3|||review
Civic Hybrid|세단|HEV|2|||review
Odyssey|MPV|GAS|4|||review
Pilot|SUV|GAS|4|||review''',
 '마세라티': '''Grecale|SUV|GAS|3|||
Grecale Folgore|SUV|EV|3|||
GranTurismo|쿠페|GAS|4|||
GranCabrio|컨버터블|GAS|4|||''',
 '벤틀리': '''Continental GT|쿠페|PHEV|4|||
Flying Spur|세단|PHEV|4|||
Bentayga|SUV|GAS|4|||review''',
 '롤스로이스': '''Ghost|세단|GAS|4|||
Phantom|세단|GAS|4|||
Cullinan|SUV|GAS|4|||
Spectre|쿠페|EV|4|||''',
 'GMC': '''아카디아|SUV|GAS|4||9128|
캐니언|픽업|GAS|4||7685|
허머 EV SUV|SUV|EV|4||24800|
시에라|픽업|GAS|4|||''',
 '로터스': '''Eletre|SUV|EV|4|||
Emeya|세단|EV|4|||
Emira|쿠페|GAS|3|||
Evija|쿠페|EV|4|||review''',
 '애스턴마틴': '''DB12|쿠페|GAS|4|||
DBX707|SUV|GAS|4|||
Vantage|쿠페|GAS|3|||
Valhalla|쿠페|PHEV|4|||review''',
 '페라리': '''Purosangue|SUV|GAS|4|||
12Cilindri|쿠페|GAS|4|||
Amalfi|쿠페|GAS|3|||
849 Testarossa|쿠페|PHEV|4|||
296 Speciale|쿠페|PHEV|3|||''',
 '람보르기니': '''Urus SE|SUV|PHEV|4|||
Revuelto|쿠페|PHEV|4|||''',
}
# models which were checked from official model list rather than generic corporate pages.
DIRECT={
 'KGM':'https://www.kg-mobility.com/pr/model',
 'BMW':'https://www.bmw.co.kr/ko/all-models.html',
 '벤츠':'https://www.mercedes-benz.co.kr/passengercars/models.html?group=all&subgroup=see-all&view=BODYTYPE',
 '아우디':'https://www.audi.co.kr/ko/models/',
 '폭스바겐':'https://www.volkswagen.co.kr/ko/models.html',
 '폴스타':'https://www.polestar.com/kr/stock-cars/',
 '제네시스':'https://www.genesis.com/kr/ko/shopping/quote.html',
 '포르쉐':'https://www.porsche.com/korea/ko/models/',
 '쉐보레':'https://www.chevrolet.co.kr/',
 'GMC':'https://www.gmckorea.co.kr/purchase/onlineshop/index.gm',
 '로터스':'https://www.lotuscars.com/ko-KR',
 '애스턴마틴':'https://astonmartinseoul.com/',
}
# manually isolated as not-yet-verified orderability; avoid mixing in "confirmed sold".
HOLD={'review','reserve'}
BASE=json.loads((ROOT/'base_vehicles.json').read_text('utf8'))
ids={v['id'] for v in BASE}
# All previous entries are retained, with provenance from prior versions.
for v in BASE:
 v['sourceCheckedAt']=v.get('sourceCheckedAt') or ('2026-10-08' if v['id'] in json.loads((ROOT/'verified-ids.json').read_text('utf8')) else 'previous-release')
 v['catalogState']=v.get('catalogState') or 'legacy-needs-recheck'
 v['priceProof']='trim-audited' if v['id'] in json.loads((ROOT/'verified-ids.json').read_text('utf8')) else ('published-start' if v['status']=='official' else 'estimate')
 v['familyName']=v['name']
addition=[];hold=[]
for brand,rows in GROUPS.items():
 for line in rows.strip().splitlines():
  parts=line.strip().split('|'); assert 4<=len(parts)<=7,(brand,line)
  parts+=['']*(7-len(parts));name,body,power,size,seats,price,state=parts
  size=int(size);seats=int(seats) if seats else None
  price=int(price) if price else None
  assert size in (1,2,3,4) and power in ('GAS','HEV','EV','DIESEL','PHEV','FCEV')
  code=re.sub(r'[^0-9a-z]+','-',(brand+'-'+name).lower()).strip('-')
  code=(code or 'kr')+'-'+hashlib.sha1((brand+'|'+name).encode('utf8')).hexdigest()[:10]
  key='market-'+code
  if key in ids: raise ValueError(f'duplicate ID {key}')
  ids.add(key)
  record={'id':key,'brand':brand,'name':name,'origin':'국산' if brand in ('현대','기아','제네시스','KGM','쉐보레','르노코리아') else '수입',
   'body':body,'size':size,'seats':seats,'power':power,'price':price,'status':'official' if price is not None else 'unpriced',
   'official':DIRECT.get(brand,SOURCES[brand]),'imageQuery':brand+' '+name,'tags':[],
   'familyName':name,'sourceCheckedAt':'2026-10-08','priceProof':'published-start' if price is not None else 'none',
   'catalogState':('official-list' if brand in ('현대','기아','제네시스','KGM','쉐보레','BMW','벤츠','아우디','폭스바겐','폴스타','포르쉐','토요타') else 'manufacturer-portal-recheck') if not state else state,
   'catalogScope':'family / powertrain (not each individual trim)', 'optionVerification':'pending'}
  # Prefer existing IDs for exact duplicate brand+model, keeping audited options tied to IDs.
  def canonical(s): return re.sub(r'[^a-z0-9가-힣]','',s.lower())
  base_matches=[v for v in BASE if v['brand']==brand and (canonical(v['name'])==canonical(name) or canonical(v['name']).endswith(canonical(name)))]
  if base_matches and not any(v['power']!=power for v in base_matches):
   # Only drop exact-equivalent official-trim family listings; do not collapse performance variants.
   if any(canonical(v['name'])==canonical(name) for v in base_matches):continue
  (hold if state in HOLD else addition).append(record)
allcars=BASE+addition
allids=[v['id'] for v in allcars]
assert len(allids)==len(set(allids))
assert all(v.get('official','').startswith('https://') for v in allcars)
assert all(v.get('price') is None or v['price']>0 for v in allcars)
(ROOT/'data.js').write_text('/* AUTO-GENERATED: python generate_market.py. Do not edit. Price in KRW 10,000 units. */\nconst VEHICLES = '+json.dumps(allcars,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf8')
(ROOT/'MARKET_CATALOG_HOLD.json').write_text(json.dumps(hold,ensure_ascii=False,indent=2),encoding='utf8')
with (ROOT/'MARKET_CATALOG_AUDIT.csv').open('w',encoding='utf-8-sig',newline='') as f:
 cols=['id','brand','name','origin','body','power','seats','price','priceProof','status','catalogState','sourceCheckedAt','official'];w=csv.DictWriter(f,cols);w.writeheader()
 for v in allcars:w.writerow({c:v.get(c,'') for c in cols})
(ROOT/'catalog-summary.json').write_text(json.dumps({'generated':'2026-10-08','count':len(allcars),'brands':len(set(v['brand'] for v in allcars)),
 'base':len(BASE),'new':len(addition),'hold':len(hold),'priceKnown':sum(v['price'] is not None for v in allcars),
 'unpriced':sum(v['price'] is None for v in allcars),'officialOptionModels':len(json.loads((ROOT/'verified-ids.json').read_text('utf8')))},ensure_ascii=False,indent=2),encoding='utf8')
print((ROOT/'catalog-summary.json').read_text('utf8'))
