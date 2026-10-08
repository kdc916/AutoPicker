from pathlib import Path
p=Path(__file__).parent
html=(p/'index.html').read_text(encoding='utf-8')
css=(p/'styles.css').read_text(encoding='utf-8')
html=html.replace('<link rel="stylesheet" href="styles.css">', '<style>\n'+css+'\n</style>')
for name in ('data','core','catalog-verified','feature-fit','app'):
 src=(p/(name+'.js')).read_text(encoding='utf-8')
 assert '</script' not in src.lower()
 html=html.replace('<script src="'+name+'.js"></script>','<script>\n'+src+'\n</script>')
(p/'AutoPicker_Pro_Standalone.html').write_text(html,encoding='utf-8')
print('Standalone generated:',len(html),'characters')
