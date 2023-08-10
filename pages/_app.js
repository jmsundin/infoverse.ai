import "@/styles/globals.css";
import "tailwindcss/tailwind.css";

import RootLayout from "./layout";

export default function MyApp({ Component, pageProps }) {
  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  );
}
