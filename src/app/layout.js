import "./globals.css";
import LenisProvider from "@/providers/LenisProvider";
import Loader from "@/components/animations/Loader";
import {
  foundersGrotesk,
  foundersGroteskCond,
  foundersGroteskXCond,
  powerGrotesk,
  dmMono,
  interTight
} from "@/lib/fonts";

export const metadata = {
  title: "ODA",
  description: "Currently working on Project-ODA",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${foundersGrotesk.variable} ${foundersGroteskCond.variable} ${foundersGroteskXCond.variable} ${powerGrotesk.variable} ${dmMono.variable} ${interTight.variable} h-full antialiased`}
    >
      <head>
        <link rel="preload" as="image" href="/images/astro/astronaut.webp" />
        <link rel="preload" as="image" href="/images/astro/rock.png" />
      </head>
      <body className="min-h-full flex flex-col">
        <Loader />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}