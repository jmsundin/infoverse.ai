import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document({ children }) {
  return (
    <Html lang="en">
      <Head>
        {/* <!-- Google tag (gtag.js) --> */}
        {/* <Script
          strategy="afterInteractive"
          src={
            "https://www.googletagmanager.com/gtag/js?id=G-" +
            process.env.GOOGLE_ANALYTICS_ID
          }
        ></Script> */}
        {/* <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);
            }
            gtag('js', new Date());
          
            gtag('config', 'G-${process.env.GOOGLE_ANALYTICS_ID}');
            `,
          }}
        /> */}
      </Head>
      <body className="h-screen box-border flex flex-col bg-gradient-to-r from-indigo-950 to-indigo-500">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
