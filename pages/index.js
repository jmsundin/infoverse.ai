"use client";

import { Fragment, useState, useRef, useContext, useEffect, use } from "react";
import { GraphDataContext } from "@/context/graph-data-context";

import SplitPane from "@/components/SplitPane";
import { IoClose } from "react-icons/io5";

import { Progress } from "@/components/ui/progress";

import Graph from "@/components/Graph";

import { Allotment } from "allotment";
import "allotment/dist/style.css";

function HomePage() {
  // const { nodeQID, setNodeQID, graphData, setGraphData } = useContext(GraphDataContext);
  const [progress, setProgress] = useState(0);
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [wikipediaPageUrl, setWikipediaPageUrl] = useState(null);
  const [splitPaneView, setSplitPaneView] = useState(false);
  const [mainWrapperDimensions, setMainWrapperDimensions] = useState({
    width: "100vw",
    height: "100%",
  });
  // const mainWrapperDimensions = useRef({ width: window.innerWidth, height: windo.innerHeight });
  const smallScreen = useRef(false);
  const splitPaneRef = useRef();

  useEffect(() => {
    smallScreen.current = window.innerWidth < 640;

    const handleResize = () => {
      const headerNavHeight = document
        .getElementById("header-nav")
        .getBoundingClientRect().height;

      const footerHeight = document
        .getElementById("footer")
        .getBoundingClientRect().height;

      setMainWrapperDimensions({
        width: window.innerWidth,
        height: window.innerHeight - headerNavHeight - footerHeight,
      });
    };
    window.addEventListener("DOMContentLoaded", handleResize);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("DOMContentLoaded", handleResize);
      window.removeEventListener("resize", handleResize);
    };
  }, [mainWrapperDimensions]);

  function handleSplitPaneViewClose() {
    setSplitPaneView(false);
    // setWikipediaPageUrl(null);
  }

  function handleWikipediaPageLoad(url) {
    setWikipediaPageUrl(url);
    setSplitPaneView(true);
  }

  return (
    <div className="flex w-screen h-full pt-2 pl-2 pr-2 pb-16">
      {!splitPaneView && (
        <div
          id="graphContainer"
          className="flex w-screen h-full justify-center"
        >
          <Graph handleWikipediaPageLoad={handleWikipediaPageLoad} />
        </div>
      )}
      {splitPaneView && (
        <Allotment ref={splitPaneRef} vertical={smallScreen.current}>
          <Allotment.Pane>
            <div
              id="graphContainer"
              className="relative flex flex-1 h-full w-screen justify-center"
            >
              <Graph handleWikipediaPageLoad={handleWikipediaPageLoad} />
            </div>
          </Allotment.Pane>
          <Allotment.Pane>
            <div className="relative flex flex-1 h-full min-w-[100px] justify-center">
              <IoClose
                className="z-10 absolute top-0 right-0 text-2xl cursor-pointer h-8 w-8 border-2 border-indigo-200 rounded-md bg-white hover:bg-indigo-200"
                onClick={handleSplitPaneViewClose}
                onTouchStart={handleSplitPaneViewClose}
              />
              <div className="w-full h-full">
                <iframe
                  src={wikipediaPageUrl}
                  className="w-full h-full pt-2"
                  title="Code Preview"
                  sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts"
                />
              </div>
            </div>
          </Allotment.Pane>
        </Allotment>
      )}
    </div>
  );
}

export default HomePage;
