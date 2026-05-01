// layout.tsx — Root layout wrapping every page in the app
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Movie Favorites",
  description: "Share your favorite movie with us",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
