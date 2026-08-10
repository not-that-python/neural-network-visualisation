// create functions:
export function createLayer(numNodes, inputLayer=false, prevLayerIndx=null, numPrevNodes=null) {
    let layer = {
        nodes: new Array(numNodes).fill().map(() => {return {value: 0}}), // array of objects
        inputLayer,
        animations: [], // array of animations for each node
        prevLayerIndx: inputLayer? null: prevLayerIndx,
        numPrevNodes: inputLayer? null: numPrevNodes,
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
    network.push(createLayer(dimensions[0], true))

    // then, push all other layers
    for (let i=1; i<dimensions.length; i++) {
        let numNodes = dimensions[i]
        let numPrevNodes = dimensions[i-1]
        network.push(createLayer(numNodes, false, i-1, numPrevNodes))
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
export function drawNode(ctx, x, y, value, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = `rgb(${value*255}, ${value*255}, ${value*255})`;
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
            drawNode(ctx, node.x, node.y, node.value, radius)
        }
    }
}

// animation

export function animateAttribute(startVal, endVal, startTime, duration, warpedTime) {

    // if duration is up, snap to the endVal
    if (warpedTime >= startTime + duration) {
        return [endVal, true]
    }

    // otherwise, continue as normal
    let timePassed = warpedTime - startTime
    let difference = endVal - startVal
    let pct = timePassed / duration

    return [startVal + (pct * difference), false]
}

export function animate(network, to, duration, warpedTime, indxTuple, updateWeight, layerIndx) {
    // could do some input validation for indxTuple based on updateWeight

    let [indx1, indx2, indx3] = indxTuple
    let from = network[layerIndx][indx1][indx2][indx3]

    return {
        start: warpedTime,
        duration,
        from,
        to,
        layerIndx,
        indxTuple,
        updateWeight

    }
}

export async function animateLayer(network, toValues, duration, warpedTime, updateWeight, layerIndx) {
    let layer = network[layerIndx]

    return new Promise(async resolve => {
        if (updateWeight) {
            // iterate through the weight matrix and use animate to change each to it's new value
            
            let weightMat = layer.weights
            for (let a=0; a<weightMat.length; a++) {
                let weightRow = weightMat[a]
                for (let b=0; b<weightRow.length; b++) {

                    let indxTuple = ['weights', a, b]
                    layer.animations.push(animate(network, toValues[a][b], duration, warpedTime, indxTuple, updateWeight, layerIndx))
                }

                    
            }
        } else {
            // iterate through the list of nodes and use animate to change each to it's new value

            let nodes = layer.nodes
            for (let j=0; j<nodes.length; j++) {

                let indxTuple = ['nodes', j, 'value']
                layer.animations.push(animate(network, toValues[j], duration, warpedTime, indxTuple, updateWeight, layerIndx))
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

export function updateState(network, warpedTime) {
    for (let i=0; i<network.length; i++) {
        let layer = network[i]

        if (layer.animations.length) {
            for (let j=0; j<layer.animations.length; j++) {
                let animation = layer.animations[j]

                if (animation !== null) {
                    let [indx1, indx2, indx3] = animation.indxTuple

                    let finished
                    ;[network[i][indx1][indx2][indx3], finished] = animateAttribute(animation.from, animation.to, animation.start, animation.duration, warpedTime)

                    if (finished) {layer.animations[j] = null}
                }
            }
        }
    }
}

export async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}