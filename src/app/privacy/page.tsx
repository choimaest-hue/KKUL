import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 | 껄껄무새",
};

export default function PrivacyPage() {
  return (
    <main
      style={{
        maxWidth: "720px",
        margin: "0 auto",
        padding: "48px 24px",
        fontFamily: "sans-serif",
        color: "#1e293b",
        lineHeight: "1.8",
      }}
    >
      <h1 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "8px" }}>
        개인정보처리방침
      </h1>
      <p style={{ fontSize: "0.9rem", color: "#64748b", marginBottom: "40px" }}>
        최종 수정일: 2026년 5월 5일
      </p>

      <section style={{ marginBottom: "36px" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "12px" }}>
          1. 수집하는 개인정보
        </h2>
        <p>
          껄껄무새(이하 &quot;서비스&quot;)는 회원가입, 로그인 등 별도의 계정 시스템을
          운영하지 않으며, <strong>사용자의 개인정보를 수집·저장하지 않습니다.</strong>
        </p>
        <p style={{ marginTop: "12px" }}>
          서비스 이용 중 입력하는 종목명, 날짜, 수량 등의 정보는 브라우저 메모리 내에서만
          처리되며 서버에 저장되지 않습니다.
        </p>
      </section>

      <section style={{ marginBottom: "36px" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "12px" }}>
          2. 자동 수집 정보
        </h2>
        <p>
          서비스는 Vercel 플랫폼 위에서 운영됩니다. Vercel은 서버 로그로 접속 IP, 브라우저
          종류, 접속 시각 등 표준 웹 접속 로그를 자동으로 수집할 수 있습니다. 이 정보는
          Vercel의 개인정보처리방침에 따라 관리되며, 당사는 해당 데이터를 별도로 수집하거나
          열람하지 않습니다.
        </p>
      </section>

      <section style={{ marginBottom: "36px" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "12px" }}>
          3. 제3자 서비스
        </h2>
        <p>서비스는 다음 외부 서비스를 사용합니다.</p>
        <ul style={{ marginTop: "12px", paddingLeft: "20px" }}>
          <li>
            <strong>Yahoo Finance API</strong> — 주가·환율 데이터 조회 (사용자 식별 정보
            전송 없음)
          </li>
          <li style={{ marginTop: "8px" }}>
            <strong>Google AdSense</strong> — 광고 게재. Google이 쿠키를 통해 광고 관련
            정보를 수집할 수 있습니다.{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#2563eb" }}
            >
              Google 개인정보처리방침
            </a>
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: "36px" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "12px" }}>
          4. 쿠키
        </h2>
        <p>
          서비스 자체는 쿠키를 사용하지 않습니다. 다만 Google AdSense를 통해 광고용 쿠키가
          설정될 수 있습니다. 브라우저 설정에서 쿠키를 비활성화할 수 있습니다.
        </p>
      </section>

      <section style={{ marginBottom: "36px" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "12px" }}>
          5. 아동 개인정보 보호
        </h2>
        <p>
          본 서비스는 만 14세 미만 아동을 대상으로 하지 않으며, 아동의 개인정보를 의도적으로
          수집하지 않습니다.
        </p>
      </section>

      <section style={{ marginBottom: "36px" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "12px" }}>
          6. 방침 변경
        </h2>
        <p>
          본 방침은 변경될 수 있으며, 변경 시 이 페이지에 최신 내용을 게시합니다. 중요한
          변경이 있을 경우 서비스 내 공지를 통해 알립니다.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "12px" }}>
          7. 문의
        </h2>
        <p>
          개인정보 관련 문의는 아래로 연락주세요.
          <br />
          이메일:{" "}
          <a href="mailto:choimaesthue@gmail.com" style={{ color: "#2563eb" }}>
            choimaesthue@gmail.com
          </a>
        </p>
      </section>
    </main>
  );
}
