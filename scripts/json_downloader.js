// @ts-check

const request = require("superagent")
const path = require("path")
const fs = require("fs")

// https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery
// Lols: I used Safari to get a cURL, then Paw to import cURL, then Paw to export to superagent
// superagent isn't my general choice, but I'll take what I can get.

const requestForPage = pageNumber =>
  request
    .post("https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery")
    .send({
      filters: [
        {
          pageSize: 54,
          sortBy: 4,
          sortOrder: 0,
          pageNumber: pageNumber,
          direction: 2,
          pagingToken: null,
          criteria: [
            {
              value: "Microsoft.VisualStudio.Code",
              filterType: 8,
            },
            {
              value: 'target:"Microsoft.VisualStudio.Code" ',
              filterType: 10,
            },
            {
              value: "5122",
              filterType: 12,
            },
            {
              value: "Themes",
              filterType: 5,
            },
          ],
        },
      ],
      assetTypes: [
        "Microsoft.VisualStudio.Services.Icons.Default",
        "Microsoft.VisualStudio.Services.Icons.Branding",
        "Microsoft.VisualStudio.Services.Icons.Small",
      ],
      flags: 870,
    })
    .set("X-Requested-With", "XMLHttpRequest")
    .set("X-Tfs-Session", "fc15a7f0-3543-46f8-b800-77a767d33a60")
    .set("Connection", "keep-alive")
    .set("Accept-Encoding", "gzip, deflate")
    .set("Content-Type", "application/json")
    .set("Origin", "https://marketplace.visualstudio.com")
    .set(
      "User-Agent",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/604.1.28 (KHTML, like Gecko) Version/11.0 Safari/604.1.28"
    )
    .set("X-Vss-Reauthenticationaction", "Suppress")
    .set(
      "Cookie",
      'Gallery-Service-UserIdentifier=dba0f6ff-a6c2-409e-8ef7-1295627dee8c; _ga=GA1.3.2093659710.1473526659; Market_SelectedTab=VSCode; Gallery-Service-UserIdentifier=dba0f6ff-a6c2-409e-8ef7-1295627dee8c; returnCDNURL=True; icxid=1487427689384-1303146671040768; VstsSession={"PersistentSessionId":"9d1d2079-e6d3-40c6-99a6-7896aa0cc42c","PendingAuthenticationSessionId":"00000000-0000-0000-0000-000000000000","CurrentAuthenticationSessionId":"b4715319-f54b-4baa-97fb-0b5d14187f3b"}; AMCV_EA76ADE95776D2EC7F000101%40AdobeOrg=T; _ga=GA1.2.2093659710.1473526659; MSFPC=ID=c09dc1db3fe4154d891dae1ef448f626&CS=1&LV=201609&V=1'
    )
    .set("Referer", "https://marketplace.visualstudio.com/search?target=VSCode&category=Themes&sortBy=Downloads")
    .set("Host", "marketplace.visualstudio.com")
    .set("Accept-Language", "en-gb")
    .set("Accept", "application/json;api-version=4.0-preview.1;excludeUrls=true")
    .set("Content-Length", "475")
    .redirects(0)

var page = 1

const handleExtensions = (err, res) => {
  if (err || !res.ok) {
    console.log("Oh no! error")
  } else {
    console.log(page)
    page++
    if (res.body.results[0].extensions.length === 0) {
      console.log("Done")
      return
    }

    res.body.results[0].extensions.forEach(function(extension) {
      const folder = "data/" + extension.extensionName
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder)
      }
      fs.writeFileSync(folder + "/extension.json", JSON.stringify(extension, null, "  "), "utf8")
    }, this)

    requestForPage(page).end(handleExtensions)
  }
}

const folder = "data/"
if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder)
}

requestForPage(1).end(handleExtensions)
