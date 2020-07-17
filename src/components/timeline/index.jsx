import React, { useContext, useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import "./style.css";
import { OptionContext } from "../../context";

const numberMapMonth = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};

function Timeline(props) {
  const { options, setCurrentOption } = useContext(OptionContext);
  const d3Container = useRef(null);
  const [selectedRange, setSelectedRange] = useState(options.month);

  useEffect(() => {
    if (d3Container.current) {
      let margin = {
        top: 30,
        bottom: 30,
        left: 20,
        right: 20,
      };
      let svg = d3.select(d3Container.current);
      svg.html("");

      let width = svg.node().getBoundingClientRect().width;
      console.log("ed", width);

      let height = svg.node().getBoundingClientRect().height;

      let size = {
        w: width - margin.left - margin.right,
        h: height - margin.top - margin.bottom,
      };
      let colors = {
        handle: "#FD486E",
        bar: "#391D71",
      };

      let barHeight = size.h / 3;

      let mydata = d3.range(1, 13).reduce((acc, d) => {
        acc[d] = 1;
        return acc;
      }, {});

      let stackData = d3.stack().keys(Object.keys(mydata))([mydata]);

      let xScale = d3
        .scaleLinear()
        .range([0, size.w])
        .domain([
          0,
          Object.keys(mydata).reduce((acc, d) => {
            return acc + mydata[d];
          }, 0),
        ]);

      let xAxis = d3
        .axisBottom()
        .scale(xScale)
        .tickValues(stackData.filter((d, i) => !(i % 1)).map((d) => d[0][0]))
        .tickFormat((d) => {
          const key = stackData.find((v) => v[0][0] == d).key;
          return numberMapMonth[key];
        });

      let stacked_snappedSelection = function (scale, domain) {
        const first = domain[0],
          last = domain[domain.length - 1];
        return [scale(first[0][0]), scale(last[0][1])];
      };

      let stacked_filteredDomain = function (data, min, max = min) {
        const filteredMin = data.find((d) => d[0][0] <= min && d[0][1] >= min);
        const filteredMax = data.find((d) => d[0][0] <= max && d[0][1] >= max);
        if (filteredMin !== undefined && filteredMax !== undefined) {
          let iMin = filteredMin.index,
            iMax = filteredMax.index + 1;
          return data.slice(iMin, iMax);
        } else {
          return data;
        }
      };

      let stacked_brushing = function () {
        if (!d3.event.sourceEvent) return;
        const s0 = d3.event.selection
            ? d3.event.selection
            : [1, 2].fill(d3.event.sourceEvent.offsetX - margin.left),
          d0 = s0.map(xScale.invert),
          d1 = stacked_filteredDomain(stackData, ...d0);
        let s1 = s0;

        if (d3.event.sourceEvent && d3.event.type === "end") {
          s1 = stacked_snappedSelection(xScale, d1);
          d3.select(this).transition().call(d3.event.target.move, s1);
        }

        // move handlers
        d3.selectAll("g.handles").attr("transform", (d) => {
          const x = d == "handle--o" ? s1[0] : s1[1];
          return `translate(${x}, 0)`;
        });

        // update labels
        d3.selectAll("g.handles")
          .selectAll("text")
          .attr("dx", (d) => (d1.length > 1 ? 0 : (s1[1] - s1[0]) / 2))
          .text((d) => {
            let year;
            if (d1.length > 1) {
              year =
                d == "handle--o"
                  ? numberMapMonth[d1[0].key]
                  : numberMapMonth[d1[d1.length - 1].key];
            } else {
              year = d == "handle--o" ? numberMapMonth[d1[0].key] : "";
            }
            return year;
          });
        // update bars class
        // d3.selectAll(".bar").attr("opacity", (d) => (d1.includes(d) ? 1 : 0.2));
        if (d3.event.sourceEvent && d3.event.type === "end") {
          setSelectedRange([d1[0].key, d1[d1.length - 1].key]);
          setCurrentOption({
            ...options,
            month: [d1[0].key, d1[d1.length - 1].key],
          });
        }
      };

      let brush = d3
        .brushX()
        .handleSize(8)
        .extent([
          [0, 0],
          [size.w, size.h],
        ])
        .on("start brush end", stacked_brushing);

      let triangle = d3.symbol().size(100).type(d3.symbolTriangle);
      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      // x axis
      g.append("g")
        .attr("transform", `translate(0, ${size.h + 5})`)
        .call(xAxis);

      // Bars
      g.selectAll("rect")
        .data(stackData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", (size.h - barHeight) / 2)
        .attr("height", barHeight)
        .attr("x", (d) => xScale(d[0][0]))
        .attr("width", (d) => xScale(d[0][1] - d[0][0]))
        .attr("fill", colors.bar)
        .attr("stroke", "#ffffff")
        .attr("opacity", 1);

      // Append brush
      const gBrush = g
        .append("g")
        .call(brush)
        .call(brush.move, [
          xScale(selectedRange[0] - 1),
          xScale(selectedRange[1]),
        ]); //change
      // Custom handlers
      // Handle group
      const gHandles = gBrush
        .selectAll("g.handles")
        .data(["handle--o", "handle--e"])
        .enter()
        .append("g")
        .attr("class", (d) => `handles ${d}`)
        .attr("fill", colors.handle)
        .attr("transform", (d) => {
          const x =
            d == "handle--o"
              ? xScale(selectedRange[0] - 1)
              : xScale(selectedRange[1]); // change
          return `translate(${x}, 0)`;
        });

      // Label
      gHandles
        .selectAll("text")
        .data((d) => [d])
        .enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", -10)
        .text((d) => {
          console.log(d);
          return d == "handle--o"
            ? numberMapMonth[selectedRange[0]] //change
            : numberMapMonth[selectedRange[1]];
        });

      // Triangle
      gHandles
        .selectAll(".triangle")
        .data((d) => [d])
        .enter()
        .append("path")
        .attr("class", (d) => `triangle ${d}`)
        .attr("d", triangle)
        .attr("transform", (d) => {
          const x = d == "handle--o" ? -6 : 6,
            rot = d == "handle--o" ? -90 : 90;
          return `translate(${x}, ${size.h / 2}) rotate(${rot})`;
        });

      // Visible Line
      gHandles
        .selectAll(".line")
        .data((d) => [d])
        .enter()
        .append("line")
        .attr("class", (d) => `line ${d}`)
        .attr("x1", 0)
        .attr("y1", -5)
        .attr("x2", 0)
        .attr("y2", size.h + 5)
        .attr("stroke", colors.handle);
    }
  }, [d3Container]);

  function getLastDay(year, month) {
    console.log(month);
    let current_datetime = new Date(year, month, 0);
    let formatted_date =
      current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1);
    return formatted_date;
  }
  function getFirstDay(year, month) {
    let current_datetime = new Date(year, month, 1);
    let formatted_date =
      current_datetime.getFullYear() + "-" + current_datetime.getMonth();
    return formatted_date;
  }
  return (
    <div className="timeline">
      <p>
        Selected date:{" "}
        <span>
          {getFirstDay(options.year, selectedRange[0])} --{" "}
          {getLastDay(options.year, selectedRange[1])}{" "}
        </span>
      </p>
      <svg
        className="d3-component"
        width="100%"
        height={100}
        ref={d3Container}
      />
    </div>
  );
}

export default Timeline;
