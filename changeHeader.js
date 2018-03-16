/*
* @file
* The changeHeader file adds an extra HTTP header (X-Audit) to requests when visiting secure websites, with the information if the browser passed the security audit.
*
* ChangeHeader Requirements:
*
* 0. Split Configuration file into two; Secured URLs and the rest of the configuration (Currently only split and used the whitelist).
*
* 1. Hash the configuration file (whitelist in this case) using sha256 (done).
*
* 2. Determine the message from the add-on audit whether it is a "pass" or a "fail" (Right now it is hardcoded to "fail" because it doesn't correctly return the message. This problem could be from the background.js).
*
* 3. Generate a salt via the Cryptological Psuedo Random Number Generator (CPRNG) (done).
*
* 4. Create HMAC using HMAC-SHA256. First concatenate the message ("pass" or "fail") with the generated salt then get HMAC using config hash from step 1 as the key (done).
*
* 5. Assemble Header: The X-Audit header will be a concatenation of the message, a 64 bit salt converted to hex, and the HMAC trimmed to 192 bits (done).
*
* 6. Send the X-Audit to the host server (I am getting the error "No Access-Control-Allow-Origin").
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