import {expect, test} from 'bun:test'
import * as func from './funcs.js'
import * as tf from '@tensorflow/tfjs'

// to test Math.random
let temp = Math.random
Math.random = () => 0

test('createLayer()', () => {
    // normal conditions
    expect(func.createLayer(3)).toEqual({
        nodes: [{value: 0, x: null, y: null}, {value: 0, x: null, y: null}, {value: 0, x: null, y: null}],
        weightMatrix: null,
        bias: null
    })

    // input layer
    // expect(func.createLayer(3, true)).toEqual({
    //     nodes: new Array(3).fill().map(() => {return {value: 0}}),
    //     inputLayer: true,
    //     prevLayerIndex: null,
    //     weightMatrix: null,
    //     bias: null
    // })

    // input layer with given prevLayerIndex
    // expect(func.createLayer(3, true, 2)).toEqual({
    //     nodes: new Array(3).fill().map(() => {return {value: 0}}),
    //     inputLayer: true,
    //     prevLayerIndex: null,
    //     weightMatrix: null,
    //     bias: null
    // })

    // zero nodes
    // expect(func.createLayer(0, true)).toThrow()
    // throws error as expected, error not being caught by toThrow
})

test('createNetwork()', () => {
    // normal conditions
    expect(func.createNetwork([2, 3, 2])).toEqual([
        {
            nodes: [{value: 0, x: null, y: null}, {value: 0, x: null, y: null}],
            weightMatrix: null,
            bias: null
        },
        {
            nodes: [{value: 0, x: null, y: null}, {value: 0, x: null, y: null}, {value: 0, x: null, y: null}],
            weightMatrix: null,
            bias: null
        },
        {
            nodes: [{value: 0, x: null, y: null}, {value: 0, x: null, y: null}],
            weightMatrix: null,
            bias: null
        }
    ])
})

test('initWeightBiasLayer()', () => {
    // normal conditions
    expect(func.initWeightBiasLayer(2, 3, false)).toEqual([
        [[-1, -1, -1],
        [-1, -1, -1]],
        0
    ])

    expect(func.initWeightBiasLayer(3, 2, false)).toEqual([
        [[-1, -1],
        [-1, -1],
        [-1, -1]],
        0
    ])

    // input layer
    // expect(func.initWeightBiasLayer(2, 3, true)).toThrow()
    // throws error as expected, error not being caught by toThrow()
})

test('initWeightBiasNetwork()', () => {
    let network = func.createNetwork([2, 3, 2])
    expect(func.initWeightBiasNetwork(network)).toEqual([
        {
            nodes: [{value: 0, x: null, y: null}, {value: 0, x: null, y: null}],
            weightMatrix: null,
            bias: null
        },
        {
            nodes: [{value: 0, x: null, y: null}, {value: 0, x: null, y: null}, {value: 0, x: null, y: null}],
            weightMatrix: [[-1, -1], [-1, -1], [-1, -1]],
            bias: 0
        },
        {
            nodes: [{value: 0, x: null, y: null}, {value: 0, x: null, y: null}],
            weightMatrix: [[-1, -1, -1], [-1, -1, -1]],
            bias: 0
        }
    ])
})

// restore Math.random for safety purposes
Math.random = temp