var $ = require("./lib/qsa");
var dot = require("./lib/dot");
var { intersects, padLeft } = require("./util");

var planTemplate = dot.compile(require("./_itinerary.html"));

var goButton = $.one(".generate-itinerary");
var dateInput = $.one(`[name="date"]`);
var resultList = $.one(".itinerary-results ul");

var today = new Date();
dateInput.value = `${today.getFullYear()}-${padLeft(today.getMonth() + 1, 2)}-${padLeft(today.getDate(), 2)}`;

var filterQuadrant = function(list, quadrant) {
  var filtered = list.filter(e => e.quadrant == quadrant);
  // get and concat food, attractions, etc.
  return filtered;
};

var filterDate = function(list, day = new Date()) {
  return list.filter(function(item) {
    if (item.timestamps.date) {
      return item.timestamps.date == day;
    }
    return item.timestamps.start < day && item.timestamps.end > day;
  });
};

var drawItem = function(list) {
  return list[(list.length * Math.random()) | 0];
};

var getFood = function(filters) {
  return {
    category: "Grab some eats",
    data: {
      name: "This space intentionally left blank.",
      description: "This is a placeholder for the description text assigned to a given item."
    }
  }
};

var getHike = function(filters) {
  return {
    category: "See the outdoors",
    data: {
      name: "This space intentionally left blank.",
      description: "This is a placeholder for the description text assigned to a given item."
    }
  }
};

var getEvent = function(filters) {
  return {
    category: "The main event",
    data: {
      name: "This space intentionally left blank.",
      description: "This is a placeholder for the description text assigned to a given item."
    }
  }
};

var getDummy = function(filters) {
  return {
    category: "This space intentionally left blank",
    data: drawItem(window.eventData)
  };
}

var generatePlan = function() {
  var filters = {
    quadrant: "south" // obviously, should be dynamic
  };
  var slots = [
    getDummy(),
    getDummy(),
    getDummy()
  ];
  resultList.innerHTML = planTemplate(slots);
}

goButton.addEventListener("click", generatePlan);