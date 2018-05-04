// require("./lib/ads");
var $ = require("./lib/qsa");

// Pre-process data:
// * add a months array based on the dates specified
// * split category field into an array
// * create a timestamps object for scheduling
window.eventData.forEach(function(row) {
  row.timestamps = {};
  if (row.date) {
    var [m, d, y] = row.date.split("/").map(Number);
    row.months = [ m ];
    row.timestamps.date = new Date(y, m - 1, d, 0);
  } else {
    var start = [5, 1, 2018];
    var end = [9, 30, 2018];
    if (row.start) {
      start = row.start.split("/").map(Number);
    }
    if (row.end) {
      end = row.end.split("/").map(Number);
    }
    var [ startMonth ] = start;
    var [ endMonth ] = end;
    row.months = [];
    for (var i = startMonth; i <= endMonth; i++) row.months.push(i);
    row.timestamps = {
      start: new Date(start[2], start[0] - 1, start[1], 0),
      end: new Date(end[2], end[0] - 1, end[1], 24) 
    }
  }

  row.categories = row.category ? row.category.split(" ") : [];
});

require("./list")();
require("./planner");

$("[data-tab]").forEach(a => a.addEventListener("click", function() {
  var selector = `.tab.${this.getAttribute("data-tab")}`;
  $.one(".tab.selected").classList.remove("selected");
  $.one(selector).classList.add("selected");
}));