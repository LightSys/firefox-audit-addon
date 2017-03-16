var self = require("sdk/self");
var enumeration = require("enumeration");
var settings = require("settings");
const webExtension = require("sdk/webextension");

function init() {
	webExtension.startup().then(api => {
		const {browser} = api;
		browser.runtime.onConnect.addListener(connected);
	});
	
	enumeration.getAddonList();
	var results = settings.getPrefList(list);
}

function connected(port){
	port.postMessage({ready: "connection recieved"});

}

exports.main = init;
