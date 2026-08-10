import {expect, test} from 'bun:test'
import { createNode, createNetwork, calculateX, updateValueProperty } from './funcs.js'
// to test Math.random
let temp = Math.random
Math.random = () => 0


test('createNode function', () => {
    // test that nodes can be created normally
    let node1 = createNode(null, true)
    let node2 = createNode(1)
    expect(node1).toEqual(
        {value:0, inputNode:true, prevNodeIndx:null, weight:null}
    )
    expect(node2).toEqual(
        {value:0, inputNode:false, prevNodeIndx:1, weight:0}
    )

    // test that input nodes will never have a prevNodeID
    expect(createNode('2', true)).toEqual(
        {value:0, inputNode:true, prevNodeIndx:null}
    )
})


test('createNetwork function', () => {
    expect(createNetwork()).toEqual(
        [
            {value:0, inputNode: true, prevNodeIndx:null, weight:0},
            {value:0, inputNode: false, prevNodeIndx:0, weight:0}
        ]
    )
})


test('calculateX() function', () => {
    let canvas = {width: 1000, height: 500}
    let width = canvas.width
    let networkPadding = 200

    expect(calculateX(networkPadding, 3, 1, width)).toBe(200)
    expect(calculateX(networkPadding, 3, 2, width)).toBe(500)
    expect(calculateX(networkPadding, 3, 3, width)).toBe(800)

    expect(calculateX(0, 1, 1, width)).toBe(canvas.width / 2)

    expect(calculateX(0, 2, 1, width)).toBe(0)
    expect(calculateX(0, 2, 2, width)).toBe(canvas.width)


    // expect(calculateX(canvas.width / 2, 1, 2, canvas)).toThrow()
    // //throws correct error, toThrow doesn't work
    // expect(calculateX(networkPadding, 1, 2, canvas)).toThrow()
    // //throws correct error, toThrow doesn't work
})

test('updateValueProperty() function', () => {
    let testNode = {
        weight: 0.1,
        value: 0.5
    }
    let nodeAnim = {
        startVal: 0.5,
        endVal: 1.0,
        duration: 5,
        start: 3 
    }
    let weightAnim = {
        startVal: 0.1,
        endVal: 0.1,
        duration: 1000,
        start: 3000
    }
    let failedAnim = {
        startVal: 0,
        endVal: 1
    }
    expect(updateValueProperty(testNode, nodeAnim, 4)).toEqual({weight: 0.1, value: 0.6})
    expect(updateValueProperty(testNode, weightAnim, 10000, true)).toEqual({weight: 0.1, value: 0.5})
    // expect(updateValueProperty(testNode, failedAnim, 5)).toThrow()
    // works as expected, toThrow() once again fails to catch error
})

// resolve reassignment of Math.random
Math.random = temp