# AutoPicker Pro v2.3.0 Handoff

2026-10-08 · Screenshot issue: selected desired features did not automatically choose manufacturer packages or update the quote (0원 bug).

Changes: `catalog-verified.js` holds scoped manufacturer trims with `baseFeatures`, package-provided `features`, `seats`/`seatCount`, prerequisites, exclusions, and price in 10,000 KRW. `feature-fit.js` selects a minimum-cost valid configuration. `app.js` synchronizes feature checkboxes with paid manufacturer packages, pricing, taxes, quote-copy/export, and candidate cards. `styles.css` shows price breakdown and missing verification. `data.js` points verified models to their direct official price pages.

Scope: 4 manufacturer models with audited subsets / 77 total vehicles: Seltos 1.6T, Carnival gasoline 3.5 9-seat, Santa Fe Hybrid 2WD, and Palisade gasoline 2.5T 9-seat. Other 73 have no verified package configuration and MUST NOT be labeled zero-cost or confirmed for requested options.

Evidence: Hyundai Santa Fe Hybrid Oct 1 2026, Exclusive 40.22 million KRW; Parking Assist Plus I 1.19m; HUD 0.59m; 7 seats 0.69m. Example: 40.22+1.19+0.59=42m KRW before tax/fees; approx total 44.82m KRW at simulated tax and 150k basic fees. Source https://www.hyundai.com/kr/ko/e/vehicles/santafe-hybrid/price . Hyundai Palisade https://www.hyundai.com/kr/ko/e/vehicles/palisade/price . Kia Seltos https://www.kia.com/kr/vehicles/seltos/price/ . Kia Carnival https://www.kia.com/kr/vehicles/carnival/price/ .

Build: `python bundle.py`. Tests: `node test_core.js`, `node test_feature_fit.js`. For end-to-end browser tests, use the standalone HTML with Playwright and Chromium.

History: v2.0 broad car search → v2.1 audited Kia trims → v2.2 profile & required features → v2.3 verified manufacturer packages reflected in final prices.

Next: expand individual official variants including AWD, seating, trim bundles; import official PDF/HTML price tables carefully with update date; review all 77 models. Replace approximate acquisition-tax rules with jurisdiction/EV/family-specific rules, keeping estimated vs verified total separate.
