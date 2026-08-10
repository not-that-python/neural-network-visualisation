import * as func from './functions/funcs.js'
import * as tf from '@tensorflow/tfjs'

// define state.width and state.height
func.state.width = canvas.width
func.state.height = canvas.height

// get necessary elements from the DOM
let ctx = canvas.getContext('2d')
let pauseBtn = document.getElementById('pauseBtn')
let hoverElem = document.getElementById('hoverElem')

// create network
let network = func.createNetwork(...func.state.dimensions)

// update state based on the DOM
pauseBtn.onclick = () => {func.state.paused = func.state.paused? false : true}
canvas.onmousemove = (e) => {func.state.mouse = {x: e.offsetX, y: e.offsetY}}


function drawLoop(currentTime) {
    let deltaTime = currentTime - func.state.previousTime
    func.state.warpedTime += func.state.paused ? 0 : deltaTime * func.state.speed

    // check text of pauseBtn
    pauseBtn.innerText = `Click to `.concat(func.state.paused? 'Play' : 'Pause')

    // clear background
    ctx.clearRect(0, 0, func.state.width, func.state.height)

    // update everything
    func.updateState(network)

    // draw everything
    func.drawState(ctx, network, func.state)

    // check for hovering
    func.hover(func.state.mouse.x, func.state.mouse.y, network, hoverElem)

    // call self
    func.state.previousTime = currentTime
    requestAnimationFrame(drawLoop)
}

requestAnimationFrame(drawLoop)

async function animateAll() {
    let falseInputs = [1, 1]

    await func.giveNetworkInputs(network, falseInputs)
    await func.forwardPropogation(network)

}
animateAll()