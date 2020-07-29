import React, { useContext, useRef, useEffect, useState } from "react";
import * as d3 from "d3";
// import "./style.css";
import dataSource from "../../data/0722_2.json";
import { OptionContext } from "../../context";
import Uid from "../../utilities/uid";

function Timeline(props) {
  const { options, setCurrentOption } = useContext(OptionContext);
  const d3Container = useRef(null);
  const id = props.id;

  async function Init() {
    let margin = { top: 30, right: 10, bottom: 0, left: 10 };
    let step = 23;
    let width = 1000;
    let data = props.data;
    let height = data.series.length * (step + 1) + margin.top + margin.bottom;
    let scheme = "schemeBlues";
    let overlap = 2;

    let color = (i) =>
      d3[scheme][Math.max(3, overlap)][i + Math.max(0, 3 - overlap)];

    let x = d3.scaleUtc().domain(d3.extent(data.dates)).range([0, width]);

    let y = d3
      .scaleLinear()
      .domain([0, d3.max(data.series, (d) => d3.max(d.values))])
      .range([0, -overlap * step]);

    let xAxis = (g) =>
      g
        .attr("transform", `translate(0,${margin.top})`)
        .call(
          d3
            .axisTop(x)
            .ticks(width / 80)
            .tickSizeOuter(0)
        )
        .call((g) =>
          g
            .selectAll(".tick")
            .filter((d) => x(d) < margin.left || x(d) >= width - margin.right)
            .remove()
        )
        .call((g) => g.select(".domain").remove());

    let area = d3
      .area()
      .curve(d3.curveBasis)
      .defined((d) => !isNaN(d))
      .x((d, i) => x(data.dates[i]))
      .y0(0)
      .y1((d) => y(d));
    let svg = d3.select(d3Container.current);
    svg.html("");
    svg.attr("viewBox", [0, 0, width, height]).style("font", "10px sans-serif");

    const g = svg
      .append("g")
      .selectAll("g")
      .data(
        data.series.map((d) =>
          Object.assign(
            {
              clipId: Uid("clip"),
              pathId: Uid("path"),
            },
            d
          )
        )
      )
      .join("g")
      .attr(
        "transform",
        (d, i) => `translate(0,${i * (step + 1) + margin.top})`
      );

    g.append("clipPath")
      .attr("id", (d) => d.clipId.id)
      .append("rect")
      .attr("width", width)
      .attr("height", step);

    g.append("defs")
      .append("path")
      .attr("id", (d) => d.pathId.id)
      .attr("d", (d) => area(d.values));

    g.append("g")
      .attr("clip-path", (d) => d.clipId)
      .selectAll("use")
      .data((d) => new Array(overlap).fill(d))
      .join("use")
      .attr("fill", (d, i) => color(i))
      .attr("transform", (d, i) => `translate(0,${(i + 1) * step})`)
      .attr("xlink:href", (d) => d.pathId.href);

    g.append("text")
      .attr("x", 4)
      .attr("y", step / 2)
      .attr("dy", "0.35em")
      .text((d) => d.name);

    svg.append("g").call(xAxis);
  }

  useEffect(() => {
    if (d3Container.current) {
      Init();
    }
  }, [d3Container, id]);

  return (
    <div className="horizon">
      <svg ref={d3Container} width={1000} height={54} />
    </div>
  );
}

export default Timeline;
