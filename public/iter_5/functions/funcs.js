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

export function initWeightBiasLayer(numNodes, prevNumNodes, inputLayer) {
    if (inputLayer) {throw new Error("Input layer does not have a weight matrix or a bias")}
    // input validation for input layers just in case

    let weightMatrix = []
    for (let i=0; i<numNodes; i++) {weightMatrix[i] = []} // first rows (height)
    for (let j=0; j<numNodes; j++) {weightMatrix[i][j] = (Math.random()*2)-1} // then values (width)
    // we'll see if there are referencing errors later or not, I don't think there will be

    let bias = 0
    return weightMatrix, bias
}

export function initWeightBiasNetwork(network) {
    let newNetwork = structuredClone(network)

    for (let i=1; i<newNetwork.length; i++) {
        let layer = newNetwork[i]
        let prevLayer = newNetwork[i-1]

        let weightMatrix, bias = initWeightBiasLayer(layer.nodes.length, prevLayer.nodes.length, layer.inputLayer)
        layer.weightMatrix = weightMatrix
        layer.bias = bias
    }

    return newNetwork
}