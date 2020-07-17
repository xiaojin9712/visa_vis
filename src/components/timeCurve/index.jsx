import React, { useContext, useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import "./style.css";
import { OptionContext } from "../../context";
import data from "../../data/timeCurve_demo";
import mds from "../../utilities/mds";
import Slider from "@material-ui/core/Slider";

//Functions
import drawLine from "./drawLine";
import { Button } from "@material-ui/core";

function TimeCurve(props) {
  const { options, setCurrentOption } = useContext(OptionContext);
  const d3Container = useRef(null);
  const [flat, setFlat] = useState(0.3);
  const [rough, setRough] = useState(1);

  useEffect(() => {
    if (d3Container.current) {
      Init();
    }
  }, [d3Container, flat, rough]);
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

    MARGIN = 100;
    let { keys, m } = data;
    points_data = mds(m);

    svgEl.call(
      d3
        .zoom()
        .extent([
          [0, 0],
          [width, height],
        ])
        .scaleExtent([1, 2])
        .on("zoom", zoomed)
    );

    function zoomed() {
      svg.attr("transform", d3.event.transform);
    }

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

    drawLine(svg, points_data, flat, rough, x, y);

    points = svg.selectAll(".point").data(points_data);

    enter_points = points
      .enter()
      .append("g")
      .attr("class", "point")
      .attr("transform", function (d) {
        return "translate(" + x(d[0]) + "," + y(d[1]) + ")";
      });

    enter_points.append("circle").attr("r", 6).attr("opacity", 0.3);

    enter_points.append("circle").attr("r", 4);

    enter_points
      .append("text")
      .text(function (d, i) {
        return keys[i];
      })
      .attr("y", 12)
      .attr("dy", "0.35em");

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

    // svg
    //   .append("line")
    //   .attr("class", "link visible")
    //   .attr("x1", 0)
    //   .attr("y1", height / 2)
    //   .attr("x2", width)
    //   .attr("y2", height / 2);

    // svg
    //   .append("line")
    //   .attr("class", "link visible xa")
    //   .attr("x1", width / 2)
    //   .attr("y1", 0)
    //   .attr("x2", width / 2)
    //   .attr("y2", height);
  }
  return (
    <div className="timeCurve">
      <div className="tc-config">
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
      </div>
      <svg className="timecurve" width={800} height={450} ref={d3Container} />
    </div>
  );
}

export default TimeCurve;
