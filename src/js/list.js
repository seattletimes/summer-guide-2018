// code for the interactive listings
var $ = require("./lib/qsa");
var debounce = require("./lib/debounce");
var dot = require("./lib/dot");
var { filterItems, filterBySearch } = require("./filters.js");
var { padLeft } = require("./util.js");

// DOM references we'll want
var searchBox = $.one(".search input");
var filterContainer = $.one(".filters");
var clearSearchButton = $.one(".search button");
var useDateCheckbox = $.one(`[data-flag="useCustomDate"]`);
var pickItemsButton = $.one(".pick-items");
var showAllCheckbox = $.one(`[data-flag="showAll"]`);
var listContainer = $.one(".event-listings");

// Template for displaying an array of cards
var listTemplate = dot.compile(require("./_list.html"));

// Removes random item from list and returns it (mutates list)
var drawAndRemoveItem = function(list) {
  var index = list.length * Math.random() | 0; // `| 0` floors number
  return list.splice(index, 1)[0];
};

var clearSearch = function() {
  if (searchBox.value.length > 0) searchBox.value = "";
  if (document.body.hasAttribute("data-searching")) {
    document.body.removeAttribute("data-searching");
  }
};

var resetBuildButtonText = function() {
  if (pickItemsButton.innerHTML !== "Build your own") {
    pickItemsButton.innerHTML = "Build your own";
  }
}

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
  clearSearch();
  resetBuildButtonText();
  var config = getConfig();
  if (!config.showAll) { // Stop execution, show instructions
    if (listContainer.firstChild.tagName !== 'P') listContainer.innerHTML = window.instructions;
    return;
  }
  var items = filterItems(window.eventData, config);
  // Output HTML into template from final results
  listContainer.innerHTML = listTemplate({ items });
};

var runSearch = function(ev) {
  var config = getConfig();
  if (!config.query) { // I.e. Cleared search box
    applyFilters();
    return;
  }
  if (!document.body.getAttribute("data-searching")) {
    document.body.setAttribute("data-searching", "");
  }
  var items = filterBySearch(window.eventData, config);
  listContainer.innerHTML = listTemplate({ items });
  resetBuildButtonText();
};

var eventsAndRecs = window.eventData.concat(recsData);
var buildItinerary = function() {
  clearSearch();
  var config = getConfig();
  if (config.showAll) { // Uncheck show all results setting when we click the button
    showAllCheckbox.checked = false;
  }
  var eligibleItems = filterItems(eventsAndRecs, config);
  var items = [];
  while (items.length < 3 && eligibleItems.length > 0) {
    var next = drawAndRemoveItem(eligibleItems);
    items.push(next);
  }
  listContainer.innerHTML = listTemplate({ items })
  if (pickItemsButton.innerHTML !== "Build another") {
    pickItemsButton.innerHTML = "Build another";
  }
};

filterContainer.addEventListener("change", applyFilters);
searchBox.addEventListener("input", debounce(runSearch));
searchBox.addEventListener("keyup", debounce((ev) => {
  if (ev.keyCode === 27) applyFilters();
}));
clearSearchButton.addEventListener("click", applyFilters);
pickItemsButton.addEventListener("click", buildItinerary);

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

// Initialize custom date to today
var today = new Date();
$.one(`[name="date"]`).value = `${today.getFullYear()}-${padLeft(today.getMonth() + 1, 2)}-${padLeft(today.getDate(), 2)}`;
