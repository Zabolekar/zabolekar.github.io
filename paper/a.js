var x0 = 50,
    y0 = 550;

var origin = new Point(x0, y0)

var xAxis = new Path();
xAxis.strokeColor = "black";
xAxis.moveTo(origin);
xAxis.lineTo(origin + [ y0-x0, 0 ]);

var yAxis = new Path();
yAxis.strokeColor = "black";
yAxis.moveTo(origin);
yAxis.lineTo(origin + [ 0, x0-y0 ]);

var U1 = new Path();
U1.strokeColor = "black";


function onMouseMove(event) {
   var budget = new Path().removeOnMove();
   budget.strokeColor = "black";
   var x = (event.point.x - x0)*2 + x0,
       y = (event.point.y - y0)*2 + y0;
   budget.moveTo(new Point(x0, y));
   budget.lineTo(new Point(x, y0));
   var intersections = budget.getIntersections(xAxis).concat(budget.getIntersections(yAxis))
   for (var i = 0; i < intersections.length; i++) {
      new Path.Circle({
          center: intersections[i].point,
          radius: 5,
          strokeColor: "black",
          fillColor: "white"
      }).removeOnMove();
   }
}
