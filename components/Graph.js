"use client";

import { Fragment, useRef, useState, useEffect, useContext } from "react";
import { GraphDataContext } from "@/context/graph-data-context";

import * as d3 from "d3";

import { BsWikipedia } from "react-icons/bs";
import { PiGraphDuotone } from "react-icons/pi";
import { AiOutlinePlusCircle } from "react-icons/ai";

function Graph({ handleWikipediaPageLoad }) {
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

  const simulationRef = useRef();
  const nodeGroupRef = useRef();
  const linkGroupRef = useRef();

  const [focusedNodeQID, setFocusedNodeQID] = useState("");
  const [wikipediaPageUrl, setWikipediaPageUrl] = useState("");

  const width = useRef(0);
  const height = useRef(0);

  useEffect(() => {
    width.current = d3.select("#graphContainer").node().clientWidth;
    height.current = d3.select("#graphContainer").node().clientHeight;

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

    const svgSelection = d3.select(svgRef.current);

    const linkSelection = d3.selectAll("line").data(links);

    const nodeSelection = d3
      .select(nodeGroupRef.current)
      .selectAll("g")
      .data(nodes);

    const rectSelection = d3
      .select(nodeGroupRef.current)
      .selectAll("rect")
      .data(nodes);

    const nodeTextSelection = d3
      .select(nodeGroupRef.current)
      .selectAll("text")
      .data(nodes);

    rectSelection
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
        return nodeWidth / 4;
      })
      .attr("dy", (d) => {
        const nodeHeight = d3
          .select(`#node__${d.data.qid}`)
          .node()
          .getBBox().height;
        return nodeHeight / 4;
      });

    nodeSelection
      .on("mouseover", handleNodeClick)
      .on("touchstart", handleNodeClick)
      .call(drag(simulation));

    function handleNodeClick(e, d) {
      e.stopPropagation();
      d3.select(`#nodeText__${d.data.qid}`).dispatch("mouseover");
      setFocusedNodeQID(d.data.qid);
      const tooltip = d3.select(tooltipRef.current);
      tooltip
        .style("opacity", 1)
        .style("left", e.x + "px")
        .style("top", e.y + "px")
        .classed("invisible", false)
        .classed("visible", true);

      d3.select(tooltipTitleRef.current)
        .classed("text-lg", true)
        .classed("font-bold", true)
        .html(d.data.label);
      d3
        .select(tooltipDescriptionRef.current)
        .classed("text-base", true)
        .classed("font-normal", true)
        .classed("mt-2", true)
        .html(`<strong>Description:</strong> ${d.data.description} <br />
        <i class="text-sm">Source: <a href="${d.data.url}" target="_blank">${d.data?.repository}</a></i>`);
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
          fetchGraphData(d.data.qid);
        });
    }

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
      });

    const tooltipSelection = d3.select(tooltipRef.current);
    const containerSelection = d3.select("#container").call(drag(simulation));

    svgSelection.on("pointerdown", handleSvgClick);

    function handleSvgClick(e, d) {
      if (e.target.id.includes("svg")) {
        const tooltip = d3.select(tooltipRef.current);
        tooltip.classed("invisible", true);
        setFocusedNodeQID("");
      }
    }

    const zoom = d3.zoom().on("zoom", handleZoom);

    function drag(simulation) {
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        if (d === undefined) return;
        d.fx = d?.x;
        d.fy = d?.y;
      }

      function dragged(event, d) {
        if (d === undefined) return;
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        if (d === undefined) return;
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
      d3.select("#container").attr("transform", event.transform);
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
        rectSelection.attr("x", (d) => d.x).attr("y", (d) => d.y);
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
      <div
        ref={tooltipRef}
        className="invisible absolute rounded-lg p-2 bg-indigo-100 z-5 max-w-[300px]"
      >
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
        id="svg"
        width="100%"
        height="100%"
        viewBox={`0 0 ${width.current} ${height.current}`}
        className="bg-gradrient-to-r from-indigo-300 to-indigo-100 mx-auto"
      >
        <g id="container">
          <g id="linkGroup" ref={linkGroupRef}>
            {links.length > 0 &&
              links.map((link) => {
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
            {nodes.length > 0 &&
              nodes.map((node) => {
                return <Node key={"node__" + node.data.qid} data={node.data} />;
              })}
          </g>
        </g>
      </svg>
    </Fragment>
  );
}

function Node({ data }) {
  const fillColor = "#fff";
  const strokeColor = "#000";
  const rx = "15px";
  const ry = "15px";

  return (
    <g key={`node__${data.qid}`} id={`node__${data.qid}`}>
      <rect
        key={`nodeRect__${data.qid}`}
        id={`nodeRect__${data.qid}`}
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
      />
      <text
        key={"nodeText__" + data.qid}
        id={"nodeText__" + data.qid}
        className="text-lg fill-black label relative text-center"
        textAnchor="middle"
        cursor="default"
      >
        {data.label}
      </text>
    </g>
  );
}

export default Graph;
