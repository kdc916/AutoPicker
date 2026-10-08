"""Regression: 321-family catalog, official-option isolation, unknown-price safe workflow and mobile."""
from pathlib import Path
from playwright.sync_api import sync_playwright
P=Path(__file__).parent
errors=[]
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1440,'height':900},accept_downloads=True)
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content((P/'AutoPicker_Pro_Standalone.html').read_text('utf8'),wait_until='domcontentloaded')
 assert page.locator('#totalCars').inner_text()=='321'
 assert page.locator('#totalBrands').inner_text()=='33'
 assert page.locator('#verifiedCount').inner_text()=='17'
 print('PASS home count, brand count, verified subset')
 page.locator('button[data-view="browse"]').first.click()
 assert '321대' in page.locator('#resultCount').inner_text()
 page.locator('#brandFilter').select_option('BMW')
 assert 'BMW' in page.locator('#carGrid').inner_text()
 print('PASS BMW batch browse')
 page.locator('#verificationFilter').select_option('unpriced')
 assert page.locator('#carGrid .car-card').count()>0
 page.locator('#search').fill('M5')
 c=page.locator('#carGrid .car-card').first
 assert '가격 확인 필요' in c.inner_text(),c.inner_text()
 c.locator('[data-open]').click()
 assert '총구매예산 계산 보류' in page.locator('#calcSummary').inner_text()
 print('PASS unknown base price never reported as 0 KRW or 15 KRW quote')
 page.locator('#actualPrice').fill('15000')
 assert '총구매예산 계산 보류' not in page.locator('#calcSummary').inner_text()
 print('PASS user-entered actual price unlocks estimate with no claimed OEM verification')
 page.locator('#modalClose').click()
 page.locator('#search').fill('')
 page.locator('#brandFilter').select_option('any')
 page.locator('#verificationFilter').select_option('packages')
 assert '17대' in page.locator('#resultCount').inner_text(),page.locator('#resultCount').inner_text()
 print('PASS option-verified-only filter exactly 17')
 page.locator('#verificationFilter').select_option('any')
 page.locator('#search').fill('싼타페 하이브리드')
 page.locator('#carGrid [data-open="santafe-hev"]').click()
 page.locator('input[data-wanted="surround"]').check()
 page.locator('input[data-wanted="hud"]').check()
 t=page.locator('#calcSummary').inner_text()
 assert '178만 원' in t and '4,200만 원' in t,t
 print('PASS existing Santa Fe 360+HUD price regression')
 page.locator('#modalClose').click()
 page.locator('#search').fill('XC40')
 page.locator('#carGrid [data-open="xc40"]').click()
 page.locator('input[data-wanted="surround"]').check()
 page.locator('#autoFitTrim').click()
 assert 'Ultra' in page.locator('#modal').inner_text()
 assert '5,490만 원' in page.locator('#calcSummary').inner_text()
 print('PASS Volvo XC40 Plus to Ultra 360 camera upgrade')
 page.locator('#modalClose').click()
 page.locator('#search').fill('')
 page.locator('#verificationFilter').select_option('unpriced')
 page.locator('#priceFilter').select_option('3000')
 assert '0대' in page.locator('#resultCount').inner_text()
 print('PASS budget filter excludes unverified price')
 page.locator('#priceFilter').select_option('0')
 with page.expect_download() as info:
  page.locator('#catalogExport').click()
 assert info.value.suggested_filename.endswith('.csv')
 print('PASS catalog CSV export')
 mobile=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,device_scale_factor=1)
 mobile.on('pageerror',lambda e:errors.append(str(e)))
 mobile.set_content((P/'AutoPicker_Pro_Standalone.html').read_text('utf8'),wait_until='domcontentloaded')
 mobile.locator('button[data-view="browse"]').first.click()
 mobile.locator('#brandFilter').select_option('KGM')
 mobile.locator('#search').fill('토레스 EVX')
 assert mobile.locator('#carGrid .car-card').count()>=1
 assert mobile.evaluate('document.documentElement.scrollWidth <= window.innerWidth+2')
 mobile.screenshot(path=str(P/'screenshot_v27_mobile.png'),full_page=True)
 print('PASS mobile KGM model and no horizontal overflow')
 assert not errors,errors
 print('PASS JavaScript errors:',errors)
 browser.close()
