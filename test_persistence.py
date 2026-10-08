from pathlib import Path
from playwright.sync_api import sync_playwright
p=Path(__file__).parent
html=(p/'AutoPicker_Pro_Standalone.html').read_text()
def inject(default='{}'):
 script='''<script>window.__testStore=Object.create(null);window.__testStore["autopicker.v2.saved"]=%s;Object.defineProperty(window,"localStorage",{configurable:true,value:{getItem(k){return window.__testStore[k]||null},setItem(k,v){window.__testStore[k]=v},removeItem(k){delete window.__testStore[k]}}});</script>'''
 import json
 return html.replace('</head>',script%json.dumps(default)+'</head>')
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 first=b.new_page();first.set_content(inject())
 first.locator('[data-view="browse"].navbtn').click()
 first.locator('#carGrid [data-fav]').first.click()
 value=first.evaluate('window.__testStore["autopicker.v2.saved"]')
 assert value and value!='{}',repr(value)
 second=b.new_page();second.set_content(inject(value))
 assert second.locator('#favCounter').inner_text()=='1'
 second.locator('[data-view="shortlist"].navbtn').click()
 assert second.locator('#shortlistGrid .car-card').count()==1
 print('Save serialization / fresh page restoration: PASS')
 b.close()
