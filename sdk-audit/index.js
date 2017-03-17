let { Cc, Ci, Cu } = require('chrome');
Cu.importGlobalProperties(['crypto']);
var self = require("sdk/self");
var request = require("sdk/request").Request;
var hashing = require("./lib/hashing.js");

function init() {
	
	getConfig(parseConfig);
	hashing.dataGen();

	//Obtains the configuration file from the given URL or File Location on the Local Storage.
	function getConfig(callback) {
		var config;
		request({
			url: "http://10.5.128.71/sample-config.json",
			onComplete: function(response) {
				callback(response.json, urlListener, changeListener);
			}
		}).get();
	}

	function parseConfig(config, callback1, callback2) {

	}

	function urlListener() {

	}

	function changeListener(){

	}

	function verifyConfig() {

	}

}

exports.main = init;
