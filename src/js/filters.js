var { intersects, filterCategories } = require("./util");

// Show items included in a list of categories
var filterCategories = function(list, { categories }) {
  if (!categories || !categories.length) return list;
  return list.filter(d => intersects(categories, d.categories));
};

// Filter by location
var filterQuadrants = function(list, { quadrants }) {
  if (!quadrants || ! quadrants.length) return list;
  return list.filter(d => intersects(quadrants, d.quadrants));
};

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

// Show items matching a particular date
var filterDate = function(list, { day = new Date() }) {
  return list.filter(function(item) {
    if (item.timestamps.date) {
      return item.timestamps.date * 1 === day * 1;
    }
    return item.timestamps.start < day && item.timestamps.end > day;
  });
};

// If custom date, filter by that; otherwise by month (never both)
var filterTime = function(list, config) {
  if (config.day) return filterDate(list, config);
  return filterMonths(list, config);
};

// Filter only items that match text in the search box
var filterBySearch = function(list, { query }) {
  if (!query) return list;
  var re = new RegExp(query, "i");
  var attrs = [ 'name', 'location', 'url', 'details', 'description'];
  return list.filter(r => attrs.some(attr => r[attr] ? r[attr].match(re) : false));
};

var filterItems = function(list, config) {
  var result = list;
  var filters = [
    filterPast,
    filterTime,
    filterCategories,
    filterQuadrants,
  ];
  filters.forEach(f => result = f(result, config));
  return result;
};

module.exports = { filterItems, filterBySearch };
