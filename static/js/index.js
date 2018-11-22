lat = []
lng = []
sizes = []
geocodes.forEach(function(object) {
  lat.push(object.lat);
  lng.push(object.lng);
  sizes.push(parseInt(object.count)*5)
});

console.log(sizes)

var data = [{
    type: 'scattergeo',
    lat: lat,
    lon: lng,
    zmin: 0,
    zmax: 17000,
    /**colorscale: [
        [0, 'rgb(242,240,247)'], [0.2, 'rgb(218,218,235)'],
        [0.4, 'rgb(188,189,220)'], [0.6, 'rgb(158,154,200)'],
        [0.8, 'rgb(117,107,177)'], [1, 'rgb(84,39,143)']
    ],
    colorbar: {
        title: 'Millions USD',
        thickness: 0.2
    },*/
    marker: {
        size: sizes,
        line: {
            color: 'black',
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

Plotly.plot(graph, data, layout);
