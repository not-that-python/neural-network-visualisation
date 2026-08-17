import * as tf from '@tensorflow/tfjs';

export function createLayer(numNodes) {
    if (numNodes === 0) {throw new Error("A layer cannot have zero nodes")}

    let layer = {
        nodes: new Array(numNodes).fill().map(() => {return {value: 0, x: null, y: null}}), // array of objects
        // will check later if this has any referencing issues which i get the gut feeling it does
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
        network.push(createLayer(numNodes))
    }

    return network
}

export function initWeightBiasLayer(numNodes, prevNumNodes, isInputLayer) {
    if (isInputLayer) {throw new Error("Input layer does not have a weight matrix or a bias")}
    // input validation for input layers just in case

    let weightMatrix = []
    for (let i=0; i<numNodes; i++) {
        weightMatrix[i] = [] // first rows (height)
        for (let j=0; j<prevNumNodes; j++) {
            weightMatrix[i][j] = (Math.random()*2)-1 // then values (width)
        } 
    } 
    
    // we'll see if there are referencing errors later or not, I don't think there will be

    let bias = 0
    return [weightMatrix, bias]
}

export function initWeightBiasNetwork(network) {
    let newNetwork = structuredClone(network)

    for (let i=1; i<newNetwork.length; i++) {
        // start looping from 1 because input layer does not have weight matrix or bias
        let layer = newNetwork[i]
        let prevLayer = newNetwork[i-1]

        let [weightMatrix, bias] = initWeightBiasLayer(layer.nodes.length, prevLayer.nodes.length, i === 0)
        layer.weightMatrix = weightMatrix
        layer.bias = bias
    }

    return newNetwork
}