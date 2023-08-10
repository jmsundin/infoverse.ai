"use client";

import { Fragment, useState, useEffect, useRef, use } from "react";
import * as d3 from "d3";
import Split from "@/components/Split";

import { Progress } from "@/components/ui/progress";
import Graph from "@/components/Graph";

function HomePage() {
  const [progress, setProgress] = useState(0);
  const [fetchingData, setFetchingData] = useState(false);
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [dragging, setDragging] = useState(false);
  const preSizeRef = useRef(0);
  const nextSizeRef = useRef(0);
  const moveRef = useRef(false);
  const paneNumberRef = useRef(0);
  const wrapperRef = useRef(null);

  const [wikipediaUrl, setWikipediaUrl] = useState(
    "https://en.wikipedia.org/wiki/Computer_science"
  );

  // useEffect(() => {
  //   let progress = 0;
  //   setInterval(() => {
  //     progress += 20;
  //     const timer = setTimeout(() => setProgress(progress), 500);
  //     if (progress === 100) {
  //       clearTimeout(timer);
  //       setPageIsLoading(false);
  //     }
  //   }, 200);
  // }, []);

  // useEffect(() => {
  //   async function getGraphData() {
  //     setFetchingData(true);
  //     const graphData = await fetch("");
  //     const graphDataJson = await graphData.json();
  //     console.log(graphDataJson);
  //     setFetchingData(false);
  //   }

  //   getGraphData();
  // }, []);

  function onMouseDown(paneNumber, event) {
    if (!event.target || !wrapperRef.current) {
      return;
    }

    this.paneNumber = paneNumber;
    preSizeRef.current = wrapperRef.current.children[paneNumber].offsetWidth;
    nextSizeRef.current =
      wrapperRef.current.children[paneNumber + 1].offsetWidth;

    moveRef.current = true;

    // get widths and heights

    window.addEventListener("mousemove", onDragging);
    window.addEventListener("mouseup", onDragEnd);

    setDragging(true);
  }

  function onDragging(event) {
    if (!moveRef.current) {
      return;
    }

    if (!dragging) {
      setDragging(true);
    }

    // calculate new sizes

    onDragging &&
      onDragging(
        preSizeRef.current,
        nextSizeRef.current,
        paneNumberRef.current
      );
  }

  function onDragEnd() {
    moveRef.current = false;

    onDragEnd &&
      onDragEnd(preSizeRef.current, nextSizeRef.current, paneNumberRef.current);

    // clean up

    setDragging(false);
  }

  function renderBar(onMouseDown, ...args) {
    return (
      <div className="drop-shadow-none flex flex-col w-4 h-full cursor-col-resize">
        <div
          className="drop-shadow-none w-1 h-full bg-gray-400 rounded-md"
          onMouseDown={onMouseDown}
        ></div>
      </div>
    );
  }

  return (
    <Fragment>
      <Split
        renderBar={renderBar}
        onMouseDown={onMouseDown}
        onDragging={onDragging}
        onDragEnd={onDragEnd}
        className="flex flex-row flex-1 h-full border-2 rounded-md"
      >
        <div className="flex flex-row h-fit">
          <div className="flex flex-1 border-2 rounded-md min-w-[100px] justify-center">
            {/* {pageIsLoading && <Progress value={progress} className="w-1/2" />} */}
            <Graph data={graphData}/>
          </div>
          <div className="flex flex-1 border-2 rounded-md min-w-[100px] justify-center">
            {/* {pageIsLoading && <Progress value={progress} className="w-1/2" />} */}
            {/* {!pageIsLoading && ( */}
            <iframe
              src={wikipediaUrl}
              className="w-full h-full"
              title="Code Preview"
              sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts"
            />
            {/* )} */}
          </div>
        </div>
      </Split>
    </Fragment>
  );
}

export default HomePage;
