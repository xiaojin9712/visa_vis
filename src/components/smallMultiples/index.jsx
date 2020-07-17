import React, { useContext, useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import "./style.css";
import { OptionContext } from "../../context";

function Timeline(props) {
  const { options, setCurrentOption } = useContext(OptionContext);
  const d3Container = useRef(null);

  async function Init() {
    const data = props.data;
    let margin = {
      top: 20,
      bottom: 20,
      left: 30,
      right: 30,
    };
    let svg = d3.select(d3Container.current);

    let width = svg.node().getBoundingClientRect().width;

    let height = svg.node().getBoundingClientRect().height;
    // let y = d3
    //   .scaleLinear()
    //   .domain([d3.min(data, (d) => d.value), d3.max(data, (d) => d.value)])
    //   .nice()
    //   .range([height - margin.bottom, margin.top]);
    let y = d3
      .scaleLinear()
      .domain([-6, d3.max(data, (d) => d.value)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    let x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date).map((i) => new Date(i)))
      .range([margin.left, width - margin.right]);

    let yAxis = (g) =>
      g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(width / 80))
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g
            .select(".tick:last-of-type text")
            .clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(data.y)
        );
    let xAxis = (g) =>
      g.attr("transform", `translate(0,${height - margin.bottom})`).call(
        d3
          .axisBottom(x)
          .ticks(width / 80)
          .tickSizeOuter(0)
      );

    let line = d3
      .line()
      .defined((d) => !isNaN(d.value))
      .x((d) => {
        return x(new Date(d.date));
      })
      .y((d) => y(d.value));
    svg.append("g").call(xAxis);

    svg.append("g").call(yAxis);

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#391D71")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", (d) => {
        return line(
          d.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
          })
        );
      });
  }

  useEffect(() => {
    if (d3Container.current) {
      Init();
    }
  }, [d3Container]);

  return (
    <div className="small">
      <svg className="d3-small" width={120} height={120} ref={d3Container} />
      <p>{props.date}</p>
    </div>
  );
}

export default Timeline;
