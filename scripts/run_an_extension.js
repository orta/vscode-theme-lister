// @ts-check

// Expects to be called like: node scripts/run_an_extension.js "an-old-hope-theme-vscode"
var path = require("path")
const fs = require("fs")

var extensionName = process.argv[2]
var insiders = true

var appPath = "/Users/orta/dev/projects/danger/danger-js"
var fileInApp = "/Users/orta/dev/projects/danger/danger-js/source/api/fetch.ts"
var appForTitle = path.basename(appPath)

var os = require("os")
var shell = require("shelljs")

var code = insiders ? "code-insiders" : "code"
var appName = insiders ? "Code - Insiders" : "Code"
var extensionsDir = insiders ? "~/.vscode-insiders/extensions" : "~/.vscode/extensions"

var install_in_code_workaround = true

// /Users/orta/Library/Application Support/Code - Insiders/User/settings.json
var settingPath = path.join(os.homedir(), "Library", "Application Support", appName, "User", "settings.json")

var extension = JSON.parse(fs.readFileSync("data/" + extensionName + "/extension.json", "utf8"))
var extensionID = extension.publisher.publisherName + "." + extension.extensionName
var folderExtensionID = extension.publisher.publisherName + "." + extension.extensionName.toLowerCase()

// Kill the current VS Code
var killProcess = () => {
  var electronProcessPath = "Visual Studio " + appName + ".app/Contents/MacOS/Electron"
  var codeProcess = "ps -ax | grep '" + electronProcessPath + "'"
  var codeProcesses = shell.exec(codeProcess)
  const lines = codeProcesses.stdout.split("\n")
  const lineWeWant = lines.find(l => l.includes("Applications/"))
  if (lineWeWant) {
    let processID = lineWeWant.split(" ")[0]
    if (processID === "") {
      processID = lineWeWant.split(" ")[1]
    }
    shell.exec("kill " + processID)
    shell.exec("sleep 2")
  }
}
// // Start with the app closed
killProcess()

if (install_in_code_workaround) {
  // Install via `code` then move it into the insiders
  shell.exec("code --install-extension " + extensionID)
  shell.mv("~/.vscode/extensions/" + folderExtensionID + "-*", "~/.vscode-insiders/extensions")
  shell.exec("sleep 3")
} else {
  // Call the extension to start installing
  console.log("Installing: " + extensionID)
  shell.exec(code + " --install-extension " + extensionID)
  // Give it three seconds to do that
  shell.exec("sleep 3")
}

// We need to get the package.json for the theme
// We don't know the theme's version so glob using cat
const installedThemeFolder = extensionsDir + "/" + folderExtensionID
var extensionPackage = shell.cat(installedThemeFolder + "*" + "/package.json")

// Copy all tmthemes + JSON for later
shell.cp("-r", installedThemeFolder + "*/theme/*.tmtheme", "data/" + extensionName + "/")
shell.cp("-r", installedThemeFolder + "*/theme/*.tmTheme", "data/" + extensionName + "/")
shell.cp("-r", installedThemeFolder + "*/theme/*.json", "data/" + extensionName + "/")

// Themes could be licensed, so note this
shell.cp("-r", installedThemeFolder + "*/LICENSE", "data/" + extensionName + "/")

var extensionSettings = JSON.parse(extensionPackage)
extensionSettings.contributes.themes.forEach(function(theme) {
  var themeName = theme.label

  killProcess()

  // Set the theme in the user settings
  var currentSettings = JSON.parse(fs.readFileSync(settingPath, "utf8"))
  currentSettings["workbench.colorTheme"] = themeName
  fs.writeFileSync(settingPath, JSON.stringify(currentSettings, null, "  "), "utf8")

  // Re-open with the new theme
  shell.exec(code + " " + appPath)
  shell.exec("sleep 1")
  shell.exec(code + " " + fileInApp)

  // Time to let extensions load, and for the text to be colored
  shell.exec("sleep 3")
  console.log("./window_list.py '" + appName + "'")
  const screengrabProcesses = shell.exec("./window_list.py '" + appName + "'")
  const screenshotProcess = screengrabProcesses.stdout.split("\n").find(l => l.includes(appForTitle)).split(" ")[0]

  var screengrab = "screencapture -l " + screenshotProcess + " 'data/" + extensionName + "/" + themeName + ".png'"
  console.log(screengrab)
  shell.exec(screengrab)
}, this)

// Mainly to ensure a clean slate, and make it obvious something has happened
killProcess()
shell.exec(code + " --uninstall-extension " + extensionID)
