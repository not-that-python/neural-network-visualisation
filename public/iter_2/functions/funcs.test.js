import {expect, test} from 'bun:test'
import * as func from './funcs.js'

// to test Math.random
let temp = Math.random
Math.random = () => 0

test('createLayer function', () => {
    // testing input layers
    expect(func.createLayer(2, true)).toEqual(
        {nodes:[{value: 0}, {value: 0}],
        animations: [],
        inputLayer: true,
        prevLayerIndx: null,
        numPrevNodes: null,
        weights: null}
    )

    // testing other layers & weight matrix dimensions
    expect(func.createLayer(2, false, 0, 3)).toEqual(
        {nodes:[{value: 0}, {value: 0}],
        animations: [],
        inputLayer: false,
        prevLayerIndx: 0,
        numPrevNodes: 3,
        weights: [[-1, -1, -1], [-1, -1, -1]]}
    )

    // testing if an input layer will always hav relevant properties set to null regardless of other given arguments
    expect(func.createLayer(1, true, 3, 2)).toEqual(
        {nodes:[{value: 0}],
        animations: [],
        inputLayer: true,
        prevLayerIndx: null,
        numPrevNodes: null,
        weights: null}
    )
})

test('createNetwork function', () => {
    expect(func.createNetwork(1, 1)).toEqual(
        [func.createLayer(1, true), func.createLayer(1, false, 0, 1)]
    )
    expect(func.createNetwork(1, 3, 2, 2)).toEqual(
        [
            func.createLayer(1, true),
            func.createLayer(3, false, 0, 1),
            func.createLayer(2, false, 1, 3),
            func.createLayer(2, false, 2, 2)
        ]
    )
    expect(func.createNetwork()).toEqual(undefined)
})

test('calculateOrdinate function', () => {
    expect(func.calculateOrdinate(80, 20, 5, 3)).toBe(40)

    // first item will be on the edge of the padding
    expect(func.calculateOrdinate(80, 15, 20394, 1)).toBe(15)
    // last item will be on the other edge of the padding
    expect(func.calculateOrdinate(80, 15, 6789, 6789)).toBe(80-15)
    // when there's only 1 item, it immediately goes in the middle
    expect(func.calculateOrdinate(80, 15, 1, 1)).toBe(40)
    
    // padding must be less than half
    // expect(func.calculateOrdinate(80, 40, 2, 2)).toThrow()
    // certain values must be greater than 0
    // expect(func.calculateOrdinate(80, 20, -2, -2)).toThrow()
    // expect(func.calculateOrdinate(80, 20, 2, 0)).toThrow()
    // expect(func.calculateOrdinate(80, 20, 0, 0)).toThrow()
    // tests work as expected, errors are not being caught by toThrow()
})

test ('animateAttribute function', () => {
    let warpedTime = 1000 // milliseconds

    // increase value
    expect(func.animateAttribute(0, 10, 500, 1000, warpedTime)).toBe(5)
    // decrease value
    expect(func.animateAttribute(10, 0, 800, 1000, warpedTime)).toBe(8)
    // no time passed
    expect(func.animateAttribute(0, 10, 1000, 1000, warpedTime)).toBe(0)
    // duration up
    expect(func.animateAttribute(0, 10, 0, 1000, warpedTime)).toBe(10)
    // duration beyond up
    expect(func.animateAttribute(0, 10, 0, 500, warpedTime)).toBe(10)
})

// restore Math.random for safety purposes
// Math.random = temp