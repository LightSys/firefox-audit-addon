/*
* @file
* eventPage.js runs scripts on installation and startup that check the audit status of the browser.
*
* Requirements:
*
* 0. On installation, asking the user for a URL to load a configuration file from: done.
*
* 1. Scanning the browser's configuration to determine if any risky configuration options are set: there are only a few methods,
* mostly related to content (chrome.contentSettings).
*
* 2. Scanning the browser's extensions/add-ons list, and comparing that with a configurable whitelist: done.
*
* 3. Determining how long it has been since the browser was updated: we are able to read current version, but not the latest.
*  Apparently Chrome updates automatically, so this may not be a problem.
*
*/


var defaultUrl = "https://raw.githubusercontent.com/LightSys/firefox-audit-addon/master/files/testconfig.json";
var passAudit = null;
var headerEntry = null;

// All of the next four functions get the config file and run the audit. These occur at diferent ponts of Chrome's lifecycle.
// This runs when the addon is installed
chrome.runtime.onInstalled.addListener(function () {
    getAndCheckConfig(suppressAlert = false);
});

// This runs on Firefox startup
chrome.runtime.onStartup.addListener(function () {
    getAndCheckConfig(suppressAlert = true);
});

// This runs when any extension is enabled
chrome.management.onEnabled.addListener(function () {
    getAndCheckConfig(suppressAlert = true);
});

// This runs when any extension is enabled
chrome.management.onDisabled.addListener(function () {
    getAndCheckConfig(suppressAlert = true);
});


/**
 * Downloads the latest config file, and runs the audit on the browser.
 */
function checkConfigFile(configUrl, suppressAlert) {
    if (configUrl == null) {
        return;
    }

    // Get the json file from the configUrl and parse it.
    $.ajax({url: configUrl, cache: false})
        .done(function (json) {
            console.log(json);
            var parsedJson = JSON.parse(json);


            //This obtains all of the installed extensions which are sent as a callback.
            getInstalledExtensions(function (installedExtensions) {

                //Create array to store IDs in
                var whitelistIds = new Array();

                //Get each json object, store its ID in the array.
                for (var obj in parsedJson.whitelist) {
                    whitelistIds.push(parsedJson.whitelist[obj].id);
                }
                //Compare the list of installed extensions. Then obtain a list of not whitelisted extensions back.
                compareExtensions(whitelistIds, installedExtensions,
                    function (badAddons) {
                        if (badAddons.length > 0) {
                            auditFailed(badAddons, suppressAlert);
                        } else {
                            auditPassed(suppressAlert);
                        }
                        console.log(passAudit);
                        setStatusAndHash(defaultUrl);
                    });
            });
        })
        .fail(function (error) {
            console.log(error);
        });
}

//Changes the icon on the toolbar to blue if the Audit Passes.

function auditPassed(suppressAlert) {
    chrome.browserAction.setIcon({
        path: "icon/icon48x48.png"
    });
    if (!suppressAlert) {
        console.log("Audit Completed Successfully!");
    }
    passAudit = true;
    set_badAddons(badAddons = null);
}

//Changes the icon on the toolbar to red if the Audit Fails.

function auditFailed(badAddons, suppressAlert) {
    chrome.browserAction.setIcon({
        path: "icon/fail-icon48x48.png"
    });
    if (!suppressAlert) {
        console.log("These addons are not in the whitelist: \n"
            + badAddons.join("\n")
            + "\n\nPlease uninstall or disable these addons and restart Chrome before continuing.");
    }
    //set the global and config variable
    passAudit = false;
    set_badAddons(badAddons);
}


/**
 * Compares two lists of extensions: a whitelist, and those currently
 * installed and enabled. Returns those that are installed and enabled
 * but not whitelisted.
 * @Param {Array} whitelistIds, the ID's of the extensions that are whitelisted
 * @Param {Array} installedExtensions, the extensions installed and enabled.
 * @Return {Array} done, when finished, returns a list of extensions installed and enabled but not whitelisted.
 */
function compareExtensions(whitelistIds, installedExtensions, done) {
    var badAddons = new Array();
    // loop through extensions, compare with whitelist
    installedExtensions.forEach(function (extension) {
        // if there is an installed extension that is not on the whitelist, add it to the array of bad addons
        if (whitelistIds.indexOf(extension.id) < 0) {
            badAddons.push(extension.name);
        }
    });
    done(badAddons);
}

/**
 * Gets a list of currently installed and enabled extensions.
 * @Return done, when finished, returns a list of enabled extensions.
 */
function getInstalledExtensions(done) {
    // This gets all Firefox extensions and apps
    chrome.management.getAll(function (items) {
        var installedExtensions = new Array();
        items.forEach(function (item) {
            // If the item is an extension and it is enabled, add it to the list, else do nothing.
            item.type == "extension" && item.enabled == true ? installedExtensions.push(item) : null;
        });
        //send the installed extensions to the caller
        done(installedExtensions);
    });
}

/**
 * Stores the add-on options to Chrome's persistent storage.
 * @Param theConfigUrl, the web address of the configuration file.
 */
function set_options(configUrl) {
    chrome.storage.sync.set({"ConfigUrl": configUrl}, function () {
        console.log("Wrote url successfully (url: " + configUrl + ")");
    });
}

function set_badAddons(badAddons) {
    chrome.storage.sync.set({"BadAddons": badAddons}, function () {
        console.log("Wrote BadAddons successfully");
    });
}

function set_passAudit(passAudit) {
    chrome.storage.sync.set({"PassAudit": passAudit}, function () {
        console.log("Wrote PassAudit successfully");
    });
}

function getAndCheckConfig(suppressAlert = false) {
    get_options(function (configUrl) {
        if (configUrl == null) {
            configUrl = prompt("Please enter the URL of the config file: ", defaultUrl);
            set_options(configUrl);
        }
        checkConfigFile(configUrl, suppressAlert);
    });
}

/**
 * Gets the add-on options from Firefox's persistent storage.
 * @Return done, the configuration file URL
 */
function get_options(done) {
    chrome.storage.sync.get("ConfigUrl", function (items) {
        done(items.ConfigUrl);
    });
}

//Gets the URL of the Configuration File from the User.

function getConfigUrl(done) {
    get_options(function (configUrl) {
        if (configUrl == null) {
            configUrl = prompt("Please enter the URL of the config file: ", defaultUrl);
            set_options(configUrl);
        }
        done(configUrl);
    });
}

function get_badAddons(done) {
    chrome.storage.sync.get("badAddons", function (items) {
        done(items.BadAddons);
    });
}

function get_passAudit(done) {
    chrome.storage.sync.get("passAudit", function (items) {
        done(items.PassAudit);
    });
}

function setStatusAndHash(configUrl) {

    //Checks if there is anything in the configUrl
    console.log("Result: " + configUrl);

    //gets json file from configUrl
    $.ajax({url: configUrl, cache: false})
        .done(function (json) {
            //parses file and a store in variable, then stringifies and stores.
            var parsed = JSON.parse(json);
            var stringifiedConfig = JSON.stringify(parsed.whitelist);
            var auditMessage = null;
            var saltPrng = null;
            var trimmedHmac = null;
            var hexSalt = null;
            var prng = new Uint32Array(1);

            console.log("Audit Status: " + passAudit);

            //Creates a Message if the Audit has Passed, Failed, or is in an Unknown state.

            function show_pass_fail(passes) {
                var messageStatus = "";

                if (passes != null) {
                    if (passes) {
                        messageStatus = "Passed";
                    } else {
                        messageStatus = "Failed";
                    }
                } else {
                    messageStatus = "Unknown";
                }
                return messageStatus;
            }

            auditMessage = show_pass_fail(passAudit);

            //Use SHA256 to turn the configuration file into a key"
            var hashKey = CryptoJS.SHA256(stringifiedConfig);
            console.log("Hash Key: " + hashKey + "\nShow Message: " + auditMessage);

            saltPrng = window.crypto.getRandomValues(prng);

            console.log("Salted PRNG: " + saltPrng);

            //Creates an HMAC and Assembles it.

            createHmac_And_Assemble(hashKey, saltPrng, auditMessage, function (hMACKey) {
                var convertString = new Number(saltPrng);

                hmacLength = hMACKey.length - 16;
                trimmedHmac = hMACKey.substring(0, hmacLength);
                hexSalt = (convertString).toString(16).toUpperCase();

                xAudit = auditMessage + " " + hexSalt + trimmedHmac;

                console.log("This is the HMAC: " + hMACKey + "\nLength: " + hmacLength + "\nTrimmed HMAC: " + trimmedHmac);
                console.log("X-Audit: " + xAudit);

                //Tells the website if the Audit has passed.
                headerEntry = {name: "X-Audit", value: xAudit};
            });
        })
        .fail(function (error) {
            console.log(error);
        })
}

//Function for creating the HMAC Salted Encryption.
function createHmac_And_Assemble(key, salt, message, done) {
    var saltedMessage = salt + message;
    var hMAC = CryptoJS.HmacSHA256(saltedMessage, key).toString();

    done(hMAC);
}