/*
*	getUrlEntered.js retrieves user input from the url bar and hashes
*	the URL to compare with the hashes stored in the configuration file.
*/
var listened;
var doneGot;

browser.webNavigation.onBeforeNavigate.addListener(listened => {
	doneGot = listened.url;
	
	//
});
	