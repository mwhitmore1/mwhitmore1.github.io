function validateData(data){
    const error = new Error("The identifiers provided in the data do not match. ");

    const notSameLength = [data.names.length, data.metadata.length, data.samples.length]
        .some(v => v !== data.names.length);

    if (notSameLength){
        throw error;
    }

    for (let i = 0; i < data.names.length; i++){
        const notSameValues = [data.names[i], data.metadata[i].id, data.samples[i].id]
            .map(v => +v)
            .some(v => v !== +data.names[i]);
        if (notSameValues){
            throw error;
        }
    }
}

function* zipSample(sample){
    if (sample.sample_values.length !== sample.otu_ids.length
        || sample.otu_ids.length !== sample.otu_labels.length){
        throw new Error("The lengths of sample values, OTU IDs, and OTU Labels do not match for this sample. ");
    }
    for (let i = 0; i < sample.sample_values.length; ++i){
        yield {
            sample_values: sample.sample_values[i],
            otu_ids: sample.otu_ids[i],
            otu_labels: sample.otu_labels[i],
        };
    }
}

function takeFromZipped(zippedSample, amount=10){
    return zippedSample.sort((a, b) => b.sample_values - a.sample_values)
        .slice(0, amount);
}

function cacheDecorator(func, c=new Map()){
    const cache = c;
    return function(i){
        if (c.has(i)){
            return c.get(i);
        } else {
            const result = func(i);
            c.set(i, result);
            return result;
        }
    }
}

const cacheTakeTop = cacheDecorator(function(sample){
    return takeFromZipped([...zipSample(sample)]);
});

try{
    module.exports = {
        cacheDecorator: cacheDecorator,
        zipSample: zipSample,
        takeFromZipped: takeFromZipped,
        validateData: validateData,
    };
} catch {}