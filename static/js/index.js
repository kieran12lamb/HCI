var lat = []
var lng = []
var sizes = []
var colours = []
var postcodes = []
var monthTotals = {};
var cityTotals = {};
var coastTotals = {};
var townTotals = {};

var cf = crossfilter(geocodes);


function addToPlot(geoJson) {
  lat.push(geoJson.lat);
  lng.push(geoJson.lng);

  var count = 0;
  for (var m in geoJson.months) {
    count += geoJson.months[m];
  }
  sizes.push(count)
  if (count <= 3) {
    colours.push("white");
  }
  else if (count > 3 && count<=7) {
    colours.push("yellow");
  }
  else if (count > 7 && count<=12) {
    colours.push("orange");
  }
  else colours.push("red");
  postcodes.push(geoJson.postcode);
}

function getGeocodeData(data) {
  lat = [];
  lng = [];
  postcodes = [];
  sizes = [];
  colours = [];
  for(var geo in geocodes){
    var geoJson = geocodes[geo]
    if (data == "cities") {
      var p1 = geoJson.postcode[0];
      var p2 = geoJson.postcode[1];
      if (p1 == "G" || p1 == "E" || p1 == "F" || p1 == "A" || p1 == "I" || (p1 == "D" && p2 == "D")) {
        addToPlot(geoJson);
      }
    }
    else if (data == "towns") {
      var p1 = geoJson.postcode[0];
      var p2 = geoJson.postcode[1];
      if (p1 != "G" && p1 != "E" && p1 != "F" && p1 != "A" && p1 != "I" && (p1 != "D" && p2 != "D")) {
        addToPlot(geoJson);
      }
    }
    else {
      addToPlot(geoJson);
    }
  }

  var data = [{
    type:'scattermapbox',
    lat: lat,
    lon: lng,
    postcode: postcodes,
    hoverinfo: 'postcode',
    mode: 'markers',
    marker: {
      size: sizes,
      color: colours
    }
  }]

  var layout = {
      autosize: true,
      hovermode:'closest',
      mapbox: {
        bearing:0,
        center: {
          lat:56.4907,
          lon:-4.2026
        },
        pitch:0,
        zoom:5
      }
    }

    Plotly.setPlotConfig({
      mapboxAccessToken: 'pk.eyJ1IjoiY2hyaXNiOTcxOSIsImEiOiJjam95aWQ4YncyYzU0M3BsazVqMjZlbHlwIn0.lnsr5Pdz83SXN6kca0Slbw'
    })

    Plotly.newPlot('graph', data, layout)
}


//Line graph
function getTotalsPerMonth() {
  for(var geo in geocodes){
    data = geocodes[geo]
    for (var month in data.months) {
      if (month in monthTotals) {
        monthTotals[month] += data.months[month];
      }
      else monthTotals[month] = data.months[month];
    }
  }
}

function plotLineGraph() {
  var m = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var values = []
  m.forEach(function(month) {
    values.push(monthTotals[month]);
  })
  var trace = {
    x: m,
    y: values,
    mode: 'markers+lines'
  };
  var dat = [trace];
  var lout = {
    autoscale: true,
    title: "Number of prescriptions by month"
  };
  Plotly.newPlot('line', dat, lout);
}
//

function addTotals(count, city, coast, town) {
  if (city != null) cityTotals[city] = (cityTotals[city] || count) + count;
  if (coast != null) coastTotals[coast] = (coastTotals[coast] || count) + count;
  if (town != null) townTotals[town] = (townTotals[town] || count) + count;
}

function getPrescriptionPerCity() {
  for(var geo in geocodes) {
    geoJson = geocodes[geo]
    var indicator1 = geoJson.postcode.charAt(0);
    var indicator2 = geoJson.postcode.charAt(1);
    var c = 0;
    for (var i in geoJson.months) {
      c += geoJson.months[i];
    }
    switch(indicator1) {
      case "M":
        addTotals(c, null, "West Coast", "Coatbridge");
        break;
      case "T":
        addTotals(c, null, "South", "Melrose");
        break;
      case "F":
        addTotals(c, "Stirling", "South");
        break;
      case "G":
        addTotals(c, "Glasgow", "West Coast");
        break;
      case"E":
        addTotals(c, "Edinburgh", "East Coast");
        break;
      case "A":
        addTotals(c, "Aberdeen", "North");
        break;
      case "I":
        addTotals(c, "Inverness", "North");
        break;
      case "D":
        if (indicator2 == "D") {
          addTotals(c, "Dundee", "North");
        }
        break;
      case "K":
        addTotals(c, null, "West Coast", "Prestwick");
        break;
      }
    }
  }

/**************************************BAR CHART********************************/
function plotBarChart(info, values) {
  var data = [{
    x: info,
    y: values,
    type: 'bar',
  }];

  var layout = {
    title: 'Number of prescriptions by place'
  };
  Plotly.newPlot('hist', data, layout);
}

function updateCityGraph(filter) {
  if (filter == "coasts") {
    plotBarChart(Object.keys(coastTotals), Object.keys(coastTotals).map(function(key){return coastTotals[key];}));
  }
  else if (filter == 'citiesAndTowns') {
    plotBarChart(Object.keys(cityTotals).concat(Object.keys(townTotals)), (Object.keys(cityTotals).map(function(key){return cityTotals[key];})).concat(Object.keys(townTotals).map(function(key){return townTotals[key];})))
  }
  else if (filter == 'towns') {
    plotBarChart(Object.keys(townTotals), Object.keys(townTotals).map(function(key){return townTotals[key];}));
  }
  else if (filter == 'cities') {
    plotBarChart(Object.keys(cityTotals), Object.keys(cityTotals).map(function(key){return cityTotals[key];}));
  }
}
/********************************************************************************************************************************/

document.getElementById("myList").onchange = function() {
   updateCityGraph(this.value);
   getGeocodeData(this.value);
   return false
};

getPrescriptionPerCity();
plotBarChart(Object.keys(cityTotals).concat(Object.keys(townTotals)), (Object.keys(cityTotals).map(function(key){return cityTotals[key];})).concat(Object.keys(townTotals).map(function(key){return townTotals[key];})))
getTotalsPerMonth();
plotLineGraph();
getGeocodeData(geocodes);
console.log(sizes);
