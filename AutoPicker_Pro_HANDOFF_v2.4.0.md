# AutoPicker Pro v2.4.0 — 누적 개발 히스토리 및 인수인계

- 개발/데이터 재확인: 2026-10-08 (Asia/Seoul)
- 저장소: https://github.com/kdc916/AutoPicker
- 구버전 안정기준: v2.3.0
- 목표: 자동차 구매자의 필수 기능 → 정확한 트림/제조사 선택품목 가격 → 최종 비교, 국산 대표 SUV 데이터 확대.

## 구현 변경

1. `catalog-verified.js`: 스포티지 GAS/HEV, 쏘렌토 GAS/HEV 4개 모델 엔트리를 추가. 총 8/77 모델에 공식 트림(합계 20개 트림)과 기능 `baseFeatures`/`options[].features`, 선택 좌석/선행 조건을 매핑.
2. `data.js`, `VEHICLE_PRICE_SOURCES.csv`: 4개 신규 모델의 시작가 및 국내 공식 가격 상세 링크 동기화.
3. `app.js`: 추천 카드 바로 저장 시 최저비용 선택 트림/옵션/좌석 프로필 스냅샷 저장. 저장된 후보를 현재 설정이 바뀐 이후 다시 열어도 기존 좌석 구성 보존. 상세 화면에 기능 체크 후 트림 자동 재추천 버튼 추가. 최종 비교표에 저장 트림/제조사 옵션 합계/검증 상태 표시.
4. `index.html`, `README.md`: v2.4.0 표기 및 안내 변경. `bundle.py`로 동일 변경을 Standalone HTML에 반영.
5. `test_feature_fit.js`: v2.3 회귀 20개 + 스포티지/쏘렌토 15개 케이스 = 35개. `test_core.js`: 기본 14개. `test_package_ui.py` 기존 주요 화면 및 `test_v24_ui.py` 신규 카드 저장·좌석 스냅샷·트림 재추천·390px 모바일 검사.

## 확인한 공식 가격표 (만 원)

| 모델 ID | 동력/트림 일부 | 가격 | 핵심 옵션 사례 | 공표 기준 | 원본 |
|---|---|---:|---|---|---|
| `sportage` | 1.6 가솔린 터보 노블레스 | 3,322 | 모니터링 114, HUD 59 | 2026-09-01 | https://www.kia.com/kr/vehicles/sportage/price |
| `sportage-hev` | 1.6T HEV 노블레스, 2WD | 3,803 | 모니터링 114, HUD 59, AWD 223 | 2026-09-01 | https://www.kia.com/kr/vehicles/sportage/price |
| `sorento` | 2.5T 가솔린 노블레스, 2WD | 3,966 | 서라운드 뷰 기본, 7인승 69 | 2026-10-01 | https://www.kia.com/kr/vehicles/sorento/price |
| `sorento-hev` | 1.6T HEV 노블레스, 2WD | 4,299 | 서라운드 뷰 기본, 7인승 69, HUD + 빌트인캠 119 | 2026-10-01 | https://www.kia.com/kr/vehicles/sorento/price |

정확한 옵션 구성 범위: 스포티지는 GAS와 HEV 트림 3개씩, 쏘렌토는 GAS 및 HEV(2WD) 트림 2개씩만 매핑. 수입차/다른 69개 차종 옵션은 '미확정' 상태로 두어 확정 사양인 양 0원 계산하지 않음.

## 검증 예시

- 스포티지 HEV 5인승, 어라운드뷰 + HUD: 노블레스 3,803 + 모니터링 114 + HUD 59 = 출고가 3,976만 원(취득세/비용 전).
- 쏘렌토 HEV 7인승, 어라운드뷰 + HUD: 노블레스 4,299 + 좌석 변경 69 + HUD+빌트인캠 119 = 출고가 4,487만 원(취득세/비용 전).
- 쏘렌토 HEV 프레스티지에서 HUD 선택 시 12.3인치 클러스터 59 + HUD 119 = 선택옵션 178만 원. 5인승 기본가 3,963만 원.
- 실제 취득세는 차량 가격·특례·구매자 조건·지역 등에 따라 달라지므로 표기된 7% 계산 결과는 비교용 추정일 뿐임.

## 테스트 & 실행

```bash
node test_core.js
node test_feature_fit.js
python bundle.py
python test_package_ui.py
python test_v24_ui.py
```

- GitHub Pages: `main` 브랜치 `/ (root)` 배포. `index.html`을 엔트리로 사용.
- 파일로 단독 실행: `AutoPicker_Pro_Standalone.html`.
- 주의: 일부 브라우저 테스트 환경에서 `http://127.0.0.1`과 `file://` 네비게이션이 차단될 수 있으므로 Playwright `page.set_content` 사용한 테스트도 제공. 이때 `about:blank`의 localStorage는 접근이 거부될 수 있어 실제 보존은 Pages/일반 HTTP 배포에서 별도 검증 권장.

## 누적 히스토리

- v2.0: 77대 국내외 차량 탐색/기본 견적
- v2.1: 공식 가격표 일부 차종 트림·선택품목 시작
- v2.2: 기본정보 선입력, 상황별 질문, 필수 기능 기반 추천
- v2.3: 기능 체크 → 옵션 패키지 → 차량가/세금 합산 버그 수정
- **v2.4: 스포티지/쏘렌토 동력별 트림 확대, 후보 저장 및 재추천 기능과 회귀 테스트 보강**

## 다음 개발 우선순위

1. 카니발 HEV, 투싼 HEV, 아반떼/쏘나타 HEV, 그랜저 등 공식 모델연도/트림·옵션을 가격표 기반 확장.
2. 수입차 국내 가격과 옵션 패키지를 공식 설정기/카탈로그 링크와 매핑; 국내 판매확인 안 되면 확정 불가로 유지.
3. 매년 세제혜택·다자녀·친환경 혜택 및 등록지역별 세금 계산 엔진 분리.
4. 탑승 인원은 `최소 인원`과 `6/7인승 구체 좌석 형태 선호`를 분리해 더 자연스러운 가족 추천.
5. 공식 가격표 갱신일/소스 스냅샷 기록과 가격 변동 알림, 모델연도별 가격 유효성 검증.
6. 실차 이미지 모델/연식 정합성 및 Wikimedia 라이선스/공식 홍보 사진 사용 허락 검토.
