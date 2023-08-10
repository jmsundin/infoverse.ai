"use client";

import { Fragment, useRef, useState, useEffect } from "react";
import * as d3 from "d3";
import { aboutMe } from "@/data/about-me";
import { v4 as uuidv4 } from "uuid";

function Graph() {
  const tooltipRef = useRef();
  const svgRef = useRef();

  // Specify the chart’s dimensions.
  const width = 960;
  const height = 700;
  const scale = 0.6;

  // Compute the graph and start the force simulation.
  const root = d3.hierarchy(aboutMe);
  const links = root.links();
  const nodes = root.descendants();
  nodes.forEach((d) => {
    d.id = uuidv4();
  });

  const simulation = useRef(null);
  const svg = useRef(null);
  const link = useRef(null);
  const node = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    simulation.current = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance((d) => {
            if (d.source.data.name === "Jon Sundin") return 40;
            else if (
              d.source.data.children &&
              d.source.data.name !== "Jon Sundin"
            ) {
              return 10;
            }

            return 1;
          })
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("collide", d3.forceCollide().radius(70))
      .force("x", d3.forceX())
      .force("y", d3.forceY());

    // Create the container SVG.
    svg.current = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    // Append links.
    link.current = svg.current
      .append("g")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("id", (d) => `line__${d.source.name}-->${d.target.name}`);

    // Append nodes.
    node.current = svg.current
      .append("g")
      .selectAll("rect")
      .data(nodes)
      .join("rect")
      .attr("id", (d) => `node__${d.data.name}`)
      .attr("fill", (d) => {
        if (d.depth == 0) return "#fff";
        else if (d.depth == 1 && d.data.children) return "#fff";
        else if (d.depth == 2 && d.data.children) return "#eee";
        else if (d.depth == 3 && d.data.children) return "#fff";
        else if (d.depth == 4 && d.data.children) return "#eee";
        return "#000";
      })
      .attr("stroke", (d) => {
        if (d.depth == 0) return "#000";
        else if (d.depth > 0 && d.data.children) return "#000";
        return "#fff";
      })
      .attr("width", (d) => {
        if (d.depth == 0) return String(d.data.name.length * 12) + "px";
        else if (d.depth > 0 && d.data.children)
          return String(d.data.name.length * 10) + "px";
        return "20px";
      })
      .attr("height", (d) => {
        if (d.depth == 0) return "40px";
        else if (d.depth > 0 && d.data.children) return "30px";
        return "20px";
      })
      .attr("rx", 15)
      .attr("ry", 15)
      .classed("node", true)
      .classed("relative", true)
      .on("mouseover", (e, d) => {
        if (d.data.children) return;
        const tooltip = d3.select(tooltipRef.current);
        tooltip
          .style("opacity", 1)
          .style("left", `${e.pageX}px`)
          .style("top", `${e.pageY}px`)
          .attr("width", d.data.name.length * 10)
          .attr("height", 20)
          .html(d.data.name)
          .classed("invisible", false)
          .classed("visible", true);
      })
      .on("mouseout", (e, d) => {
        const tooltip = d3.select(tooltipRef.current);
        tooltip.classed("invisible", true);
      })
      .call(drag(simulation));

    // Append labels.
    label.current = svg.current
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text((d) => d.data.name)
      .attr("id", (d) => `label__${d.data.name}`)
      .attr("dx", (d) => {
        if (d.data.name === "Jon Sundin")
          return String(d.data.name.length * 6) + "px";
        else if (d.data.children && d.data.name !== "Jon Sundin")
          return String(d.data.name.length * 5) + "px";
      })
      .attr("dy", (d) => {
        if (d.data.name === "Jon Sundin") return "25px";
        return "20px";
      })
      .classed("text-lg", (d) => {
        if (d.data.name === "Jon Sundin") return true;
        return false;
      })
      .classed("text-sm", (d) => {
        if (d.data.name !== "Jon Sundin") return true;
        return false;
      })
      .classed("font-bold", (d) => {
        if (d.data.name === "Jon Sundin") return true;
        return false;
      })
      .attr("text-anchor", (d) => {
        if (d.data.name === "Jon Sundin" || d.data.children) return "middle";
        return "start";
      })
      .attr("cursor", "default")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .classed("label", true)
      .classed("invisible", (d) => {
        if (d.data.children) return false;
        return true;
      })
      .classed("relative", true)
      .on("mouseover", (e, d) => {
        if (d.data.children) return;
        const tooltip = d3.select(tooltipRef.current);
        tooltip
          .style("opacity", 1)
          .style("left", String(e.pageX) + "px")
          .style("top", String(e.pageY) + "px")
          .attr("width", d.data.name.length * 10)
          .attr("height", 20)
          .html(d.data.name)
          .classed("invisible", false)
          .classed("visible", true);
      })
      .on("mouseout", (e, d) => {
        const tooltip = d3.select(tooltipRef.current);
        tooltip.classed("invisible", true);
      })
      .call(drag(simulation));

    const zoom = d3.zoom().on("zoom", handleZoom);

    function drag(simulation) {
      function dragstarted(event, d) {
        if (!event.active) simulation.current.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event, d) {
        if (!event.active) simulation.current.alphaTarget(0);
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

    node.current.append("title").text((d) => d.data.name);
    simulation.current.on("tick", () => {
      try {
        link.current
          .attr("x1", (d) => {
            if (d.source.data.name === "Jon Sundin")
              return d.source.x + d.source.data.name.length * 6;
            else if (d.source.data.children)
              return d.source.x + d.source.data.name.length * 4;
            return d.source.x + 10;
          })
          .attr("y1", (d) => {
            if (d.source.data.name === "Jon Sundin") return d.source.y + 15;
            else if (d.source.data.children) return d.source.y + 12.5;
            return d.source.y + 10;
          })
          .attr("x2", (d) => {
            if (d.target.data.name === "Jon Sundin")
              return d.target.x + d.target.data.name.length * 6;
            else if (d.target.data.children)
              return d.target.x + d.target.data.name.length * 4;
            return d.target.x + 10;
          })
          .attr("y2", (d) => {
            if (d.target.data.name === "Jon Sundin") return d.target.y + 15;
            else if (d.target.data.children) return d.target.y + 12.5;
            return d.target.y + 10;
          });
      } catch (error) {
        console.log(error);
      }

      node.current.attr("x", (d) => d.x).attr("y", (d) => d.y);

      label.current.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });
  }, [nodes, links]);

  return (
    <Fragment>
      <div
        ref={tooltipRef}
        className="invisible absolute z-10 bg-indigo-100 rounded-full p-2"
      ></div>
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 930 700"
        className="bg-gradient-to-r from-indigo-300 to-indigo-100 rounded-lg"
      ></svg>
    </Fragment>
  );
}

export default Graph;
