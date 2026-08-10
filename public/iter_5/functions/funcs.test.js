import {expect, test} from 'bun:test'
import * as func from './funcs.js'
import * as tf from '@tensorflow/tfjs'

// to test Math.random
let temp = Math.random
Math.random = () => 0

// test createLayer
test('createLayer()', () => {
    // normal conditions
    expect(func.createLayer(3, false, 2)).toEqual({
        nodes: new Array(3).fill().map(() => {return {value: 0}}),
        inputLayer: false,
        prevLayerIndex: 2,
        weightMatrix: null,
        bias: null
    })

    // input layer
    expect(func.createLayer(3, true)).toEqual({
        nodes: new Array(3).fill().map(() => {return {value: 0}}),
        inputLayer: true,
        prevLayerIndex: null,
        weightMatrix: null,
        bias: null
    })

    // input layer with given prevLayerIndex
    expect(func.createLayer(3, true, 2)).toEqual({
        nodes: new Array(3).fill().map(() => {return {value: 0}}),
        inputLayer: true,
        prevLayerIndex: null,
        weightMatrix: null,
        bias: null
    })

    // zero nodes?
    expect(func.createLayer(0, true)).toEqual({
        nodes: [],
        inputLayer: true,
        prevLayerIndex: null,
        weightMatrix: null,
        bias: null
    })
})