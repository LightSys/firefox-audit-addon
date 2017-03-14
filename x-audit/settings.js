//Gets an array of the value of all settings requested
function getPrefList(settings) {
        let{ Cc, Ci } = require('chrome');
        var prefs = Cc["@mozilla.org/preferences-service;1"]
                    .getService(Ci.nsIPrefService).getBranch("");
        var values = [];
        for(i =0, len = settings.length; i < len; i++)  {
                var type = prefs.getPrefType(setting);
                if(type == "PREF_BOOL") {values[i] = prefs.getPrefBool(settings[i]);}
                else if (type == "PREF_STRING") {values[i] = prefs.getPrefChar(settings[i]);}
                else if (type == "PREF_INT") {values[i] = pref.getPrefInt(settings[i]);}
                else if (type == "PREF_INVALID") {values[i] = "error";}
        }
        return values;
}

exports.getPrefList = getPrefList;
