var lat = []
var lng = []
var sizes = []
var colours = []
var postcodes = []
var totals = [0,0,0]
var monthTotals = {};
var cityTotals = {};
var data;
var layout;

function getGeocodeData() {
  for(var geo in geocodes){
    geoJson = geocodes[geo]
    lat.push(geoJson.lat);
    lng.push(geoJson.lng);

    var count = 0;
    for (var m in geoJson.months) {
      count += geoJson.months[m];
    }
    sizes.push(count)
    if (count <= 3) {
      colours.push("white")
    }
    else if (count > 3 && count<=6) {
      colours.push("yellow")
    }
    else if (count > 6 && count<=10) {
      colours.push("orange")
    }
    else colours.push("red")
    postcodes.push(geoJson.postcode)
  };
}


function getDataForMap() {
  data = [{
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

  layout = {
      style: 'dark',
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
}

function plotMap() {
  Plotly.setPlotConfig({
    mapboxAccessToken: 'pk.eyJ1IjoiY2hyaXNiOTcxOSIsImEiOiJjam95aWQ4YncyYzU0M3BsazVqMjZlbHlwIn0.lnsr5Pdz83SXN6kca0Slbw'
  })

  Plotly.plot('graph', data, layout)
}

function update() {
  var ud = {
    transforms: [{
      type: 'filter',
      target: 'month',
      operation: '==',
      value: 'August'
    }]
  }
}


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
  console.log(monthTotals);
}

function plotLineGraph() {
  var m = Object.keys(monthTotals);
  var values = Object.keys(monthTotals).map(function(key){return monthTotals[key];});
  console.log(m);
  console.log(values);
  //var max = values.reduce(function(a, b) {return Math.max(a, b);});
  var trace = {
    x: m,
    y: values,
    mode: 'markers+lines'
  };
  var dat = [trace];
  var lout = {
    autoscale: true,
    /**yaxis: {
        range: [0, max + 100]
    },*/
    title: "Number of prescriptions by month"
  };
  Plotly.newPlot('line', dat, lout);
}

function getPrescriptionPerCity() {
  for(var geo in geocodes) {
    geoJson = geocodes[geo]
    var indicator = geoJson.postcode.charAt(0);
    var c = 0;
    for (var i in geoJson.months) {
      c += geoJson.months[i];
    }
    switch(indicator) {
      case "M":
        if ("Coatbridge" in cityTotals) {
          cityTotals["Coatbridge"] += c;
        }
        else cityTotals["Coatbridge"] = c;
        break;
      case "T":
        if ("Melrose" in cityTotals) cityTotals["Melrose"]+=c;
        else cityTotals["Melrose"] = c;
        break;
      case "F":
        if ("Stirling" in cityTotals) cityTotals["Stirling"]+c;
        else cityTotals["Stirling"] = c;
        break;
      case "G":
        if ("Glasgow" in cityTotals) cityTotals["Glasgow"]+=c;
        else cityTotals["Glasgow"] = c;
        break;
      case"E":
        if ("Edinburgh" in cityTotals) cityTotals["Edinburgh"]+=c;
        else cityTotals["Edinburgh"] = c;
        break;
      case "A":
        if ("Aberdeen" in cityTotals) cityTotals["Aberdeen"]+=c;
        else cityTotals["Aberdeen"] = c;
        break;
      case "I":
        if ("Inverness" in cityTotals) cityTotals["Inverness"]+=c;
        else cityTotals["Inverness"] = c;
        break;
      case "D":
        if ("Dundee" in cityTotals) cityTotals["Dundee"]+=c;
        else cityTotals["Dundee"] = c;
        break;
      case "K":
        if ("Prestwick" in cityTotals) cityTotals["Prestwick"]+=c;
        else cityTotals["Prestwick"] = c;
        break;
      }
    }
  }

function plotCityTotals() {
  var cities = Object.keys(cityTotals);
  var values = Object.keys(cityTotals).map(function(key){return cityTotals[key];});
  //console.log(cities);
  //console.log(values);

  var data = [{
    x: cities,
    y: values,
    type: 'bar',
  }];
  Plotly.newPlot('hist', data);
}


getPrescriptionPerCity();
plotCityTotals();
console.log(cityTotals);
getTotalsPerMonth();
plotLineGraph();
getGeocodeData();
console.log(sizes);
getDataForMap();
plotMap();



/**
console.log(sizes)

var data = [{
    type: 'scattergeo',
    lat: lat,
    lon: lng,
    zmin: 0,
    zmax: 17000,
    *colorscale: [
        [0, 'rgb(242,240,247)'], [0.2, 'rgb(218,218,235)'],
        [0.4, 'rgb(188,189,220)'], [0.6, 'rgb(158,154,200)'],
        [0.8, 'rgb(117,107,177)'], [1, 'rgb(84,39,143)']
    ],
    colorbar: {
        title: 'Millions USD',
        thickness: 0.2
    },
    marker: {
        size: sizes,
        color: 'blue',
        line: {
            color: 'blue',
            width: 2
        },
    }
}];


var layout = {
    width:1200,
    height:1200,
    geo:{
        scope: 'europe',
        resolution: 50,
    }
};


data = graph_objs.Data([
    graph_objs.Scattermapbox(
        lat=['45.5017'],
        lon=['-73.5673'],
        mode='markers',
    )
])

Plotly.plot(graph, data, layout);
*/
