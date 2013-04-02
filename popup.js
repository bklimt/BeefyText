$(function() {

var onSlide = function(event, slider) {
  var min = slider.values[0];
  var max = slider.values[1];
  $("#sliderLabel").html("Font Weight Range: [" + min + ", " + max + "]");

  chrome.tabs.getSelected(null, function(tab) {
    var message = {
      minFontWeight: min,
      maxFontWeight: max
    };
    chrome.tabs.sendMessage(tab.id, message, function(response) {
      console.log(JSON.stringify(response));
    });
  });
};

$("#slider").slider({
  range: true,
  min: 100,
  max: 900,
  step: 100,
  values: [100, 900],
  slide: onSlide
});

});
