$(function() {

var sendMessage = function(message) {
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendMessage(tab.id, message, function(response) {
      console.log(JSON.stringify(response));
    });
  });
};

var tooltipRetainCount = 0;

var showTooltip = function(x, y, text) {
  x = x - 5;
  y = y + 5;

  var tooltip = $("#tooltip");
  tooltip.html(text);
  tooltip.css("left", (x - tooltip.width()) + "px");
  tooltip.css("top", y + "px");
  tooltip.css("display", "block");
  tooltipRetainCount++;
  setTimeout(function() {
    tooltipRetainCount--;
    if (tooltipRetainCount === 0) {
      $("#tooltip").css("display", "none");
    }
  }, 1000);
};

$("#fontWeightSlider").slider({
  range: true,
  min: 100,
  max: 900,
  step: 100,
  values: [100, 900],
  slide: function(event, slider) {
    var min = slider.values[0];
    var max = slider.values[1];
    sendMessage({
      minFontWeight: min,
      maxFontWeight: max
    });
    showTooltip(event.pageX, event.pageY, "[" + min + ", " + max + "]");
  }
});

$("#fontSizeSlider").slider({
  range: true,
  min: 200,
  max: 700,
  values: [200, 700],
  slide: function(event, slider) {
    var min = Math.round(Math.pow(2, slider.values[0] / 100.0));
    var max = Math.round(Math.pow(2, slider.values[1] / 100.0));
    sendMessage({
      minFontSize: min,
      maxFontSize: max
    });
    showTooltip(event.pageX, event.pageY, "[" + min + ", " + max + "]");
  }
});

$("#textColorPicker").minicolors({
  inline: true,
  change: function(hex, opacity) {
    sendMessage({
      overrideTextColor: hex
    });
  }
});

});
