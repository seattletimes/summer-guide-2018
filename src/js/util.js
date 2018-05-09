// Test: do two lists have items in common?
var intersects = function(a, b) {
  var aMap = {};
  a.forEach(k => aMap[k] = true);
  for (var i = 0; i < b.length; i++) {
    if (b[i] in aMap) return true;
  }
  return false;
};

var padLeft = function(string, length, padder = "0") {
  if (typeof string != "string") string = String(string);
  if (string.length < length) {
    var l = length - string.length;
    var padding = new Array(l + 1).join(padder);
    return padding + string;
  }
};

// Show items included in a list of categories
var filterCategories = function(list, { categories }) {
  if (!categories || !categories.length) return list;
  return list.filter(d => intersects(categories, d.categories));
};

module.exports = { intersects, padLeft, filterCategories };
