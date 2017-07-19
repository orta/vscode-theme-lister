// @ts-check

// Expects to be called like: node scripts/run_all_extensions.js

var shell = require("shelljs")
var fs = require("fs")
fs.readdirSync("data").forEach(file => {
  if (file.startsWith(".")) {
    return
  }

  shell.exec("yarn extension -- " + file)
})
