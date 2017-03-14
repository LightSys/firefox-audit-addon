var self = require("sdk/self");

// a dummy function, to show how tests work.
// to see how to test this function, look at test/test-index.js
function dummy(text, callback) {
	alert("test");
	var addons = getAddonList();
	var settings = ["accessibility.tabfocus", "advanced.mailftp", "dave"];
	var prefs = getPrefList(settings);
	addons.foreach(function(addon){console.log(addon.name);});
	prefs.foreach(function(value){console.log(value);});
}

exports.main = dummy;
