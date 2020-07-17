import React, { useContext, useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import style from "./style.module.css";
import Small from "../smallMultiples";
import { OptionContext } from "../../context";
import dataSource from "../../data/day_tem_hourly";

function format() {
  const d = JSON.parse(dataSource);
  let days = Object.keys(d);
  let res = [];
  for (const key in d[days[0]]) {
    if (d[days[0]].hasOwnProperty(key)) {
      let i = {};
      i["date"] = `${days[0]} ${key}`;
      i["value"] = d[days[0]][key];
      res.push(i);
    }
  }
  console.log("d", res);
  return res;
}

function Timeline(props) {
  const { options, setCurrentOption } = useContext(OptionContext);
  //   const d3Container = useRef(null);

  //   async function Init() {
  //     const data = format();
  //     let margin = {
  //       top: 30,
  //       bottom: 30,
  //       left: 20,
  //       right: 20,
  //     };
  //     let svg = d3.select(d3Container.current);

  //     let width = svg.node().getBoundingClientRect().width;

  //     let height = svg.node().getBoundingClientRect().height;
  //     let y = d3
  //       .scaleLinear()
  //       .domain([d3.min(data, (d) => d.value), d3.max(data, (d) => d.value)])
  //       .nice()
  //       .range([height - margin.bottom, margin.top]);

  //     let x = d3
  //       .scaleTime()
  //       .domain(d3.extent(data, (d) => d.date).map((i) => new Date(i)))
  //       .range([margin.left, width - margin.right]);

  //     let yAxis = (g) =>
  //       g
  //         .attr("transform", `translate(${margin.left},0)`)
  //         .call(d3.axisLeft(y))
  //         .call((g) => g.select(".domain").remove())
  //         .call((g) =>
  //           g
  //             .select(".tick:last-of-type text")
  //             .clone()
  //             .attr("x", 3)
  //             .attr("text-anchor", "start")
  //             .attr("font-weight", "bold")
  //             .text(data.y)
  //         );
  //     let xAxis = (g) =>
  //       g.attr("transform", `translate(0,${height - margin.bottom})`).call(
  //         d3
  //           .axisBottom(x)
  //           .ticks(width / 80)
  //           .tickSizeOuter(0)
  //       );

  //     let line = d3
  //       .line()
  //       .defined((d) => !isNaN(d.value))
  //       .x((d) => {
  //         return x(new Date(d.date));
  //       })
  //       .y((d) => y(d.value));
  //     console.log("see", line);
  //     svg.append("g").call(xAxis);

  //     svg.append("g").call(yAxis);

  //     svg
  //       .append("path")
  //       .datum(data)
  //       .attr("fill", "none")
  //       .attr("stroke", "steelblue")
  //       .attr("stroke-width", 1.5)
  //       .attr("stroke-linejoin", "round")
  //       .attr("stroke-linecap", "round")
  //       .attr("d", (d) => {
  //         return line(
  //           d.sort((a, b) => {
  //             return new Date(a.date) - new Date(b.date);
  //           })
  //         );
  //       });
  //   }

  //   useEffect(() => {
  //     if (d3Container.current) {
  //       Init();
  //     }
  //   }, [d3Container]);

  const d = JSON.parse(dataSource);
  let days = Object.keys(d);
  let data = {};
  for (let index = 0; index < days.length; index++) {
    const res = [];
    for (const key in d[days[index]]) {
      if (d[days[index]].hasOwnProperty(key)) {
        let i = {};
        i["date"] = `${days[index]} ${key}`;
        i["value"] = d[days[index]][key];
        res.push(i);
      }
    }
    data[days[index]] = res;
  }

  return (
    <div className={style.smallLayout}>
      {Object.keys(data).map(function (key, index) {
        return <Small key={key} data={data[key]} date={key} />;
      })}
    </div>
  );
}

export default Timeline;
