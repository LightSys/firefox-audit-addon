require(["jquery/", "crypto-js/"]);
window.onload = function(){

var crypt = new Crypt();
var digest_sha256 = crypt.HASH.sha256("message");
alert (digest_sha256);


};

