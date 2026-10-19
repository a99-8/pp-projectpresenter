import type { Metadata } from "next";
import { Geist_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";
import { getProfile } from "@/lib/data";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const ibmPlex = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PP | معرض المشاريع",
    template: "%s | PP",
  },
  description:
    "منصة معرض أعمال تفاعلية لعرض المشاريع البرمجية — بياناتها تُدار من ملفات داخل المستودع.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const profile = getProfile();
  const githubUrl = profile.socials.find((s) => s.icon === "github")?.url;

  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${ibmPlex.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <ThemeProvider>
          <SiteHeader githubUrl={githubUrl} />
          <main className="flex-1">{children}</main>
          <SiteFooter profile={profile} />
        </ThemeProvider>
      </body>
    </html>
  );
}
