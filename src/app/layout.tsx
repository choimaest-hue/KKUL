import type { Metadata } from "next";
import { Do_Hyeon, Jua } from "next/font/google";
import "./globals.css";

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
  title: "껄껄무새 | 미국/한국 주식 기회비용 계산기",
  description:
    "매도 후 갈아탄 선택을 종가 기준으로 계산해 기회비용을 보여주는 코믹 경제 웹앱",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "껄껄무새",
    description: "매도/매수 시점 기반 주식 기회비용 계산기",
  },
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
