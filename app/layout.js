import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./providers";
import "@rainbow-me/rainbowkit/styles.css";
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';

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
      <Script src="/app/Scripts/registerServiceWorker.js" strategy="afterInteractive" />
      <body className={inter.className}>
        <div className={"logo"}>
          <Link href="/">
            <Image
              src="/logo.png"
              width={450}
              height={244}
              alt="logo"
              priority={true}
            />
          </Link>
        </div>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

