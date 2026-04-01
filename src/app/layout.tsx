import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar/Sidebar";
import GlobalStyleProviders from "@/providers/GlobalStyleProviders";
import ContextProviders from "@/providers/ContextProviders";
import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import NextTopLoader from "nextjs-toploader";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Task-It",
  description: "A beautiful task management app to keep you organized.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  return (
    <ClerkProvider>
      <SpeedInsights />
      <html lang="en" className={inter.className}>
        <body>
          <NextTopLoader
            height={2}
            color="#6366f1"
            easing="cubic-bezier(0.4, 0, 0.2, 1)"
            showSpinner={false}
          />
          <ContextProviders>
            <GlobalStyleProviders>
              {userId && <Sidebar />}
              <div className="main-content">{children}</div>
            </GlobalStyleProviders>
          </ContextProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
