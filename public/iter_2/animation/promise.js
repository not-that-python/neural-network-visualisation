/*
* returning the resolve function straight up:
**/

// let x = new Promise((resolve, reject) => {
//     console.log('promise code 1')
//     console.log('promise code 2')
//     return resolve
// })

// console.log(x)

// console.log('hello!')
// let y = await x

// console.log('finished awaiting x!')
// console.log(y)


/* 
* assigning resolve function to a passed argument:
**/

// function test(resolveHolder) {
//     return new Promise((resolve) => {
//         console.log('promise code')
//         resolveHolder = resolve
//     })
// }

// console.log('testing test')
// let revolse
// console.log(test())
// console.log(revolse)
// resolve = await test(revolse)
// console.log('i can rresolve whenever i want to')
// revolse()
// console.log('just resolved it')

/*
* assigning resovle function to a global variable
**/

// let resolveGlobal
// function test2() {
//     return new Promise(resolve => {
//         console.log('promise code')
//         resolveGlobal = resolve
//     })
// }

// console.log('testing test 2')
// console.log(test2())
// console.log(resolveGlobal)
// await test2()

// // console.log('i can resolve whenever i want to')
// resolve()
// console.log('resolved the promise!')

