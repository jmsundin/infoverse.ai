"use client";

import { Fragment, useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import SplitPane from "@/components/SplitPane";
import { IoClose } from "react-icons/io5";

import { Progress } from "@/components/ui/progress";
import SPARQLQueryDispatcher from "@/lib/SPARQLQueryDispatcher";
import { endpointUrl, sparqlQuery } from "@/data/sparqlQueryParams";
import Graph from "@/components/Graph";
import { parseWikidata } from "@/lib/utils";

function HomePage() {
  const [progress, setProgress] = useState(0);
  const [fetchingData, setFetchingData] = useState(false);
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [wikipediaPageUrl, setWikipediaPageUrl] = useState(null);
  const [splitPaneView, setSplitPaneView] = useState(false);

  const [graphData, setGraphData] = useState(null);

  const graphContainer = useRef();

  useEffect(() => {
    async function getGraphData() {
      const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);
      const response = await queryDispatcher.query(sparqlQuery);
      const graphData = await parseWikidata(response);
      setGraphData(graphData);
    }
    getGraphData();
  }, []);

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
      {graphData !== null && !splitPaneView && (
        <div
          className="flex flex-1 h-full w-full pl-2 pr-2"
          ref={graphContainer}
        >
          {graphData !== null && (
            <Graph
              data={graphData}
              handleWikipediaPageLoad={handleWikipediaPageLoad}
            />
          )}
        </div>
      )}
      {splitPaneView && (
        <SplitPane
          split="vertical"
          defaultSize="60%"
          className="flex flex-row flex-1 h-full border-2 rounded-md"
        >
          <div
            className="flex flex-1 h-full w-full pl-2 pr-2"
            ref={graphContainer}
          >
            {graphData !== null && (
              <Graph
                data={graphData}
                graphContainer={graphContainer}
                handleWikipediaPageLoad={handleWikipediaPageLoad}
              />
            )}
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
