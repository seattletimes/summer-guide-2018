// code for the interactive listings
var $ = require("./lib/qsa");
var dot = require("./lib/dot");
var { intersects, filterCategories } = require("./util");

var listTemplate = dot.compile(require("./_list.html"));
var listContainer = $.one(".event-listings");

// Show items matching the months array
var filterMonths = function(list, months) {
  if (!months || !months.length) return list;
  return list.filter(d => intersects(d.months, months));
};

// Apply all filters to the full list
var applyFilters = function() {
  // Get form inputs
  var categories = $(".category:checked").map(c => c.value);
  var months = $(".month:checked").map(m => m.value).sort();
  // Set up a filter chain, in which the result of each step is passed into the next
  var filters = [
    list => filterMonths(list, months),
    list => filterCategories(list, categories)
  ];
  // Start with the full list of events
  var list = window.eventData;
  // Run through the filter chain, progressively updating `list`
  filters.forEach(f => list = f(list));
  // Output HTML into template from final results
  listContainer.innerHTML = listTemplate(list);
};

var filterContainer = $.one(".filters");
filterContainer.addEventListener("change", applyFilters);

module.exports = function() {
  applyFilters();
};
