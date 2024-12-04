"use client";

import { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "@/context/AppContext";
import { popularTopicQid, fetchGraphData } from "@/lib/utils";

import { RotatingLines } from "react-loader-spinner";
import SplitPane from "components/SplitPane";
import { IoClose } from "react-icons/io5";

import QueryForm from "components/QueryForm";

import { Allotment, AllotmentHandle } from "allotment";
import "allotment/dist/style.css";

import MyGraph from "components/MyGraph";

interface FetchState {
  isLoading: boolean;
  error: string | null;
}

function HomePage() {
  const { 
    graphData, 
    setGraphData, 
    queryFormInitialPosition, 
    setQueryFormInitialPosition,
    splitPaneView,
    setSplitPaneView,
    wikipediaPageUrl,
    setWikipediaPageUrl,
  } = useContext(AppContext);

  const [mainWrapperDimensions, setMainWrapperDimensions] = useState({
    width: "100vw",
    height: "100%",
  });
  // const mainWrapperDimensions = useRef({ width: window.innerWidth, height: windo.innerHeight });
  const smallScreen = useRef(false);
  const splitPaneRef = useRef<AllotmentHandle>(null);

  useEffect(() => {
    smallScreen.current = window.innerWidth < 640;

    const handleResize = () => {
      if (document === null) return;
      const headerNav = document.getElementById("header-nav");
      if (headerNav === null) return;
      const headerNavHeight = headerNav.getBoundingClientRect().height;

      const footer = document.getElementById("footer");
      if (footer === null) return;
      const footerHeight = footer.getBoundingClientRect().height;

      setMainWrapperDimensions({
        width: "" + window.innerWidth,
        height: "" + (window.innerHeight - headerNavHeight - footerHeight),
      });
    };
    window.addEventListener("DOMContentLoaded", handleResize);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("DOMContentLoaded", handleResize);
      window.removeEventListener("resize", handleResize);
    };
  }, [mainWrapperDimensions]);

  const [fetchState, setFetchState] = useState<FetchState>({
    isLoading: false,
    error: null,
  });

  const handleFetchStart = () => {
    setFetchState(prev => ({ ...prev, isLoading: true, error: null }));
  };

  const handleFetchSuccess = () => {
    setFetchState(prev => ({ ...prev, isLoading: false, error: null }));
    queryFormInitialPosition && setQueryFormInitialPosition(false);
  };

  const handleFetchError = (error: string) => {
    setFetchState(prev => ({ ...prev, isLoading: false, error }));
  };

  const getGraphData = (topic: string) => {
    handleFetchStart();
    try {
      fetchGraphData(topic).then((graph) => {
        setGraphData(graph);
        handleFetchSuccess();
      });
    } catch (error) {
      handleFetchError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  function handleSplitPaneViewClose() {
    setSplitPaneView(false);
  };

  return (
   <div className="flex h-full w-full pt-2 px-2">
        <div className={
          !graphData ?
            "mx-auto w-full sm:w-5/6 md:w-2/3 lg:w-1/2 p-4"
            :
            "absolute top-2 left-36 right-36 mx-auto p-4"}
            >
            <QueryForm getGraphData={getGraphData} />
            {!graphData && (
              <div className="w-full justify-center items-center flex flex-col gap-4">
                <button
                  onClick={() => {
                    const qid = popularTopicQid();
                    getGraphData(qid);
                  }}
                  className="h-11 text-base text-gray-200 hover:border-indigo-400 rounded-lg p-2 border-2 border-indigo-500"
                >Want Inspiration?
                </button>
              </div>
            )}
        </div>

      {fetchState.isLoading && (
        <div className="flex justify-center items-center w-full">
          <RotatingLines
            strokeColor="white"
            strokeWidth="5"
            animationDuration="0.75"
            width="96"
            visible={true}
          />
        </div>
      )}
      {!fetchState.isLoading && graphData && (
        <Allotment ref={splitPaneRef} vertical={smallScreen.current}>
            <Allotment.Pane>
              <MyGraph />
            </Allotment.Pane>
            
            { splitPaneView && (
              <Allotment.Pane>
                <div className="relative flex h-full min-w-[100px] justify-center">
                  <IoClose
                    className="z-10 absolute top-0 right-0 text-2xl cursor-pointer h-8 w-8 border-2 border-indigo-200 rounded-md bg-white hover:bg-indigo-200"
                    onClick={handleSplitPaneViewClose}
                  />
                  <iframe
                    src={wikipediaPageUrl}
                    className="w-full h-full pt-2"
                    title="Wikipedia Preview"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              </Allotment.Pane>
            )}
        </Allotment>
        )}
    </div>
  );
}

export default HomePage;
