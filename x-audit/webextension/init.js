window.onload = function() {
$.ajax({
  url: "http://10.5.128.71/sample-config.json",
  dataType: "json",
  success: function(response) {
	response = JSON.stringify(response);
  	dataGen(response, "passed");
  }
});
};
