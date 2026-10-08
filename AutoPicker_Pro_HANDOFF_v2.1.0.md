# AutoPicker Pro CUMULATIVE HANDOFF v2.1.0
- Repo: https://github.com/kdc916/AutoPicker
- Date: 2026-10-08
- Base v2.0: 77 models / 14 brands, 9-step wizard, shortlist, 4-car comparison, standalone.

## v2.1 changes
- Adds `catalog-verified.js`: model-specific, manufacturer-dated trim prices, option dependencies, source links.
- Seltos 1.6T gas trims: Trendy 2512, Prestige 2880, Signature 3145 (KRW 10k). Carnival 2027 3.5 gas 9-seat Prestige 3686.
- Configurator selects a trim and prunes unsupported options on changes. Existing localStorage key `autopicker.v2.saved` remains.
- Unverified vehicles do not receive invented option prices; they use manually entered extra budget and an unpriced desired-features checklist.
- Other 75 catalog entries are not newly certified for current prices.

## Grounded manufacturer sources (price table date 2026-10-01)
- https://www.kia.com/kr/vehicles/seltos/price
- https://www.kia.com/kr/vehicles/carnival/price

## Deployment
- Static GitHub Pages from `main` root; script order `data.js, core.js, catalog-verified.js, app.js`.
- Update `vehicles.json` using `build_catalog.py`; keep `catalog-verified.js` separate for manufacturer-audited trim data.
- Run `node test_core.js` and `node test_verified.js`, then `python test_smoke.py`, `python test_persistence.py`, `python test_verified_ui.py`.
- `python bundle.py` regenerates standalone HTML.
- Real purchase prices, photos, safety scores and option packages must be verified per model, trim, year and region.

## Next patch
- Verify 6/7/9-seat trim availability and remaining brand pricing, model retirement, EV incentives per address, accessibility and long-term running-cost comparison.
