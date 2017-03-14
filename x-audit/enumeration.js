//Gets an associated array of the ids and names of all add-ons installed 

function getAddonList() {
	const { AddonManager } = require("resource://gre/modules/AddonManager.jsm");
	var addonId = "";
	var addonName = "";
	var addon = {};
	var addons = [];
	var allAddons = [];
	var addonObject = {};
	AddonManager.getAllAddons(function(allAddons){
		for (i = 0; i < allAddons.length; i++){
		addon = allAddons[i]; 
		addonId = addon.id;	
		addonName = addon.name; 
		addonObject = {id: addonId, name: addonName};
		addons.push(addonObject);
		}
	return addons;

	});

	return -1;
}

exports.getAddonList = getAddonList;

