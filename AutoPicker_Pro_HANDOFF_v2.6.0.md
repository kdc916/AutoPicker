# AutoPicker Pro v2.6.0 cumulative handoff (2026-10-08)

Official repository https://github.com/kdc916/AutoPicker — main branch, GitHub Pages root. Key files index.html, data.js, core.js, catalog-verified.js, feature-fit.js, app.js, styles.css, bundle.py.

History: v2.0 vehicle discovery → v2.1 Kia official trim foundations → v2.2 customer pre-profile & feature checklist → v2.3 official option-price mapping → v2.4 Sportage/Sorento gas+HEV → v2.5 Tucson gasoline/Avante gasoline/K5/Grandeur variants → v2.6 2027 K8 gas+HEV and 2027 Sonata price update.

Now: 77 vehicles, 14 brands, 16 model groups / 39 official partial trims; remaining 61 models not confirmed for option packages. K8 2.5 gas 2027 Noblesse Light 3731, Best Selection 4172; K8 turbo HEV 2027 Noblesse Light 4267, Best Selection 4420 (KRW 10k, HEV after tax benefit). Best Selection includes surround camera, power liftgate, two front-seat ventilation. Base driver-only ventilation does not fulfill two-front-seat ventilation; Smart Trunk not equivalent to powered tailgate. Optional Meridian 109. Official manufacturer price data as of 2026-09-01: https://www.kia.com/kr/vehicles/k8/price/private .

2027 Sonata price updates are manufacturer launch news published 2026-10-07: gas 2.0 Premium 2876, HEV Premium 3328, price-only, no official 2027 option package data yet. Do not copy older 2026 Sonata options into 2027. https://www.hyundaimotorgroup.com/ko/news/hyundai-motor-company-sonata-the-edge-2027

Hyundai Tucson HEV and all-new Avante HEV year-matched option data still needs research; old Avante HEV info should never be used to validate new model configurations. All totals include approximate simulated tax/fees, NOT binding quotations.

Verification performed locally: node test_core.js (14), node test_feature_fit.js (71), Playwright desktop/mobile checks and prior version regressions; screenshots in ZIP. Run python bundle.py after changes, then check JS and browser. Next: 2027 Sonata option package mapping, Tucson HEV and new Avante HEV, remaining K8 trims, source-image license reviews, jurisdiction tax accuracy.
