"""Deterministic integrity rules for AutoPicker 2.7 market snapshot."""
from pathlib import Path
import json,csv,re
P=Path(__file__).resolve().parent
s=json.loads((P/'catalog-summary.json').read_text())
base=json.loads((P/'base_vehicles.json').read_text())
rows=list(csv.DictReader((P/'MARKET_CATALOG_AUDIT.csv').open(encoding='utf-8-sig')))
hold=json.loads((P/'MARKET_CATALOG_HOLD.json').read_text())
audited=json.loads((P/'verified-ids.json').read_text())
assert len(rows)==s['count']==321 and len(base)==77
assert len(set(r['id'] for r in rows))==321
assert len(set(r['brand'] for r in rows))==s['brands']==33
assert len(hold)==s['hold']==30
assert len([r for r in rows if not r['price']])==s['unpriced']==214
assert len([r for r in rows if r['price']])==s['priceKnown']==107
assert len(audited)==s['officialOptionModels']==17
assert set(audited).issubset({r['id'] for r in rows})
assert set(r['id'] for r in rows).isdisjoint({r['id'] for r in hold})
assert all(r['official'].startswith('https://') for r in rows)
assert all((not r['price'] or int(r['price'])>0) for r in rows)
assert all((r['priceProof']!='none' or not r['price']) for r in rows)
assert all(r['catalogState']!='review' for r in rows)
print('ALL PASS catalog integrity 12 checks: 321 vehicles, 33 brands, price provenance, separate HOLD')
