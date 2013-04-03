
/*
 * Font Weight Methods
 */

var fontWeightValue = function(str, defaultValue) {
  if (str === "normal") {
    return 400;
  }
  if (str === "bold") {
    return 700;
  }
  return parseInt(str, 10) || defaultValue;
};

var elementsWithFontWeightLessThan = function(minWeight) {
  return $("*").filter(function() {
    return fontWeightValue($(this).css("font-weight"), -Infinity) < minWeight;
  });
};

var elementsWithFontWeightGreaterThan = function(maxWeight) {
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
    elementsWithFontWeightGreaterThan(maxWeight).css("font-weight", maxWeight);
    var rule = ";font-weight:" + maxWeight + " !important";
    _.each(elementsWithFontWeightGreaterThan(maxWeight), function(element) {
      $(element).attr("style", $(element).attr("style") + rule);
    });
  }

  if (minWeight) {
    elementsWithFontWeightLessThan(minWeight).css("font-weight", minWeight);
    rule = ";font-weight:" + minWeight + " !important";
    _.each(elementsWithFontWeightLessThan(minWeight), function(element) {
      $(element).attr("style", $(element).attr("style") + rule);
    });
  }
};

/*
 * Font Size Methods
 */

var fontSizeValue = function(str, defaultValue) {
  match = /(.*)pt$/.exec(str);
  if (match) {
    str = match[1];
  }
  match = /(.*)px$/.exec(str);
  if (match) {
    str = match[1];
  }
  return parseInt(str, 10) || defaultValue;
};

var elementsWithFontSizeLessThan = function(minSize) {
  return $("*").filter(function() {
    if ($(this).css("font-size") === "0px") {
      return false;
    }
    return fontSizeValue($(this).css("font-size"), -Infinity) < minSize;
  });
};

var elementsWithFontSizeGreaterThan = function(maxSize) {
  if ($(this).css("font-size") === "0px") {
    return false;
  }
  return $("*").filter(function() {
    return fontSizeValue($(this).css("font-size"), Infinity) > maxSize;
  });
};

var normalizeFontSize = function(minSize, maxSize) {
  // Set the default font size.
  if (minSize || maxSize) {
    $("body").css("font-size", 18);
  }

  // First try setting the css for every element.
  // If that doesn't work, overwrite the style attribute with "!important".

  if (maxSize) {
    elementsWithFontSizeGreaterThan(maxSize).css("font-size", maxSize);
    var rule = ";font-size:" + maxSize + " !important";
    _.each(elementsWithFontSizeGreaterThan(maxSize), function(element) {
      $(element).attr("style", $(element).attr("style") + rule);
    });
  }

  if (minSize) {
    elementsWithFontSizeLessThan(minSize).css("font-size", minSize);
    rule = ";font-size:" + minSize + " !important";
    _.each(elementsWithFontSizeLessThan(minSize), function(element) {
      $(element).attr("style", $(element).attr("style") + rule);
    });
  }
};


/*
 * Routers
 */

var process = function(message) {
  var handled = false;
  if (message.minFontWeight || message.maxFontWeight) {
    normalizeFontWeight(message.minFontWeight, message.maxFontWeight);
    handled = true;
  }
  if (message.minFontSize || message.maxFontSize) {
    normalizeFontSize(message.minFontSize, message.maxFontSize);
    handled = true;
  }
  return handled;
};

// Listen for DOM messages to rerun the method.
window.addEventListener("message", function(event) {
  if (event.source !== window) {
    return;
  }
  process(event.data);
}, false);

// Listen for Chrome messages to rerun the method.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (process(request)) {
    sendResponse({ success: true });
  }
});

