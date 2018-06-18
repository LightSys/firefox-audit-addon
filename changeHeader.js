/*
* @file
* The changeHeader file adds an extra HTTP header (X-Audit) to requests when visiting secure websites, with the information if the browser passed the security audit.
*
* When visiting a website, it checks if it is specified in [the configuration file], and if it is, sends an X-Audit header.
*
* If the configuration file has not been updated that day, the config file will be updated.
*
* Upon a web request, the script determines the requested URL. If the URL is one specified in [the configuration file], then the outcome of the audit is sent as a header.
*
*
*/

var bg = chrome.extension.getBackgroundPage();

getConfigUrl(function (configUrl) {
    //gets json file from configUrl
    $.ajax({url: configUrl, cache: false, dataType: 'text'})
        .done(function (json) {
            var parsed = JSON.parse(json);

			createListener(configUrl, parsed.urlList.map(e => e.url), parsed.urlList.map(e => e.updates));
        })
        .fail(function (error) {
            console.log(error);
        })
});

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

function createListener(configUrl, allowedUrls, urlUpdates) {
    browser.webRequest.onBeforeSendHeaders.addListener(listened => {
		checkUpdates(listened, configUrl, allowedUrls, urlUpdates);
        return addAuditHeader(listened, configUrl, allowedUrls);
    }, {urls: allowedUrls}, ["blocking", "requestHeaders"]);
}

function checkUpdates(e, configUrl, allowedUrls, urlUpdates) {
	var doneGot = e.url;
	var updateUrl;
	if (allowedUrls.indexOf(doneGot) !== -1) {
		updateUrl = doneGot + urlUpdates[(allowedUrls.indexOf(doneGot))].substr(1);
		onceADay(updateUrl);
	}
}

//Checks the last day the config file was updated
function onceADay(updateUrl){
    var date = new Date().toLocaleDateString();
	console.log(date);
	chrome.storage.sync.set({"UpdateDate": "10/27/2018"},function(){console.log("Date updated")});
    var lastUpdate;
	chrome.storage.sync.get("UpdateDate", function(item){
		lastUpdate = item.UpdateDate;
		if( lastUpdate !== date ){
			updateConfig(updateUrl);
			chrome.storage.sync.set({"UpdateDate": date},function(){console.log("Date updated to " + date)});
		}
	});
}

//Updates the config file
function updateConfig(updateUrl){
	chrome.storage.sync.set({"ConfigUrl": updateUrl}, function () {
		console.log("Wrote url successfully (url: " + updateUrl + ")")});
	bg.getAndCheckConfig(suppressAlert = false);
}