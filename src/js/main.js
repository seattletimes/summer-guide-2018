require("./lib/ads");
var paywall = require("./lib/paywall");
setTimeout(() => paywall(10832177), 3000);


var $ = require("./lib/qsa");
// Pre-process data:
// * add a months array based on the dates specified
// * split category field into an array
// * create a timestamps object for scheduling
var preprocessData = function(row) {
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
  row.timestamps.key = row.timestamps.date || row.timestamps.start;
  if (!row.date && !row.start && !row.end) { // stick "forever" events at the end of the list
    row.timestamps.key = row.timestamps.end;
  }
  row.timestamps.endKey = row.timestamps.end || row.timestamps.date;
  row.url = row.url ? row.url.trim() : "";

  row.categories = row.category ? row.category.split(" ") : [];
  row.quadrants = row.quadrant ? row.quadrant.toLowerCase().split(" ") : [];
};
eventData.forEach(preprocessData);
eventData.sort((e1, e2) => e1.timestamps.key - e2.timestamps.key);
recsData.forEach(preprocessData);

require("./list");
