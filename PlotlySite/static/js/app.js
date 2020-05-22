let data;

d3.json('./samples.json').then(d => {
    try{
        validateData(d)
    } catch(e) {
        alert(e);
    }
    data = d;
    
    loadIds(d);
    optionChanged(d.names[0]);
});

function optionChanged(val){
    const sample = data.samples.find(s => s.id == val);
    const metadata = data.metadata.find(s => s.id == val);

    displaySample(sample);
    displayBubbles(sample);
    displayMetadata(metadata);
}

function displayMetadata(metadata){
    const metadataElement = d3.select('#sample-metadata');
    const datumElement = 'div';
    const kvStrings = Object.keys(metadata).map(k => `${k}: ${metadata[k]}`);

    metadataElement.selectAll(datumElement)
        .remove();

    metadataElement.selectAll(datumElement)
        .data(kvStrings)
        .enter()
        .append(datumElement)
        .text(d => d);
}

function loadIds(d){
    const options = d3.select('#selDataset')
        .selectAll('option')
        .data(d.names)
        .enter()
        .append('option');

    options.text(d => d);
    options.property('value', d => d);
}

function displayBubbles(sample){
    var trace1 = {
        x: sample.otu_ids,
        y: sample.sample_values,
        mode: 'markers',
        marker: {
            size: sample.sample_values,
            color: sample.otu_ids,
        },
        text: sample.otu_labels,
    };

    var data = [trace1];

    var layout = {
        title: 'Marker Size',
        showlegend: false,
        height: 600,
        width: 600
    };

    Plotly.newPlot('bubble', data, layout);
}

function displaySample(sample){
    const top = cacheTakeTop(sample)

    const sample_values = top.map(d => d.sample_values);
    const otu_ids = top.map(d => 'OTU ' + d.otu_ids.toString());
    const otu_labels = top.map(d => d.otu_labels);

    // Create the Trace
    var trace1 = {
        x: sample_values,
        y: otu_ids,
        type: "bar",
        orientation: 'h',
        text: otu_labels,
    };

    // Create the data array for the plot
    var data = [trace1];

    // Define the plot layout
    var layout = {
        title: "Sample values of OTU",
        xaxis: { title: "Sample Value" },
        yaxis: { title: "OTU Identifier" }
    };

    // Plot the chart to a div tag with id "bar"
    Plotly.newPlot("bar", data, layout);
}
