import * as d3 from "d3";

function makeColorInterpolation(min, max, colors) {
  let color = d3
    .scaleLinear()
    .domain([min, 0, max])
    .range(colors)
    .interpolate(d3.interpolateHcl);

  return color;
}

export default makeColorInterpolation;

// temperature
// 3d8bff

// e60b09
// perception

// 9fccfa

// 0974f1

// wind speed
// 60efff

// 0061ff
