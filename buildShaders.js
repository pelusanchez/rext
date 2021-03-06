const { readFileSync, writeFileSync } = require('fs')
const FRAGMENT_SHADER = readFileSync('./src/shaders/fragment_shader.frag').toString()
const VERTEX_SHADER = readFileSync('./src/shaders/vertex_shader.vert').toString()
const vertex = { FRAGMENT_SHADER, VERTEX_SHADER }
const fileContent = "const FRAGMENT_SHADER = `" + FRAGMENT_SHADER + "`\n" + 
  "const VERTEX_SHADER = `" + VERTEX_SHADER + "`\n" + 
  "export { FRAGMENT_SHADER, VERTEX_SHADER }\n"
writeFileSync('./src/shaders/index.ts', fileContent)
console.log("DONE")
