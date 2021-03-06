/*
* @file
* This script sets the dynamic objects in the popup window, and sets the "Run Audit" button's action.
*/

var bg = chrome.extension.getBackgroundPage();
var passAudit = bg.passAudit;
show_pass_fail(passAudit);

show_list(passAudit);

function show_pass_fail(passes) {
    if (passes != null) {
        if (passes) {
            $("#passFailLabel").text("Audit Passed");
            $("#popupIcon").prepend("<img align='center' src='icon/icon128x128.png'>");
        } else {
            $("#passFailLabel").text("Audit Failed");
            $("#popupIcon").prepend("<img align='center' src='icon/fail-icon128x128.png'>");
        }
    } else {
        $("#passFailLabel").text("Unknown Audit Result");
        $("#popupIcon").prepend("<img align='center' src='icon/icon128x128.png'>");
    }
}

function show_list(passes){
	if (!passes) {
		$("#BadAddonDetails").append("<a href='#' id='details'>Details...</a>");
	}
}

/*
* Triggered by clicking the "Run Audit" button in the popup, this runs an audit, 
* and notifies the user of any failures.
*/
//The following function has been removed as it is no longer neccessary:
//
//function run_audit() {
//    bg.getAndCheckConfig(suppressAlert = false);
//}

/**
 * Close the window
 */
function close_window() {
    window.close();
}

function list_BadAddons(){
 console.log("BadAddons: \n");
	bg.get_badAddons(function(badAddons){
		console.log(badAddons.join("\n")); // added the .join("\n")
		alert("Bad Addons: \n" + badAddons.join("\n"));
	});
}

// The 'rerun' listeners have been removed as they are no longer necessary:
// add listeners to rerun button
// document.getElementById('rerun').addEventListener('click', run_audit);
// document.getElementById('rerun').addEventListener('click', close_window);


document.getElementById('details').addEventListener('click', list_BadAddons);
//document.getElementById('list').addEventListener('click', close_window);