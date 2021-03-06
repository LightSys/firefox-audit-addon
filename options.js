
var bg = chrome.extension.getBackgroundPage();

/**
 * Stores the add-on options to Firefox's persistent storage.
 * @Param theConfigUrl, the web address of the configuration file.
 */

function set_options(theConfigUrl) {
    chrome.storage.sync.set({"ConfigUrl": theConfigUrl}, function () {
        console.log("Wrote url successfully (url: " + theConfigUrl + ")");
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

//Close the window.

function close_window() {
    window.close();
}


//Sets the options text box to the contain the current configuration URL.

function get() {
    get_options(function (theConfigUrl) {
        configUrl = theConfigUrl;
        document.getElementById('urlText').value = configUrl;
    });
}

//Take the URL from the text box and set the configuration URL to that. It also runs an audit.

function set() {
	set_options(document.getElementById('urlText').value);
	bg.getAndCheckConfig(suppressAlert = false);
}

// load url when on start
document.addEventListener('DOMContentLoaded',
    get);

// add listeners to save button
document.getElementById('save').addEventListener('click',
    set);
document.getElementById('save').addEventListener('click',
    close_window);
	
// add listeners to cancel button
document.getElementById('cancel').addEventListener('click',
    close_window);

// add listener for enter key that calls the save button when clicked
document.getElementById('urlText').addEventListener('keyup', function (event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        document.getElementById('save').click();
    }
});
