exports.dataGen = dataGen;

let { Cc, Ci, Cu } = require('chrome');
let { TextEncoder, TextDecoder } = require('sdk/io/buffer')
Cu.importGlobalProperties(['crypto']);
var utils = require('sdk/window/utils');


function dataGen(config, message) { 
	var data = Promise.resolve(saltGen()).then(result => {
		var salt = result;
		console.log("salt");
		console.log(salt);
		var key = Promise
			.resolve(win.crypto.subtle.sign({name: "HMAC", hash: "SHA-256"}, key, buffer)
		var message = salt + message;
		var buffer = new TextEncoder("utf-8").encode(data);
		message = Promise
			.resolve(win.crypto.subtle.sign({name: "HMAC", hash: "SHA-256"}, key, buffer)
			.then(signature => {return signature;}));
		console.log(message);
		return hex(message);
	});
	console.log(data);
}


//Generates the salt for generating the Hmac Hash.
function saltGen(){
	var browserValues = new Uint32Array(512);
	var browserValue = new Uint32Array(1);
	var win = utils.getMostRecentBrowserWindow();
	hashText512(win.crypto.getRandomValues(browserValues));
	var seed = seedGen(browserValues);
	var state = hashText512(seed);
	var whichHash;
	for(var i = 0; i < 10; i++){
		hashText512(win.crypto.getRandomValues(browserValue));
		whichHash = randThree(browserValue);
		switch(whichHash){
			case 0:
				state = hashText256(state);
				break;
			case 1:
				state = hashText384(state);
				break;
			case 2:
				state = hashText512(state);
				break;
		}
	
	}
	var salt = hashText256(state);
	return salt;
}


//Converts Buffer to Hex.
function hex(buffer) {
  var hexCodes = [];
  var view = new DataView(buffer);
  for (var i = 0; i < view.byteLength; i += 4) {
    // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
    var value = view.getUint32(i);
    // toString(16) will give the hex representation of the number without padding
    var stringValue = value.toString(16);
    // We use concatenation and slice for padding
    var padding = '00000000';
    var paddedValue = (padding + stringValue).slice(-padding.length);
    hexCodes.push(paddedValue);
  }
  // Join all the hex strings into one
  return hexCodes.join("");
}


//encrypts the text given to it in Sha256 and returns it.
function hashText256(str){
  var buffer = new TextEncoder("utf-8").encode(str);
  return crypto.subtle.digest("SHA-256", buffer).then(function (hash) {
    return hex(hash);
  });
}


//encryptss the text given to it in Sha384 and returns it.
function hashText384(str){
  var buffer = new TextEncoder("utf-8").encode(str);
  return crypto.subtle.digest("SHA-384", buffer).then(function (hash) {
    return hex(hash);
  });
}

//encrypts the text given to it in Sha512 and returns it.
function hashText512(str){
  var buffer = new TextEncoder("utf-8").encode(str);
  return crypto.subtle.digest("SHA-512", buffer).then(function (hash) {
    return hex(hash);
  });
}

//Generates a random number 0,1, or 2.
function randThree(threeSeed){
	return (randTen() + threeSeed) % 3;

}

//Generates a random number 0 through 9.
function randTen() {
	return Math.floor(Math.random()*10);
}


//Generates Seed from randomly chosen digits from browser provided integers.
function seedGen(randomValues){
	var randString = "";	
	var numString = "";
	for(var i=0; i<randomValues.length; i++){
		numString = (randomValues[i].toString()).charAt(randTen());
		randString += numString;
	}
	return randString;
}

