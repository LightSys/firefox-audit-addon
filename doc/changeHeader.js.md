 ## About `changeHeader.js`

This file adds an extra HTTP header to requests when visiting secure websites, with the information of whether or not the browser passed the security audit. 

#### Detailed Description (for developers)

When visiting a website, it checks if it is specified in [the configuration file], and if it is, sends an X-Audit header.

Upon a web request, the script determines the requested URL. If the URL is one specified in [the configuration file], then the outcome of the audit is sent as a header.


Functions and methods used
------------------------------------




[Return to the README.md file](../README.md)
