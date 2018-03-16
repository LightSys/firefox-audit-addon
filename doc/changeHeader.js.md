 ## About `changeHeader.js`

This file adds an extra HTTP header to requests when visiting secure websites, with the information of whether or not the browser passed the security audit. 

#### Detailed Description (for developers)

When visiting a website, it checks if it is specified in [the configuration file](writing_config.md), and if it is, sends an X-Audit header. 

Upon a web request, the script determines the requested URL (using the `getCurrentUrl()` function). If the URL is one specified in [the configuration file](writing_config.md), then the outcome of the audit is sent as a header. 

Requirements
-------------

0. Split Configuration file into two; Secured URLs and the rest of the configuration (Currently only split and used the whitelist).

1. Hash the configuration file (whitelist in this case) using sha256 (done).

2. Determine the message from the add-on audit whether it is a "pass" or a "fail" (Right now it is hardcoded to "fail" because it doesn't correctly return the message. This problem could be from the background.js).

3. Generate a salt via the Cryptological Psuedo Random Number Generator (CPRNG) (done).

4. Create HMAC using HMAC-SHA256. First concatenate the message ("pass" or "fail") with the generated salt then get HMAC using config hash from step 1 as the key (done).

5. Assemble Header: The X-Audit header will be a concatenation of the message, a 64 bit salt converted to hex, and the HMAC trimmed to 192 bits (done).

6. Send the X-Audit to the host server (I am getting the error "No Access-Control-Allow-Origin").


Functions and methods used
------------------------------------


[Return to the README.md file](../README.md)
