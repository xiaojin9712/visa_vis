// import React, { useContext, useRef, useEffect, useState } from "react";
// import * as d3 from "d3";
// import "./style.css";
// import { OptionContext } from "../../context";

// const numberMapMonth = [
//     "2018-03-28",
//     "2018-03-29",
//     "2018-03-17",
//     "2018-03-08",
//     "2018-03-15",
//     "2018-03-14",
//     "2018-03-13",
//     "2018-03-12",
//     "2018-03-11",
//     "2018-03-09",
//     "2018-03-31",
//     "2018-03-30",
//     "2018-03-19",
//     "2018-03-18",
//     "2018-03-01",
//     "2018-03-02",
//     "2018-03-03",
//     "2018-03-04",
//     "2018-03-05",
//     "2018-03-06",
//     "2018-03-07",
//     "2018-03-26",
//     "2018-03-27",
//     "2018-03-24",
//     "2018-03-25",
//     "2018-03-22",
//     "2018-03-23",
//     "2018-03-20",
//     "2018-03-21",
//     "2018-03-16",
//     "2018-03-10"
//   ];

// function Timeline(props) {
//   const { options, setCurrentOption } = useContext(OptionContext);
//   const d3Container = useRef(null);
//   const [selectedRange, setSelectedRange] = useState(options.month);

//   useEffect(() => {
//     if (d3Container.current) {
//         let margin = 30;
//         let radius = 270;
//         let dotRadius = 4;
//         let maxValue = 1;
//         let axisCircles = 2;
//         let wrapWidth = 60;
//         let axesLength = 8;
//         let axesDomain = ["Battery", "Brand", "Contract", "Design", "Internet", "Screen", "Price", "Smartphone"];
//         let formatPercent = d3.format(',.0%');
//         let axisLabelFactor = 1.12;
//         let color = d3.scaleOrdinal().range(["#EDC951","#CC333F","#00A0B0"]);
//         let rScale = d3.scaleLinear()
//         .domain([0, maxValue])
//         .range([0, radius]);
//         let angleSlice = Math.PI * 2 / axesLength;
//         let radarLine = d3.lineRadial()
//         .curve(d3["curveBasisClosed"])
//         .radius(d => rScale(d))
//         .angle((d, i) => i * angleSlice);

//         let svg = d3.select(d3Container.current);

//         let width = svg.node().getBoundingClientRect().width;

//         let height = svg.node().getBoundingClientRect().height;

//   const containerWidth = width-(margin*2);
//   const containerHeight = height-(margin*2);
//   const container = svg.append('g')
//     .attr("width", containerWidth)
//     .attr("height", containerHeight)
//     .attr('transform', `translate(${(width/2)+margin}, ${(height/2)+margin})`);

// 	var axisGrid = container.append("g")
//     .attr("class", "axisWrapper");

// 	axisGrid.selectAll(".levels")
// 	   .data(d3.range(1,(axisCircles+1)).reverse())
// 	   .enter()
//       .append("circle")
//       .attr("class", "gridCircle")
//       .attr("r", (d, i) => radius/axisCircles*d)
//       .style("fill", "#CDCDCD")
//       .style("stroke", "#CDCDCD")
//       .style("fill-opacity", 0.1);

// 	const axis = axisGrid.selectAll(".axis")
// 		.data(axesDomain)
// 		.enter()
//       .append("g")
//       .attr("class", "axis");

// 	axis.append("line")
// 		.attr("x1", 0)
// 		.attr("y1", 0)
// 		.attr("x2", (d, i) => rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2))
// 		.attr("y2", (d, i) => rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2))
// 		.attr("class", "line")
// 		.style("stroke", "white")
// 		.style("stroke-width", "2px");

// 	axis.append("text")
// 		.attr("class", "legend")
// 		.style("font-size", "11px")
// 		.attr("text-anchor", "middle")
//     .attr("font-family", "monospace")
//     .attr("dy", "0.35em")
// 		.attr("x", (d, i) => rScale(maxValue * axisLabelFactor) * Math.cos(angleSlice*i - Math.PI/2))
// 		.attr("y", (d, i) => rScale(maxValue * axisLabelFactor) * Math.sin(angleSlice*i - Math.PI/2))
// 		.text(d => d);

//   const plots = container.append('g')
//     .selectAll('g')
//     .data(data)
//     .join('g')
//       .attr("data-name", (d, i) => device(i))
//       .attr("fill", "none")
//       .attr("stroke", "steelblue");

//   plots.append('path')
//     .attr("d", d => radarLine(d.map(v => v.value)))
//     .attr("fill", (d, i) => color(i))
//     .attr("fill-opacity", 0.1)
//     .attr("stroke", (d, i) => color(i))
//     .attr("stroke-width", 2);

// 	plots.selectAll("circle")
// 		.data(d => d)
//     .join("circle")
// 		  .attr("r", dotRadius)
// 		  .attr("cx", (d,i) => rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2))
// 		  .attr("cy", (d,i) => rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2))
// 		  .style("fill-opacity", 0.8);
//     }
//   }, [d3Container]);

//   return (
//     <div className="radar">
//       <svg
//         className="d3-radar"
//         width={400}
//         height={400}
//         ref={d3Container}
//       />
//     </div>
//   );
// }

// export default Timeline;
