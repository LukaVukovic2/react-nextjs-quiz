import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./providers";
import { Metadata } from "next";
import Header from "@/components/shared/layouts/Header/Header";

export const metadata: Metadata = {
  title: "Quiz App",
  icons: {
    icon: [
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/favicon/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
  description: "Create and play quizzes with friends and family",
  keywords: "quiz, quizzes, create quiz, share quiz, quiz app",
  authors: [
    { name: "Luka Vukovic" }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.NODE_ENV === "development";
  return (
    <html
      lang="en"
      suppressHydrationWarning={isDev}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          as="style"
        />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Providers>
          <Header />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}