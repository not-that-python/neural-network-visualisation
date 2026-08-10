import * as tf from '@tensorflow/tfjs';

// console.log(tf)

// adding matrices / tensors
let a = tf.tensor([1, 2, 3, 4])
let b = tf.tensor([2, 4, 6, 8])
let c = a.add(b)
// console.log(c)
c.print()

let x = tf.tensor([[1, 2], [3, 4]])
let y = tf.tensor([[1, 2], [3, 4]])
let z = tf.add(x, y)
z.print()

// matrix multiplication
a = tf.tensor2d([[1, 2],[3, 4]]);
b = tf.tensor2d([[2, 4, 6],[8, 10, 12]]);

a.matMul(b).print()

// matrix and vector multiplication

let enlarge = tf.tensor([[2, 0], [0, 2]])
let coords = tf.tensor([[3], [3]])

console.log(enlarge.shape)
console.log(coords.shape)

let result = tf.matMul(enlarge, coords)
result.print()

// convert array to matrix
let thingy = [[1, 2], [3, 4], [5, 6]]
let newThingy = tf.tensor(thingy)
newThingy.print()

//convert matrix to array
let thingyArray = newThingy.array()
console.log(thingyArray)
// need to do this to the layer to multiply by the weight matrix
let thingyLong = tf.tensor([1, 2, 3, 4, 5])
let thingyTall
thingyTall = thingyLong.reshape([5, 1])
// thingyTall = tf.transpose(thingyLong)
thingyTall.print()

// apply function to each element
// let thingyLongValues = newThingy.dataSync()
// let thingyDouble = tf.tensor(thingyLongValues.map((elem) => elem*2))
// console.log(newThingy.shape)
// thingyDouble.reshape(Array(newThingy.shape))
// thingyDouble.print()

// use newThingy to practice mapping

let original = tf.tensor([[1, 2, 3], [4, 5, 6]])
const square = (x) => x**2
let originalSquare = []
let originalArray = await original.array()
console.log(originalArray)
for (let row of originalArray) {
    originalSquare.push(row.map(square))
}
let originalSquareTensor = tf.tensor(originalSquare)
originalSquareTensor.print()

let D2Thingy = tf.tensor([[1], [2]])
console.log(D2Thingy.shape.length)
