var self = require("sdk/self");
var enumeration = require("enumeration");

// a dummy function, to show how tests work.
// to see how to test this function, look at test/test-index.js
function dummy() {
//	alert("test");
	var addons = enumeration.getAddonList();
	var settings = ["accessibility.tabfocus", "advanced.mailftp", "dave"];
	//var prefs = enumeration.getPrefList(settings);
	//addons.forEach(function(addon){console.log(addon.name);});
	//prefs.forEach(function(value){console.log(value);});
	console.log(addons);
}

exports.main = dummy;
