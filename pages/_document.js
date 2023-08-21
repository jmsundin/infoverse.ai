import { Html, Head, Main, NextScript } from "next/document";

export default function Document({ children }) {
  return (
    <Html lang="en">
      <Head />
      <body className="w-screen h-screen border-box">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
