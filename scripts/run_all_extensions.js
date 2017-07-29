// @ts-check

// Expects to be called like: node scripts/run_all_extensions.js

var shell = require("shelljs")
var fs = require("fs")
fs.readdirSync("data").forEach(file => {
  // skip dupes
  // console.log(file)
  if (file.startsWith(".")) {
    return
  }

  const pngs = fs.readdirSync("data/" + file).filter(f => f.includes(".png"))
  if (pngs.length === 0) {
    console.log(file)
    shell.exec("yarn extension -- " + file)
  }
})
