import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sanket Dhital | Administration & Business Operations Professional",
  description: "Sanket Dhital - Administrative professional with 5+ years of experience in streamlining business operations, CRM management, digital strategy, and organizational efficiency. Based in Kathmandu, Nepal.",
  keywords: [
    "Sanket Dhital",
    "Business Administration",
    "Operations Management",
    "CRM Management",
    "Digital Strategy",
    "Administrative Professional",
    "Kathmandu",
    "Nepal",
    "Business Operations",
    "Office Administration"
  ],
  authors: [{ name: "Sanket Dhital" }],
  creator: "Sanket Dhital",
  publisher: "Sanket Dhital",
  icons: {
    icon: "/logo.svg",
  },
  metadataBase: new URL('https://sanketdhital.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Sanket Dhital | Administration & Business Operations Professional",
    description: "5+ years of experience in streamlining business operations, CRM management, and organizational efficiency. Based in Kathmandu, Nepal.",
    url: 'https://sanketdhital.com',
    siteName: "Sanket Dhital",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: 'https://z-cdn-media.chatglm.cn/files/15a7194c-0f6d-47d9-b7b7-dbc18449c76c.jpeg?auth_key=1870624669-42aaa17df2b84c55935c6555020c954e-0-e779b0a3e4b7d06121d5d92517864405',
        width: 1200,
        height: 630,
        alt: 'Sanket Dhital - Administration & Business Operations Professional',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sanket Dhital | Administration & Business Operations Professional",
    description: "5+ years of experience in streamlining business operations, CRM management, and organizational efficiency.",
    images: [
      'https://z-cdn-media.chatglm.cn/files/15a7194c-0f6d-47d9-b7b7-dbc18449c76c.jpeg?auth_key=1870624669-42aaa17df2b84c55935c6555020c954e-0-e779b0a3e4b7d06121d5d92517864405'
    ],
    creator: "@sanketdhital",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when ready
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
