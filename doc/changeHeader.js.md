 ## About `changeHeader.js`

This file adds an extra HTTP header to requests when visiting secure websites, with the information of whether or not the browser passed the security audit. 

#### Detailed Description (for developers)

When visiting a website, it checks if it is specified in [the configuration file], and if it is, sends an X-Audit header.

Upon a web request, the script determines the requested URL. If the URL is one specified in [the configuration file], then the outcome of the audit is sent as a header.


Functions and methods used
------------------------------------

```js
getConfigUrl(function (configUrl) {
    //gets json file from configUrl
    $.ajax({url: configUrl, cache: false})
        .done(function (json) {
            var parsed = JSON.parse(json);

            createListener(configUrl);
			getAndCheckConfig(suppressAlert = false);
        })
        .fail(function (error) {
            console.log(error);
        })
});
```

The getConfigUrl function acquires the json file from the configUrl variable and returns a done or a fail
event. After the done event it creates a listener which is set up (as seen below) to grab the header once it's called.
After the fail event it logs the error into the console. It will also call the getAndCheckConfig function which will result
in the user being prompted for a config url when the add-on is installed.

```js
function addAuditHeader(e, configUrl, allowedUrls) {
    var doneGot = e.url;

    console.log("Allowed Urls: " + allowedUrls);
    console.log(doneGot);

    //For now, just comparing plain text strings until hashed urls in config are available
    if (allowedUrls.indexOf(doneGot) !== -1) {
        e.requestHeaders.push(headerEntry);
    }
    return {requestHeaders: e.requestHeaders};
}
```

The addAuditHeader function logs a couple status reports, after which it compares plain text strings. In the future, once
the hash functions are ironed out, we will be comparing hashes.
This function returns the value of the X-Audit header.

```js
function createListener(configUrl, allowedUrls) {
    browser.webRequest.onBeforeSendHeaders.addListener(listened => {
	    checkUpdates(listened, configUrl, allowedUrls, urlUpdates);
        return addAuditHeader(listened, configUrl, allowedUrls);
    }, {urls: allowedUrls}, ["blocking", "requestHeaders"]);
}
```

The createListener function is an object that, when created, will call the checkUpdates function to see if updates are needed, 
and then snags the header and doesn't allow it to continue until our 
X-Audit header is added to the list of headers and sent on its way.

```js
function checkUpdates(e, configUrl, allowedUrls, urlUpdates) {
	var doneGot = e.url;
	var updateUrl;
	if (allowedUrls.indexOf(doneGot) !== -1) {
		updateUrl = doneGot + urlUpdates[(allowedUrls.indexOf(doneGot))].substr(1);
		onceADay(updateUrl);
	}
}
```

The checkUpdates function will check if the current url is on the list, and then will use the update url (specified in the config file)
when calling the onceADay function. 

```js
function onceADay(updateUrl){
    var date = new Date().toLocaleDateString();
    var lastUpdate;
	chrome.storage.sync.get("UpdateDate", function(item){
		lastUpdate = item.UpdateDate;
		if( lastUpdate !== date ){
			updateConfig(updateUrl);
			chrome.storage.sync.set({"UpdateDate": date},function(){console.log("Date updated to " + date)});
		}
	});
}
```

The onceADay function checks the last day that the config file was updated, and if it is not today, it will call the updateConfig function
to update the configuration file, and will update the update date to be today.

```js
function updateConfig(updateUrl){
	chrome.storage.sync.set({"ConfigUrl": updateUrl}, function () {
		console.log("Wrote url successfully (url: " + updateUrl + ")")});
	getAndCheckConfig(suppressAlert = false);
}
```

The updateConfig function sets the configuration file as the updated configuration file.

[Return to the README.md file](../README.md)
