/*
* @file
* The changeHeader file adds an extra HTTP header (X-Audit) to requests when visiting secure websites, with the information if the browser passed the security audit.
*
* When visiting a website, it checks if it is specified in [the configuration file], and if it is, sends an X-Audit header.
*
* Upon a web request, the script determines the requested URL. If the URL is one specified in [the configuration file], then the outcome of the audit is sent as a header.
*
*
*/
getConfigUrl(function (configUrl) {
    //gets json file from configUrl
    $.ajax({url: configUrl, cache: false})
        .done(function (json) {
            var parsed = JSON.parse(json);

            createListener(configUrl, parsed.urlList.map(e => e.url));
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

function createListener(configUrl, allowedUrls) {
    browser.webRequest.onBeforeSendHeaders.addListener(listened => {
        return addAuditHeader(listened, configUrl, allowedUrls);
    }, {urls: allowedUrls}, ["blocking", "requestHeaders"]);
}