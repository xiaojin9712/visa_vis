// how to draw curve
function gradient(a, b) {
  return (b.y - a.y) / (b.x - a.x);
}
function drawLine(id, svg, points_data, f, t, x, y) {
  console.log("hhh");

  if (typeof f == "undefined") f = 0.3;
  if (typeof t == "undefined") t = 0.6;
  let pathdata = "M" + x(points_data[0][0]) + "," + y(points_data[0][1]);
  let points = points_data.map((d) => {
    return {
      x: x(d[0]),
      y: y(d[1]),
    };
  });
  let preP = points[0];
  var m = 0;
  var dx1 = 0;
  var dy1 = 0;
  var dx2 = 0;
  var dy2 = 0;
  for (var i = 1; i < points.length; i++) {
    // var curP = points[i];
    // let nexP = points[i + 1];
    // if (nexP) {
    //   m = gradient(preP, nexP);
    //   dx2 = (nexP.x - curP.x) * -f;
    //   dy2 = dx2 * m * t;
    // } else {
    //   dx2 = 0;
    //   dy2 = 0;
    // }
    // pathdata += ` C${preP.x - dx1},${preP.y - dy1} ${curP.x + dx2}, ${
    //   curP.y + dy2
    // } ${curP.x}, ${curP.y}`;
    // dx1 = dx2;
    // dy1 = dy2;
    // preP = curP;
    var curP = points[i];
    pathdata += ` L${curP.x}, ${curP.y}`;
  }

  if (svg.select("#path")) {
    svg.select("#path").remove();
  }
  svg
    .append("path")
    .attr("id", id)
    .attr("class", "movepath")
    .attr("d", pathdata)
    .attr("fill", "transparent")
    .attr("stroke", "white")
    .attr("stroke-width", 1);
  var path = document.getElementById(id);
  var length = path.getTotalLength();
  path.style.color = "red";
  path.style.strokeDashoffset = length + 1000;
  path.style.strokeDasharray = length;
}

export default drawLine;
