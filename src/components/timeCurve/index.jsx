import React, { useContext, useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import * as d3Annotation from "d3-svg-annotation";
import "./style.css";
import { OptionContext } from "../../context";
// import data from "../../data/timeCurve_demo";
import mds from "../../utilities/mds";
import Slider from "@material-ui/core/Slider";

//Functions
import drawLine from "./drawLine";
import { Button } from "@material-ui/core";
import { values } from "d3";

function TimeCurve(props) {
  const { options, setCurrentOption } = useContext(OptionContext);
  const d3Container = useRef(null);
  const [flat, setFlat] = useState(0.3);
  const [rough, setRough] = useState(1);
  const { data, id, width, height } = props;

  useEffect(() => {
    if (d3Container.current) {
      Init();
    }
  }, [d3Container, flat, rough, id]);
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

    var linearGradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "demoLine")
      .attr("gradientTransform", "rotate(90)");

    linearGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#f00");

    linearGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#fff");

    width = svgEl.node().getBoundingClientRect().width;

    height = svgEl.node().getBoundingClientRect().height;

    MARGIN = 100;
    let keys = [
      "00:20:00",
      "01:20:00",
      "02:20:00",
      "03:20:00",
      "04:20:00",
      "05:20:00",
      "06:20:00",
      "07:20:00",
      "08:20:00",
      "09:20:00",
      "10:20:00",
      "11:20:00",
      "12:20:00",
      "13:20:00",
      "14:20:00",
      "15:20:00",
      "16:20:00",
      "17:20:00",
      "18:20:00",
      "19:20:00",
      "20:20:00",
      "21:20:00",
      "22:20:00",
      "23:20:00",
    ];
    let { m, v } = data;
    points_data = mds(m, 2);
    console.log("lets see", points_data);
    // svgEl.call(
    //   d3
    //     .zoom()
    //     .extent([
    //       [0, 0],
    //       [width, height],
    //     ])
    //     .scaleExtent([1, 2])
    //     .on("zoom", zoomed)
    // );

    // function zoomed() {
    //   svg.attr("transform", d3.event.transform);
    // }

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

    links = svg.selectAll(".link").data(links_data);
    let enter_links = links
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("x1", function (d) {
        return x(d.source[0]);
      })
      .attr("y1", function (d) {
        return y(d.source[1]);
      })
      .attr("x2", function (d) {
        return x(d.target[0]);
      })
      .attr("y2", function (d) {
        return y(d.target[1]);
      });

    drawLine(svg, points_data, flat, rough, x, y, id);

    points = svg.selectAll(".point").data(points_data);

    enter_points = points
      .enter()
      .append("g")
      .attr("class", "point")
      .attr("transform", function (d) {
        return "translate(" + x(d[0]) + "," + y(d[1]) + ")";
      });

    enter_points
      .append("circle")
      .attr("r", (d, i) => {
        return v[keys[i]] * 6 + 2;
      })
      .attr("stroke", "black")
      .attr("fill", (d, i) => {
        return "rgba(255,204,0, " + v[keys[i]] + ")";
      });

    // enter_points.append("circle").attr("r", 4);

    // enter_points
    //   .append("text")
    //   .text(function (d, i) {
    //     return keys[i];
    //   })
    //   .attr("y", 12)
    //   .attr("dy", "0.35em");

    enter_points.append("title").text(function (d, i) {
      return d[0] + ", " + d[1];
    });

    // indicators = svg.selectAll(".indicator").data(links_data);

    // let enter_indicators = indicators
    //   .enter()
    //   .append("circle")
    //   .attr("class", "indicator")
    //   .attr("r", 5)

    //   .attr("cx", function (d) {
    //     var mul;
    //     mul =
    //       d.dist /
    //       Math.sqrt(
    //         Math.pow(d.target[1] - d.source[1], 2) +
    //           Math.pow(d.target[0] - d.source[0], 2)
    //       );
    //     return x(d.source[0]) + mul * (x(d.target[0]) - x(d.source[0]));
    //   })

    //   .attr("cy", function (d) {
    //     var mul;
    //     mul =
    //       d.dist /
    //       Math.sqrt(
    //         Math.pow(d.target[1] - d.source[1], 2) +
    //           Math.pow(d.target[0] - d.source[0], 2)
    //       );
    //     return y(d.source[1]) + mul * (y(d.target[1]) - y(d.source[1]));
    //   });

    enter_points.on("click", function (d, i) {
      setCurrentOption({
        ...options,
        selectedPoint: i,
      });
      enter_links.classed("visible", function (l) {
        return l.source === d;
      });
      // return enter_indicators.classed("visible", function (l) {
      //   return l.source === d;
      // });
    });

    // const annotations = [
    //   {
    //     note: { label: "Hiuiuiuiui" },
    //     x: 200,
    //     y: 200,
    //     ny: 300,
    //     nx: 200,
    //     subject: { radius: 50, radiusPadding: 10 },
    //   },
    // ];

    const LABEL_MARGIN = 40;
    let x_label = d3
      .scaleLinear()
      .domain([0, 23])
      .range([LABEL_MARGIN, width - LABEL_MARGIN]);

    let labels = svg.selectAll(".rect").data(keys);
    labels
      .enter()
      .append("rect")
      .attr("x", (d, i) => {
        return x_label(i);
      })
      .attr("y", (d, i) => {
        return height - LABEL_MARGIN;
      })
      .attr("width", (width - LABEL_MARGIN) / 24 - 5)
      .attr("height", 20)
      .attr("fill", "transparent");

    const annotations = points_data.map((d, i) => {
      return {
        note: {
          padding: 5,
          title: keys[i].substr(0, 2),
        },
        x: x(d[0]),
        y: y(d[1]),
        nx: x_label(i) + 5,
        ny: height - LABEL_MARGIN,
        className: "show-bg",
        connector: { end: "arrow", curve: d3.curveBasis, points: 2 },
        subject: { radius: 20, radiusPadding: 10 },
      };
    });

    const makeAnnotations = d3Annotation
      .annotation()
      // .editMode(true)
      .type(d3Annotation.annotationCalloutCurve)
      .annotations(annotations)
      // .on("noteover", function (annotation) {
      //   annotation.type.a
      //     .selectAll("g.annotation-connector, g.annotation-note")
      //     .classed("highlight", true);
      // })
      // .on("noteout", function (annotation) {
      //   annotation.type.a
      //     .selectAll("g.annotation-connector, g.annotation-note")
      //     .classed("highlight", false);
      // })
      .on("noteclick", function (annotation) {
        annotation.type.a
          .selectAll("g.annotation-connector, g.annotation-note")
          .classed("highlight", true);
      });
    svgEl
      .append("g")
      .attr("class", "annotation-group")
      .style("font-size", "0.6rem")
      .call(makeAnnotations);
    svgEl
      .selectAll("g.annotation-connector, g.annotation-note")
      .classed("highlight", false);
  }
  return (
    <div className="timeCurve">
      {/* <div className="tc-config">
        <div className="tc-item">
          <p>
            <span>F: </span>
            <span>{flat}</span>
          </p>
          <Slider
            value={flat}
            onChange={(e, v) => {
              setFlat(v);
            }}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={0.1}
            marks
            min={0}
            max={1}
          />
        </div>
        <div className="tc-item">
          <p>
            <span>T: </span>
            <span>{rough}</span>
          </p>
          <Slider
            value={rough}
            onChange={(e, v) => {
              setRough(v);
            }}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={0.1}
            marks
            min={0}
            max={1}
          />
        </div>
        <Button color="primary" variant="contained" size="small" onClick={Init}>
          Reset
        </Button>
      </div> */}
      <svg
        className="timecurve"
        width={width}
        height={height}
        ref={d3Container}
      />
    </div>
  );
}

export default TimeCurve;
