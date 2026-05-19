import type { Metadata, Viewport } from "next";
import { Do_Hyeon, Jua } from "next/font/google";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "./globals.css";

const siteUrl = "https://kkul.vercel.app";
const siteDescription =
  "매도 후 갈아탄 선택을 종가 기준으로 계산해 기회비용을 보여주는 코믹 경제 웹앱. 미국/한국 주식, 환율 자동 반영.";

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
    "주식 수익률 계산기",
    "미국 주식 계산기",
    "한국 주식 계산기",
    "주식 갈아타기 계산",
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
    card: "summary",
    title: "껄껄무새 — 주식 기회비용 계산기",
    description: "그때 그냥 들고 있었으면 어땠을까? 웃프게 계산해드립니다.",
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

const jsonLd = {
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
