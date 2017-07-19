// @ts-check

// Expects to be called like: node scripts/run_an_extension.js "an-old-hope-theme-vscode"

var extensionName = process.argv[2]
var insiders = true

var appPath = "/Users/orta/dev/projects/danger/danger-js"
var fileInApp = "/Users/orta/dev/projects/danger/danger-js/source/api/fetch.ts"

var path = require("path")
const fs = require("fs")

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

var killProcess = () => {
  var electronProcessPath = "Visual Studio " + appName + ".app/Contents/MacOS/Electron"
  var codeProcess = "ps -ax | grep '" + electronProcessPath + "' |  awk '{print $1}' | head -n 1"
  var killProcess = shell.exec(codeProcess)
  shell.exec("kill " + killProcess)
  shell.exec("sleep 2")
}
// Start with the app closed
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
var extensionPackage = shell.cat(extensionsDir + "/" + folderExtensionID + "*" + "/package.json")
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
  var screengrab =
    "screencapture -l $(./window_list.py '" +
    appName +
    "' | head -1| awk '{print $1}') " +
    "'data/" +
    extensionName +
    "/" +
    themeName +
    ".png'"
  shell.exec(screengrab)
}, this)

// Mainly to ensure a clean slate, and make it obvious something has happened
killProcess()
