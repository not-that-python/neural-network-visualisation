import homePage from './public/iter_4/index.html'

let server = Bun.serve({
  routes: {
    '/': homePage,
    '/now': () => new Response(Date.now()), // a dynamic route
    // ... more dynamic server-processed routes here
  }
})
console.log(`Listening on ${server.url}`)
