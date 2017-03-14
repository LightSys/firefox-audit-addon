var self = require("sdk/self");
var enumeration = require("enumeration");
var settings = require("settings");

function init() {
	enumeration.getAddonList();
	var list = ["app.update.altwindowtype", "app.update.badgeWaitTime", "app.update.enabled", "phil"];
	var results = settings.getPrefList(list);
}

exports.main = init;
