// require("./lib/ads");
// var track = require("./lib/tracking");

var $ = require("./lib/qsa");
var dot = require("./lib/dot");

var listTemplate = dot.compile(require("./_list.html"));
var listContainer = $.one(".event-listings");

// Pre-process data:
// * add a months array based on the dates specified
// * split category field into an array
window.eventData.forEach(function(row) {
  if (row.date) {
    row.months = [ row.date.split("/")[0] ];
  } else {
    var startMonth = 5;
    var endMonth = 9;
    if (row.start) {
      [startMonth] = row.start.split("/") * 1;
    }
    if (row.end) {
      [endMonth] = row.end.split("/") * 1;
    }
    row.months = [];
    for (var i = startMonth; i <= endMonth; i++) row.months.push(i);
  }
if (!row.category) console.log(row);
  row.categories = row.category ? row.category.split(" ") : [];
});

// Test: do two lists have items in common?
var intersects = function(a, b) {
  var aMap = {};
  a.forEach(k => aMap[k] = true);
  for (var i = 0; i < b.length; i++) {
    if (b[i] in aMap) return true;
  }
  return false;
};

// Show items matching the months array
var filterMonths = function(list, months) {
  if (!months || !months.length) return list;
  return list.filter(d => intersects(d.months, months));
};

// Show items included in a list of categories
var filterCategories = function(list, cats) {
  if (!cats || !cats.length) return list;
  return list.filter(d => intersects(cats, d.categories));
}

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

applyFilters();

var filterContainer = $.one(".filters");
filterContainer.addEventListener("change", applyFilters);