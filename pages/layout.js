import { Fragment } from "react";
import MainNav from "@/components/MainNav";
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  return (
    <Fragment>
      <MainNav />
      <main className="h-screen relative -mt-[150px] pt-[150px]">{children}</main>
      <Footer />
    </Fragment>
  );
}
