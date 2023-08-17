import { Html, Head, Main, NextScript } from "next/document";

export default function Document({ children }) {
  return (
    <Html lang="en">
      <Head />
      <body className="z-20 box-border flex flex-col bg-gradient-to-r from-indigo-950 to-indigo-500">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
