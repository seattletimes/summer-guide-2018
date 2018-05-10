// code for the interactive listings
var $ = require("./lib/qsa");
var dot = require("./lib/dot");
var { intersects, filterCategories } = require("./util");

var listTemplate = dot.compile(require("./_list.html"));
var listContainer = $.one(".event-listings");

var hidePastCheckbox = $.one("#hide-past")
var searchBox = $.one(".search input");


// Hide items that finished before today
var filterPast = function(list, { hidePast }) {
  if (!hidePast) return list;
  var today = new Date();
  return list.filter(r => r.timestamps.endKey >= today);
};

// Show items matching the months array
var filterMonths = function(list, { months }) {
  if (!months || !months.length) return list;
  return list.filter(d => intersects(d.months, months));
};

// Filter only items that match text in the search box
var filterBySearch = function(list, { query }) {
  if (!query) return list;
  var re = new RegExp(query, "i");
  var attrs = [ 'name', 'location', 'url', 'details', 'description'];
  return list.filter(r => attrs.some(attr => r[attr] ? r[attr].match(re) : false));
};

// Apply all filters to the full list
var applyFilters = function() {
  // Get form inputs
  var categories = $(".category:checked").map(c => c.value);
  var months = $(".month:checked").map(m => m.value).sort();
  var query = searchBox.value;
  var hidePast = hidePastCheckbox.checked;
  var config = { categories, months, query, hidePast };
  // Set up a filter chain, in which the result of each step is passed into the next
  var filters = [
    filterPast,
    filterMonths,
    filterCategories,
    filterBySearch
  ];
  // Start with the full list of events
  var list = window.eventData;
  // Run through the filter chain, progressively updating `list`
  filters.forEach(f => list = f(list, config));
  // Output HTML into template from final results
  listContainer.innerHTML = listTemplate(list);
};

var filterContainer = $.one(".filters");
filterContainer.addEventListener("change", applyFilters);

searchBox.addEventListener("keyup", applyFilters);

module.exports = function() {
  applyFilters();
};
