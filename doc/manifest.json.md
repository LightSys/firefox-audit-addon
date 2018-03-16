## About `manifest.json`

The `manifest.json` file is a file that the Firefox browser reads to obtain important information about the add-on. Below is a line-by-line explanation of what exactly this file does.

```json
{
  "manifest_version": 2,
  "name": "Firefox Audit Addon",
  "version": "1.0",
  "description": "Audits browser addons and informs certain websites of audit status",
```

These fields are basic information about the add-on. The only one that may seem a little confusing is the `manifest_version` field, which describes the format of this file.

```json
  "icons": { "16": "icon/icon16x16.png",
             "48": "icon/icon48x48.png",
            "128": "icon/icon128x128.png" }, 
```

This sets the different icons for Chrome to use with the extension. The `"16"` and `"48"` icons are simply scaled version of the full icon. The `"128"` icon is in fact a 96 by 96 pixel icon, with a padding of 16 pixels of transparency on each side, as is recommended. 
_(Note: The `"128"` icon is only used during installation and in the Chrome Web Store)._

```json
  "browser_action": {
    "default_popup": "popup.html",
    "default_title": "Addon Auditor"
  },
```

The `"browser_action"` field places an icon for the add-on in the Chrome toolbar. The `"default_popup"` field specifies an html file to be displayed when the icon is clicked, and the `"default_title"` field contains the text displayed when the mouse is hovered over the icon. 

There is also the option to add a `"default_icon"` field, but if it is left unspecified, it uses the closest size from the icons specified above, scales it (if it isn't already the exact same size), and then displays it. 

```json
  "options_ui" : {
    "page": "options.html",
    "chrome_style": false
  },
```

Sets the options page html file, and that it is not in "Chrome style." 

```json
  "content_security_policy": "script-src 'self' 'unsafe-eval'; object-src 'self'",
```

This sets the security policy to allow `eval()` and its relatives, like `setTimeout(String)`, `setInterval(String)`, and `new Function(String)`.

```json
  "background": {
    "scripts": ["/libraries/jquery-3.2.0.min.js",
      "/libraries/cryptojs/rollups/sha256.js",
	  "/libraries/cryptojs/rollups/hmac-sha256.js",
	  "/libraries/cryptojs/components/enc-base64-min.js",
	  "/libraries/cryptojs/components/enc-utf16-min.js",
      "backgroundPage.js",
      "changeHeader.js"]
  },
```

This section of the file specifies scripts to run. When these scripts are run is specified in the scripts themselves, but if left unspecified, they are to run continuously. 


```json
	"applications": {
	"gecko": {
		"id": "audit@lightsys.org",
		"strict_min_version": "42.0"
  }
},
```

This section defines the permanent ID of the extension so that it can be included on the whitelist for approved extensions

```json 
  "permissions": [
	"tabs",
	"privacy",
    "management",
    "webRequest",
    "storage",
    "webRequestBlocking",
    "https://*/*",
	"browserSettings",
  ]
}
```

This requests several permissions from the user so that the extension can access different information and thereby carry out its intended purpose.
Details of what each of these are used for are provided below:

The `"tabs"` permission allows the ability to get a list of opened tabs, filtered by various criteria, and to open, update, move, reload, and remove tabs.
We are currently unsure as to whether this permission is still doing anything for us, as it is a port from the Chrome version, but we're going to keep it in here until we have time to test it.

The `"privacy"` permission allows access and the ability to modify privacy-related browser settings.
We did some looking into this but did not have time to fully explore what might be done with it. However, it does look promising and might be a viable way
to audit privacy settings and perhaps security settings.

The `"management"` permission allows the add-on access to the `chrome.management` API.

The `"webRequest"` and `"webRequestBlocking"` permissions allow us to make the required changes to headers when visiting secure sites.
It also let us pull the URL from the browser before the user navigates to that location.

`"storage"` requests for persistent storage, a place to maintain a consistent configuration file URL between Chrome sessions. 

`"https://*/*"` is requesting permissions to access any https website and any of their extensions as well.

The `"browserSettings"` permission enables our extension to modify certain global browser settings.

[Return to the README.md file](../README.md)
