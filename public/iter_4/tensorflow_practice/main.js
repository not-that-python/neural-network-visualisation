import * as tf from '@tensorflow/tfjs'
let a
let b
let c
// multiply matrices elementwise
a = tf.tensor([[1, 2], [3, 4]])
b = tf.tensor([[4, 3], [2, 1]])
// expecting [[4, 6], [6, 4]]
c = tf.mul(a, b)
c.print()
// got what was expected!

// finding the mean of a lot of matrices 
let matrixArray = [a, b, c]
// expecting [[3, 3.6666...], [3.6666..., 3]]
// summation
let sum = matrixArray[0]

for (let i=1; i<matrixArray.length; i++) {
    sum = tf.add(sum, matrixArray[i])
}
// multiply by scalar
let overN = tf.scalar(1 / matrixArray.length)
tf.mul(sum, overN).print()
// got what was expected!

// transpose matrix
let d = tf.tensor([
    [1, 2, 3, 4],
    [5, 6, 7, 8]
])
// expecting [[1, 5], [2, 6], [3, 7], [4, 8]]
tf.transpose(d).print()
// got what was expected!

// multiplying and transposing at the same time
let e = tf.tensor([[2], [3]])
let f = tf.tensor([[2], [3]])
// idk what im expecting tbh
// either 4 and 9 or 6 and 6
tf.matMul(e, f, false, true).print()
// [[4, 6], [6, 9]]
tf.matMul(e, f, true, false).print()
//[[13]]

// summing all elements in a vector
let g = tf.tensor([[1], [1], [1]])
g.sum().print()
console.log(g.sum().dataSync()[0])