import { createNetwork, drawNetwork, updateNetwork, createAnimation, sleep } from "./functions/funcs.js";

let ctx = canvas.getContext('2d')

// using state to keep all global variables (except previousTime) contained here
let state = {
    width: canvas.width,
    height: canvas.height,
    network: createNetwork(),
    animations: []
}

let previousTime = 0
function drawLoop(currentTime) {
    let deltaTime = currentTime - previousTime

    // draw or clear background
    ctx.clearRect(0, 0, state.width, state.height)

    // draw everything
    drawNetwork(ctx, state.network, state.width, state.height)

    // update everything
    ;[state.network, state.animations] = updateNetwork(state.network, state.animations, deltaTime)
    
    // call self
    previousTime = currentTime
    requestAnimationFrame(drawLoop)
}
requestAnimationFrame(drawLoop)

// used keypresses for testing purposes
function onUpKey() {
    console.log('up arrow pressed')
    state.animations.push(createAnimation(0, 0.5, 2000, 0))
    console.log(state.animations)
}
function onDownKey() {
    console.log('down arrow pressed')
    state.animations.push(createAnimation(0.5, 0, 2000, 0))
    console.log(state.animations)
}
function onLeftKey() {
    console.log('left key pressed')
    state.animations.push(createAnimation(-1, 1, 2000, 1, true))
    console.log(state.animations)
}
function onRightKey() {
    console.log('right key pressed')
    state.animations.push(createAnimation(1, -1, 2000, 1, true))
    console.log(state.animations)
}

window.onkeydown = (event) => {
    if (event.key === "ArrowUp") {
        onUpKey()
    } else if (event.key === "ArrowDown") {
        onDownKey()
    } else if (event.key === "ArrowLeft") {
        onLeftKey()
    } else if (event.key === "ArrowRight") {
        onRightKey()
    }
}

// function animateForever() {
//     // console.log('animate!')
//     if (state.animations.length === 0) {
//         state.animations.push(createAnimation(state.network[0].value, Math.random(), 2000, 0))
//         state.animations.push(createAnimation(state.network[0].value, state.network[0].value, 2000, 0))
//     }
//     setTimeout(animateForever, 0)
// }
// canvas.onclick = animateForever
