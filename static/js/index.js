lat = []
lng = []
sizes = []

geocodes.forEach(function(object) {
  lat.push(object.lat);
  lng.push(object.lng);
  sizes.push(parseInt(object.count)*5)
});

var data = [{
  type:'scattermapbox',
  lat: lat,
  lon: lng,
  mode: 'markers',
  marker: {
    size: sizes
  }
}]

console.log(data);


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
  },
}


Plotly.setPlotConfig({
  mapboxAccessToken: 'pk.eyJ1IjoiY2hyaXNiOTcxOSIsImEiOiJjam95aWQ4YncyYzU0M3BsazVqMjZlbHlwIn0.lnsr5Pdz83SXN6kca0Slbw'
})

Plotly.plot('graph', data, layout)
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
