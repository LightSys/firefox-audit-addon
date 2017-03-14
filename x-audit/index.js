var self = require("sdk/self");
var enumeration = require("enumeration");
var settings = require("settings");

function init() {
	enumeration.getAddonList();
	//settings.getPrefList(settings);
	
}

exports.main = init;
