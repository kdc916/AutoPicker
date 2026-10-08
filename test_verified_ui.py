from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).parent
with sync_playwright() as pw:
    b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    page=b.new_page(viewport={'width':1300,'height':900}); errors=[]
    page.on('pageerror',lambda e: errors.append(str(e)))
    page.set_content((root/'AutoPicker_Pro_Standalone.html').read_text(),wait_until='domcontentloaded')
    page.locator('[data-view="browse"].navbtn').click()
    page.locator('#search').fill('셀토스')
    page.locator('[data-open="seltos"]').click()
    assert page.locator('#trimId option').count()==3
    assert page.locator('#actualPrice').input_value()=='2512'
    assert page.locator('[data-option="awd"]').is_disabled()
    page.locator('[data-option="style"]').check()
    page.locator('[data-option="awd"]').check()
    assert '2,819만 원' in page.locator('#calcSummary').inner_text()
    page.locator('#trimId').select_option('prestige')
    assert page.locator('#actualPrice').input_value()=='2880'
    assert not page.locator('[data-option="awd"]').is_disabled()
    page.locator('#trimId').select_option('signature')
    assert page.locator('#actualPrice').input_value()=='3145'
    page.locator('#modalClose').click()
    page.locator('#search').fill('카니발')
    page.locator('[data-open="carnival"]').click()
    assert page.locator('#actualPrice').input_value()=='3686'
    assert not errors, errors
    print('PASS: verified trim UI and no JS errors')
    b.close()
