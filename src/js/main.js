// require("./lib/ads");
// var track = require("./lib/tracking");

var $ = require("./lib/qsa");
var dot = require("./lib/dot");

var listTemplate = dot.compile(require("./_list.html"));
var listContainer = $.one(".event-listings");

window.eventData.forEach(function(row) {
  if (row.date) {
    row.months = [ row.date.split("/")[0] ];
  } else {
    var startMonth = 5;
    var endMonth = 9;
    if (row.start) {
      [startMonth] = row.start.split("/");
    }
    if (row.end) {
      [endMonth] = row.end.split("/");
    }
    row.months = [];
    for (var i = startMonth; i <= endMonth; i++) row.months.push(i);
  }
});

var intersects = function(a, b) {
  var aMap = {};
  a.forEach(k => aMap[k] = true);
  for (var i = 0; i < b.length; i++) {
    if (b[i] in aMap) return true;
  }
  return false;
};

var filterMonths = function(list, months) {
  if (!months || !months.length) return list;
  return list.filter(d => intersects(d.months, months));
};

var filterCategories = function(list, cats) {
  if (!cats || !cats.length) return list;
  return list.filter(d => !d.category || cats.indexOf(d.category) > -1);
}

var applyFilters = function() {
  var categories = $(".category:checked").map(c => c.value);
  var months = $(".month:checked").map(m => m.value).sort();
  var filters = [
    list => filterMonths(list, months),
    list => filterCategories(list, categories)
  ];
  var list = window.eventData;
  filters.forEach(f => list = f(list));
  console.log(list);
  listContainer.innerHTML = listTemplate(list);
};

applyFilters();

var filterContainer = $.one(".filters");
filterContainer.addEventListener("change", applyFilters);