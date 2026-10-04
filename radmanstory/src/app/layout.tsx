import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Radman — A Life in Frames",
  description: "A visual biography of Radman.",
};
export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="fa" dir="rtl"><body>{children}</body></html>;
}
