"use client";

import { Fragment, useRef, useState } from "react";

import Link from "next/link";

import { RiMenu3Line, RiCloseLine } from "react-icons/ri";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

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
    <Fragment>
      <div className="flex flex-row p-2 justify-between items-center">
        <div className="flex flex-row items-center">
          <h1 className="text-3xl text-white font-bold hover:text-indigo-200 cursor-pointer tracking-tight lg:text-4xl">
            <Link href="/" className="flex flex-initial items-start p-3">
              Infoverse AI
            </Link>
          </h1>
        </div>
        <NavigationMenu className="hidden sm:inline-block sm:mx-auto sm:my-2 sm:p-2">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/about-me-with-d3" legacyBehavior passHref>
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

        {/* Mobile Menu */}
        {!isMenuOpen && (
          <RiMenu3Line
            className="relative text-white text-3xl cursor-pointer hover:fill-indigo-200 sm:hidden"
            onClick={showModalMenu}
          />
        )}
        {isMenuOpen && (
          <div
            ref={modalRef}
            className="absolute top-0 right-0 z-50 flex flex-col w-full h-full p-2 bg-gradient-to-r from-indigo-950 to-indigo-500"
          >
            <div className="flex flex-row justify-end">
              <RiCloseLine
                className="flex flex-row text-white text-4xl cursor-pointer hover:fill-indigo-200 sm:hidden"
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
    </Fragment>
  );
}
