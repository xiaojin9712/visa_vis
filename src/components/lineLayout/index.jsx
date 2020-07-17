import React, { useContext, useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { OptionContext } from "../../context";
import dataSource from "../../data/day_tem_hourly_utl";
import { div } from "numeric";
import "./style.css";

const d = JSON.parse(dataSource);
let days = Object.keys(d);
let data = {};
for (let index = 0; index < days.length; index++) {
  const res = [];
  for (const key in d[days[index]]) {
    if (d[days[index]].hasOwnProperty(key)) {
      let i = {};
      i["date"] = key;
      i["value"] = d[days[index]][key];
      res.push(i);
    }
  }
  console.log("res", res);
  data[days[index]] = res;
}

function Timeline(props) {
  const { options, setCurrentOption } = useContext(OptionContext);
  const [gap, setGap] = useState(0);

  const d3Container = useRef(null);
  let margin = { top: 10, right: 110, bottom: 20, left: 40 };

  async function Init() {
    // let y2 = d3.scaleLinear().range([height2, 0]);
    // let x2 = d3.scaleTime().range([0, width]);

    let linechart = (key, res, index) => {
      const lineData = res.map((d) => {
        return { date: d3.isoParse(d.date), value: d.value };
      });

      let line_height = 100;
      let svgEl = d3
        .select(d3Container.current)
        .attr("height", Object.keys(data).length * line_height);
      let width = svgEl.node().getBoundingClientRect().width;
      let height2 = svgEl.node().getBoundingClientRect().height;

      const svg = svgEl
        .append("g")
        .attr("transform", `translate(0, ${index * line_height})`)
        .append("svg")
        .attr("width", width)
        .attr("height", line_height);

      const x = d3
        .scaleTime()
        .domain(d3.extent(lineData.map((d) => d.date)))
        .range([margin.left, width - margin.right]);

      const y = d3
        .scaleLinear()
        .domain(d3.extent(lineData.map((d) => d.value)))
        .range([line_height - margin.bottom, margin.top]);

      const line = d3
        .line()
        .defined((d) => d.value != null)
        .x((d) => x(d.date))
        .y((d) => y(d.value))
        .curve(d3.curveBasisOpen);

      const yAxis = (g) =>
        g
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(y).ticks(5, "d"))
          .call((g) => g.select(".domain").remove())
          .call((g) =>
            g
              .select(".tick:last-of-type text")
              .clone()
              .attr("x", 3)
              .attr("text-anchor", "start")
              .attr("font-weight", "bold")
              .text(lineData.value)
          );

      const xAxis = (g) =>
        g.attr("transform", `translate(0,${line_height - margin.bottom})`).call(
          d3
            .axisBottom(x)
            .ticks(width / 60)
            .tickSizeOuter(0)
        );

      svg.append("g").call(xAxis);
      svg.append("g").call(yAxis);

      svg
        .append("path")
        .datum(lineData)
        .attr("fill", "none")
        .attr("stroke", "#391D71")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", (d) => {
          return line(
            d.sort((a, b) => {
              return a.date - b.date;
            })
          );
        });

      //   const quartiles = [0.25, 0.5, 0.75].map((q) =>
      //     d3.quantile(lineData.map((d) => d.value).sort(), q)
      //   );

      //   svg
      //     .append("rect")
      //     .attr("y", y(quartiles[2]))
      //     .attr("x", margin.left)
      //     .attr("width", width - margin.right - margin.left)
      //     .attr("height", y(quartiles[0]) - y(quartiles[2]))
      //     .style("opacity", 0.2);

      //   svg
      //     .append("line")
      //     .attr("y1", y(quartiles[1]))
      //     .attr("y2", y(quartiles[1]))
      //     .attr("x1", margin.left)
      //     .attr("x2", width - margin.right)
      //     .attr("stroke-width", 1)
      //     .attr("stroke", "black");

      svg
        .append("foreignObject")
        .attr("x", width - margin.right)
        .attr("y", margin.top)
        .attr("width", 100)
        .attr("height", line_height)
        .attr("class", "label")
        .attr("id", key);
      // .insert("xhtml:div")
      // .html("jjj");
      document.getElementById(key).innerHTML = label(key);
      if (!document.getElementById("window")) {
        setGap(Math.abs(x(lineData[0].date) - x(lineData[1].date)));
        svgEl
          .append("rect")
          .attr("id", "window")
          .attr("y", margin.top)
          .attr("x", x(lineData[options.selectedPoint].date))
          .attr("width", Math.abs(x(lineData[0].date) - x(lineData[1].date)))
          .attr("height", height2);
        //   .style("opacity", 0.2);
      }
    };

    let index = 0;
    let keys = Object.keys(data).sort((a, b) => new Date(a) - new Date(b));
    keys.forEach((key) => {
      linechart(key, data[key], index);
      index += 1;
    });
  }

  function label(key) {
    return `<div class="line-label">
    ${key}
    <input type="checkbox" name="check" id=${key} checked data-key=${key}/>
    </div>`;
  }

  function handleChange(e) {
    console.log("change", e);
  }

  useEffect(() => {
    if (d3Container.current) {
      Init();
    }
  }, [d3Container]);

  useEffect(() => {
    if (d3Container.current) {
      let svgEl = d3.select(d3Container.current);

      svgEl
        .select("#window")
        .attr("x", options.selectedPoint * gap + margin.left);
    }
  }, [d3Container, options.selectedPoint, gap]);

  return (
    <div className="lineLayout">
      <svg className="d3-small" ref={d3Container} />
    </div>
  );
}

export default Timeline;
