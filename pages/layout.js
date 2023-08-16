import { Fragment } from "react";
import MainNav from "@/components/MainNav";
import Footer from "@/components/Footer";
import GraphDataProvider from "@/context/graph-data-context";

export default function RootLayout({ children }) {
  return (
    <GraphDataProvider>
      <MainNav />
      <main className="h-screen relative z-1 -mt-[150px] pt-[150px]">
        {children}
      </main>
      <Footer />
    </GraphDataProvider>
  );
}
