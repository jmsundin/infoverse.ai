"use client";

import { Fragment, useRef, useState } from "react";

import Link from "next/link";

import { RiMenu3Line, RiCloseLine } from "react-icons/ri";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import QueryForm from "./QueryForm";

const navComponents = [
  {
    title: "D3.js",
    description: "About Me through Information Visualization",
    href: "/about-me-with-d3",
  },
];

export default function MainNav() {
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
    <div className="z-20 flex flex-row justify-between items-center gap-3 p-2 bg-inherit">
      <Link
        href="/"
        className="flex flex-initial items-start p-3 hover:cursor-pointer hover:text-indigo-200 text-3xl text-white font-bold hover:text-indigo-200 r tracking-tight lg:text-4xl z-20"
      >
        Infoverse AI
      </Link>
      <div className="flex flex-1 justify-center mx-auto max-w-[600px] bg-inherit">
        <QueryForm />
      </div>
      <div className="hidden md:flex md:flex-initial md:justify-end md:items-center md:gap-3 md:z-20 md:mx-auto md:my-2">
        <NavigationMenu className="z-20">
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

      {/* Mobile Menu */}
      {!isMenuOpen && (
        <RiMenu3Line
          className="z-20 relative text-white text-3xl cursor-pointer hover:fill-indigo-200 md:hidden"
          onClick={showModalMenu}
        />
      )}
      {isMenuOpen && (
        <div
          ref={modalRef}
          className="z-20 absolute top-0 right-0 flex flex-col w-full h-full p-2 bg-gradient-to-r from-indigo-950 to-indigo-500 md:hidden"
        >
          <div className="flex flex-row justify-end">
            <RiCloseLine
              className="flex flex-row text-white text-4xl cursor-pointer hover:fill-indigo-200 md:hidden"
              onClick={showModalMenu}
            />
          </div>
          <div
            className="flex flex-row w-full justify-center"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="flex flex-col w-1/2 justify-center items-center gap-4">
              <Link href="/" legacyBehavior passHref>
                <p className="font-bold text-2xl text-white p-2 cursor-pointer hover:text-indigo-200 ">
                  Home
                </p>
              </Link>
              <Link href="/about-me-with-d3" legacyBehavior passHref>
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
  );
}
