var $ = require("./lib/qsa");
var dot = require("./lib/dot");
var { intersects, padLeft, filterCategories } = require("./util");

var planTemplate = dot.compile(require("./_itinerary.html"));

var goButton = $.one(".generate-itinerary");
var quadrantSelect = $.one(`[name="quadrant"]`);
var dateInput = $.one(`[name="date"]`);
var resultList = $.one(".itinerary-results");

var today = new Date();
dateInput.value = `${today.getFullYear()}-${padLeft(today.getMonth() + 1, 2)}-${padLeft(today.getDate(), 2)}`;

var spaceTimeFilters = {};
var updateFilters = function() {
  // Can't just construct with date string because of timezone
  var [y, m, d] = dateInput.value.split('-').map(Number);
  spaceTimeFilters = {
    quadrant: quadrantSelect.value,
    day: new Date(y, m - 1, d, 0),
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
      return item.timestamps.date * 1 === day * 1;
    }
    return item.timestamps.start < day && item.timestamps.end > day;
  });
};

var drawItem = function(list) {
  return list[(list.length * Math.random()) | 0];
};

var getItem = function(config, metaName, oldName) {
  // Add category to config (which has qudrant and day)
  var config = Object.assign({ categories: window.metacats[metaName].cats }, config);
  var filters = [
    filterQuadrant,
    filterCategories,
    filterDate
  ];
  var list = eventsAndRecs;
  filters.forEach(f => list = f(list, config));

  var data;
  do {
    data = drawItem(list);
  } while (data.name === oldName); // ensure rerolling never returns the same as before
  return {
    metaName,
    metaMessage: window.metacats[metaName].message,
    data,
  }
};

var reroll = function() {
  var descNode = this.previousElementSibling; // <p>
  var nameNode = descNode.previousElementSibling; // <h4>
  var newItem = getItem(spaceTimeFilters, this.dataset.metacat, nameNode.innerHTML);
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
