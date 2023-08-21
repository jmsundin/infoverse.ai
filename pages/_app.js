import "@/styles/globals.css";
import "tailwindcss/tailwind.css";
import "../public/favicon.svg";

import RootLayout from "./layout";
import { useEffect } from "react";

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    document
      .getElementById("__next")
      .classList.add(
        "w-screen",
        "h-full",
        "relative",
        "box-border",
        "flex",
        "flex-col",
        "bg-gradient-to-r",
        "from-indigo-950",
        "to-indigo-500"
      );
  }, []);

  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  );
}
