/*
<<<<<<< HEAD
=======
*	What if we converted this to be "checkURL.js" where we recieve and 
*	compare the URL hash to the urlList in testConfig, sending the end
*	result to changeHeader.js?
*	
>>>>>>> master
*	getUrlEntered.js retrieves user input from the url bar and hashes
*	the URL to compare with the hashes stored in the configuration file.
*/
var listened;
var doneGot;

browser.webNavigation.onBeforeNavigate.addListener(listened => {
	doneGot = listened.url;
	
<<<<<<< HEAD
=======
	//hash URL and then send it to be compared to list
	
	//URL is hashed
	
	//URL is sent to be compared to list
	
>>>>>>> master
	
});
	