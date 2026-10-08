# AutoPicker Pro v2.2.0 Handoff — 2026-10-08

Repo: kdc916/AutoPicker; main/root GitHub Pages. Stable baseline: v2.1.0.

## Scope
Pre-qualification form (people, total budget, yearly mileage, charging) with 10 required vehicle features; 5 conditional follow-up questions; verified trim+option+dependency minimum-price configuration; budget check; clear confirmed vs pending results; preselected quote config; local browser preference storage.

## Trusted data boundaries
Only Kia Seltos 1.6 Turbo Trendy/Prestige/Signature and 2027 Carnival 3.5 gasoline 9-seat Prestige were audited for this matching flow (price schedule 2026-10-01). This is NOT comprehensive verification of 77 catalogue models. Never claim unverified options are supported; mark those as pending. Manufacturer source: https://www.kia.com/kr/vehicles/seltos/price and https://www.kia.com/kr/vehicles/carnival/price. Driving assistance is NOT autonomous driving.

## Source files
index.html (profile UI), styles.css (responsive form), app.js (adaptive flow and estimate display), feature-fit.js (new deterministic matching), catalog-verified.js (existing manufacturer trim subset), core.js (existing estimate scoring), bundle.py (updated asset order), AutoPicker_Pro_Standalone.html (offline bundle), test_feature_fit.js (matching unit tests), README.md (usage/limitations).

## Tests
node --check app.js; node --check feature-fit.js; node test_core.js; node test_verified.js; node test_feature_fit.js. Browser smoke test performed locally at 1440px and 390px with Playwright Chromium. GitHub deployment independent from test status.

## Future
Expand audited OEM trim/option coverage across Korean brands then domestic import catalog; explicit seating configurations per trim; per-model standard features and option applicability graph; model-year-specific image sources; compare TCO and real dealer quotes; accessibility/keyboard regression and browser-storage tests.
