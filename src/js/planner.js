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
console.log(dateInput.value);

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
  var filtered = list.filter(e => e.quadrants.includes(quadrant));
  // get and concat food, attractions, etc.
  return filtered;
};

var drawItem = function(list) {
  return list[(list.length * Math.random()) | 0];
};

var getItem = function(config, cat, oldName) {
  // Add category to config (which has qudrant and day)
  var fullConfig = Object.assign({ categories: [cat] }, config);
  var filters = [
    filterQuadrant,
    filterCategories,
    filterDate,
  ];
  var list = eventsAndRecs;
  filters.forEach(f => list = f(list, fullConfig));

  var item;
  do {
    item = drawItem(list);
  } while (item && item.name === oldName); // ensure rerolling never returns the same as before
  return {
    cat,
    item,
    rerollable: list.length > 1, // button is useless if there's only 1 choice (or 0)
  }
};

var reroll = function() {
  var descNode = this.previousElementSibling; // <p>
  var nameNode = descNode.previousElementSibling; // <h4>
  var newItem = getItem(spaceTimeFilters, this.dataset.cat, nameNode.innerHTML);
  nameNode.innerHTML = newItem.data.name;
  descNode.innerHTML = newItem.data.description || "";
};

var generatePlan = function() {
  updateFilters();
  var slots = $(".category:checked").map(c => {
    return getItem(spaceTimeFilters, c.value);
  });
  resultList.innerHTML = listTemplate({
    items: slots.map(s => s.item),
  });
  $(".reroll").forEach( btn => {
    btn.addEventListener("click", reroll);
  });
  document.body.setAttribute("data-planned", "yes");
};

goButton.addEventListener("click", generatePlan);
