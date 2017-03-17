var system = requires("sdk/system");
let{ Cc, Ci} = require('chrome');

exports.verifyConfig = verifyConfig;

//Verifies that Addons and Settings match the config file and that Firefox is up to date
//Passes the results to hashAndSend and informUser
function verifyConfig(config) {
	//Check Settings
	var failed = {updated: true, prefs:[], addons:[]};
	var prefCheckResults = verifyPref(config.browser-config);
	var isValid = prefCheckResult[0];
	failed.prefs = preCheckResult[1];
	
	//Check addons agaist whitelist
	verifyAddons(config.allowed-addons, isValid, failed);
}


// Checks that settings match the config file
// Any failed settings are pased on
function verifyPref(settings) {
        var prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);
	var failedPrefs = [];
	var isValid = true;
        for(var index in settings)  {
                switch(prefs.getPrefType(index)) {
			case 128:	//Check Boolean Preference
				if (prefs.getBoolPref(index) == settings[index]){
					failedPrefs.push({index: settings[index]});
					isValid = false;
				}
				break;
			case 64:	//Check Integer Prefernece
                                if (prefs.getIntPref(index) == settings[index]){
                                        failedPrefs.push({index: settings[index]});
                                        isValid = false;
                                }
                                break;
			case 32:	//Check String Preference
                                if (prefs.getChar(index) == settings[index]){
                                        failedPrefs.push({index: settings[index]});
                                        isValid = false;
                                }
                                break;
			default:	//Prefernce not found
				failedPrefs.push({index: settings[index]});
				isValid = false;
				break;
		}
	}
	return [isValid, failedPrefs];
}

//Checks for any Addons installed that are not on the white list
//Sends a list of non whitelisted add on and the result of all checks
//Calls the hashAndSend() and infromUser() asynchronously 
function verifyAddons(whitelist, isValid, failed) {
        const { AddonManager } = require("resource://gre/modules/AddonManager.jsm"); 
        AddonManager.getAllAddons(function(allAddons){
                var failedAddons = [];
		for (var i = 0; i < allAddons.length; i++){
                	var listed = false;
			for(var j = 0; j < whitelist.length; j++){
				if(allAddons.id == whitelist.id){
					listed = true;
					break;
				}
			}
			if(!listed){
				isValid = false;
				failedAddons.push(allAddons[i]);
			}
                }
		failed.addons = failedAddons;
		
		//Check For updates
		

		inforUser(failed);	//Inform the user of settings and Addons that don't match the config
		hashAndSend(isValid);	//Pass the result to the result of the verification to on 

        });
}


