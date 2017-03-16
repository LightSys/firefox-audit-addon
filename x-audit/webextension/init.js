window.onload = function() {
$.ajax({
  url: "http://10.5.128.71/sample-config.json",
  dataType: "json",
  success: function(response) {
    console.log(response);
  }
});
dataGen("testString", "passed");
};
