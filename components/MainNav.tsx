"use client";

import { Fragment, useContext, useRef, useState } from "react";
import { AppContext } from "@/context/AppContext";

import Link from "next/link";

import { RiMenu3Line, RiCloseLine } from "react-icons/ri";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "components/ui/navigation-menu";

import QueryForm from "./QueryForm";

// import Search Context

export default function MainNav() {
  const { setGraphData, queryFormInitialPosition, setQueryFormInitialPosition } =
    useContext(AppContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const modalRef = useRef(null);

  const showModalMenu = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      return;
    }
    setIsMenuOpen(true);
  };

  return (
    <div id="header-nav" className="z-20 flex flex-col flex-wrap">
      <div className="relative flex flex-row justify-between items-center w-full gap-3 pt-4 px-4 bg-inherit">
        <Link
          href="/"
          onClick={() => {
            setQueryFormInitialPosition(true);
            setGraphData(null);
          }}
          className="flex flex-1 items-start hover:cursor-pointer hover:text-indigo-200 text-3xl text-white 
          font-bold hover:text-indigo-200 tracking-tight z-20 whitespace-nowrap"
        >
          infoverse
        </Link>
        <div className="hidden md:flex md:flex-1 md:justify-end md:items-center md:gap-3 md:z-20 md:mx-auto md:my-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Contact
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Hamburger Menu */}
        {!isMenuOpen && (
          <RiMenu3Line
            className="md:hidden z-20 flex items-end relative text-white text-3xl cursor-pointer hover:fill-indigo-200"
            onClick={showModalMenu}
          />
        )}
        {isMenuOpen && (
          <div
            ref={modalRef}
            className="z-20 absolute top-0 right-0 flex flex-col w-full h-full p-2 bg-gradient-to-r from-indigo-950 to-indigo-500"
          >
            <div className="z-20 flex flex-row justify-end">
              <RiCloseLine
                className="z-20 flex flex-row text-white text-4xl cursor-pointer hover:fill-indigo-200 "
                onClick={showModalMenu}
              />
            </div>
            <div
              className="z-20 flex flex-row w-full justify-center bg-inherit"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="z-20 flex flex-col w-1/2 justify-center items-center gap-4">
                <Link href="/" legacyBehavior passHref>
                  <p className="font-bold text-2xl text-white p-2 cursor-pointer hover:text-indigo-200 ">
                    Home
                  </p>
                </Link>
                <Link href="/about" legacyBehavior passHref>
                  <p className="font-bold text-2xl text-white p-2 cursor-pointer hover:text-indigo-200">
                    About
                  </p>
                </Link>
                <Link href="/contact" legacyBehavior passHref className="">
                  <p className="font-bold text-2xl text-white p-2 cursor-pointer hover:text-indigo-200">
                    Contact
                  </p>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
