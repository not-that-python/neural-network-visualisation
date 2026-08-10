// for iteration 1
import { serveDir } from  'jsr:@std/http/file-server'
Deno.serve(req => serveDir(req, { fsRoot: './public' }))