## About `backgroundPage.js`

This file is a background page, which runs code asynchronously in the background at installation and during startup. After installation, the add-on queries for a configuration file URL, and checks to see if installed extensions are whitelisted. On startup, it checks if the currently enabled extensions are not on the whitelist, and alerts the user if they aren't. 

#### Detailed Description (for developers)

This script file contains two global variables, which are declared near the top of the file:

```javascript
var configUrl = null;
var passAudit = null;
```

On installation, the script prompts the user for a configuration URL (the example configuration is the default value for the prompt). 

_Prompting the user for a configuration URL._  
![Prompting the user for a configuration URL](https://raw.githubusercontent.com/LightSys/chrome-audit-addon/master/doc/backgroundPage.js_img/backgroundPage.js_img00.png)

The file, which is formatted as JSON, downloaded with JQuery, and parsed. To learn more about the configuration file, see the following documentation files:  
[The example configuration script](files/testconfig.json.md)  
[How to write a custom configuration script](writing_config.md)

On installation, each time Chrome is started, and when an extension is enabled or disabled, this script runs `checkConfigFile()`. This gets the current whitelist of extensions from the `configUrl` variable (which is set at installation, stored persistently, and can be modified from the options page), and compares it to the list of enabled extensions (generated by `getInstalledExtensions()`) using the `compareExtensions()` function. 

This requires the `chrome.management` API to run, sets the `passAudit` variable, and alerts the user of there are any non-approved extensions enabled. 

_Alerting the user of non-approved extensions_  
![Alerting the user of non-approved extensions](https://raw.githubusercontent.com/LightSys/chrome-audit-addon/master/doc/backgroundPage.js_img/backgroundPage.js_img01.png)

[View the source code for this file](../backgroundPage.js). 

[Return to the README.md file](../README.md)