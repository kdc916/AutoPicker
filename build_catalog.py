import json,re
from pathlib import Path
# schema: key|brand|model|origin|body|size|seats|power|price|status|official-source-path|imageQuery|tags|photo-file(optional)
records = '''
casper|현대|캐스퍼|국산|경차|1|4|GAS|1546|official|hyundai|Hyundai Casper 2024|city,affordable
venue|현대|베뉴|국산|SUV|2|5|GAS|1994|official|hyundai|Hyundai Venue 2025|city,affordable
avante|현대|디 올 뉴 아반떼|국산|세단|2|5|GAS|2398|official|hyundai|Hyundai Elantra 2026|affordable,city,beginner
avante-hev|현대|디 올 뉴 아반떼 하이브리드|국산|세단|2|5|HEV|3042|official|hyundai|Hyundai Elantra 2026|economy,city
sonata|현대|쏘나타 디 엣지|국산|세단|3|5|GAS|2866|official|hyundai|Hyundai Sonata 2025|comfort,family
sonata-hev|현대|쏘나타 디 엣지 하이브리드|국산|세단|3|5|HEV|3318|official|hyundai|Hyundai Sonata 2025|economy,comfort
new-grandeur|현대|더 뉴 그랜저|국산|세단|4|5|GAS|4245|official|hyundai|Hyundai Grandeur GN7|comfort,tech
new-grandeur-hev|현대|더 뉴 그랜저 하이브리드|국산|세단|4|5|HEV|4833|official|hyundai|Hyundai Grandeur GN7|comfort,economy
kona|현대|코나|국산|SUV|2|5|GAS|2393|official|hyundai|Hyundai Kona SX2|city,beginner
kona-hev|현대|코나 하이브리드|국산|SUV|2|5|HEV|2938|official|hyundai|Hyundai Kona SX2|economy,city
kona-ev|현대|코나 일렉트릭|국산|SUV|2|5|EV|4152|official|hyundai|Hyundai Kona Electric 2024|economy,city
sonata-n|현대|아반떼 N|국산|세단|2|5|GAS|3356|official|hyundai|Hyundai Elantra N 2024|performance
Tucson|현대|투싼|국산|SUV|3|5|GAS|2844|official|hyundai|Hyundai Tucson 2025|family,cargo
Tucson-hev|현대|투싼 하이브리드|국산|SUV|3|5|HEV|3318|official|hyundai|Hyundai Tucson 2025|economy,family
santafe|현대|싼타페|국산|SUV|4|7|GAS|3657|official|hyundai|Hyundai Santa Fe MX5|cargo,family,thirdrow
santafe-hev|현대|싼타페 하이브리드|국산|SUV|4|7|HEV|4022|official|hyundai|Hyundai Santa Fe MX5|cargo,economy,family,thirdrow
palisade|현대|디 올 뉴 팰리세이드|국산|SUV|4|9|GAS|4478|official|hyundai|Hyundai Palisade LX3 2026|thirdrow,cargo,comfort
palisade-hev|현대|디 올 뉴 팰리세이드 하이브리드|국산|SUV|4|9|HEV|5077|official|hyundai|Hyundai Palisade LX3 2026|thirdrow,comfort,economy
ioniq5|현대|아이오닉 5|국산|SUV|3|5|EV|4735|official|hyundai|Hyundai Ioniq 5 2025|tech,economy,cargo
ioniq6|현대|더 뉴 아이오닉 6|국산|세단|3|5|EV|4856|official|hyundai|Hyundai Ioniq 6 facelift 2026|tech,economy
ioniq9|현대|아이오닉 9|국산|SUV|4|7|EV|6759|official|hyundai|Hyundai Ioniq 9 2026|thirdrow,tech,comfort
staria-hev|현대|더 뉴 스타리아 하이브리드|국산|MPV|4|9|HEV|4350|estimate|hyundai|Hyundai Staria 2025|thirdrow,cargo,family
morning|기아|모닝|국산|경차|1|5|GAS|1400|estimate|kia/morning|Kia Picanto 2024|city,beginner,affordable
ray|기아|레이|국산|경차|1|5|GAS|1490|estimate|kia/ray|Kia Ray 2024|city,cargo,affordable
ray-ev|기아|레이 EV (4인승)|국산|경차|1|4|EV|2852|official|kia/ray-ev|Kia Ray EV 2024|city,economy
seltos|기아|디 올 뉴 셀토스 1.6T|국산|SUV|2|5|GAS|2512|official|kia/seltos|Kia Seltos 2026|city,tech,beginner
seltos-hev|기아|디 올 뉴 셀토스 하이브리드|국산|SUV|2|5|HEV|3020|estimate|kia/seltos|Kia Seltos 2026|city,economy
k5|기아|K5|국산|세단|3|5|GAS|2750|estimate|kia/k5|Kia K5 2025|comfort,affordable
k5-hev|기아|K5 하이브리드|국산|세단|3|5|HEV|3450|estimate|kia/k5|Kia K5 2025|economy,comfort
k8|기아|K8|국산|세단|4|5|GAS|3650|estimate|kia/k8|Kia K8 2025|comfort,tech
k8-hev|기아|K8 하이브리드|국산|세단|4|5|HEV|4300|estimate|kia/k8|Kia K8 2025|comfort,economy
sportage|기아|스포티지|국산|SUV|3|5|GAS|2800|estimate|kia/sportage|Kia Sportage 2025|family,cargo
sportage-hev|기아|스포티지 하이브리드|국산|SUV|3|5|HEV|3400|estimate|kia/sportage|Kia Sportage 2025|economy,family
sorento|기아|쏘렌토 2.5T|국산|SUV|4|7|GAS|3641|official|kia/sorento|Kia Sorento MQ4 facelift|family,thirdrow,cargo
sorento-hev|기아|쏘렌토 하이브리드|국산|SUV|4|7|HEV|4050|estimate|kia/sorento|Kia Sorento MQ4 facelift|family,economy,thirdrow
carnival|기아|카니발 3.5|국산|MPV|4|9|GAS|3686|official|kia/carnival|Kia Carnival KA4 facelift|thirdrow,cargo,family
carnival-hev|기아|카니발 하이브리드|국산|MPV|4|9|HEV|4141|estimated_from_official|kia/carnival|Kia Carnival KA4 facelift|thirdrow,cargo,economy
EV3|기아|EV3|국산|SUV|2|5|EV|3995|official|kia/ev3|Kia EV3 2025|economy,city,tech
EV4|기아|EV4|국산|세단|3|5|EV|4042|official|kia/ev4|Kia EV4 2025|tech,economy
EV5|기아|EV5|국산|SUV|3|5|EV|4155|official|kia/ev5|Kia EV5 2025|cargo,economy
EV6|기아|EV6|국산|SUV|3|5|EV|5260|estimate|kia/ev6|Kia EV6 2025|performance,tech
EV9|기아|EV9|국산|SUV|4|7|EV|6900|estimate|kia/ev9|Kia EV9 2025|thirdrow,tech,cargo
G70|제네시스|G70|국산|세단|3|5|GAS|4500|official|genesis/g70|Genesis G70 2025|performance,comfort
G80|제네시스|G80|국산|세단|4|5|GAS|6063|official|genesis/g80|Genesis G80 2025|comfort,tech
G90|제네시스|G90|국산|세단|4|5|GAS|9748|official|genesis/g90|Genesis G90 2025|comfort,tech
GV70|제네시스|GV70|국산|SUV|3|5|GAS|5473|official|genesis/gv70|Genesis GV70 2025|comfort,tech
GV80|제네시스|GV80|국산|SUV|4|7|GAS|6985|official|genesis/gv80|Genesis GV80 2025|comfort,thirdrow
GV60|제네시스|GV60|국산|SUV|3|5|EV|6828|official|genesis/gv60|Genesis GV60 2025|tech,performance
model3|테슬라|모델 3|수입|세단|3|5|EV|5300|estimate|tesla/model3|Tesla Model 3 Highland 2024|economy,tech
modely|테슬라|모델 Y|수입|SUV|3|5|EV|5300|estimate|tesla/modely|Tesla Model Y Juniper 2025|tech,economy,cargo
rav4|토요타|RAV4 하이브리드|수입|SUV|3|5|HEV|4500|estimate|toyota/rav4|Toyota RAV4 2025|economy,cargo
camry|토요타|캠리 하이브리드|수입|세단|3|5|HEV|4800|estimate|toyota/camry|Toyota Camry XV80 2025|comfort,economy
prius|토요타|프리우스|수입|세단|2|5|HEV|4000|estimate|toyota/prius|Toyota Prius 2024|economy,city
es300h|렉서스|ES 300h|수입|세단|4|5|HEV|6500|estimate|lexus/es|Lexus ES 300h 2025|comfort,economy
nx350h|렉서스|NX 350h|수입|SUV|3|5|HEV|6900|estimate|lexus/nx|Lexus NX 350h 2025|comfort,economy
crv|혼다|CR-V 하이브리드|수입|SUV|3|5|HEV|5600|estimate|honda/cr-v|Honda CR-V 2024|family,economy
accord|혼다|어코드 하이브리드|수입|세단|3|5|HEV|5300|estimate|honda/accord|Honda Accord Hybrid 2025|economy,comfort
320i|BMW|320i|수입|세단|3|5|GAS|5800|estimate|bmw/3-series|BMW 320i G20 2025|performance,comfort
520i|BMW|520i|수입|세단|4|5|GAS|7100|estimate|bmw/5-series|BMW 520i G60 2025|comfort,tech
x1|BMW|X1|수입|SUV|2|5|GAS|6100|estimate|bmw/x1|BMW X1 U11 2024|city,comfort
x3|BMW|X3|수입|SUV|3|5|GAS|7200|estimate|bmw/x3|BMW X3 G45 2025|comfort,cargo
x5|BMW|X5|수입|SUV|4|7|GAS|12500|estimate|bmw/x5|BMW X5 G05 2024|comfort,thirdrow
c200|벤츠|C 200|수입|세단|3|5|GAS|6500|estimate|benz/c-class|Mercedes-Benz C-Class W206 2024|comfort,tech
e200|벤츠|E 200|수입|세단|4|5|GAS|7400|estimate|benz/e-class|Mercedes-Benz E-Class W214 2025|comfort,tech
glc|벤츠|GLC 300|수입|SUV|3|5|GAS|8700|estimate|benz/glc|Mercedes-Benz GLC X254 2024|comfort,tech
gle|벤츠|GLE 450|수입|SUV|4|7|GAS|12700|estimate|benz/gle|Mercedes-Benz GLE 2025|comfort,thirdrow
q5|아우디|Q5|수입|SUV|3|5|GAS|7000|estimate|audi/q5|Audi Q5 2025|comfort,tech
a6|아우디|A6|수입|세단|4|5|GAS|6900|estimate|audi/a6|Audi A6 2025|comfort,tech
xc40|볼보|XC40|수입|SUV|2|5|GAS|4900|estimate|volvo/xc40|Volvo XC40 2025|safety,city
xc60|볼보|XC60|수입|SUV|3|5|GAS|6500|estimate|volvo/xc60|Volvo XC60 2025|safety,comfort
xc90|볼보|XC90|수입|SUV|4|7|GAS|8800|estimate|volvo/xc90|Volvo XC90 2025|safety,thirdrow
id4|폭스바겐|ID.4|수입|SUV|3|5|EV|5400|estimate|vw/id4|Volkswagen ID.4 2024|economy,cargo
tiguan|폭스바겐|티구안|수입|SUV|3|5|GAS|5000|estimate|vw/tiguan|Volkswagen Tiguan 2025|family,comfort
atto3|BYD|아토 3|수입|SUV|2|5|EV|3150|estimate|byd/atto3|BYD Atto 3 2024|city,economy
seal|BYD|씰|수입|세단|3|5|EV|4000|estimate|byd/seal|BYD Seal 2024|tech,performance
sealion7|BYD|씨라이언 7|수입|SUV|3|5|EV|4800|estimate|byd/sealion7|BYD Sealion 7 2025|tech,cargo
macan|포르쉐|마칸 일렉트릭|수입|SUV|3|5|EV|11000|estimate|porsche/macan|Porsche Macan electric 2025|performance,tech
''' .strip()
# Only curated, source-linked real-car files; generation-year disclaimer applied in UI.
photos={
'santafe-hev':'Hyundai Santa Fe 2.5T Calligraphy MX5 Creamy White Pearl (5).jpg',
'santafe':'Hyundai Santa Fe 2.5T Calligraphy MX5 Creamy White Pearl (5).jpg',
'carnival-hev':'Kia Carnival 3.5 KA4 PE Snow White Pearl (8).jpg',
'carnival':'Kia Carnival 3.5 KA4 PE Snow White Pearl (8).jpg',
'new-grandeur':'00 Hyundai Grandeur (GN7).jpg',
'new-grandeur-hev':'00 Hyundai Grandeur (GN7).jpg',
'G80':'Genesis G80 RG3 PE Savile Silver (1).jpg',
'GV80':'Genesis GV80 IAA 2021 1X7A0165.jpg',
'modely':'2025 Tesla Model Y Juniper Long Range AWD.jpg',
'EV6':'KIA EV6 (Fully Charged 2022).jpg',
'sorento':'Kia Sorento MQ4 FL 1.6T Hybrid Gravity Aurora Black Pearl (1).jpg',
'sorento-hev':'Kia Sorento MQ4 FL 1.6T Hybrid Gravity Aurora Black Pearl (1).jpg',
'ray-ev':'Kia Ray EV TAM EV PE Smoke Blue (3).jpg',
'atto3':'2024 BYD Atto 3 1.jpg',
'EV3':'Kia EV3 (2025) (54810638023).jpg',
'EV4':'Kia EV4 Sedan CT1 2025-04-11 (01).jpg',
'EV5':'Kia EV5 01 China 2025-03-25.jpg',
}
# older photos visually distinguish representative only, not necessarily 2026 exact.
base={'hyundai':'https://www.hyundai.com/kr/ko/e/all-vehicles', 'kia':'https://www.kia.com/kr/vehicles', 'genesis':'https://www.genesis.com/kr/ko', 'tesla':'https://www.tesla.com/ko_kr', 'toyota':'https://www.toyota.co.kr', 'lexus':'https://www.lexus.co.kr', 'honda':'https://www.hondakorea.co.kr', 'bmw':'https://www.bmw.co.kr', 'benz':'https://www.mercedes-benz.co.kr', 'audi':'https://www.audi.co.kr', 'volvo':'https://www.volvocars.com/kr', 'vw':'https://www.volkswagen.co.kr', 'byd':'https://www.bydauto.kr', 'porsche':'https://www.porsche.com/korea/ko'}
vehicles=[]
for line in records.splitlines():
 p=line.split('|'); assert len(p)==13,(len(p),line)
 key,brand,name,origin,body,size,seats,power,price,status,page,query,tags=p
 root,*tail=page.split('/')
 if root=='kia': official=f'https://www.kia.com/kr/vehicles/{tail[0]}/price'
 elif root=='genesis': official=f'https://www.genesis.com/kr/ko/models/{tail[0]}'
 elif root=='tesla': official=f'https://www.tesla.com/ko_kr/{tail[0]}'
 else: official=base[root]
 item=dict(id=key,brand=brand,name=name,origin=origin,body=body,size=int(size),seats=int(seats),power=power,price=int(price),status=status,official=official,imageQuery=query,tags=tags.split(','))
 if key in photos:
  from urllib.parse import quote
  title=photos[key]; item['image']='https://commons.wikimedia.org/wiki/Special:FilePath/'+quote(title,safe='')
  item['credit']='https://commons.wikimedia.org/wiki/File:'+quote(title.replace(' ','_'),safe=':_()')
 vehicles.append(item)
print('entries:',len(vehicles),'official:',sum(x['status']=='official' for x in vehicles),'curated photo:',sum('image' in x for x in vehicles))
p=Path('/mnt/data/autopicker_build')
(p/'vehicles.json').write_text(json.dumps(vehicles,ensure_ascii=False,indent=2),encoding='utf-8')
(p/'data.js').write_text('/* 차량 기본 가격: 2026-10-08 확인 가능한 공식 시작가 + 별도 추정치. 사용 전 공식 사이트 재확인 필요. */\nconst VEHICLES = '+json.dumps(vehicles,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
