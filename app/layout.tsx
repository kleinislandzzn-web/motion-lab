import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  return {
    metadataBase: new URL(`${protocol}://${host}`),
    title: "Motion Lab｜可复制的 HTML 动效收藏馆",
    description: "15 个可现场试玩、拆分查看并复制到纯 HTML 项目中的产品动效样本。",
    openGraph: {
      title: "Motion Lab｜可复制的 HTML 动效收藏馆",
      description: "CSS、Anime.js 与 GSAP 动效零件，一次收藏，随时带走。",
      images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Motion Lab 动效收藏馆" }],
      type: "website",
    },
    twitter: { card: "summary_large_image", images: ["/og.png"] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
