var lat = []
var lng = []
var sizes = []
var colours = []
var postcodes = []
var totals = [0,0,0]
var months = ["June", "July", "August"]
var cityTotals = {};
var data;
var layout;

function getGeocodeData() {
<<<<<<< HEAD
  geocodes.forEach(function(object) {
    lat.push(object.lat);
    lng.push(object.lng);
    sizes.push(parseInt(object.count)*4)
    if (object.count <= 2) {
      colours.push("white")
    }
    else if (object.count > 2 && object.count<=5) {
      colours.push("yellow")
    }
    else if (object.count > 5 && object.count<=9) {
=======
  for(var geo in geocodes){
    geoJson = geocodes[geo]
    lat.push(geoJson.lat);
    lng.push(geoJson.lng);
    sizes.push(parseInt(geoJson.count)*4)
    if (geoJson.count <= 1) {
      colours.push("white")
    }
    else if (geoJson.count > 1 && geoJson.count<=3) {
      colours.push("yellow")
    }
    else if (geoJson.count > 3 && geoJson.count<=5) {
>>>>>>> b3322531351aeb6c1f75cefb4511869f613bd04f
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
    if (data.month == "June") {
      totals[0]++;
    }
    else if (data.month == "July") {
      totals[1]++;
    }
    else if (data.month == "August") {
      totals[2]++;
    }
  }
}

function plotLineGraph() {
  var max = totals.reduce(function(a, b) {return Math.max(a, b);});
  var trace = {
    x: months,
    y: totals,
    mode: 'markers+lines'
  };
  var dat = [trace];
  var lout = {
    autoscale: true,
    yaxis: {
        range: [0, max + 100]
    },
    title: "Number of prescriptions by month"
  };
  Plotly.newPlot('line', dat, lout);
}

function getPrescriptionPerCity() {
  geocodes.forEach(function(d) {
    var indicator = d.postcode.charAt(0);
    switch(indicator) {
      case "M":
        if ("Coatbridge" in cityTotals) cityTotals["Coatbridge"]++;
        else cityTotals["Coatbridge"] = 1;
        break;
      case "T":
        if ("Melrose" in cityTotals) cityTotals["Melrose"]++;
        else cityTotals["Melrose"] = 1;
        break;
      case "F":
        if ("Stirling" in cityTotals) cityTotals["Stirling"]++;
        else cityTotals["Stirling"] = 1;
        break;
      case "G":
        if ("Glasgow" in cityTotals) cityTotals["Glasgow"]++;
        else cityTotals["Glasgow"] = 1;
        break;
      case"E":
        if ("Edinburgh" in cityTotals) cityTotals["Edinburgh"]++;
        else cityTotals["Edinburgh"] = 1;
        break;
      case "A":
        if ("Aberdeen" in cityTotals) cityTotals["Aberdeen"]++;
        else cityTotals["Aberdeen"] = 1;
        break;
      case "I":
        if ("Inverness" in cityTotals) cityTotals["Inverness"]++;
        else cityTotals["Inverness"] = 1;
        break;
      case "D":
        if ("Dundee" in cityTotals) cityTotals["Dundee"]++;
        else cityTotals["Dundee"] = 1;
        break;
      }
    })
  }

function plotCityTotals() {
  var cities = Object.keys(cityTotals);
  var values = Object.keys(cityTotals).map(function(key){return cityTotals[key];});
  console.log(cities);
  console.log(values);

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
