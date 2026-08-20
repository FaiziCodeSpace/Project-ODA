import localFont from "next/font/local";
import { DM_Mono, Inter_Tight } from "next/font/google";

export const foundersGrotesk = localFont({
  src: [
    {
      path: "../../public/fonts/Founders_Grotesk/FoundersGrotesk-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Founders_Grotesk/FoundersGrotesk-LightItalic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/Founders_Grotesk/FoundersGrotesk-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Founders_Grotesk/FoundersGrotesk-RegularItalic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/Founders_Grotesk/FoundersGrotesk-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Founders_Grotesk/FoundersGrotesk-MediumItalic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/Founders_Grotesk/FoundersGrotesk-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Founders_Grotesk/FoundersGrotesk-SemiboldItalic.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../../public/fonts/Founders_Grotesk/FoundersGrotesk-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Founders_Grotesk/FoundersGrotesk-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-founders",
  display: "swap",
});

export const foundersGroteskCond = localFont({
  src: "../../public/fonts/Founders_Grotesk/FoundersGroteskCond-Lt.otf",
  weight: "300",
  style: "normal",
  variable: "--font-founders-cond",
  display: "swap",
});

export const foundersGroteskXCond = localFont({
  src: [
    {
      path: "../../public/fonts/Founders_Grotesk/FoundersGroteskXCond-Lt.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Founders_Grotesk/FoundersGroteskXCond-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-founders-xcond",
  display: "swap",
});

export const powerGrotesk = localFont({
  src: "../../public/fonts/PowerGrotesk-Regular.ttf",
  weight: "400",
  style: "normal",
  variable: "--font-power",
  display: "swap",
});

export const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-inter-tight",
  display: "swap",
});