//Gets an array of the value of all settings requested
function getPrefList(settings) {
        let{ Cc, Ci } = require('chrome');
        var prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);
        var values = [];
        for(i = 0, len = settings.length; i < len; i++)  {
           	var type = prefs.getPrefType(settings[i]);
		if(type == 128) {values.push(prefs.getBoolPref(settings[i]));}
                else if (type == 32) {values.push(prefs.getCharPref(settings[i]));}
                else if (type == 64) {values.push(prefs.getIntPref(settings[i]));}
		else if (type === 0) {values.push({});}
        }
	return values;
}

exports.getPrefList = getPrefList;
