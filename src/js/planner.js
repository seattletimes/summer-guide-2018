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

var spaceTimeFilters = {};
var updateFilters = function() {
  spaceTimeFilters = {
    quadrant: quadrantSelect.value,
    date: dateInput.valueAsDate, // TODO: IE 11 support ... ?
  };
};

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

var getItem = function(filters, cats) {
  var eligible = filterDate(
    filterCategories(
      filterQuadrant(eventsAndRecs, filters.quadrant),
      cats),
    filters.date);
  var data = drawItem(eligible);
  return {
    category: cats[0], // TODO: use real words
    data,
  }
};

var reroll = function() {
  var cat = this.dataset.cat;
  var nameNode = this.parentNode.nextElementSibling;
  var descNode = nameNode.nextElementSibling;

  var newItem = getItem(spaceTimeFilters, [cat]);
  nameNode.innerHTML = newItem.data.name;
  descNode.innerHTML = newItem.data.description || "";
};

var generatePlan = function() {
  updateFilters();
  var slots = $(".planner-category:checked").map(c => {
    var cats = [c.value];
    return getItem(spaceTimeFilters, cats);
  });
  resultList.innerHTML = planTemplate(slots);
  $(".reroll").forEach( btn => {
    btn.addEventListener("click", reroll);
  });
};

goButton.addEventListener("click", generatePlan);
