const width = 1350,
      height = 500,
      n = 50; // smaller n is faster, larger n is more interesting

const leg_raw = [{x:0, y: 40},
                 {x: 20, y: 40},
                 {x: 30, y: 50},
                 {x: 40, y: 60},
                 {x: 60, y: 80},
                 {x: 80, y: 110},
                 {x: 90, y: 130},
                 {x: 60, y: 130},
                 {x: 50, y: 130},
                 {x: 40, y: 150},
                 {x: 50, y: 110},
                 {x: 60, y: 90},
                 {x: 70, y: 70},
                 {x: 60, y: 50},
                 {x: 40, y: 50},
                 {x: 20, y: 50},
                 {x:0, y: 40}],
      eye_raw = [{x: 0, y: -20},
                 {x: 0, y: -25},
                 {x: 5, y: -25},
                 {x: 5, y: -20},
                 {x: 0, y: -20}],
      hand_raw = [{x:0, y: 0},
                  {x: 5, y: 0},
                  {x: 10, y: 0},
                  {x: 10, y: 5},
                  {x: 15, y: 10},
                  {x: 30, y: 20},
                  {x: 25, y: 25},
                  {x: 15, y: 15},
                  {x: 15, y: 25},
                  {x: 10, y: 30},
                  {x: 15, y: 20},
                  {x: 15, y: 15},
                  {x: 20, y: 10},
                  {x: 15, y: 0},
                  {x: 10, y: 0},
                  {x:0, y: 0}];

var exponates = d3.range(1, n+1).map(function(i) {
   with (Math) {
      function randomize (o) {
         return {x: o.x+5*random(), y: o.y+5*random()};
      }

      var x0 = width * i/5,
          y0 = height * (0.5 + (random()*0.2-0.1)),
          r1 = 20,
          r2 = 80,
          leftRibs = d3.range(PI/2, 3*PI/2, PI/80).map(function(phi) {
             return random() > 0.5+(i-1)/(2*n) ? 0 : phi}).map(function(phi) {
                return {x: max(min(phi == 0 ? 0 : ((i-1)/(2*n)+1)*r2*cos(phi),
                                   random() > 0.5 ? 80 : 60),
                               random() > 0.5 ? -80 : -60),
                        y: ((phi == 0) ? 0 : 1.5*r2*sin(phi)+random())};
          }),
          leg = leg_raw.map(function (o) {
             return {
                x: (o.x+random()*50*(i-1)/n)/pow(i, 0.3),
                y: (o.y+random()*50*(i-1)/n)/pow(i, 0.3)+10
             };
          }),
          spine = d3.range(-20,20).map(function(j) {
             return {x: x0+5*sin(5*j)+random(),
                   y: y0+j+random()};
          }),
          head = d3.range(PI/2, 3*PI/2, PI/20).map(function(phi) {
             return {x: -15*cos(phi)*(1-(i-1)/(n-1)+(i-1)/(n-1)*(sin(phi)+3)),
                      y: 15*sin(phi)-20};
          }),
          eye = eye_raw.map(randomize),
          hand = hand_raw.map(randomize);

      function offset (o) {
         return {x: x0+o.x, y: y0+o.y};
      }
 
      function symmetrize (data) {
         return data.concat([...data].reverse().map(o => ({x: -o.x, y: o.y}))).map(offset);
      }

      return {
         ribs: symmetrize(leftRibs),
         plate: d3.range(0, 2*PI, PI/36).map(function(phi){
            return {x: x0+max(min(r1*cos(phi)*(sin(phi)+4*(i-1)/n), 50), -50),
                    y: y0+Math.pow(i, 0.2)*r1*sin(phi)};
         }),
         legs: symmetrize(leg),
         spine: spine,
         hands: symmetrize(hand),
         head: symmetrize(head),
         eyes: symmetrize(eye)
      };
   }
});

var svg = d3.select("body #gallery").append("svg").attr("width", width).attr("height", height).on("mousedown", () => { v_x = -100; }).on("mouseup", () => { v_x = -1; });
var g = svg.selectAll("g").data(exponates).enter().append("g");

["ribs", "legs", "plate", "spine", "hands", "head", "eyes"].forEach(function (s) {
   g.append("path").datum(d => d[s]).attr("class", s);
})

//Moving slowly to the left
var v_x = -1,
    position = 0, 
    everything = g.selectAll("path");

d3.timer(function(time) {
  position += v_x;
  everything.attr("d", lineFunction).attr("transform", "translate(" + position + ",0)");
});

var lineFunction = d3.svg.line().x(d => d.x).y(d => d.y).interpolate("basis");
