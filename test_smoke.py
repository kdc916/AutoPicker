from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).parent
errors=[]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--disable-web-security','--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':900})
 page.on('pageerror',lambda err: errors.append(str(err)))
 page.set_content((root/'AutoPicker_Pro_Standalone.html').read_text(),wait_until='domcontentloaded')
 page.screenshot(path=str(root/'screenshot_home.png'),full_page=True)
 assert page.locator('#totalCars').inner_text()=='77'
 page.get_by_role('button',name='맞춤 차량 찾기',exact=False).first.click()
 assert not page.locator('#wizardView').is_hidden()
 for idx in range(9):
  assert page.locator('#wizardCard .choice').count()>0
  page.locator('#nextStep').click()
 assert not page.locator('#browseView').is_hidden(), 'finish survey navigates to browse'
 assert '추천' in page.locator('#browseTitle').inner_text()
 assert page.locator('#carGrid .car-card').count()==12
 page.screenshot(path=str(root/'screenshot_recommend.png'),full_page=True)
 first=page.locator('#carGrid [data-open]').first
 carid=first.get_attribute('data-open'); first.click()
 assert not page.locator('#modal').is_hidden()
 page.locator('#actualPrice').fill('3500')
 page.locator('#extraBudget').fill('150')
 assert page.locator('#calcSummary .total').inner_text()!='0만 원'
 page.locator('#saveConfig').click();assert page.locator('#favCounter').inner_text()=='1'
 page.locator('#modalClose').click()
 page.locator('#carGrid [data-fav]').nth(1).click()
 assert page.locator('#favCounter').inner_text()=='2'
 page.locator('[data-view="shortlist"].navbtn').click()
 assert page.locator('#shortlistGrid .car-card').count()==2
 page.locator('#shortlistGrid [data-compare]').first.check()
 page.locator('#shortlistGrid [data-compare]').nth(1).check()
 page.locator('#compareBtn').click()
 assert page.locator('.comparetable').count()==1
 page.screenshot(path=str(root/'screenshot_compare.png'),full_page=True)
 # set_content runs on an opaque about:blank origin, so localStorage persistence cannot be tested here.
 assert page.locator('#favCounter').inner_text()=='2', 'favorite count before reload' 
 print('Desktop wizard / browse / modal / save / comparison: PASS')
 ctx=b.new_context(viewport={'width':390,'height':844},is_mobile=True,device_scale_factor=1)
 mobile=ctx.new_page();mobile.on('pageerror',lambda err: errors.append(str(err)))
 mobile.set_content((root/'AutoPicker_Pro_Standalone.html').read_text(),wait_until='domcontentloaded')
 mobile.screenshot(path=str(root/'screenshot_mobile.png'),full_page=True)
 assert mobile.evaluate('document.documentElement.scrollWidth <= window.innerWidth+1'),'mobile horizontal overflow'
 mobile.locator('[data-view="browse"].navbtn').click()
 assert mobile.locator('#carGrid .car-card').count()==12
 assert mobile.evaluate('document.documentElement.scrollWidth <= window.innerWidth+1'),'browse horizontal overflow'
 print('Mobile 390px home and catalog: PASS')
 print('JS page errors:',errors)
 assert not errors, 'Javascript errors found: '+repr(errors)
 b.close()
