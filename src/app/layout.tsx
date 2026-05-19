import type { Metadata, Viewport } from "next";
import { Do_Hyeon, Jua } from "next/font/google";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "./globals.css";

const siteUrl = "https://kkul.vercel.app";
const siteDescription =
  "그때 그냥 들고 있었으면? 주식 갈아타기·매도 후 기회비용을 종가 기준으로 웃프게 계산해드립니다. 미국·한국 주식, 환율 자동 반영.";

const doHyeon = Do_Hyeon({
  variable: "--font-do-hyeon",
  weight: "400",
  subsets: ["latin"],
});

const jua = Jua({
  variable: "--font-jua",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "껄껄무새",
  title: "껄껄무새 | 미국/한국 주식 기회비용 계산기",
  description: siteDescription,
  keywords: [
    "껄껄무새",
    "주식 기회비용 계산기",
    "주식 갈아타기 계산기",
    "주식 갈아타기 후회",
    "주식 매도 후회",
    "주식 기회비용",
    "미국 주식 계산기",
    "한국 주식 계산기",
    "주식 수익률 계산기",
    "테슬라 갈아타기",
    "엔비디아 기회비용",
    "그때 팔았으면 계산기",
    "주식 환율 계산기",
  ],
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "껄껄무새",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "껄껄무새 — 주식 기회비용 계산기",
    description: siteDescription,
    url: "/",
    siteName: "껄껄무새",
    type: "website",
    locale: "ko_KR",
    images: [
      {
        url: "/screenshots/app-wide.png",
        width: 1600,
        height: 900,
        alt: "껄껄무새 주식 기회비용 계산 화면",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "껄껄무새 — 주식 기회비용 계산기",
    description: "그때 그냥 들고 있었으면 어땠을까? 주식 갈아타기·매도 후 기회비용을 웃프게 계산해드립니다.",
    images: ["/screenshots/app-wide.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "google-adsense-account": "ca-pub-3397494907696633",
    "naver-site-verification": "0fe141b08ab352842cba6c56d910c149303b563f",
  },
  verification: {
    google: "p1sOyazCjOMOi4Nt9AcF9jaIzoxvRR0FT0sgwoTxMRY",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#070A12",
};

const jsonLdApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "껄껄무새",
  alternateName: "주식 기회비용 계산기",
  url: siteUrl,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  inLanguage: "ko-KR",
  description: siteDescription,
  image: `${siteUrl}/screenshots/app-wide.png`,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
  },
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "껄껄무새는 어떤 서비스인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "주식을 매도한 뒤 다른 종목으로 갈아탔을 때의 기회비용을 실제 종가 기준으로 계산해주는 무료 웹앱입니다. 미국·한국 주식과 환율을 자동으로 반영합니다.",
      },
    },
    {
      "@type": "Question",
      name: "주식 갈아타기 기회비용을 어떻게 계산하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "매도한 종목·날짜·수량과 새로 산 종목·날짜·비중을 입력하면, 매도하지 않고 계속 보유했을 때와 갈아탄 경우의 수익률·손익을 자동으로 비교해줍니다.",
      },
    },
    {
      "@type": "Question",
      name: "미국 주식과 한국 주식 모두 계산할 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네. 티커 심볼(예: TSLA, NVDA) 또는 종목코드(예: 005930 삼성전자)로 미국·한국 주식을 모두 지원하며, 원화·달러 환율도 자동 반영됩니다.",
      },
    },
    {
      "@type": "Question",
      name: "이용 요금이 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "완전 무료입니다. 로그인이나 회원가입 없이 바로 사용할 수 있습니다.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${doHyeon.variable} ${jua.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3397494907696633"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
