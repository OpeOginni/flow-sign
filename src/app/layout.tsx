import "./globals.css";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import AuthProvider from "./AuthProvider";
import Provider from "./_trpc/Provider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({ weight: "600", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flow Sign",
  description: "Contract Management on the Flow Blockchain",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={cn(poppins.className, "bg-[#dff6ed]")}>
          <Provider>{children}</Provider>
          <Toaster />
        </body>
      </html>
    </AuthProvider>
  );
}
