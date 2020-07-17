import React, { useContext, useRef, useEffect, useState } from "react";
import * as d3 from "d3";
// import "./style.css";
import { OptionContext } from "../../context";
import dataSource from "../../data/timeCurve_demo";

function Timeline(props) {
  const { options, setCurrentOption } = useContext(OptionContext);
  const d3Container = useRef(null);

  async function Init() {
    const matrix = {
      identifiers: dataSource.keys,
      matrix: dataSource.m,
    };
    const div = d3.select(d3Container.current);

    const size = div.node().getBoundingClientRect().width;
    const margin = { topAndLeft: 40, bottomAndRight: 40 };

    const color = d3
      //   .scaleSequential(d3.interpolateGreens)
      .scaleSequential((t) => {
        let c = d3.rgb(39, 20, 79);
        c.opacity = t;
        return c.toString();
      })
      .domain(d3.extent(d3.merge(matrix.matrix).filter((d) => d > 0.01)));

    const scale = d3
      .scaleBand()
      .domain(matrix.identifiers)
      .range([margin.topAndLeft, size - margin.bottomAndRight])
      .padding(0.1);

    const svg = div.append("svg").attr("width", size).attr("height", size);

    const tooltip = div
      .selectAll("#matrix-tooltip")
      .data([null]) // only append the tooltip div if it doesn't already exist
      .join("div")
      .attr("id", "matrix-tooltip")
      .style("display", "none")
      .style("position", "absolute")
      .style("background", "#FD486E")
      .style("font-size", "12px")
      .style("color", "#fff")
      .style("padding", "4px 4px");

    const data = d3.merge(
      matrix.matrix.map((d, i) =>
        d.map((value, j) => ({ row: i, column: j, value }))
      )
    );

    svg
      .selectAll(".cell")
      .data(data)
      .join("rect")
      .attr("class", "cell")
      .attr("x", (d) => scale(matrix.identifiers[d.row]))
      .attr("y", (d) => scale(matrix.identifiers[d.column]))
      .attr("width", scale.bandwidth())
      .attr("height", scale.bandwidth())
      .attr("fill", (d) => (d.row === d.column ? "lightgray" : color(d.value)))
      .on("mouseenter", function (d) {
        d3.select(this).style("stroke", "#FD486E").style("stroke-width", 2);
        showTooltip(d);
      })
      .on("mouseleave", function () {
        d3.select(this).style("stroke", null);
        hideTooltip();
      });

    function showTooltip(d) {
      const state1 = matrix.identifiers[d.row],
        state2 = matrix.identifiers[d.column];

      const [x, y] = d3.mouse(div.node());
      tooltip
        .html(`Similarity: ${state1} to ${state2}: ${d.value.toFixed(2)}`)
        .style("top", y + "px")
        .style("left", x + 15 + "px");
      tooltip.style("display", null);
    }

    function hideTooltip() {
      tooltip.style("display", "none");
    }

    svg
      .selectAll(".row-label")
      .data(matrix.identifiers)
      .join("text")
      .attr("class", "row-label")
      .attr("x", margin.topAndLeft - 5)
      .attr("y", (d) => scale(d) + scale.bandwidth() / 2)
      .text((d) => d)
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .attr("font-size", "12px");

    svg
      .append("g")
      .attr("transform", `translate(0,${margin.topAndLeft}) rotate(-90)`)
      .selectAll(".column-label")
      .data(matrix.identifiers)
      .join("text")
      .attr("class", "column-label")
      .attr("x", 5)
      .attr("y", (d) => scale(d) + scale.bandwidth() / 2)
      .text((d) => d)
      .attr("dy", "0.35em")
      .attr("font-size", "12px");
  }

  useEffect(() => {
    if (d3Container.current) {
      Init();
    }
  }, [d3Container]);

  return (
    <div className="similarity" style={{ width: "100%" }}>
      <div
        ref={d3Container}
        style={{ position: "relative", width: "100%" }}
      ></div>
    </div>
  );
}

export default Timeline;
