import React, { useContext, useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import "./style.css";
import { OptionContext } from "../../context";
import mds from "../../utilities/mds";
import drawLine from "./drawLine";

function makeColorInterpolation(min, max, colors) {
  let color = d3
    .scaleLinear()
    .domain([min, 0, max])
    .range(colors)
    .interpolate(d3.interpolateHcl);

  return color;
}

//Functions

function TimeCurve(props) {
  const { options, setCurrentOption } = useContext(OptionContext);
  const d3Container = useRef(null);
  const [flat, setFlat] = useState(0.3);
  const [rough, setRough] = useState(1);
  const data = props.data;
  const id = props.id;
  const record = props.record;

  useEffect(() => {
    if (d3Container.current) {
      Init();
    }
  }, [d3Container, flat, rough, options.weather]);
  function Init() {
    let MARGIN,
      enter_points,
      height,
      indicators,
      links,
      links_data,
      max_x,
      max_y,
      min_x,
      min_y,
      points,
      points_data,
      svg,
      width,
      x,
      y;
    let svgEl = d3.select(d3Container.current);
    svgEl.html("");
    svg = svgEl.append("g");
    width = svgEl.node().getBoundingClientRect().width;

    height = svgEl.node().getBoundingClientRect().height;
    switch (options.weather) {
      case "temperature":
        var colors = makeColorInterpolation(-10, 30, [
          "#3d8bff",
          "#fff",
          "#e60b09",
        ]);
        svgEl.style("background", colors(record.med_tmp));
        break;
      case "precip1Hour":
        var colors = makeColorInterpolation(0, 0.5, [
          "#03045eff",
          "#023e8aff",
          "#0077b6ff",
          "#0096c7ff",
          "#00b4d8ff",
          "#48cae4ff",
          "#90e0efff",
          "#ade8f4ff",
          "#caf0f8ff",
        ]);
        svgEl.style("background", colors(record.med_pre));
        break;
      case "windSpeed":
        var colors = makeColorInterpolation(10, 30, [
          "#10002bff",
          "#240046ff",
          "#3c096cff",
          "#5a189aff",
          "#7b2cbfff",
          "#9d4eddff",
          "#c77dffff",
          "#e0aaffff",
        ]);
        console.log("f", id, record.med_win);
        svgEl.style("background", colors(record.med_win));
        break;
      default:
        break;
    }

    MARGIN = 8;
    let keys = [
      "t1",
      "t2",
      "t3",
      "t4",
      "t5",
      "t6",
      "t7",
      "t8",
      "t9",
      "t10",
      "t11",
      "t12",
      "t13",
      "t14",
      "t15",
      "t16",
      "t17",
      "t18",
      "t19",
      "t20",
      "t21",
      "t22",
      "t23",
      "t24",
    ];
    let { m } = data;
    points_data = mds(m);

    min_x = d3.min(points_data, function (d) {
      return d[0];
    });

    max_x = d3.max(points_data, function (d) {
      return d[0];
    });

    min_y = d3.min(points_data, function (d) {
      return d[1];
    });

    max_y = d3.max(points_data, function (d) {
      return d[1];
    });

    x = d3
      .scaleLinear()
      .domain([max_x, min_x])
      .range([MARGIN, width - MARGIN]);

    y = d3
      .scaleLinear()
      .domain([min_y, max_y])
      .range([MARGIN, height - MARGIN]);

    links_data = [];

    points_data.forEach(function (p1, i1) {
      var array;
      array = [];
      points_data.forEach(function (p2, i2) {
        if (i1 !== i2) {
          return array.push({
            source: p1,
            target: p2,
            dist: m[i1][i2],
          });
        }
      });
      return (links_data = links_data.concat(array));
    });

    drawLine(id, svg, points_data, flat, rough, x, y);

    points = svg.selectAll(".point").data(points_data);

    enter_points = points
      .enter()
      .append("g")
      .attr("class", "point")
      .attr("transform", function (d) {
        return "translate(" + x(d[0]) + "," + y(d[1]) + ")";
      });

    enter_points.append("circle").attr("r", 2).attr("opacity", 0.3);

    enter_points.append("circle").attr("r", 1);
  }
  return (
    <div className="timeCurve">
      <svg
        className="timecurvesmall"
        width={72}
        height={72}
        ref={d3Container}
      />
    </div>
  );
}

export default TimeCurve;
