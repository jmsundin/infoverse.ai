"use client";

import { Fragment, useRef, useState, useEffect, useContext } from "react";
import { GraphDataContext } from "@/context/graph-data-context";

import * as d3 from "d3";

import { BsWikipedia } from "react-icons/bs";
import { PiGraphDuotone } from "react-icons/pi";
import { AiOutlinePlusCircle } from "react-icons/ai";

function Graph({ graphContainer, handleWikipediaPageLoad }) {
  const {
    root: root,
    nodes: nodes,
    links: links,
    fetchGraphData: fetchGraphData,
  } = useContext(GraphDataContext);

  const tooltipRef = useRef();
  const tooltipTitleRef = useRef();
  const tooltipDescriptionRef = useRef();
  const tooltipMenuRef = useRef();
  const tooltipWikipediaIconRef = useRef();
  const subtopicsRef = useRef();
  const svgRef = useRef(null);
  const width = useRef(960);
  const height = useRef(700);

  const rootRef = useRef(root);
  const nodesRef = useRef(nodes);
  const linksRef = useRef(links);

  const simulationRef = useRef();
  const nodeGroupRef = useRef();
  const linkGroupRef = useRef();

  const [focusedNodeQID, setFocusedNodeQID] = useState("");
  const [wikipediaPageUrl, setWikipediaPageUrl] = useState("");

  useEffect(() => {
    const nodePaddingX = 60;
    const nodePaddingY = 20;

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.data.qid)
          .distance(300)
          .strength(0.1)
      )
      .force("collide", d3.forceCollide().radius(100))
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(width.current / 2, height.current / 2));
    // Create the container SVG.
    const svgSelection = d3.select(svgRef.current);

    const linkSelection = d3.selectAll("line").data(links);

    const nodeSelection = d3
      .select(nodeGroupRef.current)
      .selectAll("rect")
      .data(nodes);

    const nodeTextSelection = d3.selectAll("text").data(nodes);

    nodeSelection
      .attr("width", (d) => {
        const textWidth = d3
          .select(`#nodeText__${d.data.qid}`)
          .node()
          .getBBox().width;
        return textWidth + nodePaddingX;
      })
      .attr("height", (d) => {
        const textHeight = d3
          .select(`#nodeText__${d.data.qid}`)
          .node()
          .getBBox().height;
        return textHeight + nodePaddingY;
      });

    nodeTextSelection
      .attr("dx", (d) => {
        const nodeWidth = d3
          .select(`#node__${d.data.qid}`)
          .node()
          .getBBox().width;
        return nodeWidth / 2 + "px";
      })
      .attr("dy", (d) => {
        const nodeHeight = d3
          .select(`#node__${d.data.qid}`)
          .node()
          .getBBox().height;
        return nodeHeight / 2 + "px";
      });

    nodeSelection
      .on("mouseover", (e, d) => {
        setFocusedNodeQID(d.data.qid);
        // console.log(d.data);
        const tooltip = d3.select(tooltipRef.current);
        tooltip
          .style("opacity", 1)
          .style("left", e.pageX + 100 + "px")
          .style("top", e.pageY + "px")
          .classed("rounded-lg", true)
          .classed("p-2", true)
          .classed("bg-indigo-100", true)
          .classed("z-5", true)
          .classed("invisible", false)
          .classed("visible", true)
          .classed("max-w-[300px]", true);

        d3.select(tooltipTitleRef.current)
          .classed("text-lg", true)
          .classed("font-bold", true)
          .html(d.data.label);
        d3.select(tooltipDescriptionRef.current)
          .classed("text-base", true)
          .classed("font-normal", true)
          .classed("mt-2", true)
          .html(`<strong>Description:</strong> ${d.data.description}`);
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
          .on("click", () => {
            fetchGraphData(d.data.qid);
          });
      })
      .call(drag(simulation));

    // Setting the x and y of the text to the center of the node.
    nodeTextSelection
      .attr("dx", (d) => {
        const nodeWidth = d3
          .select(`#node__${d.data.qid}`)
          .node()
          .getBBox().width;
        return nodeWidth / 2 + "px";
      })
      .attr("dy", (d) => {
        const nodeHeight = d3
          .select(`#node__${d.data.qid}`)
          .node()
          .getBoundingClientRect().height;
        const nodeTextHeight = d3
          .select(`#nodeText__${d.data.qid}`)
          .node()
          .getBBox().height;
        return nodeHeight / 2 + nodeTextHeight / 4 + "px";
      })
      .on("mouseover", (e, d) => {
        setFocusedNodeQID(d.data.qid);
        const tooltip = d3.select(tooltipRef.current);
        tooltip
          .style("opacity", 1)
          .style("left", e.pageX + 100 + "px")
          .style("top", e.pageY + 100 + "px")
          .classed("rounded-lg", true)
          .classed("p-2", true)
          .classed("bg-indigo-100", true)
          .classed("z-5", true)
          .classed("invisible", false)
          .classed("visible", true)
          .classed("max-w-[300px]", true);

        d3.select(tooltipTitleRef.current)
          .classed("text-2xl", true)
          .classed("font-bold", true)
          .html(d.data.label);
        d3.select(tooltipDescriptionRef.current)
          .classed("text-base", true)
          .classed("font-normal", true)
          .classed("mt-2", true)
          .html(`<strong>Description:</strong> ${d.data.description}`);
        d3.select(tooltipMenuRef.current)
          .classed("flex", true)
          .classed("flex-row", true)
          .classed("justify-center", true)
          .classed("space-x-2", true)
          .classed("items-center", true)
          .classed("mt-2", true)
          .classed("text-2xl", true);
        d3.select(subtopicsRef.current)
          .classed("text-base", true)
          .classed("cursor-pointer", true)
          .classed("hover:text-indigo-500", true)
          .on("click", () => {
            fetchGraphData(d.data.qid);
          });
      })
      .call(drag(simulation));

    const tooltipSelection = d3.select(tooltipRef.current);

    svgSelection.on("click", (e, d) => {
      const tooltip = d3.select(tooltipRef.current);
      tooltip.classed("invisible", true);
      setFocusedNodeQID("");
    });

    const zoom = d3.zoom().on("zoom", handleZoom);

    function drag(simulation) {
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
      return d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    function handleZoom(event) {
      d3.selectAll("g").attr("transform", event.transform);
    }

    function initZoom() {
      d3.select(svgRef.current).call(zoom);
    }

    initZoom();

    simulation.on("tick", tick);

    function tick() {
      try {
        nodeSelection.attr("x", (d) => d.x).attr("y", (d) => d.y);
      } catch (error) {
        console.log(error);
      }
      try {
        nodeTextSelection.attr("x", (d) => d.x).attr("y", (d) => d.y);
      } catch (error) {
        console.log(error);
      }

      try {
        linkSelection
          .attr("x1", (d) => {
            const nodeWidth = d3
              .select(`#node__${d.source.data.qid}`)
              .node()
              .getBBox().width;
            return d.source.x + nodeWidth / 2;
          })
          .attr("y1", (d) => {
            const nodeHeight = d3
              .select(`#node__${d.source.data.qid}`)
              .node()
              .getBBox().height;
            return d.source.y + nodeHeight / 2;
          })
          .attr("x2", (d) => {
            const nodeWidth = d3
              .select(`#node__${d.target.data.qid}`)
              .node()
              .getBBox().width;
            return d.target.x + nodeWidth / 2;
          })
          .attr("y2", (d) => {
            const nodeHeight = d3
              .select(`#node__${d.target.data.qid}`)
              .node()
              .getBBox().height;
            return d.target.y + nodeHeight / 2;
          });
      } catch (error) {
        console.log(error);
      }
    }
    
    simulationRef.current = simulation;

    return () => {
      simulation.stop();
    };
  }, [nodes, links, fetchGraphData]);

  useEffect(() => {
    async function getWikipediaPageUrl(nodeQID) {
      const mediaWikiApi =
        `https://www.wikidata.org/w/api.php?action=wbgetentities&format=xml&props=sitelinks&ids=` +
        nodeQID +
        `&sitefilter=enwiki&origin=*`;

      let response = null;
      try {
        response = await fetch(mediaWikiApi);
      } catch (error) {
        console.log(error);
      }
      let data = null;
      try {
        data = await response?.text();
      } catch (error) {
        console.log(error);
      }
      const parser = new DOMParser();
      let xmlDoc = null;
      try {
        xmlDoc = parser.parseFromString(data, "text/xml");
      } catch (error) {
        console.log(error);
      }

      let wikipediaPageTitle = null;
      if (xmlDoc !== null && xmlDoc !== undefined && xmlDoc !== "") {
        const siteLink = xmlDoc.getElementsByTagName("sitelink")[0];
        if (siteLink !== null && siteLink !== undefined) {
          wikipediaPageTitle = siteLink.getAttribute("title");
        }
      }

      let url = null;
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
    <Fragment>
      <div ref={tooltipRef} className="invisible absolute">
        <div ref={tooltipTitleRef}></div>
        <p ref={tooltipDescriptionRef}></p>
        <div ref={tooltipMenuRef} className="flex flex-row items-start gap-2">
          {wikipediaPageUrl !== null && wikipediaPageUrl.length > 0 ? (
            <Fragment>
              <span
                ref={tooltipWikipediaIconRef}
                className="flex gap-2 justify-center cursor-pointer"
              >
                <BsWikipedia
                  className="w-6 h-6 hover:fill-indigo-500 hover:border-indigo-500"
                  title="Wikipedia Page"
                  onClick={() => {
                    handleWikipediaPageLoad(wikipediaPageUrl);
                  }}
                />
              </span>
            </Fragment>
          ) : (
            <span className="text-xs">No Wiki Page</span>
          )}
          <div className="flex flex-row justify-center gap-3 bg-inherit">
            <PiGraphDuotone
              id="create-new-graph"
              key={"create-new-graph"}
              value="create-new-graph"
              title="Create new graph"
              className="float-right w-6 h-6 fill-black cursor-pointer hover:fill-indigo-500"
              onMouseDown={function (event) {
                console.log(this);
              }}
            />
            <AiOutlinePlusCircle
              id="add-to-graph"
              key={"add-to-graph"}
              value="add-to-graph"
              title="Add to current graph"
              className="float-right w-6 h-6 fill-black cursor-pointer hover:fill-indigo-500"
              onMouseDown={function (event) {
                console.log(this);
              }}
            />
          </div>
        </div>
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width.current} ${height.current}`}
        className="bg-gradrient-to-r from-indigo-300 to-indigo-100 rounded-lg w-full h-full mx-auto"
      >
        <g id="linkGroup" ref={linkGroupRef}>
          {links.length > 0 && links.map((link) => {
              return (
                <line
                  key={`link__${link.source.data.qid}--${link.target.data.qid}`}
                  id={`link__${link.source.data.qid}--${link.target.data.qid}`}
                  stroke="#fff"
                  strokeWidth="1"
                  className="link"
                ></line>
              );
            })}
        </g>

        <g id="nodeGroup" ref={nodeGroupRef}>
          {nodes.length > 0 && nodes.map((node) => {
              return (
                <Fragment key={"nodeFragment__" + node.data.qid}>
                  <Node key={"node__" + node.data.qid} data={node.data} />
                  <text
                    key={"nodeText__" + node.data.qid}
                    id={"nodeText__" + node.data.qid}
                    className="text-lg fill-black label relative text-center"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    cursor="default"
                  >
                    {node.data.label}
                  </text>
                </Fragment>
              );
            })}
        </g>
      </svg>
    </Fragment>
  );
}

function Node({ data, children }) {
  const fillColor = "#fff";
  const strokeColor = "#000";
  const rx = "15px";
  const ry = "15px";

  return (
    <rect
      id={`node__${data.qid}`}
      data-value={data.value}
      data-qid={data.qid}
      data-label={data.label}
      data-description={data.description}
      data-parent={data.parent}
      data-children={data.children}
      data-uri={data.uri}
      data-url={data.url}
      data-repository={data.repository}
      rx={rx}
      ry={ry}
      fill={fillColor}
      stroke={strokeColor}
      className="node relative"
    >
      {children}
    </rect>
  );
}

export default Graph;
