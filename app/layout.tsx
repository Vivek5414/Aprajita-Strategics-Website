import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import SiteFooter from "@/app/components/layout/SiteFooter";
import SiteHeader from "@/app/components/layout/SiteHeader";
import FloatingContactActions from "@/app/components/layout/FloatingContactActions";
import { EnquiryProvider } from "@/app/components/enquiry/EnquiryContext";
import { enquiryPopupConfig } from "@/app/data/contact";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aprajitastrategics.com"),
  title: {
    default: "Aprajita Strategics",
    template: "%s | Aprajita Strategics",
  },
  description:
    "Engineering, architectural design, industrial infrastructure, and project management consultancy.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <EnquiryProvider
          firstVisitPopup={enquiryPopupConfig.firstVisitEnabled}
          firstVisitDelayMs={enquiryPopupConfig.firstVisitDelayMs}
        >
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
          <FloatingContactActions />
        </EnquiryProvider>
      </body>
    </html>
  );
}
