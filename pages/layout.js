import MainNav from "@/components/MainNav";
import Footer from "@/components/Footer";
import GraphDataProvider from "@/context/graph-data-context";

import { useEffect } from "react";
import { useRouter } from "next/router";
import { Analytics } from "@vercel/analytics/react";

import * as ga from "@/lib/ga";

import Head from "next/head";
import Script from "next/script";

export default function RootLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url);
    };
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on("routeChangeComplete", handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <GraphDataProvider>
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
        <link rel="icon" href="/public/favicon.svg" type="xml+svg" />
        <title>Infoverse AI</title>
      </Head>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}', {
            page_path: window.location.pathname,
          });
        `,
        }}
      />
      <MainNav />
      <main className="w-full h-full">{children}</main>
      <Footer />
      <Analytics />
    </GraphDataProvider>
  );
}
