// code for the interactive listings
var $ = require("./lib/qsa");
var dot = require("./lib/dot");
var { filterItems, filterBySearch } = require("./filters.js");
var { padLeft } = require("./util.js");

var filterContainer = $.one(".filters");
var searchBox = $.one(".search input");
var pickItemsButton = $.one(".pick-items");

var listTemplate = dot.compile(require("./_list.html"));
var listContainer = $.one(".event-listings");

// Removes random item from list and returns it
var drawAndRemoveItem = function(list) {
  var index = list.length * Math.random();
  return list.splice(index, 1)[0];
};

var getConfig = function() {
  var config = {};
  $("[data-aggregate]:checked").forEach(function(input) {
    var agg = input.getAttribute("data-aggregate");
    if (!config[agg]) config[agg] = [];
    config[agg].push(input.value);
  });
  $("[data-flag]:checked").forEach(function(input) {
    var flag = input.getAttribute("data-flag");
    config[flag] = true;
  });
  $("[data-string]").forEach(function(input) {
    var inputName = input.getAttribute("data-string");
    config[inputName] = input.value;
  });
  return config;
};

// Apply all filters to the full list (if "show all results" is checked)
var applyFilters = function() {
  var config = getConfig();
  if (config.query) { // clear search on any non-search action
    searchBox.value = "";
    document.body.removeAttribute("data-searching");
  }
  if (!config.showAll) { // Stop execution, show instructions
    if (listContainer.firstChild.tagName !== 'P') listContainer.innerHTML = window.instructions;
    return;
  }

  var items = filterItems(window.eventData, config);
  // Output HTML into template from final results
  listContainer.innerHTML = listTemplate({ items });
};

var runSearch = function() {
  var config = getConfig();
  if (!config.query) { // I.e. Cleared search box
    document.body.removeAttribute("data-searching");
    return;
  }

  if (!document.body.getAttribute("data-searching")) {
    document.body.setAttribute("data-searching", "");
  }
  var items = filterBySearch(window.eventData, config);
  listContainer.innerHTML = listTemplate({ items });
};

var eventsAndRecs = eventData.concat(recsData);
var buildItinerary = function() {
  var config = getConfig();
  var eligibleItems = filterItems(eventsAndRecs, config);
  var items = [];
  while (items.length < 3 && eligibleItems.length > 0) {
    var next = drawAndRemoveItem(eligibleItems);
    console.log(next);
    items.push(next);
  }
  listContainer.innerHTML = listTemplate({ items })
};

filterContainer.addEventListener("change", applyFilters);
searchBox.addEventListener("keyup", runSearch);
pickItemsButton.addEventListener("click", buildItinerary);

var useDateCheckbox = $.one(`[data-flag="useCustomDate"]`);
// If we check "use custom date," automatically uncheck all months
useDateCheckbox.addEventListener("change", () => {
  if (useDateCheckbox.checked){
    $(`[data-aggregate="months"]:checked`).forEach(m => m.checked = false);
  }
})
// If we check any month, automatically uncheck "use custom date"
$(`[data-aggregate="months"]`).forEach(m => m.addEventListener("change", () => {
  if (useDateCheckbox.checked) useDateCheckbox.checked = false;
}));

// Initialize custom date to day
var today = new Date();
$.one(`[name="date"]`).value = `${today.getFullYear()}-${padLeft(today.getMonth() + 1, 2)}-${padLeft(today.getDate(), 2)}`;
