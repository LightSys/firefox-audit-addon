//Enumeration functinos to get the list of all add-ons installed and get the values of a set of prefrences

//Gets a associated array of the ids and names of all add-ons installed 
function getAddonList() {
	const { AddonManager } = require("resource://gre/modules/AddonManager.jsm");
	var addons = [];
	AddonManager.getAllAddons(function(aAddons){aAddons.foreach(function(aAddon, index){
		var addonObject = {id: aAddon.id, name: aAddon.name};
		addons[index] = addonObject;  
	});});
	return addons;
}

//Gets an array of the value of all settings requested
function getPrefList(settings) {
	var prefs = Component.classes["@mozilla.org/preferences-services;1"].getService(Components.interface.nsIPrefBranch);
	var values = [];
	settings.foreach(function(setting,index){
		var type = prefs.getPrefType(setting);
		if(type == "PREF_BOOL") values[i] = prefs.getPrefBool(setting);
		else if (type == "PREF_STRING") values[i] = prefs.getPrefChar(setting);
		else if (type == "PREF_INT") values[i] = pref.getPrefInt(setting);
		else if (type == "PREF_INVALID") values[i] = "error";
	});
	return values;
}

