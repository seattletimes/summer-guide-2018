// require("./lib/ads");
// var track = require("./lib/tracking");

var $ = require("./lib/qsa");
var dot = require("./lib/dot");

var listTemplate = dot.compile(require("./_list.html"));
console.log(listTemplate);

var listContainer = $.one(".event-listings");
console.log(listContainer);
listContainer.innerHTML = listTemplate(window.eventData);

// delete me later!
// document.body.addEventListener("click", function() {
//   var ongoing = window.eventData.filter(r => r.name.match(/^m/i));
//   listContainer.innerHTML = listTemplate(ongoing);
// })

var applyFilters = function() {
  var items = window.eventData;
  var date = this.getAttribute("data-date");
  if (date) {
    items = window.eventData.filter(r => r.date == date);
  }
  listContainer.innerHTML = listTemplate(items);
}

$("[data-date]").forEach(a => a.addEventListener("click", applyFilters));
