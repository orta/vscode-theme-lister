# Notes on trying to automate generating a screenshot for every VS Code theme.

So the general gist should be:

* Download all JSON for every theme (`yarn download_json`)
* Loop though JSON themes
* For each theme:

  - Install the extension
  - Set the theme ( user settings JSON: `"workbench.colorTheme": "Slime",`)
  - `killall code`
  - Launch VS Code on a known folder
  - Delay for x amount for code to launch properly
  - Take screenshot with name that matches id
  - Uninstall theme

Rinse and repeat. Create a site with images.

## Useful terminal pieces

Can use an insider build of VS Code, so that all this doesn't affect your main installation. Swap `code` with `code-insiders`.

* See all extensions: `code --list-extensions`
* Install an extension: `code --install-extension [id]`
* Uninstall an extension: `code --uninstall-extension [id]`
* Take a screenshot of a code window:
  - Code: `screencapture -l (./window_list.py Cod | head -1| awk '{print $1}') out.png`
  - Insiders: `screencapture -l (./window_list.py Insiders | head -1| awk '{print $1}') out.png`

## VS Code search API:

Page 1
```sh
curl 'https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery' \
-XPOST \
-H 'Referer: https://marketplace.visualstudio.com/search?target=VSCode&category=Themes&sortBy=Downloads' \
-H 'Content-Type: application/json' \
-H 'Origin: https://marketplace.visualstudio.com' \
-H 'Host: marketplace.visualstudio.com' \
-H 'Accept: application/json;api-version=4.0-preview.1;excludeUrls=true' \
-H 'Connection: keep-alive' \
-H 'Accept-Language: en-gb' \
-H 'Accept-Encoding: gzip, deflate' \
-H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/604.1.28 (KHTML, like Gecko) Version/11.0 Safari/604.1.28' \
-H 'Cookie: Gallery-Service-UserIdentifier=dba0f6ff-a6c2-409e-8ef7-1295627dee8c; _ga=GA1.3.2093659710.1473526659; Market_SelectedTab=VSCode; Gallery-Service-UserIdentifier=dba0f6ff-a6c2-409e-8ef7-1295627dee8c; returnCDNURL=True; icxid=1487427689384-1303146671040768; VstsSession={"PersistentSessionId":"9d1d2079-e6d3-40c6-99a6-7896aa0cc42c","PendingAuthenticationSessionId":"00000000-0000-0000-0000-000000000000","CurrentAuthenticationSessionId":"b4715319-f54b-4baa-97fb-0b5d14187f3b"}; AMCV_EA76ADE95776D2EC7F000101%40AdobeOrg=T; _ga=GA1.2.2093659710.1473526659; MSFPC=ID=c09dc1db3fe4154d891dae1ef448f626&CS=1&LV=201609&V=1' \
-H 'Content-Length: 475' \
-H 'X-TFS-Session: fc15a7f0-3543-46f8-b800-77a767d33a60' \
-H 'X-VSS-ReauthenticationAction: Suppress' \
-H 'X-Requested-With: XMLHttpRequest' \
--data-binary '{"assetTypes":["Microsoft.VisualStudio.Services.Icons.Default","Microsoft.VisualStudio.Services.Icons.Branding","Microsoft.VisualStudio.Services.Icons.Small"],"filters":[{"criteria":[{"filterType":8,"value":"Microsoft.VisualStudio.Code"},{"filterType":10,"value":"target:\"Microsoft.VisualStudio.Code\" "},{"filterType":12,"value":"5122"},{"filterType":5,"value":"Themes"}],"direction":2,"pageSize":54,"pageNumber":1,"sortBy":4,"sortOrder":0,"pagingToken":null}],"flags":870}'
```

page 2
``` sh
curl 'https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery' \
-XPOST \
-H 'Referer: https://marketplace.visualstudio.com/search?target=VSCode&category=Themes&sortBy=Downloads' \
-H 'Content-Type: application/json' \
-H 'Origin: https://marketplace.visualstudio.com' \
-H 'Host: marketplace.visualstudio.com' \
-H 'Accept: application/json;api-version=4.0-preview.1;excludeUrls=true' \
-H 'Connection: keep-alive' \
-H 'Accept-Language: en-gb' \
-H 'Accept-Encoding: gzip, deflate' \
-H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/604.1.28 (KHTML, like Gecko) Version/11.0 Safari/604.1.28' \
-H 'Cookie: Gallery-Service-UserIdentifier=dba0f6ff-a6c2-409e-8ef7-1295627dee8c; _ga=GA1.3.2093659710.1473526659; Market_SelectedTab=VSCode; Gallery-Service-UserIdentifier=dba0f6ff-a6c2-409e-8ef7-1295627dee8c; returnCDNURL=True; icxid=1487427689384-1303146671040768; VstsSession={"PersistentSessionId":"9d1d2079-e6d3-40c6-99a6-7896aa0cc42c","PendingAuthenticationSessionId":"00000000-0000-0000-0000-000000000000","CurrentAuthenticationSessionId":"b4715319-f54b-4baa-97fb-0b5d14187f3b"}; AMCV_EA76ADE95776D2EC7F000101%40AdobeOrg=T; _ga=GA1.2.2093659710.1473526659; MSFPC=ID=c09dc1db3fe4154d891dae1ef448f626&CS=1&LV=201609&V=1' \
-H 'Content-Length: 475' \
-H 'X-TFS-Session: 70d7eb2b-e5cf-4094-a3ec-3b7ed84ef655' \
-H 'X-VSS-ReauthenticationAction: Suppress' \
-H 'X-Requested-With: XMLHttpRequest' \
--data-binary '{"assetTypes":["Microsoft.VisualStudio.Services.Icons.Default","Microsoft.VisualStudio.Services.Icons.Branding","Microsoft.VisualStudio.Services.Icons.Small"],"filters":[{"criteria":[{"filterType":8,"value":"Microsoft.VisualStudio.Code"},{"filterType":10,"value":"target:\"Microsoft.VisualStudio.Code\" "},{"filterType":12,"value":"5122"},{"filterType":5,"value":"Themes"}],"direction":2,"pageSize":54,"pageNumber":2,"sortBy":4,"sortOrder":0,"pagingToken":null}],"flags":870}'
```

looks like it just needs pageNumber to change in the JSON.
