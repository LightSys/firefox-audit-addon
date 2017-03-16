function dataGen(config, message) { 
	var key = config;
	key = hashText256(key);
	var  salt = saltGen();
	var data = salt.concat(message);
	console.log(salt);
	console.log(message);
	console.log(data);
}


//Generates the salt for generating the Hmac Hash.
function saltGen(){
	var browserValues = new Uint32Array(512);
	var browserValue = new Uint32Array(1);
	hashText512(window.crypto.getRandomValues(browserValues));
	hashText512(window.crypto.getRandomValues(browserValue));
	var seed = seedGen(browserValues);
	var state = hashText3(seed);
	var whichHash;
	for(var i = 0; i<3; i++){
		whichHash = randThree();
		switch(whichHash){
			case 0:
				state = hashText5(state);
				break;
			case 1:
				state = hashText3(state);
				break;
			case 2:
				state = hashText512(state);
				break;
		}
	
	}
	var salt = hashText5(state);
	return salt;
}


//Converts Hex to Bianary.
function Hex2Bin(n){return parseInt(n,16).toString(2);} 


//encrypts the text given to it in Sha3 and returns it.
function hashText3(str){
	var hash = CryptoJS.SHA3(str);
	return hash.toString(CryptoJS.enc.Hex);
}



//encrypts the text given to it in Sha256 and returns it.
function hashText256(str){
	var hash =  CryptoJS.SHA256(str);
	return hash.toString(CryptoJS.enc.Hex);
}


//encrypts the text given to it in Sha512 and returns it.
function hashText512(str){
	var hash =  CryptoJS.SHA512(str);
	return hash.toString(CryptoJS.enc.Hex);
}

//encrypts the text given to it in MD5 and returns it.
function hashText5(str){
	var hash =  CryptoJS.MD5(str);	
	return hash.toString(CryptoJS.enc.Hex);
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
		randString = randString.concat(numString);
	}
	return randString;
}

