import type { MetadataRoute } from "next";

const iconSizes = [72, 96, 128, 144, 152, 180, 192, 384, 512, 1024] as const;

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "껄껄무새 — 주식 기회비용 계산기",
    short_name: "껄껄무새",
    description:
      "매도 후 갈아탄 선택을 종가 기준으로 계산해 기회비용을 보여주는 코믹 경제 웹앱. 미국/한국 주식, 환율 자동 반영.",
    start_url: "/",
    display: "standalone",
    background_color: "#F2F5FF",
    theme_color: "#070A12",
    orientation: "portrait-primary",
    lang: "ko",
    scope: "/",
    categories: ["finance", "utilities", "productivity"],
    prefer_related_applications: false,
    icons: [
      ...iconSizes.map((size) => ({
        src: `/icons/icon-${size}.png`,
        sizes: `${size}x${size}`,
        type: "image/png",
        purpose: "any" as const,
      })),
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "기회비용 계산",
        short_name: "계산하기",
        description: "주식 기회비용을 바로 계산합니다",
        url: "/",
        icons: [
          {
            src: "/icons/icon-96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
    ],
    screenshots: [
      {
        src: "/screenshots/app-wide.png",
        sizes: "1600x900",
        type: "image/png",
        form_factor: "wide",
        label: "껄껄무새 데스크톱 계산 시작 화면",
      },
      {
        src: "/screenshots/app-narrow.png",
        sizes: "750x1334",
        type: "image/png",
        form_factor: "narrow",
        label: "껄껄무새 모바일 계산 시작 화면",
      },
    ],
  };
}
