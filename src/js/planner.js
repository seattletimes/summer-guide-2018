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
    day: dateInput.valueAsDate, // TODO: IE 11 support ... ?
  };
};

var eventsAndRecs = eventData.concat(recsData);

var filterQuadrant = function(list, { quadrant }) {
  var filtered = list.filter(e => e.quadrant == quadrant);
  // get and concat food, attractions, etc.
  return filtered;
};

var filterDate = function(list, { day = new Date() }) {
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

var getItem = function(config, metaName) {
  // Add category to config (which has qudrant and day)
  var config = Object.assign({ categories: window.metacats[metaName].cats }, config);
  var filters = [
    filterQuadrant,
    filterCategories,
    filterDate
  ];
  var list = eventsAndRecs;
  filters.forEach(f => list = f(list, config));

  var data = drawItem(list);
  return {
    metaName,
    metaMessage: window.metacats[metaName].message,
    data,
  }
};

var reroll = function() {
  var nameNode = this.parentNode.nextElementSibling;
  var descNode = nameNode.nextElementSibling;
  var newItem = getItem(spaceTimeFilters, this.dataset.metacat);
  nameNode.innerHTML = newItem.data.name;
  descNode.innerHTML = newItem.data.description || "";
};

var generatePlan = function() {
  updateFilters();
  var slots = $(".metacategory:checked").map(metaCheckbox => {
    return getItem(spaceTimeFilters, metaCheckbox.value);
  });
  resultList.innerHTML = planTemplate(slots);
  $(".reroll").forEach( btn => {
    btn.addEventListener("click", reroll);
  });
};

goButton.addEventListener("click", generatePlan);
