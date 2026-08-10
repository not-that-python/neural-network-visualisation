import {expect, test} from 'bun:test'
import * as func from './funcs.js'
import * as tf from '@tensorflow/tfjs'

// to test Math.random
let temp = Math.random
Math.random = () => 0

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

// test ('mapTo2DTensor function', async () => {
//     const double = (x) => x*2

//     // expect(await func.mapTo2DTensor(tf.tensor([[1, 2, 3], [4, 5, 6]]), double)).toEqual(tf.tensor([[2, 4, 6], [8, 10, 12]]))
//     // expect(await func.mapTo2DTensor(tf.tensor([[1]]), double)).toEqual(tf.tensor[[2]])
//     // expect(await func.mapTo2DTensor(tf.tensor([[1, 1, 1]]), double)).toEqual(tf.tensor([[2, 2, 2]]))
//     // unsure if they are working as intended or not. seems to be an issue with ids (id = 2 when it shoud equal 1), possibly this is how tf tensors that are identical are differentiated?

//     // Have decided to do the above tests manually, using console logs
//     let testTF
    
//     let randomTF = tf.tensor([0])
//     console.log('made random tensor because of node.js advertising')
//     console.log()

//     console.log('expecting tensor [[2, 4, 6], [8, 10, 12]]:')
//     testTF = await func.mapTo2DTensor(tf.tensor([[1, 2, 3], [4, 5, 6]]), double)
//     testTF.print()
//     console.log()

//     console.log('expecting tensor [[2]]:')
//     testTF = await func.mapTo2DTensor(tf.tensor([[1]]), double)
//     testTF.print()
//     console.log()

//     console.log('expecting tensor [[2, 2, 2]]:')
//     testTF = await func.mapTo2DTensor(tf.tensor([[1, 1, 1]]), double)
//     testTF.print()
//     console.log()

//     // dispose of tensors to clear memory
//     randomTF.dispose()
//     testTF.dispose()

//     // only takes 2D tensor
//     // expect(await func.mapTo2DTensor(tf.tensor([1, 1, 1]), double)).toThrow()
//     // works as expected, .toThrow() is once again failing to catch error

// })

// restore Math.random for safety purposes
// Math.random = temp

test ('calculateActivations function', async () => {
    let weights = tf.tensor([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ])
    let prevActivations = tf.tensor([[1], [1], [1], [1]])
    let biasVector = tf.tensor([[1], [1], [1]])
    let testTF

    // manual testing, due to tensor ids
    let exp = func.sigmoid(1)
    console.log(`expecting tensor [[${exp}], [${exp}], [${exp}]]`)
    testTF = await func.calculateActivations(prevActivations, weights, biasVector)
    testTF.print()

    // weights = tf.tensor
    weights = tf.tensor([
        [1, 0, 0]
        // [0, 0, 0],
        // [0, 0, 0]
    ])
    prevActivations = tf.tensor([[1], [1], [1]])
    biasVector = tf.tensor([[0]])
    console.log(`expecting tensor [[${exp}]]`)
    testTF = await func.calculateActivations(prevActivations, weights, biasVector)
    testTF.print()

    let identity = tf.tensor([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ])
    // test that 0 will go to 0.5
    prevActivations = tf.tensor([[1], [1], [1]])
    biasVector = tf.tensor([[-1], [-1], [-1]])
    console.log(`expecting tensor [[0.5], [0.5], [0.5]]`)
    testTF = await func.calculateActivations(prevActivations, identity, biasVector)
    testTF.print()
    
    // dispose of tensors
    weights.dispose()
    identity.dispose()
    prevActivations.dispose()
    biasVector.dispose()

})

// test('sigmoid', () => {
//     expect(func.sigmoid(0)).toBe(0.5)
//     expect(func.sigmoid(100000)).toBe(1)
//     expect(func.sigmoid(-100000)).toBe(0)
// })

test('getActivationVector', () => {
    // manual testing, due to tensor ids

    let testLayer = func.createLayer(4, false, 0, 3)
    let testTF
    console.log('expecting tensor [[0], [0], [0], [0]]')
    testTF = func.getActivationVector(testLayer)
    testTF.print()

    testLayer = func.createLayer(1, true, 2)
    console.log('expecting tensor [[0]]')
    testTF = func.getActivationVector(testLayer)
    testTF.print()

    testTF.dispose()

})

test('createBiasVector function', () => {
    // manual testing, due to tensor ids
    let testTF

    console.log('expecting tensor [[0], [0], [0]]')
    testTF = func.createBiasVector(0, 3)
    testTF.print()

    console.log('expecting tensor [[1]]')
    testTF = func.createBiasVector(1, 1)
    testTF.print()
})