import type { Metadata } from "next";
import { Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar, BottomNav, Footer } from "@/components/layout";

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto",
});

export const metadata: Metadata = {
  title: "সিলেট-৪ | আপনার সমস্যা, আমার দায়িত্ব",
  description:
    "রাশেল উল আলম - প্রার্থী সিলেট-৪ আসন। কোম্পানীগঞ্জ, গোয়াইনঘাট ও জৈন্তাপুর উপজেলার জনগণের সেবায়।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className="scroll-smooth">
      <body className={cn(notoSansBengali.className, "min-h-screen bg-gray-50")}>
        <Navbar />
        <main className="pt-28 pb-24 md:pb-8">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}