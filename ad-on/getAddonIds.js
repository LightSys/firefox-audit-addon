//Get the ids of all installed addons

Components.utils.import("resource://gre/modules/AddonManager.jsm");

function getAddonIds() {
	return  AddonManager.getAllAddons(function(aAddons) {
		var arr = [];
		for(var i = 0; i < aAddons.length; i++){
			arr[i] = aAddons[i].id;
		}	
		return arr;
	});
}

