import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./providers";
import "@rainbow-me/rainbowkit/styles.css";
import Image from 'next/image';
import Link from 'next/link';
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ETCeria Home",
  description: "made by tschoerv.eth",
  icons: {
    icon: '/favicon.ico', // /public path
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <div className={"logo"}>
      <Link href="/">
          <Image
      src="/logo.png"
      width={450}
      height={244}
      alt="logo"
      priority={true}
      /></Link></div>
        <Providers>{children}</Providers>

      </body>
    </html>
    
  );
}
