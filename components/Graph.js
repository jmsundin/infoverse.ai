"use client";

import { Fragment, useRef, useState, useEffect } from "react";
import * as d3 from "d3";

import { BsWikipedia } from "react-icons/bs";
import { node } from "prop-types";

function Graph({ data, graphContainer, handleWikipediaPageLoad }) {
  const tooltipRef = useRef();
  const tooltipTitleRef = useRef();
  const tooltipDescriptionRef = useRef();
  const tooltipMenuRef = useRef();
  const tooltipWikipediaIconRef = useRef();

  const [focusedNodeQID, setFocusedNodeQID] = useState("");
  const [wikipediaPageUrl, setWikipediaPageUrl] = useState("");

  const svgRef = useRef();
  const width = useRef(graphContainer?.current?.width || 930);
  const height = useRef(graphContainer?.current?.height || 700);

  const root = useRef();
  const nodes = useRef();
  const links = useRef();
  const simulation = useRef();

  useEffect(() => {
    async function getWikipediaPageUrl(QID) {
      const mediaWikiApi =
        `https://www.wikidata.org/w/api.php?action=wbgetentities&format=xml&props=sitelinks&ids=` +
        QID +
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

  useEffect(() => {

    root.current = d3.hierarchy(data);
    nodes.current = root.current.descendants();
    links.current = root.current.links();

    const nodePaddingX = 60;
    const nodePaddingY = 20;

    simulation.current = d3
      .forceSimulation(nodes.current)
      .force(
        "link",
        d3
          .forceLink(links.current)
          .id((d) => d.data.qid)
          .distance(300)
          .strength(0.1)
      )
      .force("collide", d3.forceCollide().radius(100))
      .force("x", d3.forceX())
      .force("y", d3.forceY());

    // Create the container SVG.
    const svgSelection = d3
      .select(svgRef.current)
      .attr("viewBox", [-width.current / 2, -height.current / 2, width.current, height.current])
      .classed("bg-gradient-to-r", true)
      .classed("from-indigo-300", true)
      .classed("to-indigo-100", true)
      .classed("rounded-lg", true)
      .classed("w-full", true)
      .classed("h-full", true)
      .classed("mx-auto", true);

    const linkSelection = svgSelection
      .append("g")
      .attr("id", "links")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .selectAll("line")
      .data(links.current)
      .join("line")
      .attr("id", (d) => `link__${d.source.data.qid}__${d.target.data.qid}`)
      .attr("marker-end", (d) => {
        return `url(#marker__${d.target.data.qid})`;
      });

    // Append nodes.
    const nodeSelection = svgSelection
      .append("g")
      .classed("nodeGroup", true)
      .selectAll("rect")
      .data(nodes.current)
      .join("rect")
      .attr("id", (d) => `node__${d.data.qid}`)
      .attr("fill", "#fff")
      .attr("stroke", "#000")
      .attr("rx", "15px")
      .attr("ry", "15px")
      .classed("node", true)
      .classed("relative", true);

    const nodeTextSelection = svgSelection
      .append("g")
      .classed("nodeTextGroup", true)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .selectAll("text")
      .data(nodes.current)
      .join("text")
      .text((d) => d.data.label)
      .attr("id", (d) => `nodeText__${d.data.qid}`)
      .attr("text-anchor", "middle")
      .classed("text-2xl", (d) => {
        if (d.data.value > 1) {
          return true;
        }
        return false;
      })
      .classed("text-base", (d) => {
        if (d.data.value > 1) {
          return false;
        }
        return true;
      })
      .classed("font-bold", (d) => {
        if (d.data.value > 1) {
          return true;
        }
        return false;
      })
      .attr("cursor", "default")
      .classed("label", true)
      .classed("relative", true);

    // Setting the width of the node to the width of the text + padding.
    nodeSelection
      .attr("width", (d) => {
        const nodeTextWidth = d3
          .select(`#nodeText__${d.data.qid}`)
          .node()
          .getBoundingClientRect().width;
        return nodeTextWidth + nodePaddingX + "px";
      })
      .attr("height", (d) => {
        const nodeTextHeight = d3
          .select(`#nodeText__${d.data.qid}`)
          .node()
          .getBoundingClientRect().height;
        return nodeTextHeight + nodePaddingY + "px";
      })
      .on("mouseover", (e, d) => {
        setFocusedNodeQID(d.data.qid);
        const tooltip = d3.select(tooltipRef.current);
        tooltip
          .style("opacity", 1)
          .style("left", e.pageX + "px")
          .style("top", e.pageY + "px")
          .classed("rounded-lg", true)
          .classed("p-2", true)
          .classed("bg-indigo-100", true)
          .classed("z-10", true)
          .classed("invisible", false)
          .classed("visible", true);

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
      })
      // .on("mouseout", (e, d) => {
      //   const tooltip = d3.select(tooltipRef.current);
      //   tooltip.classed("invisible", true);
      // })
      .call(drag(simulation.current));

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
          .getBBox().height;
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
          .style("left", e.x + "px")
          .style("top", e.y + "px")
          .classed("rounded-lg", true)
          .classed("p-2", true)
          .classed("bg-indigo-100", true)
          .classed("z-10", true)
          .classed("invisible", false)
          .classed("visible", true);

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
        d3.select(tooltipWikipediaIconRef.current)
          .classed("cursor-pointer", true)
          .classed("border-solid", true)
          .classed("border-2", true)
          .classed("border-gray-500", true)
          .classed("rounded-lg", true)
          .classed("hover:border-indigo-500", true);
      })
      .call(drag(simulation.current));

    const markerSelection = svgSelection
      .append("g")
      .attr("id", "markers")
      .append("defs")
      .selectAll("marker")
      .data(links.current)
      .join("marker")
      .attr("id", (d) => `marker__${d.target.data.qid}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("markerWidth", 10)
      .attr("markerHeight", 10)
      .attr("orient", "auto-start-reverse");

    // Adding the arrow path to the marker.
    markerSelection
      .append("path")
      .attr("id", (d) => `arrow__${d.target.data.qid}`)
      .attr("fill", "#000")
      .attr("d", "M0,-5L10,0L0,5");

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

    simulation.current.on("tick", tick);
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
            return d.source.x + nodeWidth / 2 + "px";
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

            return d.target.x + nodeWidth / 2 + "px";
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

      // try {
      //   markerSelection
      //     .attr("refX", (d) => {
      //       // find the x intercept of the line and the node
      //       const x1 = d.source.x;
      //       const y1 = d.source.y;
      //       const x2 = d.target.x;
      //       const y2 = d.target.y;

      //       const m = (y2 - y1) / (x2 - x1); // slope

      //       // get the x value when the y value is the height of the node / 2
      //       const nodeHeight = d3
      //         .select(`#node__${d.target.data.qid}`)
      //         .node()
      //         .getBoundingClientRect().height;

      //       const y = nodeHeight / 2;
      //       const b = y1 - m * x1; // y intercept
      //       // y = mx + b;
      //       // y - b = mx;
      //       // (y - b) / m = x;

      //       // const x = y - b / m + x1; // x intercept
      //       const x = (y - 0) / m + x1; // x intercept

      //       return x;
      //     })
      //     .attr("refY", (d) => {
      //       const nodeHeight = d3
      //         .select(`#node__${d.target.data.qid}`)
      //         .node()
      //         .getBoundingClientRect().height;
      //       return nodeHeight / 2;
      //     });
      // } catch (error) {
      //   console.log(error);
      // }
    }

    return () => {
      simulation.current.stop();
    };
  }, [data, graphContainer]);

  return (
    <Fragment>
      <div ref={tooltipRef} className="invisible absolute">
        <div ref={tooltipTitleRef}></div>
        <p ref={tooltipDescriptionRef}></p>
        <div ref={tooltipMenuRef}>
          {wikipediaPageUrl !== null && wikipediaPageUrl.length > 0 ? (
            <Fragment>
              <span className="text-sm">Wikipedia Page:</span>
              <span
                ref={tooltipWikipediaIconRef}
                className="cursor-pointer border-solid border-2 border-gray-500 rounded-lg hover:border-indigo-500 hover:text-indigo-500"
              >
                <BsWikipedia
                  onClick={() => {
                    handleWikipediaPageLoad(wikipediaPageUrl);
                  }}
                />
              </span>
            </Fragment>
          ) : (
            <span className="text-xs">No Wikipedia Page Available</span>
          )}
        </div>
      </div>
      <svg ref={svgRef}></svg>
    </Fragment>
  );
}

export default Graph;
