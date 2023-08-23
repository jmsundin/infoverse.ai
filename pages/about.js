"use client";

import Head from "next/head";
import Link from "next/link";
import { Fragment } from "react";

import { FaBookReader } from "react-icons/fa";
import { GiCoconuts } from "react-icons/gi";
import { GiMaterialsScience } from "react-icons/gi";
import { FiAlertTriangle } from "react-icons/fi";
import { PiGraphDuotone } from "react-icons/pi";
import { TbZoomQuestion } from "react-icons/tb";

function AboutPage() {
  return (
    <Fragment>
      <Head>
        <title>Infoverse AI | About</title>
      </Head>
      <div className="flex flex-col items-center gap-8 text-white mt-5">
        <div className="flex flex-wrap justify-center items-center gap-8">
          <div className="flex flex-col w-3/4 sm:w-2/3 md:w-1/2 items-center text-black bg-indigo-200 drop-shadow-md rounded-lg p-3">
            <h2 className="text-2xl">Vision</h2>
            <p className="indent-8">
              To help people explore the world of information, to help people
              make sense of that information, and to utilize that information to
              make better decisions in life.
            </p>
          </div>
          <div className="flex flex-col w-3/4 sm:w-2/3 md:w-1/2 items-center text-black bg-indigo-200 drop-shadow-md rounded-lg p-3">
            <h2 className="text-2xl">Mission</h2>
            <p className="indent-8">
              To build a knowledge graph of the world&apos;s information and to
              provide tools to help people explore that knowledge graph to make
              better decisions in life.
            </p>
          </div>
        </div>

        {/* <div className="flex flex-row w-[400px] items-center text-black justify-center bg-indigo-200 drow-shadow-md rounded-lg p-3">
            <h2 className="text-2xl">Values</h2>
            <ul className="flex flex-row flex-wrap gap-2 text-center mt-2 justify-center">
              <li className="text-black border-2 border-indigo-300 rounded-lg p-3">
                <div className="flex flex-row gap-1 items-center">
                  <Link
                    href="https://en.wikipedia.org/wiki/Learning"
                    target="_blank"
                    className="flex gap-1 cursor-pointer group"
                  >
                    <FaBookReader className="h-8 w-8 group-hover:fill-indigo-800" />
                    <span className="flex items-center group-hover:text-indigo-800">
                      Learning
                    </span>
                  </Link>{" "}
                  over{" "}
                  <Link
                    href="https://en.wikipedia.org/wiki/Id,_ego_and_super-ego#Ego"
                    target="_blank"
                    className="flex gap-1 cursor-pointer group"
                  >
                    <span className="flex items-center group-hover:text-gray-500">
                      Ego
                    </span>
                    <GiCoconuts className="h-8 w-8 group-hover:fill-gray-500" />
                  </Link>
                </div>
              </li>
              <li className="text-black border-2 border-indigo-300 rounded-lg p-3">
                <div className="flex flex-row nowrap gap-1 items-center">
                  <Link
                    className="flex gap-1 cursor-pointer group"
                    href="https://en.wikipedia.org/wiki/Systems_thinking"
                    target="_blank"
                  >
                    <PiGraphDuotone className="h-8 w-8 group-hover:fill-indigo-800" />
                    <span className="flex items-center group-hover:text-indigo-800">
                      Systems Thinking
                    </span>
                  </Link>{" "}
                  over
                  <Link
                    href="https://en.wikipedia.org/wiki/Reductionism"
                    target="_blank"
                    className="cursor-pointer group"
                  >
                    <span className="group-hover:text-gray-500">
                      Reductionism
                    </span>
                  </Link>
                </div>
              </li>
              <li className="text-black border-2 border-indigo-300 rounded-lg p-3">
                <div className="flex flex-row nowrap gap-1 items-center">
                  <Link
                    href="https://en.wikipedia.org/wiki/Open-mindedness"
                    target="_blank"
                    className="cursor-pointer group"
                  >
                    <span className="group-hover:text-indigo-800">
                      Open-Mindedness
                    </span>
                  </Link>{" "}
                  over{" "}
                  <Link
                    href="https://en.wikipedia.org/wiki/Open-mindedness#:~:text=According%20to%20David,.%5B10%5D"
                    target="_blank"
                    className="cursor-pointer group"
                  >
                    <span className="group-hover:text-gray-500">
                      Closed-Mindedness
                    </span>
                  </Link>
                </div>
              </li>
              <li className="text-black border-2 border-indigo-300 rounded-lg p-3 items-center">
                <div className="flex flex-row nowrap gap-1 items-center">
                  <Link
                    href=""
                    target="_blank"
                    className="cursor-pointer group"
                  >
                    <TbZoomQuestion className="h-8 w-8 group-hover:stroke-indigo-800" />
                    <span className="group-hover:text-indigo-800">
                      Questioning
                    </span>
                  </Link>
                  over
                  <Link
                    href="https://en.wikipedia.org/wiki/Bias"
                    target="_blank"
                    className="cursor-pointer group"
                  >
                    <span className="group-hover:text-gray-500">Assumming</span>
                  </Link>
                </div>
              </li>
              <li className="text-black border-2 border-indigo-300 rounded-lg p-3">
                <div className="flex flex-row nowrap gap-1 items-center">
                  <Link
                    href=""
                    target="_blank"
                    className="group cursor-pointer"
                  >
                    <GiMaterialsScience className="h-8 w-8 group-hover:fill-indigo-800" />
                    <span className="group-hover:text-indigo-800">
                      Exploration and Discovery
                    </span>
                  </Link>
                  over Stagnation
                </div>
              </li>
              <li className="text-black border-2 border-indigo-300 rounded-lg p-3">
                <div className="flex flex-row nowrap gap-1 items-center">
                  Innovation over Status Quo
                </div>
              </li>
            </ul>
          </div> */}
        <div className="flex flex-col w-3/4 sm:w-2/3 md:w-1/2 items-center bg-indigo-200 drop-shadow-md text-black rounded-lg p-3">
          <h2 className="text-2xl">Data Sources</h2>
          <ul className="flex flex-row gap-4">
            <li className="flex hover:text-indigo-500">
              <Link href="https://wikidata.org">Wikidata.org</Link>
            </li>
            <li className="flex hover:text-indigo-500">
              <Link href="https://wikipedia.org">Wikipedia.org</Link>
            </li>
          </ul>
        </div>
      </div>
    </Fragment>
  );
}

export default AboutPage;
