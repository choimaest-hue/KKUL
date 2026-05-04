# 껄껄무새

코믹 톤으로 보여주는 미국/한국 주식 기회비용 계산기입니다.

사용자가 다음 정보를 입력하면,

1. 어떤 종목을 언제, 몇 주 매도했는지
2. 그 자금으로 어떤 종목들을 언제, 몇 % 비중으로 매수했는지
3. 최종 평가일이 언제인지

야후 금융 종가(휴장일은 직전 거래일 종가)를 기준으로,

1. 갈아탄 포트폴리오 현재 가치
2. 원래 종목을 계속 들고 있었을 때 가치
3. 현금으로 들고 있었을 때 가치
4. 기회비용

을 한 번에 계산합니다.

## 핵심 기능

1. 미국/한국 종목 혼합 계산 지원
2. 한국 6자리 종목코드 입력 시 자동으로 .KS/.KQ 후보 조회
3. 매수 라인 무제한 추가/삭제
4. 비중 합계 100% 검증
5. 광고 슬롯(AdSense/AdFit) 영역 자동 숨김
	- 광고가 실제로 로드되지 않으면 영역이 접혀서 UI를 가리지 않음
6. 데스크톱/모바일 반응형 레이아웃

## 로컬 실행

1. 의존성 설치

npm.cmd install

2. 환경 변수 설정

Windows:

copy .env.example .env.local

3. 개발 서버 실행

npm.cmd run dev

4. 브라우저에서 http://localhost:3000 접속

## 환경 변수

파일: .env.local

1. NEXT_PUBLIC_ADSENSE_CLIENT
2. NEXT_PUBLIC_ADSENSE_SLOT_TOP
3. NEXT_PUBLIC_ADFIT_CLIENT
4. NEXT_PUBLIC_ADFIT_UNIT_BOTTOM

광고 관련 환경 변수를 비워두면 광고 영역은 렌더링되지 않습니다.

## Vercel 배포

1. GitHub 저장소를 Vercel에 Import
2. Framework Preset: Next.js 확인
3. Environment Variables에 아래 값 등록
	- NEXT_PUBLIC_ADSENSE_CLIENT
	- NEXT_PUBLIC_ADSENSE_SLOT_TOP
	- NEXT_PUBLIC_ADFIT_CLIENT
	- NEXT_PUBLIC_ADFIT_UNIT_BOTTOM
4. Deploy

배포 후에는 실제 광고 계정/슬롯 활성화 상태에 따라 영역 노출 여부가 자동 결정됩니다.
