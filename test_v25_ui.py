from pathlib import Path
from playwright.sync_api import sync_playwright
p=Path(__file__).parent
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1280,'height':840});errors=[];page.on('pageerror',lambda x:errors.append(str(x)))
 page.set_content((p/'AutoPicker_Pro_Standalone.html').read_text(),wait_until='domcontentloaded')
 page.locator('button[data-view="browse"]').first.click()
 page.locator('#search').fill('K5 하이브리드')
 page.locator('#carGrid .car-card[data-id="k5-hev"] [data-open]').click()
 page.locator('input[data-wanted="surround"]').check();page.locator('#autoFitTrim').click()
 assert page.locator('#trimId').input_value()=='hev-best'
 assert '+115만 원' in page.locator('#calcSummary').inner_text()
 mobile=b.new_page(viewport={'width':390,'height':844},is_mobile=True)
 mobile.set_content((p/'AutoPicker_Pro_Standalone.html').read_text(),wait_until='domcontentloaded')
 mobile.locator('button[data-view="browse"]').first.click()
 assert mobile.evaluate('document.documentElement.scrollWidth<=window.innerWidth+1')
 assert errors==[],errors
 print('AutoPicker v2.5.0 UI PASS')
 b.close()
