var $ = require("./lib/qsa");
var dot = require("./lib/dot");
var { intersects, padLeft, filterCategories } = require("./util");

var planTemplate = dot.compile(require("./_itinerary.html"));

var goButton = $.one(".generate-itinerary");
var quadrantSelect = $.one(`[name="quadrant"]`);
var dateInput = $.one(`[name="date"]`);
var resultList = $.one(".itinerary-results ul");

var today = new Date();
dateInput.value = `${today.getFullYear()}-${padLeft(today.getMonth() + 1, 2)}-${padLeft(today.getDate(), 2)}`;

var eventsAndRecs = eventData.concat(recsData);

var filterQuadrant = function(list, quadrant) {
  var filtered = list.filter(e => e.quadrant == quadrant);
  // get and concat food, attractions, etc.
  return filtered;
};

var filterDate = function(list, day = new Date()) {
  return list.filter(function(item) {
    if (item.timestamps.date) {
      return item.timestamps.date == day;
    }
    return item.timestamps.start < day && item.timestamps.end > day;
  });
};

var drawItem = function(list) {
  return list[(list.length * Math.random()) | 0];
};

var getItem = function(filters) {
  var eligible = filterDate(
    filterQuadrant(eventsAndRecs, filters.quadrant),
    filters.date);
  var data = drawItem(eligible);
  return {
    category: "TK",
    data,
  }
};

var generatePlan = function() {
  var filters = {
    quadrant: quadrantSelect.value,
    date: dateInput.valueAsDate, // TODO: IE 11 support ... ?
  };
  var slots = [
    getItem(filters),
    getItem(filters),
    getItem(filters),
  ];
  resultList.innerHTML = planTemplate(slots);
}

goButton.addEventListener("click", generatePlan);
