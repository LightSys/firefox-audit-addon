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

            createListener(configUrl, parsed.urlList.map(e => e.url));
        })
        .fail(function (error) {
            console.log(error);
        })
});
```

The getConfigUrl function acquires the json file from the configUrl variable and returns a done or a fail
event. After the done event it creates a listener which is set up (as seen below) to grab the header once it's called.
After the fail event it logs the error into the console.

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
        return addAuditHeader(listened, configUrl, allowedUrls);
    }, {urls: allowedUrls}, ["blocking", "requestHeaders"]);
}
```

The createListener function is an object that, when created, snags the header and doesn't allow it to continue until our 
X-Audit header is added to the list of headers and sent on its way.

[Return to the README.md file](../README.md)
