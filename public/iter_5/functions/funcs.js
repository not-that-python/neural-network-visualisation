import * as tf from '@tensorflow/tfjs';

export function createLayer(numNodes, inputLayer=true, prevLayerIndex=null) {
    let layer = {
        nodes: new Array(numNodes).fill().map(() => {return {value: 0}}), // array of objects
        // will check later if this has any referencing issues which i get the gut feeling it does
        inputLayer,
        prevLayerIndex: inputLayer? null: prevLayerIndex,
        weightMatrix: null,
        bias: null
    }
    return layer
}

export function createNetwork(dimensions) {
    let network = []
    if (!dimensions.length) return // don't bother if there's no input. although this feels a little redundant

    for (let i=0; i<dimensions.length; i++) {
        let numNodes = dimensions[i]
        let inputLayer = (i === 0) // determines if it's input layer or not

        network.push(createLayer(numNodes, inputLayer, i-1))
    }

    return network
}