/*
*	What if we converted this to be "checkURL.js" where we recieve and 
*	compare the URL hash to the urlList in testConfig, sending the end
*	result to changeHeader.js?
*	
*	getUrlEntered.js retrieves user input from the url bar and hashes
*	the URL to compare with the hashes stored in the configuration file.
*/
var listened;
var doneGot;

browser.webNavigation.onBeforeNavigate.addListener(listened => {
	doneGot = listened.url;
	
	
	
	//
});
	