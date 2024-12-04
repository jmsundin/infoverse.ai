import { Html, Head, Main, NextScript } from "next/document";

export default function Document({ children }) {
  return (
    <Html lang="en">
      <Head />
      <body className="flex w-screen min-h-screen h-screen border-box">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
