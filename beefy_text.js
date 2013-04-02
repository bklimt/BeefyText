
var fontWeightValue = function(str, defaultValue) {
  if (str === "normal") {
    return 400;
  }
  if (str === "bold") {
    return 700;
  }
  return parseInt(str, 10) || defaultValue;
};

var elementsWithWeightLessThan = function(minWeight) {
  return $("*").filter(function() {
    return fontWeightValue($(this).css("font-weight"), -Infinity) < minWeight;
  });
};

var elementsWithWeightGreaterThan = function(maxWeight) {
  return $("*").filter(function() {
    return fontWeightValue($(this).css("font-weight"), Infinity) > maxWeight;
  });
};

var normalizeFontWeight = function(minWeight, maxWeight) {
  // Set the default font weight.
  if (minWeight || maxWeight) {
    $("body").css("font-weight", 400);
  }

  // First try setting the css for every element.
  // If that doesn't work, overwrite the style attribute with "!important".

  if (maxWeight) {
    elementsWithWeightGreaterThan(maxWeight).css("font-weight", maxWeight);
    var rule = ";font-weight:" + maxWeight + " !important";
    _.each(elementsWithWeightGreaterThan(maxWeight), function(element) {
      $(element).attr("style", $(element).attr("style") + rule);
    });
  }

  if (minWeight) {
    elementsWithWeightLessThan(minWeight).css("font-weight", minWeight);
    rule = ";font-weight:" + minWeight + " !important";
    _.each(elementsWithWeightLessThan(minWeight), function(element) {
      $(element).attr("style", $(element).attr("style") + rule);
    });
  }
};

// Listen for DOM messages to rerun the method.
window.addEventListener("message", function(event) {
  if (event.source !== window) {
    return;
  }
  normalizeFontWeight(event.data.minFontWeight, event.data.maxFontWeight);
}, false);

// Listen for Chrome messages to rerun the method.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.minFontWeight || request.maxFontWeight) {
    normalizeFontWeight(request.minFontWeight, request.maxFontWeight);
    sendResponse({ success: true });
  }
});

