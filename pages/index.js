"use client";

import { Fragment, useState, useRef, useContext } from "react";
import { GraphDataContext } from "@/context/graph-data-context";

import SplitPane from "@/components/SplitPane";
import { IoClose } from "react-icons/io5";

import { Progress } from "@/components/ui/progress";

import Graph from "@/components/Graph";

function HomePage() {
  // const { nodeQID, setNodeQID, graphData, setGraphData } = useContext(GraphDataContext);
  const [progress, setProgress] = useState(0);
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [wikipediaPageUrl, setWikipediaPageUrl] = useState(null);
  const [splitPaneView, setSplitPaneView] = useState(false);

  const graphContainer = useRef();

  function handleSplitPaneViewClose() {
    setSplitPaneView(false);
    // setWikipediaPageUrl(null);
  }

  function handleWikipediaPageLoad(url) {
    setWikipediaPageUrl(url);
    setSplitPaneView(true);
  }

  return (
    <Fragment>
      {!splitPaneView && (
        <div
          className="flex flex-1 h-full w-full pl-2 pr-2"
          ref={graphContainer}
        >
          <Graph handleWikipediaPageLoad={handleWikipediaPageLoad} />
        </div>
      )}
      {splitPaneView && (
        <SplitPane
          split="vertical"
          defaultSize="60%"
          className="flex flex-row flex-1 h-full w-full"
        >
          <div
            className="flex flex-1 h-full w-full pl-2 pr-2"
            ref={graphContainer}
          >
            <Graph
              graphContainer={graphContainer.current}
              handleWikipediaPageLoad={handleWikipediaPageLoad}
            />
          </div>

          {/* <div className="flex flex-1 h-full border-2 rounded-md min-w-[100px] justify-center">
          {/* {pageIsLoading && <Progress value={progress} className="w-1/2" />} */}

          <div className="relative flex flex-1 h-full border-2 rounded-md min-w-[100px] justify-center">
            <IoClose
              className="absolute top-2 right-2 text-2xl cursor-pointer"
              onClick={handleSplitPaneViewClose}
            />
            <iframe
              src={wikipediaPageUrl}
              className="w-full h-full"
              title="Code Preview"
              sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts"
            />
          </div>
        </SplitPane>
      )}
    </Fragment>
  );
}

export default HomePage;
