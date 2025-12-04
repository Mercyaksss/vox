// app/layout.js
import "./globals.scss";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from './src/components/Providers';  // FIXED: correct path

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Vox",
  description: "Milestone-based Crowdfunding on Sepolia",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}