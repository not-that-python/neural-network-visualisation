import * as tf from '@tensorflow/tfjs';

// exporting state like this so I can allow imported functions to be non-pure
export let state = {
    // width: canvas.width,
    // height: canvas.height,
    dimensions: [2, 4, 4, 3],
    previousTime: 0,
    warpedTime: 0,
    paused: false,
    speed: 1,
    mouse: {x: null, y: null}
}

// create functions:
export function createLayer(numNodes, inputLayer=false, bias=null, prevLayerIndx=null, numPrevNodes=null) {
    let layer = {
        nodes: new Array(numNodes).fill().map(() => {return {value: 0}}), // array of objects
        inputLayer,
        animations: [], // array of animations for each node
        prevLayerIndx: inputLayer? null: prevLayerIndx,
        numPrevNodes: inputLayer? null: numPrevNodes,
        bias,
        weights: inputLayer? null: new Array(numNodes).fill(new Array(numPrevNodes).fill(0))
        // weight matrix is a 2D array rather than a matrix at this stage, since calculations aren't needed
    }

    // assign weights separately:
    if (layer.weights) {
        for (let i=0; i<layer.weights.length; i++) {
            layer.weights[i] = new Array(layer.weights[i].length)

            for (let j=0; j<layer.weights[i].length; j++) {
                layer.weights[i][j] = ((Math.random()*2) - 1)
            }
        }
        // TO DO: replace these for loops with some kind of iteration function like reduce idk
    }
    
    return layer
}

export function createNetwork(...dimensions) {
    let network = []
    if (!dimensions.length) return // don't bother if there's no input

    // first, push input layer
    network.push(createLayer(dimensions[0], true, Math.random()))
    console.log(network[0].bias)

    // then, push all other layers
    for (let i=1; i<dimensions.length; i++) {
        let numNodes = dimensions[i]
        let numPrevNodes = dimensions[i-1]
        let bias = i==dimensions.length-1? null : (1 - Math.random()*2)
        // the output layer has no bias
        network.push(createLayer(numNodes, false, bias, i-1, numPrevNodes))

        console.log(network[i].bias)
    }
    return network
}

// position calculation
export function calculateOrdinate(span, networkPadding, numItems, whichItem) {

    // edge case(s)
    if (numItems === 1) return span/2 // put in the middle if only 1 item

    // input validation
    if (networkPadding >= span/2) throw new Error('network padding must be less than half the given span')
    if (numItems <= 0) throw new Error ('number of items must be greater than 0')
    if (whichItem <= 0) throw new Error ('whichItem must be greater than 0')

    let networkSpan = span - (2*networkPadding)
    let location = (whichItem-1) / (numItems-1)

    let ordinate = networkPadding + (networkSpan * location)

    return ordinate
}
// draw functions
export function drawState(ctx, network, state) {
    drawNetwork(ctx, network, state.width, state.height)
    drawPause(ctx, state.paused)
}

/// HSV to RGB converter
// Source - https://stackoverflow.com/a
// Posted by danielm2402, modified by community. See post 'Timeline' for change history
// Retrieved 2025-11-26, License - CC BY-SA 4.0

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}


export function drawNode(ctx, x, y, value, radius, inputLayer=false, outputLayer=false) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    // decide fill style
    if (inputLayer) {

        // input nodes are green
        // colour is hsl(111, 88%, 81%) or hsv(111, 34%, 98%)
        let {r, g, b} = HSVtoRGB(111 / 360, 0.34, value)
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`

    } else if (outputLayer) {

        // output nodes are purple
        // colour is hsl(263, 44%, 79%) or hsv(263, 21%, 88%)
        let {r, g, b} = HSVtoRGB(263 / 360, 0.21, value)
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`

    } else {

        // other nodes are blue / turquoise
        // colours is hsl(180, 51%, 73%) or hsv(180, 32%, 87%)
        let {r, g, b} = HSVtoRGB(180 / 360, 0.32, value)
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`

    }
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "white";
    ctx.stroke();
}

export function drawConnection(ctx, startX, startY, endX, endY, weight) {
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)

    ctx.lineWidth = Math.abs(weight*5)

    ctx.strokeStyle = weight>=0? `rgba(3, 144, 252, ${weight})` : `rgba(252, 144, 3, ${weight*-1})`
    // make blue if positive, orange if negative

    ctx.stroke()
}

export function drawNetwork(ctx, network, width, height) {
    let networkPaddingX = 200
    let networkPaddingY = 200
    let radius = 30
    let numLayers = network.length

    // assign positions to each node
    for (let i=0; i<numLayers; i++) {
        let whichLayer = i+1
        let x = calculateOrdinate(width, networkPaddingX, numLayers, whichLayer)

        let layer = network[i]
        let numNodes = layer.nodes.length
        for (let j=0; j<numNodes; j++) {
            let whichNode = j+1
            let y = calculateOrdinate(height, networkPaddingY, numNodes, whichNode)

            network[i].nodes[j] = {
                value: network[i].nodes[j].value,
                x: x,
                y: y
            };
        }
    }

    // draw connections
    for (let i=1; i<numLayers; i++) { // starting from second layer as input layer has no weight matrix

        let weightMat = network[i].weights

        let layer = network[i]
        let prevLayer = network[i-1]

        // first, iterate over current layer for starting positions
        for (let a=0; a<layer.nodes.length; a++) {
            let node = layer.nodes[a]
            let [startX, startY] = [node.x, node.y]

            // then iterate over previous layer for ending positions
            for (let b=0; b<prevLayer.nodes.length; b++) {
                let prevNode = prevLayer.nodes[b]
                let [endX, endY] = [prevNode.x, prevNode.y]

                // find relevant weight
                let weight = weightMat[a][b]

                drawConnection(ctx, startX, startY, endX, endY, weight)
            }
        }
    }

    // then draw nodes
    for (let i=0; i<numLayers; i++) {
        let layer = network[i]
        for (let j=0; j<layer.nodes.length; j++) {
            let node = layer.nodes[j]
            // decide if layer is input, output, or neither
            let inputLayer = i === 0
            let outputLayer = i === numLayers-1

            drawNode(ctx, node.x, node.y, node.value, radius, inputLayer, outputLayer)
        }
    }
}

export function drawPause(ctx, paused) {
    let alphaVal = paused? 1 : 0

    ctx.beginPath()
    ctx.lineWidth = 2
    ctx.strokeStyle = `rgb(255, 255, 255, ${alphaVal})`
    ctx.fillStyle = `rgb(255, 255, 255, ${alphaVal})`

    ctx.fillRect(15, 15, 10, 30)
    ctx.fillRect(35, 15, 10, 30)
    ctx.stroke()
}

// animation
export function animateAttribute(startVal, endVal, startTime, duration) {

    // if duration is up, snap to the endVal
    if (state.warpedTime >= startTime + duration) {
        return [endVal, true]
    }

    // otherwise, continue as normal
    let timePassed = state.warpedTime - startTime
    let difference = endVal - startVal
    let pct = timePassed / duration

    return [startVal + (pct * difference), false]
}

export function animate(network, to, duration, indxTuple, updateWeight, layerIndx) {
    // could do some input validation for indxTuple based on updateWeight

    let [indx1, indx2, indx3] = indxTuple
    let from = network[layerIndx][indx1][indx2][indx3]

    return {
        start: state.warpedTime,
        duration,
        from,
        to,
        layerIndx,
        indxTuple,
        updateWeight

    }
}

export async function animateLayer(network, toValues, duration, updateWeight, layerIndx) {
    let layer = network[layerIndx]

    return new Promise(async resolve => {
        if (updateWeight) {
            // iterate through the weight matrix and use animate to change each to it's new value
            
            let weightMat = layer.weights
            for (let a=0; a<weightMat.length; a++) {
                let weightRow = weightMat[a]
                for (let b=0; b<weightRow.length; b++) {

                    let indxTuple = ['weights', a, b]
                    layer.animations.push(animate(network, toValues[a][b], duration, indxTuple, updateWeight, layerIndx))
                }

                    
            }
        } else {
            // iterate through the list of nodes and use animate to change each to it's new value

            let nodes = layer.nodes
            for (let j=0; j<nodes.length; j++) {

                let indxTuple = ['nodes', j, 'value']
                layer.animations.push(animate(network, toValues[j], duration, indxTuple, updateWeight, layerIndx))
            }
        }

        // while loop to delay resolving promise until all animations are completed

        while (true) {
            if (network[layerIndx].animations.every(item => item === null)) {
                network[layerIndx].animations = []
                break
            }
            await sleep (1)
        }

        resolve()
    })
}

export function updateState(network) {
    for (let i=0; i<network.length; i++) {
        let layer = network[i]

        if (layer.animations.length) {
            for (let j=0; j<layer.animations.length; j++) {
                let animation = layer.animations[j]

                if (animation !== null) {
                    let [indx1, indx2, indx3] = animation.indxTuple

                    let finished
                    ;[network[i][indx1][indx2][indx3], finished] = animateAttribute(animation.from, animation.to, animation.start, animation.duration)

                    if (finished) {layer.animations[j] = null}
                }
            }
        }
    }
}

export async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}


// collision

export function distance(x1, y1, x2, y2) {
    return Math.sqrt(((x1-x2)**2) + ((y1-y2)**2))
}

// circle collision
export function circleCollision(x, y, circleX, circleY, radius) {
    if (radius <= 0) {throw new Error('radius must be greater than 0')}
    return distance(x, y, circleX, circleY) <= radius
}

export function hoverNode(node, mouseX, mouseY, radius) {
    if (circleCollision(mouseX, mouseY, node.x, node.y, radius)) {
        return node.value.toFixed(2)
    } else {return false}
}

// line collision
export function lineCollision(x, y, lineX1, lineY1, lineX2, lineY2, buffer) {
    let d1 = distance(x, y, lineX1, lineY1)
    let d2 = distance(x, y, lineX2, lineY2)
    let lineLen = distance(lineX1, lineY1, lineX2, lineY2)

    return (d1+d2 <= lineLen+buffer && d1+d2 >= lineLen-buffer)
}

export function hoverConnection(node1, node2, mouseX, mouseY, weight) {
    if (lineCollision(mouseX, mouseY, node1.x, node1.y, node2.x, node2.y, 0.1)) {
        return (weight.toFixed(3))
    } else {return false}
}

export function hover(mouseX, mouseY, network, hoverElem) {

    let hoverValues = []
    let finalInnerText = 'Hover over parts of the network to view their values'
    for (let i=0; i<network.length; i++) {
        let layer = network[i]

        // iterate over nodes to check collisions
        for (let j=0; j<layer.nodes.length; j++) {
            let node = layer.nodes[j]

            let hoverNodeValue = hoverNode(node, mouseX, mouseY, 30)

            if (hoverNodeValue) {

                hoverValues.push(['node', j, i, hoverNodeValue])
            }
        }

        if (i !== 0 && hoverValues.length === 0) {
            // iterate over weights only if not input layer (i.e. the first layer) and if the hoverValues list is empty (i.e. no nodes are being collided with)

            let weightMat = layer.weights
            for (let a=0; a<weightMat.length; a++) {
                for (let b=0; b<weightMat[a].length; b++) {
                    let weight = weightMat[a][b]
                    let prevLayer = network[layer.prevLayerIndx]
                    let node1 = prevLayer.nodes[b]
                    let node2 = layer.nodes[a]

                    let hoverConnectionValue = hoverConnection(node1, node2, mouseX, mouseY, weight)

                    if (hoverConnectionValue) {
                        hoverValues.push(['weight', a, b, i, hoverConnectionValue])
                    }
                }
            }
        }
    }

    if (hoverValues.length !== 0) {
        let hoverTuple = hoverValues[0]
        if (hoverTuple[0] == 'node') {
            let [type, j, i, hoverNodeValue] = hoverTuple

            finalInnerText = `node ${j+1} in layer ${i+1}: ${hoverNodeValue}`
        } else if (hoverTuple[0] === 'weight') {
            let [type, a, b, i, hoverConnectionValue] = hoverTuple
            finalInnerText = `weight (${a}, ${b}) in layer ${i+1}: ${hoverConnectionValue}`
        }
    }

    hoverElem.innerText = finalInnerText
}

// forward propogation
export const sigmoid = (x) => 1 / (1 + (Math.E **(-1*x)))

export async function mapTo2DTensor(inputTensor, mapFunc) {
    // throw error if the input tensor isnt 2d
    if (inputTensor.shape.length !== 2) {throw new Error(`tensor must be 2D (gave tensor of shape ${inputTensor.shape})`)}

    let newTensor = []
    let inputArray = await inputTensor.array()
    // must be awaited because .array() function returns a promise

    for (let row of inputArray) {
        newTensor.push(row.map(mapFunc))
    }

    newTensor = tf.tensor(newTensor)
    return newTensor


}

export async function calculateActivations(prevActivations, weightMat, biasVector, activationFunc=sigmoid) {
    let Z = tf.matMul(weightMat, prevActivations)
    let sum = tf.add(Z, biasVector)
    let curActivations = await mapTo2DTensor(sum, activationFunc)
    return curActivations
}

export function getActivationVector(layer) {
    return tf.tensor(layer.nodes.map(node => [node.value,]))
}

export async function giveNetworkInputs(network, inputActivations) {
    // this function exists to reduce the number of arguments needed to give inputs, and also to improve readability of code
    await animateLayer(network, inputActivations, 2000, false, 0)
}

export async function forwardPropogation(network) {
    // this function assumes the given network has already been given inputs. this cnanot be validated, as all 0s is a perfectly valid set of inputs into a network.
    // this function will not give inputs into the network itself

    for (let i=1; i<network.length; i++) {
        console.log(`calculating activations of layer ${i+1}`)
        console.log()
        // starting from i=1 to skip input layer, as forward propogation of this layer does not need to be calculated

        let layer = network[i]
        let prevLayer = network[i-1]

        let weightMat = layer.weights
        let prevActivations = getActivationVector(prevLayer)
        console.log(`previous activations:`)
        prevActivations.print()
        let biasVector = createBiasVector(prevLayer.bias, layer.nodes.length)
        console.log(`bias vector:`)
        biasVector.print()

        // calculate new activations for the current layer
        let newActivations = await calculateActivations(prevActivations, weightMat, biasVector)
        console.log(`activations of this layer (using sigmoid function):`)
        newActivations.print()

        // convert newActivations back to flat array
        newActivations = await newActivations.array()
        newActivations = newActivations.flat()

        // animate the new activations being assigned to the network
        await animateLayer(network, newActivations, 1000, false, i)

    }
}

export function createBiasVector(bias, vectorHeight) {
    let biasVector = new Array(vectorHeight)
    for (let i=0; i<vectorHeight; i++) {
        biasVector[i] = [bias,]
    }
    return tf.tensor(biasVector)
}