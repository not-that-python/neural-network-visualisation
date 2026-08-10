// SC1

//create functions

export function createNode(prevNodeIndx=null, inputNode=false) {
    let node = {
        value: 0,
        inputNode,
        prevNodeIndx: inputNode? null : prevNodeIndx, // may not be needed, but is being kept for ease of future calculations just in case
        weight: inputNode? null : 1 - 2*Math.random()
    }
    return node
}

export function createNetwork() {
    // creates initial state to define everything in the canvas
    let network = []
    network.push(createNode(null, true))
    network.push(createNode(0))
    
    return network
}

// position calculation functions
export function calculateX(networkPadding, numNodes, whichNode, width) {
    // input validation
    if (networkPadding >= width / 2) {throw new Error("networkPadding must be less than half the canvas width")}
    if (whichNode > numNodes) {throw new Error("whichNode must be less than or equal to numNodes")}

    let networkArea = width - 2*networkPadding
    // defines the "slice" out of the canvas that the network gets
    let fraction = numNodes === 1? 1/2 : (whichNode - 1) / (numNodes - 1) 
    // defines how far along the node / layer is: defines it's position

    let x = networkPadding + (networkArea * fraction)
    return x
}

export function calculateY(height) {
    // later, when layers are added, this function will be used to find the y-position of a node within a layer
    return height / 2
}

export function assignPos(node, x, y) {
    // assigns a node it's co-ordinates, to draw itself and connections
    let newNode = structuredClone(node)
    newNode.x = x
    newNode.y = y
    return newNode
}

// drawing functions
export function drawNode(ctx, node, radius) {
    // credit to W3Schools for how to draw a circle
    ctx.beginPath();

    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);

    ctx.fillStyle = `rgb(${node.value*255}, ${node.value*255}, ${node.value*255})`;
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = 'white'; // white outline on black background, like 3b1b's own simulations
    ctx.closePath()

    ctx.stroke();
}

export function drawConnection(ctx, startX, startY, endX, endY, weight) {
    // credit to W3Schools for how to draw a line
    ctx.beginPath()

    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)


    if (weight >= 0) {
        // make blue if weight is positive
        ctx.lineWidth = weight * 5
        ctx.strokeStyle = `rgba(3, 144, 252, ${weight})`
    } else {
        // make orange if weight is negative
        ctx.lineWidth = weight * -1 * 5
        ctx.strokeStyle = `rgba(252, 144, 3, ${weight*-1})`
    }
    
    ctx.closePath()

    ctx.stroke()
}

export function drawNetwork(ctx, network, width, height) {
    let networkPadding = 200
    let numNodes = network.length
    let radius = 30 // radius of every node

    // assign positions: could replace this with two iterating functions
    for (let i=0; i<numNodes; i++) {
        let whichNode = i+1
        
        let x = calculateX(networkPadding, numNodes, whichNode, width)
        let y = calculateY(height)

        network[i] = assignPos(network[i], x, y)
    }

    // draw connections
    for (let i=1; i<numNodes; i++) {
        let node = network[i]
        let prevNode = network[i-1]

        drawConnection(ctx, node.x, node.y, prevNode.x, prevNode.y, node.weight)
    }

    
    // draw nodes
    for (let i=0; i<numNodes; i++) {
        drawNode(ctx, network[i], radius)
    }
}

// SC2
// export function testAnimation(deltaTime, node) {
//     let newNode = structuredClone(node)
//     newNode.value = Math.random()
//     return newNode
// }

// export function testAnimation(deltaTime, node) {
//     let newNode = structuredClone(node)
//     newNode.x += deltaTime
//     return newNode
// }

export async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// credit to https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep

export function updateValueProperty(node, animation, updateWeight=false) {
    let curTime = Date.now()
    // console.log('updating...')
    let newNode = structuredClone(node)
    let key = updateWeight? 'weight' : 'value'

    let timePassed = curTime - animation.startDate
    let difference = animation.endVal - animation.startVal

    newNode[key] = animation.startVal + (difference * (timePassed / animation.duration))

    // to stop animation once the duration is up
    if (timePassed >= animation.duration) {
        newNode[key] = animation.endVal // snap to correct value
        console.log('duration up')
        return [newNode, false]
    }
    console.log(animation, timePassed)
    return [newNode, true]

}

export function updateNetwork(network, animations, deltaTime) {
    let newNetwork = structuredClone(network)
    let newAnimations = structuredClone(animations)


    for (let i=0; i<newAnimations.length; i++) {
        let animation = newAnimations[i]

        let nodeIndx = animation.nodeIndx
        let node = newNetwork[nodeIndx]

        
        let [newNode, continueAnimating] = updateValueProperty(node, animation, animation.updateWeight)
        newNetwork[nodeIndx]  = newNode
        
        if (!continueAnimating) {
            console.log('stop animating!')
            newAnimations.splice(i, 1)
            console.log(newNetwork[nodeIndx])
        }

    }
    
    return [newNetwork, newAnimations]
}

export function createAnimation(startVal, endVal, duration, nodeIndx, updateWeight=false) {
    console.log('created animation')
    return {
        startVal,
        endVal,
        duration,
        startDate: Date.now(), // used to keep track of duration
        nodeIndx,
        updateWeight
    }
}
 