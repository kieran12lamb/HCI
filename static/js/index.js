
graph = document.getElementById('graph');

var layout = {
    'geo': {
        'scope': 'europe',
        'resolution': 50
    }
};

Plotly.newPlot(graph, layout)
