var self = require("sdk/self");
var request = require("sdk/request").Request;
var cryptoJS = require("./lib/crypto-js/crypto-js.js");

function init() {
	
	getConfig(parseConfig);


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
