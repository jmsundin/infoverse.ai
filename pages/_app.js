import "@/styles/globals.css";
import "tailwindcss/tailwind.css";
import "../public/favicon.svg";

import Head from "next/head";
import Script from "next/script";

import RootLayout from "./layout";

export default function MyApp({ Component, pageProps }) {
  return (
    <RootLayout>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Infoverse AI is a platform for building and deploying AI models without writing code."
        />
        <meta
          name="keywords"
          content="Infoverse AI, Infoverse, Information, Data, Data Visualization"
        />
        <meta name="author" content="Infoverse AI" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="..public/favicon.svg" type="xml+svg" />
        <title>Infoverse AI</title>
      </Head>
      {/* <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-${process.env.GOOGLE_ANALYTICS_ID}`}
      /> */}
      {/* <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);
            }
            gtag('js', new Date());
          
            gtag('config', G-${process.env.GOOGLE_ANALYTICS_ID}
            `,
        }}
      /> */}
      <Component {...pageProps} />
    </RootLayout>
  );
}
