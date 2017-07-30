// @ts-check

// Expects to be called like: node scripts/run_all_extensions.js

var shell = require("shelljs")
var fs = require("fs")
const files = fs.readdirSync("data")
files.forEach(file => {
  console.log(files.indexOf(file) + "/" + files.length)
  if (file.startsWith(".")) {
    return
  }

  const folder = "data/" + file
  const pngs = fs.readdirSync(folder).filter(f => f.includes(".png"))
  pngs.forEach(png => {
    const cmd = `pngquant '${folder}/${png}' -f --speed 1 --output '${folder}/${png}'`
    console.log(cmd)
    shell.exec(cmd)
  })
})
