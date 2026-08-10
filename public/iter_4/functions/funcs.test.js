import {expect, test} from 'bun:test'
import * as func from './funcs.js'
import * as tf from '@tensorflow/tfjs'

// test('circleCollision function', () => {
//     expect(func.circleCollision(0, 0, 3, 4, 6)).toBe(true)
//     expect(func.circleCollision(0, 0, 3, 4, 5)).toBe(true)
//     expect(func.circleCollision(0, 0, 3, 4, 4)).toBe(false)

//     // negative numbers
//     expect(func.circleCollision(-1, -1, -4, -5, 6)).toBe(true)

//     // requires positive radius
//     // expect(func.circleCollision(-1, -1, -4, -5, 0)).toThrow()
//     // expect(func.circleCollision(-1, -1, -4, -5, -1)).toThrow()
//     // tests throw errors as expected: errors are not being caught
// })

test('findWeightedSums function', () => {
    // manual testing, due to tensor ids
    let randomTf = tf.tensor([1])
    randomTf.dispose()
    console.log('created random tensor because of node.js advertising')
    let weightMat = tf.tensor([[0, 0], [0, 0], [0, 0]])
    let prevActivations = tf.tensor([[1], [1]])
    let biasVector = tf.tensor([[0.5], [0.5], [0.5]])

    let testTf


    console.log('expecting tensor [[0.5], [0.5]]')
    testTf = func.findWeightedSums(weightMat, prevActivations, biasVector)
    testTf.print()

})