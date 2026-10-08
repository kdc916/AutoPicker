'use strict';
const assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm');const core=require('./core'),verified=require('./catalog-verified');const cx={AutoCore:core,AutoVerified:verified,console};vm.createContext(cx);vm.runInContext(fs.readFileSync('./data.js','utf8')+';globalThis.CARS=VEHICLES;',cx);vm.runInContext(fs.readFileSync('./feature-fit.js','utf8'),cx);const f=cx.AutoFeatureFit,car=id=>cx.CARS.find(x=>x.id===id);let n=0;const test=(name,fn)=>{fn();console.log('PASS '+(++n)+' '+name)};
test('catalog count',()=>assert.equal(cx.CARS.length,77));test('Santa Fe parking package 119',()=>{let x=f.fitVerified(car('santafe-hev'),{seats:5},['surround']);assert.equal(x.estimate.optionCost,119);});test('Santa Fe HUD+parking 178',()=>assert.equal(f.fitVerified(car('santafe-hev'),{seats:5},['surround','hud']).estimate.optionCost,178));test('Santa Fe 7-seat priced',()=>assert.equal(f.fitVerified(car('santafe-hev'),{seats:7},['surround']).estimate.optionCost,188));test('best package cannot coexist with parking',()=>assert.equal(f.optionClosure(verified.trim('santafe-hev','ex2wd').options,['best','parking']),null));test('carnival mandatory cluster counted',()=>assert.equal(f.fitVerified(car('carnival'),{seats:9},['surround']).estimate.optionCost,150));test('seltos 360 monitoring 104',()=>assert.equal(f.fitVerified(car('seltos'),{seats:5},['surround']).estimate.optionCost,104));test('palisade 360 option 113',()=>assert.equal(f.fitVerified(car('palisade'),{seats:9},['surround']).estimate.optionCost,113));test('unknown not zero-priced',()=>assert.equal(f.fitVerified(car('palisade'),{seats:9},['audio']).status,'unavailable'));test('Sportage gas base',()=>{assert.equal(f.fitVerified(car('sportage'),{seats:5},['cruise']).estimate.base,2944);});
test('Sportage gasoline surround 114',()=>{assert.equal(f.fitVerified(car('sportage'),{seats:5},['surround']).estimate.optionCost,114);});
test('Sportage HEV 360+HUD 173',()=>{assert.equal(f.fitVerified(car('sportage-hev'),{seats:5},['surround','hud']).estimate.optionCost,173);});
test('Sportage HEV package total 3976',()=>{assert.equal(f.fitVerified(car('sportage-hev'),{seats:5},['surround','hud']).estimate.vehiclePrice,3976);});
test('Sportage HEV AWD option 223',()=>{assert.equal(f.fitVerified(car('sportage-hev'),{seats:5},['awd']).estimate.optionCost,223);});
test('Sportage Signature HUD base',()=>{assert.equal(f.fitVerified(car('sportage-hev'),{seats:5},['surround','hud'],{trimId:'hev-signature'}).estimate.optionCost,114);});
test('Sportage prestige surround unverified',()=>{assert.equal(f.fitVerified(car('sportage-hev'),{seats:5},['surround'],{trimId:'hev-prestige'}).status,'unavailable');});
test('Sorento gas surround standard',()=>{assert.equal(f.fitVerified(car('sorento'),{seats:5},['surround']).estimate.optionCost,0);});
test('Sorento hybrid surround standard',()=>{assert.equal(f.fitVerified(car('sorento-hev'),{seats:5},['surround']).estimate.optionCost,0);});
test('Sorento hybrid Noblesse base',()=>{assert.equal(f.fitVerified(car('sorento-hev'),{seats:5},['surround']).estimate.base,4299);});
test('Sorento hybrid seven seat 69',()=>{assert.equal(f.fitVerified(car('sorento-hev'),{seats:7},['surround']).estimate.optionCost,69);});
test('Sorento hybrid prestige HUD prereq 178',()=>{assert.equal(f.fitVerified(car('sorento-hev'),{seats:5},['hud'],{trimId:'hev-prestige'}).estimate.optionCost,178);});
test('Sorento hybrid Noblesse HUD 119',()=>{assert.equal(f.fitVerified(car('sorento-hev'),{seats:5},['hud'],{trimId:'hev-noblesse'}).estimate.optionCost,119);});
test('Sorento hybrid AWD must not be marked verified',()=>{assert.equal(f.fitVerified(car('sorento-hev'),{seats:5},['awd']).status,'unavailable');});
test('Sixteen audited variants',()=>{assert.equal(Object.keys(verified.catalog).length,16);});

test('Tucson surround+cruise 163',()=>{const x=f.fitVerified(car('Tucson'),{seats:5},['surround','cruise','hda']);assert.equal(x.trimId,'gas-premium');assert.equal(x.estimate.optionCost,163);});
test('Tucson Modern cruise 40',()=>assert.equal(f.fitVerified(car('Tucson'),{seats:5},['cruise'],{trimId:'gas-modern'}).estimate.optionCost,40));
test('Tucson HDA Modern not confirmed',()=>assert.equal(f.fitVerified(car('Tucson'),{seats:5},['hda'],{trimId:'gas-modern'}).status,'unavailable'));
test('Avante base cruise free',()=>assert.equal(f.fitVerified(car('avante'),{seats:5},['cruise']).estimate.optionCost,0));
test('Avante HDA Premium',()=>assert.equal(f.fitVerified(car('avante'),{seats:5},['hda']).trimId,'gas-premium'));
test('Avante surround not guessed',()=>assert.equal(f.fitVerified(car('avante'),{seats:5},['surround']).status,'unavailable'));
test('K5 GAS surround Noblesse base',()=>{const x=f.fitVerified(car('k5'),{seats:5},['surround']);assert.equal(x.trimId,'gas-noblesse');assert.equal(x.estimate.optionCost,0);});
test('K5 HEV monitor Best Selection 115',()=>{const x=f.fitVerified(car('k5-hev'),{seats:5},['surround']);assert.equal(x.trimId,'hev-best');assert.equal(x.estimate.optionCost,115);});
test('K5 HEV surround+HUD Noblesse HUD109',()=>{const x=f.fitVerified(car('k5-hev'),{seats:5},['surround','hud']);assert.equal(x.trimId,'hev-noblesse');assert.equal(x.estimate.optionCost,109);});
test('Grandeur GAS Parking 170',()=>assert.equal(f.fitVerified(car('new-grandeur'),{seats:5},['surround']).estimate.optionCost,170));
test('Grandeur GAS Exclusive parking standard',()=>assert.equal(f.fitVerified(car('new-grandeur'),{seats:5},['surround'],{trimId:'gas-exclusive'}).estimate.optionCost,0));
test('Grandeur HEV parking 170',()=>assert.equal(f.fitVerified(car('new-grandeur-hev'),{seats:5},['surround']).estimate.optionCost,170));
test('Grandeur AWD not verified',()=>assert.equal(f.fitVerified(car('new-grandeur'),{seats:5},['awd']).status,'unavailable'));


test('K8 gas entry price 3731',()=>assert.equal(f.fitVerified(car('k8'),{seats:5},[]).estimate.base,3731));
test('K8 gas surround uses Best 4172',()=>{const x=f.fitVerified(car('k8'),{seats:5},['surround']);assert.equal(x.trimId,'gas-25-best');assert.equal(x.estimate.base,4172);assert.equal(x.estimate.optionCost,0);});
test('K8 HEV price 4267 and 360 Best 4420',()=>{assert.equal(f.fitVerified(car('k8-hev'),{seats:5},[]).estimate.base,4267);const x=f.fitVerified(car('k8-hev'),{seats:5},['surround']);assert.equal(x.trimId,'hev-best');assert.equal(x.estimate.base,4420);});
test('K8 HEV Meridian audio adds 109',()=>{const x=f.fitVerified(car('k8-hev'),{seats:5},['surround','audio']);assert.equal(x.estimate.optionCost,109);});
test('2027 Sonata is price-only',()=>{assert.equal(car('sonata').price,2876);assert.equal(car('sonata-hev').price,3328);assert.equal(verified.get('sonata'),null);assert.equal(verified.get('sonata-hev'),null);});

console.log('ALL PASS',n);
