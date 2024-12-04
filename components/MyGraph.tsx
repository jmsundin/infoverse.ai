"use client";

// import Link from "next/link";

import React, { Fragment, useRef, useState, useEffect, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { fetchGraphData } from "@/lib/utils";
import type { 
  GraphologyNode, 
  GraphologyEdge, 
  ColaNode, 
  ColaLink, 
  D3ColaGraphologyNode, 
  NodeAttributes 
} from "lib/types";

import * as d3 from "d3";
import * as cola from "webcola";

import { BsWikipedia } from "react-icons/bs";
import { PiGraphDuotone } from "react-icons/pi";
import { AiOutlinePlusCircle } from "react-icons/ai";

interface NodeData {
  id: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}
interface EdgeData {
  source: string;
  target: string;
}

function MyGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { graphData } = useContext(AppContext);

  const tooltipRef = useRef(null);
  const tooltipTitleRef = useRef(null);
  const tooltipDescriptionRef = useRef(null);
  const tooltipMenuRef = useRef(null);
  const tooltipWikipediaIconRef = useRef(null);
  const subtopicsRef = useRef(null);
  const splitPaneRef = useRef(null);
  const simulationRef = useRef<cola.Layout & cola.ID3StyleLayoutAdaptor>();
  const nodeElementsRef = useRef(null);
  const linkElementsRef = useRef(null);

  const [focusedNodeQID, setFocusedNodeQID] = useState("");
  const [wikipediaPageUrl, setWikipediaPageUrl] = useState("");
  const [splitPaneView, setSplitPaneView] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const width = useRef(0);
  const height = useRef(0);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleWikipediaPageLoad = (url) => {
    setWikipediaPageUrl(url);
    setSplitPaneView(true);
  };

  useEffect(() => {
    if (!graphData) return;
    if (!svgRef.current) return;

    const graphContainer = d3.select("#graphContainer").node() as HTMLElement;
    if (!graphContainer) return;
    width.current = graphContainer.clientWidth;
    height.current = graphContainer.clientHeight;

    const nodePaddingX = 60;
    const nodePaddingY = 20;
    
    const nodes: ColaNode[] = graphData.mapNodes((node: string, attributes: NodeAttributes) => {
      return {
        id: node,
        attributes: attributes,
        x: Math.random() * (width.current - nodePaddingX * 2) + nodePaddingX,
        y: Math.random() * (height.current - nodePaddingY * 2) + nodePaddingY,
      };
    });

    const links = graphData.mapEdges((edge, attributes, source, target) => {
      return {
        id: edge,
        source: nodes.find((n) => n.id === source),
        target: nodes.find((n) => n.id === target),
        attributes: attributes,
      } as ColaLink;
    });

    const d3cola = cola.d3adaptor(d3)
      .size([width.current, height.current])
      .jaccardLinkLengths(300)
      // .symmetricDiffLinkLengths(100)
      .avoidOverlaps(true)
      .handleDisconnected(false)
      .nodes(nodes)
      .links(links)
      .start(20,20,60);

    const svgSelection = d3.select(svgRef.current);
    
    // create links before nodes because SVGs are drawn in order
    const linkSelection = d3.selectAll("line").data(links);

    const nodeSelection = d3
      .select(nodeElementsRef.current)
      .selectAll("g")
      .data(nodes);

    const rectSelection = d3
      .select(nodeElementsRef.current)
      .selectAll("rect")
      .data(nodes);

    const foreignObjectSelection = d3
      .selectAll("foreignObject")
      .data(nodes);

    const drag = d3.drag<SVGGElement, ColaNode>()
      .on('start', function(event) {
        let d = event.subject;
        d.fixed |= 2; // fix node in place during drag
        d.x = event.x;
        d.y = event.y;
        d3cola.alpha(0.3).start();
      })
      .on('drag', function(event) {
        let d = event.subject;
        d.x = event.x;
        d.y = event.y;
        d3cola.alpha(0.3).start();
      })
      .on('end', function(event) {
        let d = event.subject;
        d.fixed &= ~2; // unfix node after drag
        d3cola.alpha(0.3).start();
    });

    nodeSelection
      // .on("mouseover", handleNodeClick)
      .on("touchstart", handleNodeClick)
      .call(drag);

    function handleNodeClick(this, e, d: ColaNode) {
      e.stopPropagation();
      d3.select(`#nodeText__${d.id}`).dispatch("mouseover");
      setFocusedNodeQID(d.id);
      const tooltip = d3.select(tooltipRef.current);

      // add a timeout to delay the tooltip from appearing
      setTimeout(() => {
        tooltip
          .style("opacity", 1)
          .style("left", e.x + "px")
          .style("top", e.y + "px")
          .classed("invisible", false)
          .classed("visible", true);
      }, 500);

      d3.select(tooltipTitleRef.current)
        .classed("text-lg", true)
        .classed("font-bold", true)
        .html(d.attributes.label);
      d3
        .select(tooltipDescriptionRef.current)
        .classed("text-base", true)
        .classed("font-normal", true)
        .classed("mt-2", true)
        .html(`<strong>Description:</strong> ${d.attributes.description}`);
      d3.select(tooltipMenuRef.current)
        .classed("flex", true)
        .classed("flex-row", true)
        .classed("justify-center", true)
        .classed("space-x-2", true)
        .classed("items-center", true)
        .classed("mt-2", true)
        .classed("text-base", true);
      d3.select(subtopicsRef.current)
        .classed("text-base", true)
        .classed("cursor-pointer", true)
        .classed("hover:text-indigo-500", true)
        .on("click.handleFetch", () => {
          fetchGraphData(d.id);
        });
    }

    const tooltipSelection = d3.select(tooltipRef.current);
    d3.select("#container").call(d3cola.drag);

    svgSelection.on("pointerdown", handleSvgClick);

    function handleSvgClick(e, d) {
      if (e.target.id.includes("svg")) {
        const tooltip = d3.select(tooltipRef.current);
        tooltip.classed("invisible", true);
        setFocusedNodeQID("");
      }
    }

    const zoom = d3.zoom().on("zoom", handleZoom);

    function handleZoom(event) {
      d3.select("#container").attr("transform", event.transform);
    }

    function initZoom() {
      d3.select(svgRef.current).call(zoom as any);
    }

    initZoom();

    d3cola.on("tick", updatePositions);

    function updatePositions() {
      try {
        nodeSelection.attr("x", (d: ColaNode) => d.x).attr("y", (d) => d.y);
        rectSelection.attr("x", (d: ColaNode) => d.x).attr("y", (d) => d.y);
        foreignObjectSelection.attr("x", (d: ColaNode) => d.x).attr("y", (d) => d.y);
      } catch (error) {
        console.log(error);
      }

      try {
        linkSelection
          .attr("x1", (d: ColaLink) => {
            if (d.source.width) return (d.source.x + d.source.width / 2);
            return (d.source.x + 100);
          })
          .attr("y1", (d: ColaLink) => {
            if (d.source.height) return (d.source.y + d.source.height / 2);
            return (d.source.y + 20);
          })
          .attr("x2", (d: ColaLink) => {
            if (d.target.width) return (d.target.x + d.target.width / 2);
            return (d.target.x + 100);
          })
          .attr("y2", (d: ColaLink) => {
            if (d.target.height) return (d.target.y + d.target.height / 2);
            return (d.target.y + 20);
          });
      } catch (error) {
        console.error('Error updating link positions:', error);
      }
    }

    simulationRef.current = d3cola;

    return () => {
      d3cola.stop();
    };
  }, [graphData]);

  useEffect(() => {
    async function getWikipediaPageUrl(nodeQID) {
      const mediaWikiApi =
        `https://www.wikidata.org/w/api.php?action=wbgetentities&format=xml&props=sitelinks&ids=` +
        nodeQID +
        `&sitefilter=enwiki&origin=*`;

      let response;
      try {
        response = await fetch(mediaWikiApi);
      } catch (error) {
        console.log(error);
      }
      let data;
      try {
        data = await response?.text();
      } catch (error) {
        console.log(error);
      }
      const parser = new DOMParser();
      let xmlDoc;
      try {
        xmlDoc = parser.parseFromString(data, "text/xml");
      } catch (error) {
        console.log(error);
      }

      let wikipediaPageTitle;
      if (xmlDoc !== null && xmlDoc !== undefined && xmlDoc !== "") {
        const siteLink = xmlDoc.getElementsByTagName("sitelink")[0];
        if (siteLink !== null && siteLink !== undefined) {
          wikipediaPageTitle = siteLink.getAttribute("title");
        }
      }

      let url;
      if (wikipediaPageTitle !== null && wikipediaPageTitle !== undefined) {
        url =
          "https://en.wikipedia.org/wiki/" +
          wikipediaPageTitle.replace(" ", "_");
      }
      setWikipediaPageUrl(url);
    }

    getWikipediaPageUrl(focusedNodeQID);
  }, [focusedNodeQID]);

  return (
    <div
        id="graphContainer"
        className="relative flex h-full w-screen justify-center"
    >
      <div
        ref={tooltipRef}
        className="invisible absolute rounded-lg p-2 bg-indigo-100 z-5 max-w-[300px]"
      >
      </div>
      <svg
        ref={svgRef}
        id="svg"
        width="100%"
        height="100%"
        viewBox={`0 0 ${width.current} ${height.current}`}
        className="bg-gradrient-to-r from-indigo-300 to-indigo-100 mx-auto"
      >
        <g id="container">
          {/* link group needs to be before node group due to order of svg rendering */}
          <g id="linkGroup" ref={linkElementsRef}>
            {graphData && (
              <>
                {graphData.mapEdges((edge) => {
                  return (
                    <line
                      key={`link__${edge}`}
                      id={`link__${edge}`}
                      stroke="#fff"
                      strokeWidth="1"
                      className="link"
                    ></line>
                  );
                })}
              </>
              )}
          </g>
          <g id="nodeGroup" ref={nodeElementsRef}>
              {graphData && 
                graphData.mapNodes((node: string, attributes: NodeAttributes) => {
                  return (
                    <Node key={node} node={node} attributes={attributes} />
                  );
                })}
          </g>
        </g>
      </svg>
    </div>
  );
}

function Node({ node, attributes }: { node: string; attributes: NodeAttributes }) {
  const [showFullLabel, setShowFullLabel] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const fillColor = "#fff";
  const strokeColor = "#000";
  const rx = "15px";
  const ry = "15px";
  const width = 200;
  const [height, setHeight] = useState(50);

  const MAX_LABEL_LENGTH = 50;
  const truncatedLabel = attributes.label.length > MAX_LABEL_LENGTH 
    ? attributes.label.substring(0, MAX_LABEL_LENGTH) + "..."
    : attributes.label;

  useEffect(() => {
    if (nodeRef.current) {
      const newHeight = nodeRef.current.scrollHeight + 20;
      setHeight(newHeight);
    }
  }, [showDescription, showFullLabel]);

  const handleSeeMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDescription(!showDescription);
  };

  const handleLabelSeeMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowFullLabel(!showFullLabel); 
  };

  return (
    <g key={`node__${node}`} id={`node__${node}`}>
      <rect
        key={`nodeRect__${node}`}
        id={`nodeRect__${node}`}
        rx={rx}
        ry={ry}
        width={width}
        height={height}
        fill={fillColor}
        stroke={strokeColor}
        className="node relative"
      />
      <foreignObject
        key={`nodeFO__${node}`}
        id={`nodeFO__${node}`}
        width={width} 
        height={height}
        x={0}
        y={0}
        className="overflow-visible"
      >
       <div
          ref={nodeRef}
          className="h-full w-full flex flex-col items-center justify-center p-2"
        >
          <div className="text-lg text-center break-words">
            {showFullLabel ? (
              <>
                <p>{attributes.label}</p>
                <p 
                  onClick={handleLabelSeeMore}
                  className="text-indigo-600 hover:text-indigo-800 text-sm mt-1"
                >
                  See Less
                </p>
              </>
            ) : (
              <>
                <p>{truncatedLabel}</p>
                {attributes.label.length > MAX_LABEL_LENGTH && (
                  <p 
                    onClick={handleLabelSeeMore}
                    className="text-indigo-600 hover:text-indigo-800 text-sm mt-1"
                  >
                    See More
                  </p>
                )}
              </>
            )}
          </div>

          {attributes.description && (
            <div className="text-sm text-center mt-1">
              {showDescription ? (
                <>
                  <p className="text-gray-600">{attributes.description}</p>
                  <p 
                    onClick={handleSeeMore}
                    className="text-indigo-600 hover:text-indigo-800 mt-1"
                  >
                    See Less
                  </p>
                </>
              ) : (
                <p 
                  onClick={handleSeeMore}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  See More
                </p>
              )}
            </div>
          )}
        </div>
      </foreignObject>
    </g>
  );
}

export default MyGraph;
