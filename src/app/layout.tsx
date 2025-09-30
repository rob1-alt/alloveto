import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AlloVeto",
  description: "Moins d’administratif, plus de temps pour vos toutous",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} antialiased`}
      >
        <div className="relative">
          <div className="fixed top-0 left-0 right-0 h-8 bg-[#0f8f70] text-white overflow-hidden z-[60]">
            <div className="absolute inset-0 flex items-center">
              <div className="whitespace-nowrap animate-[marquee_12s_linear_infinite]">
                <span className="mx-6">🐕</span>
                <span className="mx-6">🐈‍⬛</span>
                <span className="mx-6">🐈</span>
                <span className="mx-6">🐕‍🦺</span>
                <span className="mx-6">🐕</span>
                <span className="mx-6">🐈‍⬛</span>
                <span className="mx-6">🐈</span>
                <span className="mx-6">🐕‍🦺</span>
                <span className="mx-6">🐕</span>
                <span className="mx-6">🐈‍⬛</span>
                <span className="mx-6">🐈</span>
                <span className="mx-6">🐕‍🦺</span>
                <span className="mx-6">🐕</span>
                <span className="mx-6">🐈‍⬛</span>
                <span className="mx-6">🐈</span>
                <span className="mx-6">🐕‍🦺</span>
                <span className="mx-6">🐕</span>
                <span className="mx-6">🐈‍⬛</span>
                <span className="mx-6">🐈</span>
                <span className="mx-6">🐕‍🦺</span>
                <span className="mx-6">🐕</span>
                <span className="mx-6">🐈‍⬛</span>
                <span className="mx-6">🐈</span>
                <span className="mx-6">🐕‍🦺</span>
                <span className="mx-6">🐕</span>
                <span className="mx-6">🐈‍⬛</span>
                <span className="mx-6">🐈</span>
                <span className="mx-6">🐕‍🦺</span>
                <span className="mx-6">🐕</span>
                <span className="mx-6">🐈‍⬛</span>
                <span className="mx-6">🐈</span>
                <span className="mx-6">🐕‍🦺</span>
                <span className="mx-6">🐕</span>
                <span className="mx-6">🐈‍⬛</span>
                <span className="mx-6">🐈</span>
                <span className="mx-6">🐕‍🦺</span>
                <span className="mx-6">🐕</span>
                <span className="mx-6">🐈‍⬛</span>
                <span className="mx-6">🐈</span>
                <span className="mx-6">🐕‍🦺</span>
                <span className="mx-6">🐕</span>
                <span className="mx-6">🐈‍⬛</span>
                <span className="mx-6">🐈</span>
                <span className="mx-6">🐕‍🦺</span>
                <span className="mx-6">🐕</span>
                <span className="mx-6">🐈‍⬛</span>
                <span className="mx-6">🐈</span>
                <span className="mx-6">🐕‍🦺</span>
              </div>
            </div>
          </div>
          <div className="pt-8">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
