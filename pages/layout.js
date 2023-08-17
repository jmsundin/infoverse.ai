import MainNav from "@/components/MainNav";
import Footer from "@/components/Footer";
import GraphDataProvider from "@/context/graph-data-context";
import { Fragment } from "react";

export default function RootLayout({ children }) {
  return (
    <GraphDataProvider>
      <MainNav />
      <main className="h-screen relative -mt-[150px] pt-[150px]">
        {children}
      </main>
      <Footer />
    </GraphDataProvider>
  );
}
