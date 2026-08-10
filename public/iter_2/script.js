import * as func from './functions/funcs.js'

let ctx = canvas.getContext('2d')

let state = {
    width: canvas.width,
    height: canvas.height,
    dimensions: [2, 4, 3],
    previousTime: 0,
    warpedTime: 0,
    paused: false,
    speed: 1
}
let network = func.createNetwork(...state.dimensions)

function drawLoop(currentTime) {
    let deltaTime = currentTime - state.previousTime
    state.warpedTime += state.paused ? 0 : deltaTime * state.speed

    // clear background
    ctx.clearRect(0, 0, state.width, state.height)

    // update everything
    func.updateState(network, state.warpedTime)

    // draw everything
    func.drawNetwork(ctx, network, state.width, state.height)

    // call self
    state.previousTime = currentTime
    requestAnimationFrame(drawLoop)
}

requestAnimationFrame(drawLoop)

// testing animation
async function animateAll() {
    // nodes:
    await func.animateLayer(network, [0.5, 0.8], 2000, state.warpedTime, false, 0)
    await func.animateLayer(network, [0.1, 0.3, 0.2, 0.1], 2000, state.warpedTime, false, 1)
    await func.animateLayer(network, [1, 0.3, 0.9], 2000, state.warpedTime, false, 2)

    // weights:
    // layer 1 only
    let newWeightMat = new Array(4).fill(new Array(2).fill(1))
    await func.animateLayer(network, newWeightMat, 1000, state.warpedTime, true, 1)

}
animateAll()
animateAll()