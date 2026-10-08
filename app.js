(() => {
'use strict';
const $ = (id)=>document.getElementById(id);
const safe = (value)=>String(value ?? '').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const {purchase,rank,money}=AutoCore;
const {get:verifiedGet,trim:verifiedTrim,normalize:verifiedNormalize,options:verifiedOptions}=AutoVerified;
const {FEATURES,fitVerified,recommend:recommendConfigured}=AutoFeatureFit;
const POWER={GAS:'가솔린',HEV:'하이브리드',EV:'전기차',DIESEL:'디젤',PHEV:'플러그인 하이브리드'};
const SIZES=['','경형','소형','중형급','대형급'];
const QUESTIONS=[
 {id:'budget',eyebrow:'01 · 예산',title:'차량을 구입하는 데 최대 얼마까지 생각하세요?',help:'차량값뿐 아니라 취득세와 기본 부대비용을 포함하는 총 예산입니다.',items:[['2000','2,000만 원','실속·경차 중심'],['3000','3,000만 원','소형·준중형'],['4000','4,000만 원','국민 패밀리카'],['5000','5,000만 원','넉넉한 선택지'],['7000','7,000만 원','프리미엄까지'],['10000','1억 원','고급차도 고려'],['15000','1억 5,000만 원','상위 차급'],['0','정해두지 않았어요','우선 조건 중심으로']]},
 {id:'seats',eyebrow:'02 · 탑승 인원',title:'최대 몇 명이 함께 탈 예정인가요?',help:'가끔이라도 함께 타야 하는 최대 인원을 골라주세요. 이 조건은 우선 적용합니다.',items:[['2','1~2명','혼자 또는 둘이서'],['4','3~4명','작은 가족'],['5','5명','5인승이 필요해요'],['6','6명','3열이 필요한 가족'],['7','7명','다인승 SUV·MPV'],['9','9명','대가족·단체 이동']]},
 {id:'body',eyebrow:'03 · 차체 형태',title:'어떤 모양의 차가 마음에 드세요?',help:'차의 모양을 잘 모르겠다면 상관없음을 고르세요.',items:[['any','상관없음','모두 비교'],['세단','세단','일반 승용차'],['SUV','SUV','높은 차체·짐 적재'],['경차','경차','작고 주차 쉬운 차'],['MPV','미니밴·MPV','카니발 같은 다인승']]},
 {id:'power',eyebrow:'04 · 엔진과 에너지',title:'차를 움직이는 방식, 어떤 쪽이 좋으세요?',help:'가솔린은 주유만, 하이브리드는 주유하면서 연비 절약, 전기차는 충전해서 운행합니다.',items:[['any','잘 모르겠어요','모두 비교'],['GAS','가솔린','초기 비용·친숙함'],['HEV','하이브리드','주유만 하면서 연비 절약'],['EV','전기차','충전 가능할 때 경제성']]},
 {id:'charger',eyebrow:'05 · 충전 환경',title:'집이나 직장에서 전기차 충전이 쉬운가요?',help:'이 질문은 전기차를 고를 때 특히 중요합니다.',items:[['none','충전하기 어려워요','주변에 충전기 없음'],['home','집에서 가능해요','상시 충전 여건 있음'],['work','직장에서 가능해요','평소 충전 여건 있음'],['public','외부 충전소 사용','충전 계획이 필요함']]},
 {id:'km',eyebrow:'06 · 연간 주행거리',title:'일 년에 얼마나 많이 운전할 것 같으세요?',help:'보통 하루 30km 정도 달리면 연간 약 11,000km입니다.',items:[['6000','6,000km 이하','가끔 운전'],['10000','약 10,000km','일반 출퇴근'],['15000','약 15,000km','출퇴근 + 주말 이동'],['25000','25,000km 이상','운행이 많은 편']]},
 {id:'parking',eyebrow:'07 · 주차 환경',title:'주차공간이나 운전 실력은 어떤 편인가요?',help:'차가 클수록 좁은 골목과 주차장에서 부담이 커집니다.',items:[['tight','초보 또는 좁은 주차장','작은 차가 좋아요'],['normal','보통','중형까지 괜찮아요'],['easy','여유 있어요','큰 차도 괜찮아요']]},
 {id:'priorities',eyebrow:'08 · 중요 옵션',title:'차를 고를 때 중요한 것은 무엇인가요?',help:'최대 3개까지 선택할 수 있어요. 안전 항목은 객관적 충돌시험 결과가 없어 점수화하지 않으며 별도로 꼭 확인해야 합니다.',multi:true,items:[['economy','유지비 절약','연료·충전비'],['cargo','짐 싣기','유모차·캠핑'],['comfort','승차감','소음·안락함'],['tech','첨단 기능','디스플레이·연결성'],['city','도심에서 편리함','크기·기동성'],['thirdrow','3열 좌석','여럿이 이동'],['performance','운전 재미','가속·주행감'],['safety','안전 관련 사양','ADAS·안전 평가 확인']]},
 {id:'origin',eyebrow:'09 · 국산/수입',title:'국산차와 수입차 중 어느 쪽을 선호하세요?',help:'선호도가 없으면 모두 비교합니다. 해당 조건은 점수에 반영하지만 특정 브랜드를 제외하지는 않습니다.',items:[['any','모두 괜찮아요','국산·수입 모두'],['국산','국산차','현대·기아·제네시스'],['수입','수입차','해외 브랜드 중심']]}
];
const WANTED_FEATURES=[...FEATURES.map(f=>[f.id,f.name]),['audio','프리미엄 오디오']];
const DEFAULT={budget:5000,seats:5,body:'any',power:'any',charger:'none',km:10000,parking:'normal',priorities:[],origin:'any',requiredFeatures:[]};
const PROFILE_KEY='autopicker.v2.2.profile';
function loadProfile(){try{const o=JSON.parse(localStorage.getItem(PROFILE_KEY)||'null');return o&&typeof o==='object'&&!Array.isArray(o)?{...DEFAULT,...o,requiredFeatures:Array.isArray(o.requiredFeatures)?o.requiredFeatures:[]}:structuredClone(DEFAULT)}catch{return structuredClone(DEFAULT)}}
let activeQuestions=[],profileStarted=false;
function questionsFor(p){const questions=QUESTIONS.filter(q=>!['budget','seats','charger','km'].includes(q.id)).map(q=>({...q}));
 if(p.seats>=6){const body=questions.find(q=>q.id==='body');body.title='여러 명이 함께 탈 차로 어떤 형태를 원하세요?';body.items=body.items.filter(it=>!['세단','경차'].includes(it[0]));const prior=questions.find(q=>q.id==='priorities');prior.title='대가족 차량에서 특히 중요한 점은 무엇인가요?';}
 else if(p.seats<=2){const park=questions.find(q=>q.id==='parking');park.title='혼자 또는 둘이 탈 때, 주차 편의가 중요하세요?';}
 if(p.charger==='none'){const power=questions.find(q=>q.id==='power');power.help='집·직장에서 충전이 어렵다고 입력하셨습니다. EV 선택 시 충전 동선을 꼭 검토하세요.';}
 if(p.requiredFeatures.includes('surround')){const park=questions.find(q=>q.id==='parking');park.help='어라운드뷰를 필수로 선택했어요. 좁은 주차장인지도 판단에 반영합니다.';}
 return questions;}
const STORE='autopicker.v2.saved'; // Compatible with existing v2.0 saved cars
let preferences=loadProfile(), wizardStep=0, saved=loadStore(), compareIds=new Set(), draft={}, currentCar=null;
let resultMode='all', shown=12, filteredCars=[], toastTimer=null, initialFocus=null;
let pictureMemo=new Map();
function loadStore(){try{const o=JSON.parse(localStorage.getItem(STORE)||'{}');return o && typeof o==='object'&&!Array.isArray(o)?o:{}}catch{return {}}}
function store(){try{localStorage.setItem(STORE,JSON.stringify(saved))}catch{notify('브라우저 저장소에 저장할 수 없습니다. 내보내기 기능을 이용하세요.')}}
function notify(str){const t=$('toast');t.textContent=str;t.classList.remove('hidden');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.add('hidden'),2900)}
function updateCounts(){const count=Object.keys(saved).length;$('favCounter').textContent=count;$('totalCars').textContent=VEHICLES.length;$('totalBrands').textContent=new Set(VEHICLES.map(c=>c.brand)).size;}
function show(view,opts={}){
 if(view==='browse'&&!opts.preserve){resultMode='all';$('browseEyebrow').textContent='EXPLORE THE MARKET';$('browseTitle').textContent='전체 차량 탐색';$('browseDesc').textContent='브랜드·예산·차종을 직접 선택해 차량을 비교하세요.';}
 ['home','profile','wizard','browse','shortlist'].forEach(name=>$(name+'View').classList.toggle('hidden',name!==view));
 document.querySelectorAll('[data-view].navbtn').forEach(btn=>btn.classList.toggle('active',btn.dataset.view===view));
 window.scrollTo({top:0,behavior:'instant'});
 if(view==='profile')drawProfile();
 if(view==='wizard')drawWizard();
 if(view==='browse'){renderCriteria();renderBrowse();}
 if(view==='shortlist')renderSaved();
}
function drawProfile(){
 $('profileSeats').value=String(preferences.seats);$('profileBudget').value=String(preferences.budget);$('profileKm').value=String(preferences.km);$('profileCharger').value=preferences.charger;
 $('requiredFeatureList').innerHTML=FEATURES.map(f=>`<label class="feature-choice"><input type="checkbox" name="requiredFeature" value="${safe(f.id)}" ${(preferences.requiredFeatures||[]).includes(f.id)?'checked':''}><span><b>${safe(f.name)}</b><small>${safe(f.description)}</small></span></label>`).join('');
}
function startProfile(){
 const seats=Number($('profileSeats').value), budget=Number($('profileBudget').value),km=Number($('profileKm').value);
 if(!Number.isInteger(seats)||seats<1||seats>9){notify('탑승 인원을 다시 선택해주세요.');return;}
 if(!Number.isFinite(budget)||budget<0||budget>30000){notify('총 예산은 0~30,000만 원 사이로 입력해주세요.');return;}
 preferences={...preferences,seats,budget,km,charger:$('profileCharger').value,requiredFeatures:[...document.querySelectorAll('input[name="requiredFeature"]:checked')].map(el=>el.value)};
 try{localStorage.setItem(PROFILE_KEY,JSON.stringify(preferences))}catch{};
 activeQuestions=questionsFor(preferences);wizardStep=0;profileStarted=true;show('wizard',{preserve:true});
}
function drawWizard(){
 if(!activeQuestions.length){show('profile');return;}
 const q=activeQuestions[wizardStep],val=preferences[q.id];
 $('stepLabel').textContent=q.eyebrow;$('progressLabel').textContent=`${wizardStep+1} / ${activeQuestions.length}`;$('progressFill').style.width=`${(wizardStep+1)/activeQuestions.length*100}%`;
 let html=`<span class="eyebrow">${safe(q.eyebrow)}</span><h2>${safe(q.title)}</h2><p>${safe(q.help)}</p><div class="optionsGrid">`;
 for(const [value,label,desc] of q.items){let selected=q.multi?val.includes(value):String(val)===String(value);html+=`<button type="button" class="choice ${selected?'selected':''}" data-choose="${safe(value)}" aria-pressed="${selected}"><b>${safe(label)}</b><span>${safe(desc)}</span></button>`;}
 html+='</div>';
 if(q.multi)html+='<p class="stepHint">원하는 항목을 최대 3개까지 고르세요. 선택하지 않고 진행해도 됩니다.</p>';
 $('wizardCard').innerHTML=html;
 $('prevStep').disabled=false;
 $('nextStep').textContent=wizardStep===activeQuestions.length-1?'추천 결과 보기 →':'다음 →';
}
function choose(value){const q=activeQuestions[wizardStep];if(q.multi){const current=[...preferences[q.id]];const idx=current.indexOf(value);if(idx>=0)current.splice(idx,1);else if(current.length>=3){notify('최대 3개까지 선택할 수 있습니다.');return;}else current.push(value);preferences[q.id]=current;}else preferences[q.id]=['budget','seats','km'].includes(q.id)?Number(value):value;drawWizard();}
function nextWizard(){if(wizardStep<activeQuestions.length-1){wizardStep++;drawWizard();$('wizardCard').scrollIntoView({block:'start'});}else finishWizard()}
function finishWizard(){resultMode='recommend';shown=12;document.querySelectorAll('.toolbar select').forEach(el=>el.value=el.querySelector('option[value="any"]')?'any':['priceFilter','sizeFilter'].includes(el.id)?'0':el.value);$('search').value='';$('sortSelect').value='recommended';$('browseEyebrow').textContent='YOUR PERSONAL MATCHES';$('browseTitle').textContent='내게 맞는 차량 추천';$('browseDesc').textContent='기본조건에 맞는 최소 비용 트림부터 추천합니다. 공식 검증 구성과 확인 대기 후보를 구분했습니다.';show('browse',{preserve:true});}
function toggleFavorite(id){const car=VEHICLES.find(c=>c.id===id);if(!car)return;if(saved[id]){delete saved[id];compareIds.delete(id);notify('관심 목록에서 해제했습니다.')}else{saved[id]=draft[id]||{};notify('관심 차량에 저장했습니다.')}store();updateCounts();renderBrowse();if(!$('shortlistView').classList.contains('hidden'))renderSaved();}
function priceLabel(car){return verifiedGet(car.id)?'2026.10 공식 확인':car.status==='official'?'공식 출처 등록':'참고 추정';}
function chips(car){return `<span class="pill">${safe(car.body)}</span><span class="pill">${safe(POWER[car.power]||car.power)}</span><span class="pill">최대 ${car.seats}명</span><span class="pill">${safe(SIZES[car.size])}</span>`;}
function imgMarkup(v){const src=pictureMemo.get(v.id)||v.image||'';const photo=src?`<img loading="lazy" src="${safe(src)}" alt="${safe(v.brand+' '+v.name+' 참고 사진')}" referrerpolicy="no-referrer">`:'';
const link=v.credit || (src.startsWith('https://upload.wikimedia.org')?`https://commons.wikimedia.org/`:null);
return `<div class="car-img ${src?'':'no-image'}" data-img-id="${safe(v.id)}">${photo}<span class="img-label">모델 참고 사진 · 연식/사양 상이 가능</span><div class="fallback"><strong>◇ ${safe(v.brand)}</strong><span>실차 사진을 확인 중이거나 제공되지 않습니다.</span><span>아래 '자세히 보기'에서 공식 갤러리를 확인하세요.</span></div>${link?`<a class="img-credit" target="_blank" rel="noopener noreferrer" href="${safe(link)}" title="이미지 출처와 라이선스">사진 출처 ↗</a>`:''}</div>`;}
function cardHTML(v,inSaved=false){const s=Boolean(saved[v.id]);const priceStatus=priceLabel(v);return `<article class="car-card" data-id="${safe(v.id)}">${imgMarkup(v)}<div class="car-body"><div class="car-topline"><span class="car-brand">${safe(v.brand)} · ${safe(v.origin)}</span>${resultMode==='recommend'&&!inSaved?`<span class="match">적합도 ${v.score}점</span>`:''}</div><h3 class="car-name">${safe(v.name)}</h3><div class="car-specs">${chips(v)}</div><div class="car-price"><div><small>기본 구매 시작가 (옵션·취득세 전)</small><strong>${money(v.price)}</strong></div><span class="source-badge ${v.status==='official'?'':'estimate'}">${priceStatus}</span></div>${v.flags?.length&&!inSaved&&resultMode==='recommend'?`<small style="color:#e7ba91">⚠ ${safe(v.flags[0])}</small>`:''}${resultMode==='recommend'&&!inSaved?`<div class="fit-detail ${v.fit?.status==='verified'?'fit-ok':'fit-pending'}">${v.fit?.status==='verified'?`<strong>✓ 확인된 구성: ${safe(v.fit.trimName)}</strong><small>${safe(v.fit.optionNames.join(' + ')||'추가 패키지 없이 충족')} · 총구매 예상 ${money(v.fit.estimate.total)}</small>`:`<strong>옵션·최종 트림 확인 필요</strong><small>기본가 기반 후보 · 필수 기능 적용 여부와 실제 가격을 아직 확인하지 못했습니다.</small>`}</div>`:''}<div class="card-actions"><button class="primary" data-open="${safe(v.id)}">상세·견적 보기 →</button><button class="fav-btn ${s?'saved':''}" data-fav="${safe(v.id)}" title="관심 목록 ${s?'제거':'추가'}" aria-label="${safe(v.name)} 관심 차량 ${s?'제거':'추가'}">${s?'♥':'♡'}</button></div>${inSaved?`<label style="font-size:12px;color:#a4b6d2"><input type="checkbox" data-compare="${safe(v.id)}" ${compareIds.has(v.id)?'checked':''}> 비교할 차량 선택</label>`:''}</div></article>`;}
function preparePhotos(container){for(const el of container.querySelectorAll('.car-img')){
 const img=el.querySelector('img');if(img){img.addEventListener('error',()=>{el.classList.add('no-image');img.remove();});}
 const id=el.dataset.imgId;const v=VEHICLES.find(c=>c.id===id);
 if(v&&!v.image&&!pictureMemo.has(id))lookupCommons(v,el);
 }}
const photoRequests=new Map();
async function lookupCommons(v,el){
 if(photoRequests.has(v.id)){try{const result=await photoRequests.get(v.id);if(result)insertPhoto(v,el,result);}catch{}return;}
 const req=(async()=>{
 const query=v.imageQuery.replace(/\b20\d{2}\b/g,'').trim();
 const url='https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrlimit=8&gsrsearch='+encodeURIComponent(query+' filetype:bitmap')+'&prop=imageinfo&iiprop=url%7Cextmetadata&iiurlwidth=800&format=json&origin=*';
 const response=await fetch(url,{signal:AbortSignal.timeout(9000)});if(!response.ok)throw Error('Image API unavailable');
 const data=await response.json(); const pages=Object.values(data.query?.pages||{});
 const needed=query.toLowerCase().split(/\s+/).filter(w=>w.length>=2&&!['facelift','hybrid','electric','highland','juniper','sedan','sport','turbo','long','range'].includes(w));
 const candidates=pages.filter(page=>{const title=page.title?.toLowerCase()||'';return needed.every(token=>title.includes(token)) && page.imageinfo?.[0]?.thumburl;});
 const usable=candidates.find(page=>{const lic=page.imageinfo?.[0]?.extmetadata?.LicenseShortName?.value||'';return /^(CC|PD)|public domain/i.test(lic);});
 if(!usable)return null;
 return {url:usable.imageinfo[0].thumburl,credit:usable.imageinfo[0].descriptionurl};
 })();photoRequests.set(v.id,req);
 try{const result=await req;if(result){pictureMemo.set(v.id,result.url);photoCredits.set(v.id,result.credit);insertPhoto(v,el,result);}else {pictureMemo.set(v.id,'');}}catch{pictureMemo.set(v.id,'');}
 finally{photoRequests.delete(v.id);}
}
const photoCredits=new Map();
function insertPhoto(v,el,result){if(!el.isConnected||el.querySelector('img'))return;const img=document.createElement('img');img.loading='lazy';img.alt=v.brand+' '+v.name+' 참고 사진';img.referrerPolicy='no-referrer';img.addEventListener('load',()=>el.classList.remove('no-image'));img.addEventListener('error',()=>{el.classList.add('no-image');img.remove()});img.src=result.url;el.prepend(img);if(result.credit&&!el.querySelector('.img-credit')){let a=document.createElement('a');a.href=result.credit;a.className='img-credit';a.target='_blank';a.rel='noopener noreferrer';a.textContent='사진 출처 ↗';el.append(a);}}
function renderCriteria(){
 const box=$('criteriaSummary');box.classList.toggle('hidden',resultMode!=='recommend');if(resultMode!=='recommend')return;
 const labels=['예산 '+(preferences.budget?money(preferences.budget):'제한 없음'),'탑승 '+preferences.seats+'명','필수 사양 '+(preferences.requiredFeatures?.map(id=>FEATURES.find(f=>f.id===id)?.name).filter(Boolean).join(' · ')||'선택 안 함'),'차체 '+(preferences.body==='any'?'전체':preferences.body),'동력 '+(POWER[preferences.power]||'전체'),'국산/수입 '+(preferences.origin==='any'?'전체':preferences.origin)];
 box.innerHTML=labels.map(t=>`<span>${safe(t)}</span>`).join('')+'<button type="button" class="secondary" data-view="profile">조건 수정 ↗</button><div class="note">적합도는 입력한 조건의 상대적 충족 정도이며 차량의 안전성·품질 순위가 아닙니다. 최종 판단 시 트림별 옵션·실차 시승을 확인하세요.</div>';
 box.querySelector('button').addEventListener('click',()=>show('profile'));
}
function computedList(){
 let cars=resultMode==='recommend'?recommendConfigured(VEHICLES,preferences,rank).ordered:VEHICLES.map(v=>({...v}));
 const q=$('search').value.trim().toLowerCase();const brand=$('brandFilter').value,origin=$('originFilter').value,body=$('bodyFilter').value,power=$('powerFilter').value,size=Number($('sizeFilter').value),price=Number($('priceFilter').value);
 cars=cars.filter(v=>(!q||[v.name,v.brand,v.body,POWER[v.power],v.imageQuery].join(' ').toLowerCase().includes(q))&&(brand==='any'||v.brand===brand)&&(origin==='any'||v.origin===origin)&&(body==='any'||v.body===body)&&(power==='any'||v.power===power)&&(!size||v.size===size)&&(!price||v.price<=price));
 const sort=$('sortSelect').value;
 if(sort==='priceAsc')cars.sort((a,b)=>a.price-b.price);else if(sort==='priceDesc')cars.sort((a,b)=>b.price-a.price);else if(sort==='name')cars.sort((a,b)=>a.name.localeCompare(b.name,'ko'));else if(resultMode!=='recommend')cars.sort((a,b)=>a.price-b.price);
 return cars;
}
function renderBrowse(){filteredCars=computedList();
 const fitInfo=$('matchSummary');fitInfo.classList.toggle('hidden',resultMode!=='recommend');
 if(resultMode==='recommend'){const r=recommendConfigured(VEHICLES,preferences,rank);fitInfo.innerHTML=`<b>공식 트림·옵션 충족 ${r.confirmed.length}대</b><span> | 추가 확인 필요 ${r.pending.length}대</span>${r.confirmed.length?'':'<p>검증된 트림 기준으로 모든 필수 조건을 만족한 차량이 없습니다. 아래는 옵션 확인이 필요한 후보이며 실제 충족 여부를 보장하지 않습니다.</p>'}<p>총예산 초과(확인된 트림) ${r.overBudget.length}대 · 필수 옵션 미검증/불충족 ${r.unavailable.length}대는 추천에서 제외했습니다.</p>`;}
$('resultCount').textContent=(resultMode==='recommend'?'조건에 맞는 후보 ':'전체 검색 결과 ')+filteredCars.length+'대';
 const list=filteredCars.slice(0,shown);$('carGrid').innerHTML=list.length?list.map(v=>cardHTML(v)).join(''):'<div class="empty">검색 조건에 맞는 차량이 없습니다.<br>예산 또는 필터를 조정해 보세요.</div>';
 $('moreBtn').classList.toggle('hidden',shown>=filteredCars.length);preparePhotos($('carGrid'));
}
function renderSaved(){const list=Object.keys(saved).map(id=>VEHICLES.find(v=>v.id===id)).filter(Boolean);
 $('shortlistGrid').innerHTML=list.length?list.map(v=>cardHTML(v,true)).join(''):'<div class="empty">아직 저장한 차량이 없습니다.<br>차량 탐색에서 ♡을 눌러 후보에 담아보세요.</div>';
 $('compareOutput').innerHTML='';preparePhotos($('shortlistGrid'));
}
function pickCompare(id,isChecked){if(isChecked){if(compareIds.size>=4){notify('비교는 최대 4대까지 가능합니다.');renderSaved();return;}compareIds.add(id);}else compareIds.delete(id);}
function compare(){const list=[...compareIds].map(id=>VEHICLES.find(v=>v.id===id)).filter(Boolean);if(list.length<2){notify('비교할 차량을 2~4대 선택해주세요.');return;}
 const rows=[['기본 시작가',v=>money(v.price)+' / '+priceLabel(v)],['국산/수입',v=>v.origin],['차체',v=>v.body],['차체 규모',v=>SIZES[v.size]],['최대 탑승 인원',v=>v.seats+'명'],['동력방식',v=>POWER[v.power]],['시뮬레이션 총액',v=>money(makeCalc(v,saved[v.id]||{}).total)],['옵션 희망',v=>(saved[v.id]?.wantedFeatures||[]).map(k=>WANTED_FEATURES.find(x=>x[0]===k)?.[1]||k).join(', ')||'미설정'],['공식 사이트',v=>`<a href="${safe(v.official)}" target="_blank" rel="noopener noreferrer" style="color:#a6c2ff">제조사 확인 ↗</a>`]];
 $('compareOutput').innerHTML=`<table class="comparetable"><thead><tr><th>비교 항목</th>${list.map(v=>`<th>${safe(v.brand+' '+v.name)}</th>`).join('')}</tr></thead><tbody>${rows.map(([title,fn])=>`<tr><th>${safe(title)}</th>${list.map(v=>`<td>${title==='공식 사이트'?fn(v):safe(fn(v))}</td>`).join('')}</tr>`).join('')}</tbody></table><p class="modalPanelNotes">크기와 사양은 비교용 분류입니다. 가격·3열 시트 구성·안전 사양은 제조사 페이지의 선택 트림 기준으로 다시 확인해 주세요.</p>`;
 $('compareOutput').scrollIntoView({block:'nearest',behavior:'smooth'});
}
function quoteText(v,cfg){const x=makeCalc(v,cfg);return ['AutoPicker Pro 차량 비교용 견적','차량: '+v.brand+' '+v.name,'가격 출처 수준: '+priceLabel(v),'공식 트림: '+(verifiedTrim(v.id,cfg.trimId)?.name||'제조사 확인 필요'),'최초 필수 옵션: '+((preferences.requiredFeatures||[]).map(k=>FEATURES.find(f=>f.id===k)?.name).filter(Boolean).join(', ')||'없음'),'대표 시작가: '+money(x.base),'선택 추가품목: '+money(x.optionCost),'원하는 기능 (가격 미반영): '+((cfg.wantedFeatures||[]).map(k=>WANTED_FEATURES.find(x=>x[0]===k)?.[1]||k).join(', ')||'없음'),'별도 옵션 예산: '+money(x.manualExtras),'출고가 기준 합계: '+money(x.vehiclePrice),'취득세 추정: '+money(x.tax),'부대비용 가정: '+money(x.fees),'전기차 보조금 (직접 입력): -'+money(x.subsidy),'예상 구매 총액: '+money(x.total),'예상 월 할부: '+money(x.monthly),'초기 필요 현금 추정: '+money(x.cash),'공식 확인: '+v.official,'* 계약 전 제조사 최종 견적·실제 세액·보조금·금융 심사가 필요합니다.'].join('\n');}
async function copy(str){try{await navigator.clipboard.writeText(str);notify('견적을 클립보드에 복사했습니다.')}catch{const el=document.createElement('textarea');el.value=str;el.style.position='fixed';el.style.left='-9999px';document.body.append(el);el.select();try{if(!document.execCommand('copy'))throw Error();notify('견적을 클립보드에 복사했습니다.')}catch{notify('복사할 수 없습니다. 내보내기 기능을 이용하세요.')}el.remove();}}
function download(name,content,mime='text/plain;charset=utf-8'){const blob=new Blob([content],{type:mime});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function normalizeDraft(id){const car=VEHICLES.find(v=>v.id===id);const from=draft[id]||saved[id]||{};return {trimId:from.trimId,actualPrice:from.actualPrice||car.price,extraBudget:from.extraBudget||0,optionIds:[...(from.optionIds||[])],wantedFeatures:[...(from.wantedFeatures||[])],taxRate:from.taxRate??(car.body==='경차'?4:7),taxCredit:from.taxCredit||0,fees:from.fees??15,subsidy:from.subsidy||0,downPayment:from.downPayment??30,months:from.months||48,apr:from.apr??4.8};}
function makeCalc(v,cfg){const audited=verifiedGet(v.id),normal=audited?verifiedNormalize(v.id,cfg):{...cfg,optionIds:[]};return purchase(v,{...normal,actualPrice:audited?verifiedTrim(v.id,normal.trimId).price:normal.actualPrice,options:verifiedOptions(v.id,normal)});}
function renderModal(id){
 const suggested=(resultMode==='recommend'?recommendConfigured(VEHICLES,preferences,rank).ordered.find(x=>x.id===id):null);
 if(suggested?.fit?.status==='verified'&&!draft[id]&&!saved[id])draft[id]={trimId:suggested.fit.trimId,optionIds:[...suggested.fit.optionIds],wantedFeatures:[...(preferences.requiredFeatures||[])]};
 else if(suggested&&!draft[id]&&!saved[id])draft[id]={wantedFeatures:[...(preferences.requiredFeatures||[])]};
 const original=VEHICLES.find(c=>c.id===id);if(!original)return;const v=(resultMode==='recommend'?rank(VEHICLES,preferences).find(x=>x.id===id):null)||original;currentCar=v;initialFocus=document.activeElement;const cfg=verifiedGet(id)?verifiedNormalize(id,normalizeDraft(id)):normalizeDraft(id);draft[id]=cfg;
 const audit=verifiedGet(id),selectedTrim=verifiedTrim(id,cfg.trimId),opts=selectedTrim?.options||[];
 const html=`<div class="detail-heading"><span class="eyebrow">CAR DETAIL & BUDGET STUDIO</span><h2>${safe(v.brand)} ${safe(v.name)}</h2><p>${safe(v.origin)} · ${safe(v.body)} · ${safe(POWER[v.power])} · 최대 ${v.seats}명</p></div>${suggested?`<div class="auto-trim-note ${suggested.fit?.status==='verified'?'fit-ok':'fit-pending'}">${suggested.fit?.status==='verified'?`<b>자동 추천 트림: ${safe(suggested.fit.trimName)}</b><p>필수 옵션 충족 구성: ${safe(suggested.fit.optionNames.join(' + ')||'기본사양만으로 충족')} · 예상 ${money(suggested.fit.estimate.total)}</p>`:'<b>최종 트림 자동 확정 불가</b><p>공식 트림별 필수 옵션 정보가 검증되지 않았습니다.</p>'}</div>`:''}<div class="detail-grid"><div><div class="detailPhoto">${imgMarkup(v)}</div><div class="detail-info"><h3>이 차를 볼 때 확인할 항목</h3><div class="mini-row"><span>기본 시작가</span><strong>${money(v.price)} · ${safe(priceLabel(v))}</strong></div><div class="mini-row"><span>규모</span><strong>${safe(SIZES[v.size])} · 최대 ${v.seats}명</strong></div><div class="mini-row"><span>동력</span><strong>${safe(POWER[v.power])}</strong></div><p>일부 모델은 국가·연식·선택 트림에 따라 좌석 수와 디자인이 달라집니다. 사진은 참고용이며 실제 계약 차량과 다를 수 있습니다.</p>${v.score!==undefined?`<p><b>선호도 적합도: ${v.score}/100</b></p><p>${safe((v.reasons||[]).join(' · ')||'조건에 따른 비교 후보')}</p><p>${safe((v.flags||[]).join(' · '))}</p>`:''}<div class="detail-buttons"><a href="${safe(v.official)}" target="_blank" rel="noopener noreferrer" class="secondary">공식 모델·가격 확인 ↗</a></div></div><div class="detail-info"><h3>구매 전 체크리스트</h3><p>✓ 실제 시승 및 승차감 확인<br>✓ 주차장 폭·길이와 차량 전장 확인<br>✓ 보험료·세금·등록비 확인<br>✓ 트림별 기본 포함 옵션·중복 여부 확인<br>✓ 출고 대기·제조사 보증과 프로모션 확인</p></div></div><div class="sim"><h3>구매비용 시뮬레이터</h3><p class="subcopy">만 원 단위입니다. 실제 구매가를 알고 있다면 시작가를 수정하고, 본인이 받은 할인/보조금을 입력해 보세요.</p>${audit?`<div class="auditbox"><b>공식 가격표 확인 · ${safe(audit.priceDate)}</b><p>${safe(audit.note)}</p><a href="${safe(audit.url)}" target="_blank" rel="noopener noreferrer">기아 공식 트림·선택품목 확인 ↗</a></div><div class="fullrow"><label for="trimId">공식 트림 선택</label><select id="trimId" data-trim="1">${audit.trims.map(t=>`<option value="${safe(t.id)}" ${cfg.trimId===t.id?'selected':''}>${safe(t.name)} · ${money(t.price)}</option>`).join('')}</select></div>`:''}<div class="formrow"><div><label for="actualPrice">차량 기준 가격 (만 원)</label><input id="actualPrice" data-field="actualPrice" type="number" min="0" max="300000" step="1" value="${audit?selectedTrim.price:cfg.actualPrice}" ${audit?'readonly title="공식 트림가를 기준으로 계산합니다"':''}></div><div><label for="extraBudget">추가 옵션 예산 (만 원)</label><input id="extraBudget" data-field="extraBudget" type="number" min="0" max="30000" step="10" value="${cfg.extraBudget}"></div></div>
 ${opts.length?`<div class="realopt-title">선택한 트림의 공식 선택품목 <small>(일부 항목만 수록)</small></div>${opts.map(o=>`<label class="realopt"><input type="checkbox" data-option="${safe(o.id)}" ${cfg.optionIds.includes(o.id)?'checked':''}><span>${safe(o.name)}<small>${o.requires?' · 다른 옵션 선행 필요':''}</small></span><b>+${money(o.price)}</b></label>`).join('')}<p class="modalPanelNotes">선택 가능 여부는 등급·기본사양·선행 패키지에 따라 달라질 수 있으며, 확인한 트림의 선행 조건을 적용했습니다. 일부 선택품목만 수록되어 있습니다. 정확한 견적은 제조사 견적기에서 확인하세요.</p>`:'<p class="modalPanelNotes">이 모델은 최신 트림별 선택품목을 아직 검증하지 않아 옵션 가격을 임의로 만들지 않았습니다. 별도 옵션 예산을 입력하고 제조사 견적기에서 조합을 검증하세요.</p>'}
 <div class="realopt-title">내가 원하는 기능 체크리스트 <small>(초기 필수 기능 불러옴)</small></div><div class="wants-grid">${WANTED_FEATURES.map(([key,name])=>`<label class="realopt"><input type="checkbox" data-wanted="${safe(key)}" ${cfg.wantedFeatures.includes(key)?'checked':''}><span>${safe(name)}</span></label>`).join('')}</div><p class="modalPanelNotes">공식 검증된 구성의 실제 옵션 가격은 위 트림·선택품목에 합산되어 있습니다. 기타 항목은 상담용 확인 목록이며, 다른 차종은 트림별 적용 여부를 먼저 확인해야 합니다.</p>
 <div class="formrow"><div><label for="taxRate">취득세율 가정 (%)</label><select id="taxRate" data-field="taxRate">${[0,4,5,7].map(n=>`<option value="${n}" ${cfg.taxRate===n?'selected':''}>${n}%</option>`).join('')}</select></div><div><label for="taxCredit">취득세 감면 직접 입력 (만 원)</label><input id="taxCredit" data-field="taxCredit" type="number" min="0" max="500" value="${cfg.taxCredit}"></div></div>
 <div class="formrow"><div><label for="fees">등록·탁송 등 부대비용 (만 원)</label><input id="fees" data-field="fees" type="number" min="0" max="2000" value="${cfg.fees}"></div><div><label for="subsidy">EV 보조금 / 확인된 지원금 (만 원)</label><input id="subsidy" data-field="subsidy" type="number" min="0" max="30000" ${v.power!=='EV'?'disabled':''} value="${cfg.subsidy}"></div></div>
 <div class="formrow"><div><label for="downPayment">선수금 (%)</label><select id="downPayment" data-field="downPayment">${[0,10,20,30,50,70,100].map(n=>`<option value="${n}" ${cfg.downPayment===n?'selected':''}>${n}%</option>`).join('')}</select></div><div><label for="months">할부 기간</label><select id="months" data-field="months">${[24,36,48,60,72,84].map(n=>`<option value="${n}" ${cfg.months===n?'selected':''}>${n}개월</option>`).join('')}</select></div></div>
 <div class="fullrow"><label for="apr">연 할부 금리 (%) · 금융사 금리 확인 후 수정</label><input id="apr" data-field="apr" type="number" step="0.1" min="0" max="50" value="${cfg.apr}"></div>
 <div class="sumbox" id="calcSummary" aria-live="polite"></div><div class="detail-buttons"><button class="primary" id="saveConfig">♥ 이 견적으로 후보 저장</button><button class="secondary" id="copyConfig">견적 복사 ↗</button></div><div class="modalPanelNotes">* 취득세는 부가세 제외 가격에 선택 세율을 적용한 단순 추정입니다. 실제 세금·채권·개별소비세·전기차 보조금은 차량·지역·시기에 따라 다릅니다. 월 납입금은 원리금균등 방식 예시이며 금융 수수료·보험료는 포함하지 않습니다.</div></div></div>`;
 $('modalContent').innerHTML=html;$('modal').classList.remove('hidden');document.body.style.overflow='hidden';$('modalClose').focus();preparePhotos($('modalContent'));
 if(v.score===undefined&&resultMode==='recommend'){/* ranking details are only represented when browsing recommended result */}
 refreshCalc();
}
function refreshCalc(){if(!currentCar)return;const cfg=draft[currentCar.id],audit=verifiedGet(currentCar.id);if(audit){Object.assign(cfg,verifiedNormalize(currentCar.id,cfg));cfg.actualPrice=verifiedTrim(currentCar.id,cfg.trimId).price;}else cfg.optionIds=[];const options=verifiedTrim(currentCar.id,cfg.trimId)?.options||[];
 $('modalContent').querySelectorAll('[data-option]').forEach(node=>{const o=options.find(x=>x.id===node.dataset.option);node.checked=cfg.optionIds.includes(node.dataset.option);node.disabled=Boolean(o?.requires&&!o.requires.every(req=>cfg.optionIds.includes(req)));});
 const x=makeCalc(currentCar,cfg);
 $('calcSummary').innerHTML=`<span style="font-size:11px;color:#b7c9e9">선택한 구성의 구매비용 예상</span><div class="total">${money(x.total)}</div><div class="mini-row"><span>기준 차량가 + 추가품목/예산</span><strong>${money(x.vehiclePrice)}</strong></div><div class="mini-row"><span>취득세 추정 (${x.taxRate}%, 감면 반영)</span><strong>+ ${money(x.tax)}</strong></div><div class="mini-row"><span>부대비용</span><strong>+ ${money(x.fees)}</strong></div><div class="mini-row"><span>사용자 입력 EV 보조금</span><strong>− ${money(x.subsidy)}</strong></div><div class="cashmonthly"><div><span>예상 월 할부</span><strong>${money(x.monthly)}</strong></div><div><span>초기 필요 현금</span><strong>${money(x.cash)}</strong></div></div><p>실제 견적이 아니라 비교용 추정 결과입니다. 취득세 감면과 전기차 보조금은 자동으로 적용하지 않습니다.</p>`;
}
function closeModal(){if($('modal').classList.contains('hidden'))return;$('modal').classList.add('hidden');document.body.style.overflow='';currentCar=null;initialFocus?.focus?.();}
function setup(){
 updateCounts();const brands=[...new Set(VEHICLES.map(v=>v.brand))].sort((a,b)=>a.localeCompare(b,'ko'));$('brandFilter').insertAdjacentHTML('beforeend',brands.map(b=>`<option value="${safe(b)}">${safe(b)}</option>`).join(''));
 document.querySelectorAll('[data-view]').forEach(el=>el.addEventListener('click',event=>{event.preventDefault();show(el.dataset.view)}));
 $('brandLink').addEventListener('click',e=>{e.preventDefault();show('home')});
 $('profileForm').addEventListener('submit',e=>{e.preventDefault();startProfile()});
 $('clearProfile').addEventListener('click',()=>{preferences=structuredClone(DEFAULT);try{localStorage.removeItem(PROFILE_KEY)}catch{};drawProfile();notify('기본 입력값을 초기화했습니다.')});
 $('wizardCard').addEventListener('click',e=>{const el=e.target.closest('[data-choose]');if(el)choose(el.dataset.choose)});
 $('prevStep').addEventListener('click',()=>{if(wizardStep>0){wizardStep--;drawWizard()}else show('profile')});$('nextStep').addEventListener('click',nextWizard);
 for(const id of ['search','brandFilter','originFilter','bodyFilter','powerFilter','sizeFilter','priceFilter','sortSelect']) $(id).addEventListener('input',()=>{shown=12;renderBrowse();});
 $('moreBtn').addEventListener('click',()=>{shown+=12;renderBrowse()});
 document.addEventListener('click',e=>{const open=e.target.closest('[data-open]');const favorite=e.target.closest('[data-fav]');if(open)renderModal(open.dataset.open);else if(favorite)toggleFavorite(favorite.dataset.fav);else if(e.target.dataset.close==='modal')closeModal()});
 document.addEventListener('change',e=>{if(e.target.dataset.compare)pickCompare(e.target.dataset.compare,e.target.checked)});
 $('compareBtn').addEventListener('click',compare);
 $('exportBtn').addEventListener('click',()=>{const list=Object.keys(saved).map(id=>VEHICLES.find(v=>v.id===id)).filter(Boolean);if(!list.length){notify('저장한 차량이 없습니다.');return;}download('AutoPicker_내차후보.txt',list.map(v=>quoteText(v,saved[v.id])).join('\n\n'+'-'.repeat(35)+'\n\n'));notify('관심 차량 견적 파일을 생성했습니다.')});
 $('clearBtn').addEventListener('click',()=>{if(!Object.keys(saved).length)return;if(!window.confirm('관심 차량 전체를 비울까요?'))return;saved={};compareIds.clear();store();updateCounts();renderSaved();notify('목록을 비웠습니다.')});
 $('modalClose').addEventListener('click',closeModal);document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
 $('modalContent').addEventListener('change',e=>{const el=e.target;if(!currentCar)return;const cfg=draft[currentCar.id];if(el.dataset.trim){cfg.trimId=el.value;cfg.optionIds=[];cfg.actualPrice=verifiedTrim(currentCar.id,cfg.trimId).price;renderModal(currentCar.id);return;}if(el.dataset.wanted){const wants=new Set(cfg.wantedFeatures||[]);if(el.checked)wants.add(el.dataset.wanted);else wants.delete(el.dataset.wanted);cfg.wantedFeatures=[...wants];refreshCalc();}
 else if(el.dataset.option){const option=(verifiedTrim(currentCar.id,cfg.trimId)?.options||[]).find(o=>o.id===el.dataset.option);if(!option)return;const ids=new Set(cfg.optionIds);if(el.checked){if(option.exclusive)(verifiedTrim(currentCar.id,cfg.trimId)?.options||[]).filter(o=>o.exclusive===option.exclusive).forEach(o=>ids.delete(o.id));ids.add(option.id)}else ids.delete(option.id);cfg.optionIds=[...ids];refreshCalc();}
 else if(el.dataset.field){cfg[el.dataset.field]=Number(el.value)||0;refreshCalc();}});
 $('modalContent').addEventListener('input',e=>{if(!currentCar||!e.target.dataset.field)return;draft[currentCar.id][e.target.dataset.field]=Number(e.target.value)||0;refreshCalc()});
 $('modalContent').addEventListener('click',e=>{if(!currentCar)return;if(e.target.closest('#saveConfig')){const id=currentCar.id;saved[id]=structuredClone(draft[id]);store();updateCounts();notify('옵션과 견적을 후보로 저장했습니다.');renderBrowse();}else if(e.target.closest('#copyConfig'))copy(quoteText(currentCar,draft[currentCar.id]))});
 show('home');
}
setup();
})();
