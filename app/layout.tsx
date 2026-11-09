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
    title: "Motion Lab — Interaction Archive",
    description: "An offline-first archive of reusable web interactions, organized by component family, visual style and implementation method.",
    icons: {
      icon: [{
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ctext y='52' font-size='52'%3E%F0%9F%AB%A7%3C/text%3E%3C/svg%3E",
        type: "image/svg+xml",
      }],
    },
    openGraph: {
      title: "Motion Lab — Interaction Archive",
      description: "Preview, tune, inspect and copy a growing collection of reusable web interactions.",
      images: [{ url: "/og-webcore.png", width: 1536, height: 1024, alt: "Motion Lab interaction archive" }],
      type: "website",
    },
    twitter: { card: "summary_large_image", images: ["/og-webcore.png"] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
