// node_modules/nouislider/dist/nouislider.mjs
var PipsMode;
(function(PipsMode2) {
  PipsMode2["Range"] = "range";
  PipsMode2["Steps"] = "steps";
  PipsMode2["Positions"] = "positions";
  PipsMode2["Count"] = "count";
  PipsMode2["Values"] = "values";
})(PipsMode || (PipsMode = {}));
var PipsType;
(function(PipsType2) {
  PipsType2[PipsType2["None"] = -1] = "None";
  PipsType2[PipsType2["NoValue"] = 0] = "NoValue";
  PipsType2[PipsType2["LargeValue"] = 1] = "LargeValue";
  PipsType2[PipsType2["SmallValue"] = 2] = "SmallValue";
})(PipsType || (PipsType = {}));
function isValidFormatter(entry) {
  return isValidPartialFormatter(entry) && typeof entry.from === "function";
}
function isValidPartialFormatter(entry) {
  return typeof entry === "object" && typeof entry.to === "function";
}
function removeElement(el) {
  el.parentElement.removeChild(el);
}
function isSet(value) {
  return value !== null && value !== void 0;
}
function preventDefault(e) {
  e.preventDefault();
}
function unique(array) {
  return array.filter(function(a) {
    return !this[a] ? this[a] = true : false;
  }, {});
}
function closest(value, to) {
  return Math.round(value / to) * to;
}
function offset(elem, orientation) {
  var rect = elem.getBoundingClientRect();
  var doc = elem.ownerDocument;
  var docElem = doc.documentElement;
  var pageOffset = getPageOffset(doc);
  if (/webkit.*Chrome.*Mobile/i.test(navigator.userAgent)) {
    pageOffset.x = 0;
  }
  return orientation ? rect.top + pageOffset.y - docElem.clientTop : rect.left + pageOffset.x - docElem.clientLeft;
}
function isNumeric(a) {
  return typeof a === "number" && !isNaN(a) && isFinite(a);
}
function addClassFor(element, className, duration) {
  if (duration > 0) {
    addClass(element, className);
    setTimeout(function() {
      removeClass(element, className);
    }, duration);
  }
}
function limit(a) {
  return Math.max(Math.min(a, 100), 0);
}
function asArray(a) {
  return Array.isArray(a) ? a : [a];
}
function countDecimals(numStr) {
  numStr = String(numStr);
  var pieces = numStr.split(".");
  return pieces.length > 1 ? pieces[1].length : 0;
}
function addClass(el, className) {
  if (el.classList && !/\s/.test(className)) {
    el.classList.add(className);
  } else {
    el.className += " " + className;
  }
}
function removeClass(el, className) {
  if (el.classList && !/\s/.test(className)) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ");
  }
}
function hasClass(el, className) {
  return el.classList ? el.classList.contains(className) : new RegExp("\\b" + className + "\\b").test(el.className);
}
function getPageOffset(doc) {
  var supportPageOffset = window.pageXOffset !== void 0;
  var isCSS1Compat = (doc.compatMode || "") === "CSS1Compat";
  var x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? doc.documentElement.scrollLeft : doc.body.scrollLeft;
  var y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? doc.documentElement.scrollTop : doc.body.scrollTop;
  return {
    x,
    y
  };
}
function getActions() {
  return window.navigator.pointerEnabled ? {
    start: "pointerdown",
    move: "pointermove",
    end: "pointerup"
  } : window.navigator.msPointerEnabled ? {
    start: "MSPointerDown",
    move: "MSPointerMove",
    end: "MSPointerUp"
  } : {
    start: "mousedown touchstart",
    move: "mousemove touchmove",
    end: "mouseup touchend"
  };
}
function getSupportsPassive() {
  var supportsPassive = false;
  try {
    var opts = Object.defineProperty({}, "passive", {
      get: function() {
        supportsPassive = true;
      }
    });
    window.addEventListener("test", null, opts);
  } catch (e) {
  }
  return supportsPassive;
}
function getSupportsTouchActionNone() {
  return window.CSS && CSS.supports && CSS.supports("touch-action", "none");
}
function subRangeRatio(pa, pb) {
  return 100 / (pb - pa);
}
function fromPercentage(range, value, startRange) {
  return value * 100 / (range[startRange + 1] - range[startRange]);
}
function toPercentage(range, value) {
  return fromPercentage(range, range[0] < 0 ? value + Math.abs(range[0]) : value - range[0], 0);
}
function isPercentage(range, value) {
  return value * (range[1] - range[0]) / 100 + range[0];
}
function getJ(value, arr) {
  var j = 1;
  while (value >= arr[j]) {
    j += 1;
  }
  return j;
}
function toStepping(xVal, xPct, value) {
  if (value >= xVal.slice(-1)[0]) {
    return 100;
  }
  var j = getJ(value, xVal);
  var va = xVal[j - 1];
  var vb = xVal[j];
  var pa = xPct[j - 1];
  var pb = xPct[j];
  return pa + toPercentage([va, vb], value) / subRangeRatio(pa, pb);
}
function fromStepping(xVal, xPct, value) {
  if (value >= 100) {
    return xVal.slice(-1)[0];
  }
  var j = getJ(value, xPct);
  var va = xVal[j - 1];
  var vb = xVal[j];
  var pa = xPct[j - 1];
  var pb = xPct[j];
  return isPercentage([va, vb], (value - pa) * subRangeRatio(pa, pb));
}
function getStep(xPct, xSteps, snap, value) {
  if (value === 100) {
    return value;
  }
  var j = getJ(value, xPct);
  var a = xPct[j - 1];
  var b = xPct[j];
  if (snap) {
    if (value - a > (b - a) / 2) {
      return b;
    }
    return a;
  }
  if (!xSteps[j - 1]) {
    return value;
  }
  return xPct[j - 1] + closest(value - xPct[j - 1], xSteps[j - 1]);
}
var Spectrum = (
  /** @class */
  function() {
    function Spectrum2(entry, snap, singleStep) {
      this.xPct = [];
      this.xVal = [];
      this.xSteps = [];
      this.xNumSteps = [];
      this.xHighestCompleteStep = [];
      this.xSteps = [singleStep || false];
      this.xNumSteps = [false];
      this.snap = snap;
      var index;
      var ordered = [];
      Object.keys(entry).forEach(function(index2) {
        ordered.push([asArray(entry[index2]), index2]);
      });
      ordered.sort(function(a, b) {
        return a[0][0] - b[0][0];
      });
      for (index = 0; index < ordered.length; index++) {
        this.handleEntryPoint(ordered[index][1], ordered[index][0]);
      }
      this.xNumSteps = this.xSteps.slice(0);
      for (index = 0; index < this.xNumSteps.length; index++) {
        this.handleStepPoint(index, this.xNumSteps[index]);
      }
    }
    Spectrum2.prototype.getDistance = function(value) {
      var distances = [];
      for (var index = 0; index < this.xNumSteps.length - 1; index++) {
        distances[index] = fromPercentage(this.xVal, value, index);
      }
      return distances;
    };
    Spectrum2.prototype.getAbsoluteDistance = function(value, distances, direction) {
      var xPct_index = 0;
      if (value < this.xPct[this.xPct.length - 1]) {
        while (value > this.xPct[xPct_index + 1]) {
          xPct_index++;
        }
      } else if (value === this.xPct[this.xPct.length - 1]) {
        xPct_index = this.xPct.length - 2;
      }
      if (!direction && value === this.xPct[xPct_index + 1]) {
        xPct_index++;
      }
      if (distances === null) {
        distances = [];
      }
      var start_factor;
      var rest_factor = 1;
      var rest_rel_distance = distances[xPct_index];
      var range_pct = 0;
      var rel_range_distance = 0;
      var abs_distance_counter = 0;
      var range_counter = 0;
      if (direction) {
        start_factor = (value - this.xPct[xPct_index]) / (this.xPct[xPct_index + 1] - this.xPct[xPct_index]);
      } else {
        start_factor = (this.xPct[xPct_index + 1] - value) / (this.xPct[xPct_index + 1] - this.xPct[xPct_index]);
      }
      while (rest_rel_distance > 0) {
        range_pct = this.xPct[xPct_index + 1 + range_counter] - this.xPct[xPct_index + range_counter];
        if (distances[xPct_index + range_counter] * rest_factor + 100 - start_factor * 100 > 100) {
          rel_range_distance = range_pct * start_factor;
          rest_factor = (rest_rel_distance - 100 * start_factor) / distances[xPct_index + range_counter];
          start_factor = 1;
        } else {
          rel_range_distance = distances[xPct_index + range_counter] * range_pct / 100 * rest_factor;
          rest_factor = 0;
        }
        if (direction) {
          abs_distance_counter = abs_distance_counter - rel_range_distance;
          if (this.xPct.length + range_counter >= 1) {
            range_counter--;
          }
        } else {
          abs_distance_counter = abs_distance_counter + rel_range_distance;
          if (this.xPct.length - range_counter >= 1) {
            range_counter++;
          }
        }
        rest_rel_distance = distances[xPct_index + range_counter] * rest_factor;
      }
      return value + abs_distance_counter;
    };
    Spectrum2.prototype.toStepping = function(value) {
      value = toStepping(this.xVal, this.xPct, value);
      return value;
    };
    Spectrum2.prototype.fromStepping = function(value) {
      return fromStepping(this.xVal, this.xPct, value);
    };
    Spectrum2.prototype.getStep = function(value) {
      value = getStep(this.xPct, this.xSteps, this.snap, value);
      return value;
    };
    Spectrum2.prototype.getDefaultStep = function(value, isDown, size) {
      var j = getJ(value, this.xPct);
      if (value === 100 || isDown && value === this.xPct[j - 1]) {
        j = Math.max(j - 1, 1);
      }
      return (this.xVal[j] - this.xVal[j - 1]) / size;
    };
    Spectrum2.prototype.getNearbySteps = function(value) {
      var j = getJ(value, this.xPct);
      return {
        stepBefore: {
          startValue: this.xVal[j - 2],
          step: this.xNumSteps[j - 2],
          highestStep: this.xHighestCompleteStep[j - 2]
        },
        thisStep: {
          startValue: this.xVal[j - 1],
          step: this.xNumSteps[j - 1],
          highestStep: this.xHighestCompleteStep[j - 1]
        },
        stepAfter: {
          startValue: this.xVal[j],
          step: this.xNumSteps[j],
          highestStep: this.xHighestCompleteStep[j]
        }
      };
    };
    Spectrum2.prototype.countStepDecimals = function() {
      var stepDecimals = this.xNumSteps.map(countDecimals);
      return Math.max.apply(null, stepDecimals);
    };
    Spectrum2.prototype.hasNoSize = function() {
      return this.xVal[0] === this.xVal[this.xVal.length - 1];
    };
    Spectrum2.prototype.convert = function(value) {
      return this.getStep(this.toStepping(value));
    };
    Spectrum2.prototype.handleEntryPoint = function(index, value) {
      var percentage;
      if (index === "min") {
        percentage = 0;
      } else if (index === "max") {
        percentage = 100;
      } else {
        percentage = parseFloat(index);
      }
      if (!isNumeric(percentage) || !isNumeric(value[0])) {
        throw new Error("noUiSlider: 'range' value isn't numeric.");
      }
      this.xPct.push(percentage);
      this.xVal.push(value[0]);
      var value1 = Number(value[1]);
      if (!percentage) {
        if (!isNaN(value1)) {
          this.xSteps[0] = value1;
        }
      } else {
        this.xSteps.push(isNaN(value1) ? false : value1);
      }
      this.xHighestCompleteStep.push(0);
    };
    Spectrum2.prototype.handleStepPoint = function(i, n) {
      if (!n) {
        return;
      }
      if (this.xVal[i] === this.xVal[i + 1]) {
        this.xSteps[i] = this.xHighestCompleteStep[i] = this.xVal[i];
        return;
      }
      this.xSteps[i] = fromPercentage([this.xVal[i], this.xVal[i + 1]], n, 0) / subRangeRatio(this.xPct[i], this.xPct[i + 1]);
      var totalSteps = (this.xVal[i + 1] - this.xVal[i]) / this.xNumSteps[i];
      var highestStep = Math.ceil(Number(totalSteps.toFixed(3)) - 1);
      var step = this.xVal[i] + this.xNumSteps[i] * highestStep;
      this.xHighestCompleteStep[i] = step;
    };
    return Spectrum2;
  }()
);
var defaultFormatter = {
  to: function(value) {
    return value === void 0 ? "" : value.toFixed(2);
  },
  from: Number
};
var cssClasses = {
  target: "target",
  base: "base",
  origin: "origin",
  handle: "handle",
  handleLower: "handle-lower",
  handleUpper: "handle-upper",
  touchArea: "touch-area",
  horizontal: "horizontal",
  vertical: "vertical",
  background: "background",
  connect: "connect",
  connects: "connects",
  ltr: "ltr",
  rtl: "rtl",
  textDirectionLtr: "txt-dir-ltr",
  textDirectionRtl: "txt-dir-rtl",
  draggable: "draggable",
  drag: "state-drag",
  tap: "state-tap",
  active: "active",
  tooltip: "tooltip",
  pips: "pips",
  pipsHorizontal: "pips-horizontal",
  pipsVertical: "pips-vertical",
  marker: "marker",
  markerHorizontal: "marker-horizontal",
  markerVertical: "marker-vertical",
  markerNormal: "marker-normal",
  markerLarge: "marker-large",
  markerSub: "marker-sub",
  value: "value",
  valueHorizontal: "value-horizontal",
  valueVertical: "value-vertical",
  valueNormal: "value-normal",
  valueLarge: "value-large",
  valueSub: "value-sub"
};
var INTERNAL_EVENT_NS = {
  tooltips: ".__tooltips",
  aria: ".__aria"
};
function testStep(parsed, entry) {
  if (!isNumeric(entry)) {
    throw new Error("noUiSlider: 'step' is not numeric.");
  }
  parsed.singleStep = entry;
}
function testKeyboardPageMultiplier(parsed, entry) {
  if (!isNumeric(entry)) {
    throw new Error("noUiSlider: 'keyboardPageMultiplier' is not numeric.");
  }
  parsed.keyboardPageMultiplier = entry;
}
function testKeyboardMultiplier(parsed, entry) {
  if (!isNumeric(entry)) {
    throw new Error("noUiSlider: 'keyboardMultiplier' is not numeric.");
  }
  parsed.keyboardMultiplier = entry;
}
function testKeyboardDefaultStep(parsed, entry) {
  if (!isNumeric(entry)) {
    throw new Error("noUiSlider: 'keyboardDefaultStep' is not numeric.");
  }
  parsed.keyboardDefaultStep = entry;
}
function testRange(parsed, entry) {
  if (typeof entry !== "object" || Array.isArray(entry)) {
    throw new Error("noUiSlider: 'range' is not an object.");
  }
  if (entry.min === void 0 || entry.max === void 0) {
    throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.");
  }
  parsed.spectrum = new Spectrum(entry, parsed.snap || false, parsed.singleStep);
}
function testStart(parsed, entry) {
  entry = asArray(entry);
  if (!Array.isArray(entry) || !entry.length) {
    throw new Error("noUiSlider: 'start' option is incorrect.");
  }
  parsed.handles = entry.length;
  parsed.start = entry;
}
function testSnap(parsed, entry) {
  if (typeof entry !== "boolean") {
    throw new Error("noUiSlider: 'snap' option must be a boolean.");
  }
  parsed.snap = entry;
}
function testAnimate(parsed, entry) {
  if (typeof entry !== "boolean") {
    throw new Error("noUiSlider: 'animate' option must be a boolean.");
  }
  parsed.animate = entry;
}
function testAnimationDuration(parsed, entry) {
  if (typeof entry !== "number") {
    throw new Error("noUiSlider: 'animationDuration' option must be a number.");
  }
  parsed.animationDuration = entry;
}
function testConnect(parsed, entry) {
  var connect = [false];
  var i;
  if (entry === "lower") {
    entry = [true, false];
  } else if (entry === "upper") {
    entry = [false, true];
  }
  if (entry === true || entry === false) {
    for (i = 1; i < parsed.handles; i++) {
      connect.push(entry);
    }
    connect.push(false);
  } else if (!Array.isArray(entry) || !entry.length || entry.length !== parsed.handles + 1) {
    throw new Error("noUiSlider: 'connect' option doesn't match handle count.");
  } else {
    connect = entry;
  }
  parsed.connect = connect;
}
function testOrientation(parsed, entry) {
  switch (entry) {
    case "horizontal":
      parsed.ort = 0;
      break;
    case "vertical":
      parsed.ort = 1;
      break;
    default:
      throw new Error("noUiSlider: 'orientation' option is invalid.");
  }
}
function testMargin(parsed, entry) {
  if (!isNumeric(entry)) {
    throw new Error("noUiSlider: 'margin' option must be numeric.");
  }
  if (entry === 0) {
    return;
  }
  parsed.margin = parsed.spectrum.getDistance(entry);
}
function testLimit(parsed, entry) {
  if (!isNumeric(entry)) {
    throw new Error("noUiSlider: 'limit' option must be numeric.");
  }
  parsed.limit = parsed.spectrum.getDistance(entry);
  if (!parsed.limit || parsed.handles < 2) {
    throw new Error("noUiSlider: 'limit' option is only supported on linear sliders with 2 or more handles.");
  }
}
function testPadding(parsed, entry) {
  var index;
  if (!isNumeric(entry) && !Array.isArray(entry)) {
    throw new Error("noUiSlider: 'padding' option must be numeric or array of exactly 2 numbers.");
  }
  if (Array.isArray(entry) && !(entry.length === 2 || isNumeric(entry[0]) || isNumeric(entry[1]))) {
    throw new Error("noUiSlider: 'padding' option must be numeric or array of exactly 2 numbers.");
  }
  if (entry === 0) {
    return;
  }
  if (!Array.isArray(entry)) {
    entry = [entry, entry];
  }
  parsed.padding = [parsed.spectrum.getDistance(entry[0]), parsed.spectrum.getDistance(entry[1])];
  for (index = 0; index < parsed.spectrum.xNumSteps.length - 1; index++) {
    if (parsed.padding[0][index] < 0 || parsed.padding[1][index] < 0) {
      throw new Error("noUiSlider: 'padding' option must be a positive number(s).");
    }
  }
  var totalPadding = entry[0] + entry[1];
  var firstValue = parsed.spectrum.xVal[0];
  var lastValue = parsed.spectrum.xVal[parsed.spectrum.xVal.length - 1];
  if (totalPadding / (lastValue - firstValue) > 1) {
    throw new Error("noUiSlider: 'padding' option must not exceed 100% of the range.");
  }
}
function testDirection(parsed, entry) {
  switch (entry) {
    case "ltr":
      parsed.dir = 0;
      break;
    case "rtl":
      parsed.dir = 1;
      break;
    default:
      throw new Error("noUiSlider: 'direction' option was not recognized.");
  }
}
function testBehaviour(parsed, entry) {
  if (typeof entry !== "string") {
    throw new Error("noUiSlider: 'behaviour' must be a string containing options.");
  }
  var tap = entry.indexOf("tap") >= 0;
  var drag = entry.indexOf("drag") >= 0;
  var fixed = entry.indexOf("fixed") >= 0;
  var snap = entry.indexOf("snap") >= 0;
  var hover = entry.indexOf("hover") >= 0;
  var unconstrained = entry.indexOf("unconstrained") >= 0;
  var dragAll = entry.indexOf("drag-all") >= 0;
  var smoothSteps = entry.indexOf("smooth-steps") >= 0;
  if (fixed) {
    if (parsed.handles !== 2) {
      throw new Error("noUiSlider: 'fixed' behaviour must be used with 2 handles");
    }
    testMargin(parsed, parsed.start[1] - parsed.start[0]);
  }
  if (unconstrained && (parsed.margin || parsed.limit)) {
    throw new Error("noUiSlider: 'unconstrained' behaviour cannot be used with margin or limit");
  }
  parsed.events = {
    tap: tap || snap,
    drag,
    dragAll,
    smoothSteps,
    fixed,
    snap,
    hover,
    unconstrained
  };
}
function testTooltips(parsed, entry) {
  if (entry === false) {
    return;
  }
  if (entry === true || isValidPartialFormatter(entry)) {
    parsed.tooltips = [];
    for (var i = 0; i < parsed.handles; i++) {
      parsed.tooltips.push(entry);
    }
  } else {
    entry = asArray(entry);
    if (entry.length !== parsed.handles) {
      throw new Error("noUiSlider: must pass a formatter for all handles.");
    }
    entry.forEach(function(formatter) {
      if (typeof formatter !== "boolean" && !isValidPartialFormatter(formatter)) {
        throw new Error("noUiSlider: 'tooltips' must be passed a formatter or 'false'.");
      }
    });
    parsed.tooltips = entry;
  }
}
function testHandleAttributes(parsed, entry) {
  if (entry.length !== parsed.handles) {
    throw new Error("noUiSlider: must pass a attributes for all handles.");
  }
  parsed.handleAttributes = entry;
}
function testAriaFormat(parsed, entry) {
  if (!isValidPartialFormatter(entry)) {
    throw new Error("noUiSlider: 'ariaFormat' requires 'to' method.");
  }
  parsed.ariaFormat = entry;
}
function testFormat(parsed, entry) {
  if (!isValidFormatter(entry)) {
    throw new Error("noUiSlider: 'format' requires 'to' and 'from' methods.");
  }
  parsed.format = entry;
}
function testKeyboardSupport(parsed, entry) {
  if (typeof entry !== "boolean") {
    throw new Error("noUiSlider: 'keyboardSupport' option must be a boolean.");
  }
  parsed.keyboardSupport = entry;
}
function testDocumentElement(parsed, entry) {
  parsed.documentElement = entry;
}
function testCssPrefix(parsed, entry) {
  if (typeof entry !== "string" && entry !== false) {
    throw new Error("noUiSlider: 'cssPrefix' must be a string or `false`.");
  }
  parsed.cssPrefix = entry;
}
function testCssClasses(parsed, entry) {
  if (typeof entry !== "object") {
    throw new Error("noUiSlider: 'cssClasses' must be an object.");
  }
  if (typeof parsed.cssPrefix === "string") {
    parsed.cssClasses = {};
    Object.keys(entry).forEach(function(key) {
      parsed.cssClasses[key] = parsed.cssPrefix + entry[key];
    });
  } else {
    parsed.cssClasses = entry;
  }
}
function testOptions(options) {
  var parsed = {
    margin: null,
    limit: null,
    padding: null,
    animate: true,
    animationDuration: 300,
    ariaFormat: defaultFormatter,
    format: defaultFormatter
  };
  var tests = {
    step: { r: false, t: testStep },
    keyboardPageMultiplier: { r: false, t: testKeyboardPageMultiplier },
    keyboardMultiplier: { r: false, t: testKeyboardMultiplier },
    keyboardDefaultStep: { r: false, t: testKeyboardDefaultStep },
    start: { r: true, t: testStart },
    connect: { r: true, t: testConnect },
    direction: { r: true, t: testDirection },
    snap: { r: false, t: testSnap },
    animate: { r: false, t: testAnimate },
    animationDuration: { r: false, t: testAnimationDuration },
    range: { r: true, t: testRange },
    orientation: { r: false, t: testOrientation },
    margin: { r: false, t: testMargin },
    limit: { r: false, t: testLimit },
    padding: { r: false, t: testPadding },
    behaviour: { r: true, t: testBehaviour },
    ariaFormat: { r: false, t: testAriaFormat },
    format: { r: false, t: testFormat },
    tooltips: { r: false, t: testTooltips },
    keyboardSupport: { r: true, t: testKeyboardSupport },
    documentElement: { r: false, t: testDocumentElement },
    cssPrefix: { r: true, t: testCssPrefix },
    cssClasses: { r: true, t: testCssClasses },
    handleAttributes: { r: false, t: testHandleAttributes }
  };
  var defaults = {
    connect: false,
    direction: "ltr",
    behaviour: "tap",
    orientation: "horizontal",
    keyboardSupport: true,
    cssPrefix: "noUi-",
    cssClasses,
    keyboardPageMultiplier: 5,
    keyboardMultiplier: 1,
    keyboardDefaultStep: 10
  };
  if (options.format && !options.ariaFormat) {
    options.ariaFormat = options.format;
  }
  Object.keys(tests).forEach(function(name) {
    if (!isSet(options[name]) && defaults[name] === void 0) {
      if (tests[name].r) {
        throw new Error("noUiSlider: '" + name + "' is required.");
      }
      return;
    }
    tests[name].t(parsed, !isSet(options[name]) ? defaults[name] : options[name]);
  });
  parsed.pips = options.pips;
  var d = document.createElement("div");
  var msPrefix = d.style.msTransform !== void 0;
  var noPrefix = d.style.transform !== void 0;
  parsed.transformRule = noPrefix ? "transform" : msPrefix ? "msTransform" : "webkitTransform";
  var styles = [
    ["left", "top"],
    ["right", "bottom"]
  ];
  parsed.style = styles[parsed.dir][parsed.ort];
  return parsed;
}
function scope(target, options, originalOptions) {
  var actions = getActions();
  var supportsTouchActionNone = getSupportsTouchActionNone();
  var supportsPassive = supportsTouchActionNone && getSupportsPassive();
  var scope_Target = target;
  var scope_Base;
  var scope_Handles;
  var scope_Connects;
  var scope_Pips;
  var scope_Tooltips;
  var scope_Spectrum = options.spectrum;
  var scope_Values = [];
  var scope_Locations = [];
  var scope_HandleNumbers = [];
  var scope_ActiveHandlesCount = 0;
  var scope_Events = {};
  var scope_Document = target.ownerDocument;
  var scope_DocumentElement = options.documentElement || scope_Document.documentElement;
  var scope_Body = scope_Document.body;
  var scope_DirOffset = scope_Document.dir === "rtl" || options.ort === 1 ? 0 : 100;
  function addNodeTo(addTarget, className) {
    var div = scope_Document.createElement("div");
    if (className) {
      addClass(div, className);
    }
    addTarget.appendChild(div);
    return div;
  }
  function addOrigin(base, handleNumber) {
    var origin = addNodeTo(base, options.cssClasses.origin);
    var handle = addNodeTo(origin, options.cssClasses.handle);
    addNodeTo(handle, options.cssClasses.touchArea);
    handle.setAttribute("data-handle", String(handleNumber));
    if (options.keyboardSupport) {
      handle.setAttribute("tabindex", "0");
      handle.addEventListener("keydown", function(event) {
        return eventKeydown(event, handleNumber);
      });
    }
    if (options.handleAttributes !== void 0) {
      var attributes_1 = options.handleAttributes[handleNumber];
      Object.keys(attributes_1).forEach(function(attribute) {
        handle.setAttribute(attribute, attributes_1[attribute]);
      });
    }
    handle.setAttribute("role", "slider");
    handle.setAttribute("aria-orientation", options.ort ? "vertical" : "horizontal");
    if (handleNumber === 0) {
      addClass(handle, options.cssClasses.handleLower);
    } else if (handleNumber === options.handles - 1) {
      addClass(handle, options.cssClasses.handleUpper);
    }
    origin.handle = handle;
    return origin;
  }
  function addConnect(base, add) {
    if (!add) {
      return false;
    }
    return addNodeTo(base, options.cssClasses.connect);
  }
  function addElements(connectOptions, base) {
    var connectBase = addNodeTo(base, options.cssClasses.connects);
    scope_Handles = [];
    scope_Connects = [];
    scope_Connects.push(addConnect(connectBase, connectOptions[0]));
    for (var i = 0; i < options.handles; i++) {
      scope_Handles.push(addOrigin(base, i));
      scope_HandleNumbers[i] = i;
      scope_Connects.push(addConnect(connectBase, connectOptions[i + 1]));
    }
  }
  function addSlider(addTarget) {
    addClass(addTarget, options.cssClasses.target);
    if (options.dir === 0) {
      addClass(addTarget, options.cssClasses.ltr);
    } else {
      addClass(addTarget, options.cssClasses.rtl);
    }
    if (options.ort === 0) {
      addClass(addTarget, options.cssClasses.horizontal);
    } else {
      addClass(addTarget, options.cssClasses.vertical);
    }
    var textDirection = getComputedStyle(addTarget).direction;
    if (textDirection === "rtl") {
      addClass(addTarget, options.cssClasses.textDirectionRtl);
    } else {
      addClass(addTarget, options.cssClasses.textDirectionLtr);
    }
    return addNodeTo(addTarget, options.cssClasses.base);
  }
  function addTooltip(handle, handleNumber) {
    if (!options.tooltips || !options.tooltips[handleNumber]) {
      return false;
    }
    return addNodeTo(handle.firstChild, options.cssClasses.tooltip);
  }
  function isSliderDisabled() {
    return scope_Target.hasAttribute("disabled");
  }
  function isHandleDisabled(handleNumber) {
    var handleOrigin = scope_Handles[handleNumber];
    return handleOrigin.hasAttribute("disabled");
  }
  function disable(handleNumber) {
    if (handleNumber !== null && handleNumber !== void 0) {
      scope_Handles[handleNumber].setAttribute("disabled", "");
      scope_Handles[handleNumber].handle.removeAttribute("tabindex");
    } else {
      scope_Target.setAttribute("disabled", "");
      scope_Handles.forEach(function(handle) {
        handle.handle.removeAttribute("tabindex");
      });
    }
  }
  function enable(handleNumber) {
    if (handleNumber !== null && handleNumber !== void 0) {
      scope_Handles[handleNumber].removeAttribute("disabled");
      scope_Handles[handleNumber].handle.setAttribute("tabindex", "0");
    } else {
      scope_Target.removeAttribute("disabled");
      scope_Handles.forEach(function(handle) {
        handle.removeAttribute("disabled");
        handle.handle.setAttribute("tabindex", "0");
      });
    }
  }
  function removeTooltips() {
    if (scope_Tooltips) {
      removeEvent("update" + INTERNAL_EVENT_NS.tooltips);
      scope_Tooltips.forEach(function(tooltip) {
        if (tooltip) {
          removeElement(tooltip);
        }
      });
      scope_Tooltips = null;
    }
  }
  function tooltips() {
    removeTooltips();
    scope_Tooltips = scope_Handles.map(addTooltip);
    bindEvent("update" + INTERNAL_EVENT_NS.tooltips, function(values, handleNumber, unencoded) {
      if (!scope_Tooltips || !options.tooltips) {
        return;
      }
      if (scope_Tooltips[handleNumber] === false) {
        return;
      }
      var formattedValue = values[handleNumber];
      if (options.tooltips[handleNumber] !== true) {
        formattedValue = options.tooltips[handleNumber].to(unencoded[handleNumber]);
      }
      scope_Tooltips[handleNumber].innerHTML = formattedValue;
    });
  }
  function aria() {
    removeEvent("update" + INTERNAL_EVENT_NS.aria);
    bindEvent("update" + INTERNAL_EVENT_NS.aria, function(values, handleNumber, unencoded, tap, positions) {
      scope_HandleNumbers.forEach(function(index) {
        var handle = scope_Handles[index];
        var min = checkHandlePosition(scope_Locations, index, 0, true, true, true);
        var max = checkHandlePosition(scope_Locations, index, 100, true, true, true);
        var now = positions[index];
        var text = String(options.ariaFormat.to(unencoded[index]));
        min = scope_Spectrum.fromStepping(min).toFixed(1);
        max = scope_Spectrum.fromStepping(max).toFixed(1);
        now = scope_Spectrum.fromStepping(now).toFixed(1);
        handle.children[0].setAttribute("aria-valuemin", min);
        handle.children[0].setAttribute("aria-valuemax", max);
        handle.children[0].setAttribute("aria-valuenow", now);
        handle.children[0].setAttribute("aria-valuetext", text);
      });
    });
  }
  function getGroup(pips2) {
    if (pips2.mode === PipsMode.Range || pips2.mode === PipsMode.Steps) {
      return scope_Spectrum.xVal;
    }
    if (pips2.mode === PipsMode.Count) {
      if (pips2.values < 2) {
        throw new Error("noUiSlider: 'values' (>= 2) required for mode 'count'.");
      }
      var interval = pips2.values - 1;
      var spread = 100 / interval;
      var values = [];
      while (interval--) {
        values[interval] = interval * spread;
      }
      values.push(100);
      return mapToRange(values, pips2.stepped);
    }
    if (pips2.mode === PipsMode.Positions) {
      return mapToRange(pips2.values, pips2.stepped);
    }
    if (pips2.mode === PipsMode.Values) {
      if (pips2.stepped) {
        return pips2.values.map(function(value) {
          return scope_Spectrum.fromStepping(scope_Spectrum.getStep(scope_Spectrum.toStepping(value)));
        });
      }
      return pips2.values;
    }
    return [];
  }
  function mapToRange(values, stepped) {
    return values.map(function(value) {
      return scope_Spectrum.fromStepping(stepped ? scope_Spectrum.getStep(value) : value);
    });
  }
  function generateSpread(pips2) {
    function safeIncrement(value, increment) {
      return Number((value + increment).toFixed(7));
    }
    var group = getGroup(pips2);
    var indexes = {};
    var firstInRange = scope_Spectrum.xVal[0];
    var lastInRange = scope_Spectrum.xVal[scope_Spectrum.xVal.length - 1];
    var ignoreFirst = false;
    var ignoreLast = false;
    var prevPct = 0;
    group = unique(group.slice().sort(function(a, b) {
      return a - b;
    }));
    if (group[0] !== firstInRange) {
      group.unshift(firstInRange);
      ignoreFirst = true;
    }
    if (group[group.length - 1] !== lastInRange) {
      group.push(lastInRange);
      ignoreLast = true;
    }
    group.forEach(function(current, index) {
      var step;
      var i;
      var q;
      var low = current;
      var high = group[index + 1];
      var newPct;
      var pctDifference;
      var pctPos;
      var type;
      var steps;
      var realSteps;
      var stepSize;
      var isSteps = pips2.mode === PipsMode.Steps;
      if (isSteps) {
        step = scope_Spectrum.xNumSteps[index];
      }
      if (!step) {
        step = high - low;
      }
      if (high === void 0) {
        high = low;
      }
      step = Math.max(step, 1e-7);
      for (i = low; i <= high; i = safeIncrement(i, step)) {
        newPct = scope_Spectrum.toStepping(i);
        pctDifference = newPct - prevPct;
        steps = pctDifference / (pips2.density || 1);
        realSteps = Math.round(steps);
        stepSize = pctDifference / realSteps;
        for (q = 1; q <= realSteps; q += 1) {
          pctPos = prevPct + q * stepSize;
          indexes[pctPos.toFixed(5)] = [scope_Spectrum.fromStepping(pctPos), 0];
        }
        type = group.indexOf(i) > -1 ? PipsType.LargeValue : isSteps ? PipsType.SmallValue : PipsType.NoValue;
        if (!index && ignoreFirst && i !== high) {
          type = 0;
        }
        if (!(i === high && ignoreLast)) {
          indexes[newPct.toFixed(5)] = [i, type];
        }
        prevPct = newPct;
      }
    });
    return indexes;
  }
  function addMarking(spread, filterFunc, formatter) {
    var _a, _b;
    var element = scope_Document.createElement("div");
    var valueSizeClasses = (_a = {}, _a[PipsType.None] = "", _a[PipsType.NoValue] = options.cssClasses.valueNormal, _a[PipsType.LargeValue] = options.cssClasses.valueLarge, _a[PipsType.SmallValue] = options.cssClasses.valueSub, _a);
    var markerSizeClasses = (_b = {}, _b[PipsType.None] = "", _b[PipsType.NoValue] = options.cssClasses.markerNormal, _b[PipsType.LargeValue] = options.cssClasses.markerLarge, _b[PipsType.SmallValue] = options.cssClasses.markerSub, _b);
    var valueOrientationClasses = [options.cssClasses.valueHorizontal, options.cssClasses.valueVertical];
    var markerOrientationClasses = [options.cssClasses.markerHorizontal, options.cssClasses.markerVertical];
    addClass(element, options.cssClasses.pips);
    addClass(element, options.ort === 0 ? options.cssClasses.pipsHorizontal : options.cssClasses.pipsVertical);
    function getClasses(type, source) {
      var a = source === options.cssClasses.value;
      var orientationClasses = a ? valueOrientationClasses : markerOrientationClasses;
      var sizeClasses = a ? valueSizeClasses : markerSizeClasses;
      return source + " " + orientationClasses[options.ort] + " " + sizeClasses[type];
    }
    function addSpread(offset2, value, type) {
      type = filterFunc ? filterFunc(value, type) : type;
      if (type === PipsType.None) {
        return;
      }
      var node = addNodeTo(element, false);
      node.className = getClasses(type, options.cssClasses.marker);
      node.style[options.style] = offset2 + "%";
      if (type > PipsType.NoValue) {
        node = addNodeTo(element, false);
        node.className = getClasses(type, options.cssClasses.value);
        node.setAttribute("data-value", String(value));
        node.style[options.style] = offset2 + "%";
        node.innerHTML = String(formatter.to(value));
      }
    }
    Object.keys(spread).forEach(function(offset2) {
      addSpread(offset2, spread[offset2][0], spread[offset2][1]);
    });
    return element;
  }
  function removePips() {
    if (scope_Pips) {
      removeElement(scope_Pips);
      scope_Pips = null;
    }
  }
  function pips(pips2) {
    removePips();
    var spread = generateSpread(pips2);
    var filter = pips2.filter;
    var format = pips2.format || {
      to: function(value) {
        return String(Math.round(value));
      }
    };
    scope_Pips = scope_Target.appendChild(addMarking(spread, filter, format));
    return scope_Pips;
  }
  function baseSize() {
    var rect = scope_Base.getBoundingClientRect();
    var alt = "offset" + ["Width", "Height"][options.ort];
    return options.ort === 0 ? rect.width || scope_Base[alt] : rect.height || scope_Base[alt];
  }
  function attachEvent(events, element, callback, data) {
    var method = function(event) {
      var e = fixEvent(event, data.pageOffset, data.target || element);
      if (!e) {
        return false;
      }
      if (isSliderDisabled() && !data.doNotReject) {
        return false;
      }
      if (hasClass(scope_Target, options.cssClasses.tap) && !data.doNotReject) {
        return false;
      }
      if (events === actions.start && e.buttons !== void 0 && e.buttons > 1) {
        return false;
      }
      if (data.hover && e.buttons) {
        return false;
      }
      if (!supportsPassive) {
        e.preventDefault();
      }
      e.calcPoint = e.points[options.ort];
      callback(e, data);
      return;
    };
    var methods = [];
    events.split(" ").forEach(function(eventName) {
      element.addEventListener(eventName, method, supportsPassive ? { passive: true } : false);
      methods.push([eventName, method]);
    });
    return methods;
  }
  function fixEvent(e, pageOffset, eventTarget) {
    var touch = e.type.indexOf("touch") === 0;
    var mouse = e.type.indexOf("mouse") === 0;
    var pointer = e.type.indexOf("pointer") === 0;
    var x = 0;
    var y = 0;
    if (e.type.indexOf("MSPointer") === 0) {
      pointer = true;
    }
    if (e.type === "mousedown" && !e.buttons && !e.touches) {
      return false;
    }
    if (touch) {
      var isTouchOnTarget = function(checkTouch) {
        var target2 = checkTouch.target;
        return target2 === eventTarget || eventTarget.contains(target2) || e.composed && e.composedPath().shift() === eventTarget;
      };
      if (e.type === "touchstart") {
        var targetTouches = Array.prototype.filter.call(e.touches, isTouchOnTarget);
        if (targetTouches.length > 1) {
          return false;
        }
        x = targetTouches[0].pageX;
        y = targetTouches[0].pageY;
      } else {
        var targetTouch = Array.prototype.find.call(e.changedTouches, isTouchOnTarget);
        if (!targetTouch) {
          return false;
        }
        x = targetTouch.pageX;
        y = targetTouch.pageY;
      }
    }
    pageOffset = pageOffset || getPageOffset(scope_Document);
    if (mouse || pointer) {
      x = e.clientX + pageOffset.x;
      y = e.clientY + pageOffset.y;
    }
    e.pageOffset = pageOffset;
    e.points = [x, y];
    e.cursor = mouse || pointer;
    return e;
  }
  function calcPointToPercentage(calcPoint) {
    var location = calcPoint - offset(scope_Base, options.ort);
    var proposal = location * 100 / baseSize();
    proposal = limit(proposal);
    return options.dir ? 100 - proposal : proposal;
  }
  function getClosestHandle(clickedPosition) {
    var smallestDifference = 100;
    var handleNumber = false;
    scope_Handles.forEach(function(handle, index) {
      if (isHandleDisabled(index)) {
        return;
      }
      var handlePosition = scope_Locations[index];
      var differenceWithThisHandle = Math.abs(handlePosition - clickedPosition);
      var clickAtEdge = differenceWithThisHandle === 100 && smallestDifference === 100;
      var isCloser = differenceWithThisHandle < smallestDifference;
      var isCloserAfter = differenceWithThisHandle <= smallestDifference && clickedPosition > handlePosition;
      if (isCloser || isCloserAfter || clickAtEdge) {
        handleNumber = index;
        smallestDifference = differenceWithThisHandle;
      }
    });
    return handleNumber;
  }
  function documentLeave(event, data) {
    if (event.type === "mouseout" && event.target.nodeName === "HTML" && event.relatedTarget === null) {
      eventEnd(event, data);
    }
  }
  function eventMove(event, data) {
    if (navigator.appVersion.indexOf("MSIE 9") === -1 && event.buttons === 0 && data.buttonsProperty !== 0) {
      return eventEnd(event, data);
    }
    var movement = (options.dir ? -1 : 1) * (event.calcPoint - data.startCalcPoint);
    var proposal = movement * 100 / data.baseSize;
    moveHandles(movement > 0, proposal, data.locations, data.handleNumbers, data.connect);
  }
  function eventEnd(event, data) {
    if (data.handle) {
      removeClass(data.handle, options.cssClasses.active);
      scope_ActiveHandlesCount -= 1;
    }
    data.listeners.forEach(function(c) {
      scope_DocumentElement.removeEventListener(c[0], c[1]);
    });
    if (scope_ActiveHandlesCount === 0) {
      removeClass(scope_Target, options.cssClasses.drag);
      setZindex();
      if (event.cursor) {
        scope_Body.style.cursor = "";
        scope_Body.removeEventListener("selectstart", preventDefault);
      }
    }
    if (options.events.smoothSteps) {
      data.handleNumbers.forEach(function(handleNumber) {
        setHandle(handleNumber, scope_Locations[handleNumber], true, true, false, false);
      });
      data.handleNumbers.forEach(function(handleNumber) {
        fireEvent("update", handleNumber);
      });
    }
    data.handleNumbers.forEach(function(handleNumber) {
      fireEvent("change", handleNumber);
      fireEvent("set", handleNumber);
      fireEvent("end", handleNumber);
    });
  }
  function eventStart(event, data) {
    if (data.handleNumbers.some(isHandleDisabled)) {
      return;
    }
    var handle;
    if (data.handleNumbers.length === 1) {
      var handleOrigin = scope_Handles[data.handleNumbers[0]];
      handle = handleOrigin.children[0];
      scope_ActiveHandlesCount += 1;
      addClass(handle, options.cssClasses.active);
    }
    event.stopPropagation();
    var listeners = [];
    var moveEvent = attachEvent(actions.move, scope_DocumentElement, eventMove, {
      // The event target has changed so we need to propagate the original one so that we keep
      // relying on it to extract target touches.
      target: event.target,
      handle,
      connect: data.connect,
      listeners,
      startCalcPoint: event.calcPoint,
      baseSize: baseSize(),
      pageOffset: event.pageOffset,
      handleNumbers: data.handleNumbers,
      buttonsProperty: event.buttons,
      locations: scope_Locations.slice()
    });
    var endEvent = attachEvent(actions.end, scope_DocumentElement, eventEnd, {
      target: event.target,
      handle,
      listeners,
      doNotReject: true,
      handleNumbers: data.handleNumbers
    });
    var outEvent = attachEvent("mouseout", scope_DocumentElement, documentLeave, {
      target: event.target,
      handle,
      listeners,
      doNotReject: true,
      handleNumbers: data.handleNumbers
    });
    listeners.push.apply(listeners, moveEvent.concat(endEvent, outEvent));
    if (event.cursor) {
      scope_Body.style.cursor = getComputedStyle(event.target).cursor;
      if (scope_Handles.length > 1) {
        addClass(scope_Target, options.cssClasses.drag);
      }
      scope_Body.addEventListener("selectstart", preventDefault, false);
    }
    data.handleNumbers.forEach(function(handleNumber) {
      fireEvent("start", handleNumber);
    });
  }
  function eventTap(event) {
    event.stopPropagation();
    var proposal = calcPointToPercentage(event.calcPoint);
    var handleNumber = getClosestHandle(proposal);
    if (handleNumber === false) {
      return;
    }
    if (!options.events.snap) {
      addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
    }
    setHandle(handleNumber, proposal, true, true);
    setZindex();
    fireEvent("slide", handleNumber, true);
    fireEvent("update", handleNumber, true);
    if (!options.events.snap) {
      fireEvent("change", handleNumber, true);
      fireEvent("set", handleNumber, true);
    } else {
      eventStart(event, { handleNumbers: [handleNumber] });
    }
  }
  function eventHover(event) {
    var proposal = calcPointToPercentage(event.calcPoint);
    var to = scope_Spectrum.getStep(proposal);
    var value = scope_Spectrum.fromStepping(to);
    Object.keys(scope_Events).forEach(function(targetEvent) {
      if ("hover" === targetEvent.split(".")[0]) {
        scope_Events[targetEvent].forEach(function(callback) {
          callback.call(scope_Self, value);
        });
      }
    });
  }
  function eventKeydown(event, handleNumber) {
    if (isSliderDisabled() || isHandleDisabled(handleNumber)) {
      return false;
    }
    var horizontalKeys = ["Left", "Right"];
    var verticalKeys = ["Down", "Up"];
    var largeStepKeys = ["PageDown", "PageUp"];
    var edgeKeys = ["Home", "End"];
    if (options.dir && !options.ort) {
      horizontalKeys.reverse();
    } else if (options.ort && !options.dir) {
      verticalKeys.reverse();
      largeStepKeys.reverse();
    }
    var key = event.key.replace("Arrow", "");
    var isLargeDown = key === largeStepKeys[0];
    var isLargeUp = key === largeStepKeys[1];
    var isDown = key === verticalKeys[0] || key === horizontalKeys[0] || isLargeDown;
    var isUp = key === verticalKeys[1] || key === horizontalKeys[1] || isLargeUp;
    var isMin = key === edgeKeys[0];
    var isMax = key === edgeKeys[1];
    if (!isDown && !isUp && !isMin && !isMax) {
      return true;
    }
    event.preventDefault();
    var to;
    if (isUp || isDown) {
      var direction = isDown ? 0 : 1;
      var steps = getNextStepsForHandle(handleNumber);
      var step = steps[direction];
      if (step === null) {
        return false;
      }
      if (step === false) {
        step = scope_Spectrum.getDefaultStep(scope_Locations[handleNumber], isDown, options.keyboardDefaultStep);
      }
      if (isLargeUp || isLargeDown) {
        step *= options.keyboardPageMultiplier;
      } else {
        step *= options.keyboardMultiplier;
      }
      step = Math.max(step, 1e-7);
      step = (isDown ? -1 : 1) * step;
      to = scope_Values[handleNumber] + step;
    } else if (isMax) {
      to = options.spectrum.xVal[options.spectrum.xVal.length - 1];
    } else {
      to = options.spectrum.xVal[0];
    }
    setHandle(handleNumber, scope_Spectrum.toStepping(to), true, true);
    fireEvent("slide", handleNumber);
    fireEvent("update", handleNumber);
    fireEvent("change", handleNumber);
    fireEvent("set", handleNumber);
    return false;
  }
  function bindSliderEvents(behaviour) {
    if (!behaviour.fixed) {
      scope_Handles.forEach(function(handle, index) {
        attachEvent(actions.start, handle.children[0], eventStart, {
          handleNumbers: [index]
        });
      });
    }
    if (behaviour.tap) {
      attachEvent(actions.start, scope_Base, eventTap, {});
    }
    if (behaviour.hover) {
      attachEvent(actions.move, scope_Base, eventHover, {
        hover: true
      });
    }
    if (behaviour.drag) {
      scope_Connects.forEach(function(connect, index) {
        if (connect === false || index === 0 || index === scope_Connects.length - 1) {
          return;
        }
        var handleBefore = scope_Handles[index - 1];
        var handleAfter = scope_Handles[index];
        var eventHolders = [connect];
        var handlesToDrag = [handleBefore, handleAfter];
        var handleNumbersToDrag = [index - 1, index];
        addClass(connect, options.cssClasses.draggable);
        if (behaviour.fixed) {
          eventHolders.push(handleBefore.children[0]);
          eventHolders.push(handleAfter.children[0]);
        }
        if (behaviour.dragAll) {
          handlesToDrag = scope_Handles;
          handleNumbersToDrag = scope_HandleNumbers;
        }
        eventHolders.forEach(function(eventHolder) {
          attachEvent(actions.start, eventHolder, eventStart, {
            handles: handlesToDrag,
            handleNumbers: handleNumbersToDrag,
            connect
          });
        });
      });
    }
  }
  function bindEvent(namespacedEvent, callback) {
    scope_Events[namespacedEvent] = scope_Events[namespacedEvent] || [];
    scope_Events[namespacedEvent].push(callback);
    if (namespacedEvent.split(".")[0] === "update") {
      scope_Handles.forEach(function(a, index) {
        fireEvent("update", index);
      });
    }
  }
  function isInternalNamespace(namespace) {
    return namespace === INTERNAL_EVENT_NS.aria || namespace === INTERNAL_EVENT_NS.tooltips;
  }
  function removeEvent(namespacedEvent) {
    var event = namespacedEvent && namespacedEvent.split(".")[0];
    var namespace = event ? namespacedEvent.substring(event.length) : namespacedEvent;
    Object.keys(scope_Events).forEach(function(bind) {
      var tEvent = bind.split(".")[0];
      var tNamespace = bind.substring(tEvent.length);
      if ((!event || event === tEvent) && (!namespace || namespace === tNamespace)) {
        if (!isInternalNamespace(tNamespace) || namespace === tNamespace) {
          delete scope_Events[bind];
        }
      }
    });
  }
  function fireEvent(eventName, handleNumber, tap) {
    Object.keys(scope_Events).forEach(function(targetEvent) {
      var eventType = targetEvent.split(".")[0];
      if (eventName === eventType) {
        scope_Events[targetEvent].forEach(function(callback) {
          callback.call(
            // Use the slider public API as the scope ('this')
            scope_Self,
            // Return values as array, so arg_1[arg_2] is always valid.
            scope_Values.map(options.format.to),
            // Handle index, 0 or 1
            handleNumber,
            // Un-formatted slider values
            scope_Values.slice(),
            // Event is fired by tap, true or false
            tap || false,
            // Left offset of the handle, in relation to the slider
            scope_Locations.slice(),
            // add the slider public API to an accessible parameter when this is unavailable
            scope_Self
          );
        });
      }
    });
  }
  function checkHandlePosition(reference, handleNumber, to, lookBackward, lookForward, getValue, smoothSteps) {
    var distance;
    if (scope_Handles.length > 1 && !options.events.unconstrained) {
      if (lookBackward && handleNumber > 0) {
        distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber - 1], options.margin, false);
        to = Math.max(to, distance);
      }
      if (lookForward && handleNumber < scope_Handles.length - 1) {
        distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber + 1], options.margin, true);
        to = Math.min(to, distance);
      }
    }
    if (scope_Handles.length > 1 && options.limit) {
      if (lookBackward && handleNumber > 0) {
        distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber - 1], options.limit, false);
        to = Math.min(to, distance);
      }
      if (lookForward && handleNumber < scope_Handles.length - 1) {
        distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber + 1], options.limit, true);
        to = Math.max(to, distance);
      }
    }
    if (options.padding) {
      if (handleNumber === 0) {
        distance = scope_Spectrum.getAbsoluteDistance(0, options.padding[0], false);
        to = Math.max(to, distance);
      }
      if (handleNumber === scope_Handles.length - 1) {
        distance = scope_Spectrum.getAbsoluteDistance(100, options.padding[1], true);
        to = Math.min(to, distance);
      }
    }
    if (!smoothSteps) {
      to = scope_Spectrum.getStep(to);
    }
    to = limit(to);
    if (to === reference[handleNumber] && !getValue) {
      return false;
    }
    return to;
  }
  function inRuleOrder(v, a) {
    var o = options.ort;
    return (o ? a : v) + ", " + (o ? v : a);
  }
  function moveHandles(upward, proposal, locations, handleNumbers, connect) {
    var proposals = locations.slice();
    var firstHandle = handleNumbers[0];
    var smoothSteps = options.events.smoothSteps;
    var b = [!upward, upward];
    var f = [upward, !upward];
    handleNumbers = handleNumbers.slice();
    if (upward) {
      handleNumbers.reverse();
    }
    if (handleNumbers.length > 1) {
      handleNumbers.forEach(function(handleNumber, o) {
        var to = checkHandlePosition(proposals, handleNumber, proposals[handleNumber] + proposal, b[o], f[o], false, smoothSteps);
        if (to === false) {
          proposal = 0;
        } else {
          proposal = to - proposals[handleNumber];
          proposals[handleNumber] = to;
        }
      });
    } else {
      b = f = [true];
    }
    var state = false;
    handleNumbers.forEach(function(handleNumber, o) {
      state = setHandle(handleNumber, locations[handleNumber] + proposal, b[o], f[o], false, smoothSteps) || state;
    });
    if (state) {
      handleNumbers.forEach(function(handleNumber) {
        fireEvent("update", handleNumber);
        fireEvent("slide", handleNumber);
      });
      if (connect != void 0) {
        fireEvent("drag", firstHandle);
      }
    }
  }
  function transformDirection(a, b) {
    return options.dir ? 100 - a - b : a;
  }
  function updateHandlePosition(handleNumber, to) {
    scope_Locations[handleNumber] = to;
    scope_Values[handleNumber] = scope_Spectrum.fromStepping(to);
    var translation = transformDirection(to, 0) - scope_DirOffset;
    var translateRule = "translate(" + inRuleOrder(translation + "%", "0") + ")";
    scope_Handles[handleNumber].style[options.transformRule] = translateRule;
    updateConnect(handleNumber);
    updateConnect(handleNumber + 1);
  }
  function setZindex() {
    scope_HandleNumbers.forEach(function(handleNumber) {
      var dir = scope_Locations[handleNumber] > 50 ? -1 : 1;
      var zIndex = 3 + (scope_Handles.length + dir * handleNumber);
      scope_Handles[handleNumber].style.zIndex = String(zIndex);
    });
  }
  function setHandle(handleNumber, to, lookBackward, lookForward, exactInput, smoothSteps) {
    if (!exactInput) {
      to = checkHandlePosition(scope_Locations, handleNumber, to, lookBackward, lookForward, false, smoothSteps);
    }
    if (to === false) {
      return false;
    }
    updateHandlePosition(handleNumber, to);
    return true;
  }
  function updateConnect(index) {
    if (!scope_Connects[index]) {
      return;
    }
    var l = 0;
    var h = 100;
    if (index !== 0) {
      l = scope_Locations[index - 1];
    }
    if (index !== scope_Connects.length - 1) {
      h = scope_Locations[index];
    }
    var connectWidth = h - l;
    var translateRule = "translate(" + inRuleOrder(transformDirection(l, connectWidth) + "%", "0") + ")";
    var scaleRule = "scale(" + inRuleOrder(connectWidth / 100, "1") + ")";
    scope_Connects[index].style[options.transformRule] = translateRule + " " + scaleRule;
  }
  function resolveToValue(to, handleNumber) {
    if (to === null || to === false || to === void 0) {
      return scope_Locations[handleNumber];
    }
    if (typeof to === "number") {
      to = String(to);
    }
    to = options.format.from(to);
    if (to !== false) {
      to = scope_Spectrum.toStepping(to);
    }
    if (to === false || isNaN(to)) {
      return scope_Locations[handleNumber];
    }
    return to;
  }
  function valueSet(input, fireSetEvent, exactInput) {
    var values = asArray(input);
    var isInit = scope_Locations[0] === void 0;
    fireSetEvent = fireSetEvent === void 0 ? true : fireSetEvent;
    if (options.animate && !isInit) {
      addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
    }
    scope_HandleNumbers.forEach(function(handleNumber) {
      setHandle(handleNumber, resolveToValue(values[handleNumber], handleNumber), true, false, exactInput);
    });
    var i = scope_HandleNumbers.length === 1 ? 0 : 1;
    if (isInit && scope_Spectrum.hasNoSize()) {
      exactInput = true;
      scope_Locations[0] = 0;
      if (scope_HandleNumbers.length > 1) {
        var space_1 = 100 / (scope_HandleNumbers.length - 1);
        scope_HandleNumbers.forEach(function(handleNumber) {
          scope_Locations[handleNumber] = handleNumber * space_1;
        });
      }
    }
    for (; i < scope_HandleNumbers.length; ++i) {
      scope_HandleNumbers.forEach(function(handleNumber) {
        setHandle(handleNumber, scope_Locations[handleNumber], true, true, exactInput);
      });
    }
    setZindex();
    scope_HandleNumbers.forEach(function(handleNumber) {
      fireEvent("update", handleNumber);
      if (values[handleNumber] !== null && fireSetEvent) {
        fireEvent("set", handleNumber);
      }
    });
  }
  function valueReset(fireSetEvent) {
    valueSet(options.start, fireSetEvent);
  }
  function valueSetHandle(handleNumber, value, fireSetEvent, exactInput) {
    handleNumber = Number(handleNumber);
    if (!(handleNumber >= 0 && handleNumber < scope_HandleNumbers.length)) {
      throw new Error("noUiSlider: invalid handle number, got: " + handleNumber);
    }
    setHandle(handleNumber, resolveToValue(value, handleNumber), true, true, exactInput);
    fireEvent("update", handleNumber);
    if (fireSetEvent) {
      fireEvent("set", handleNumber);
    }
  }
  function valueGet(unencoded) {
    if (unencoded === void 0) {
      unencoded = false;
    }
    if (unencoded) {
      return scope_Values.length === 1 ? scope_Values[0] : scope_Values.slice(0);
    }
    var values = scope_Values.map(options.format.to);
    if (values.length === 1) {
      return values[0];
    }
    return values;
  }
  function destroy() {
    removeEvent(INTERNAL_EVENT_NS.aria);
    removeEvent(INTERNAL_EVENT_NS.tooltips);
    Object.keys(options.cssClasses).forEach(function(key) {
      removeClass(scope_Target, options.cssClasses[key]);
    });
    while (scope_Target.firstChild) {
      scope_Target.removeChild(scope_Target.firstChild);
    }
    delete scope_Target.noUiSlider;
  }
  function getNextStepsForHandle(handleNumber) {
    var location = scope_Locations[handleNumber];
    var nearbySteps = scope_Spectrum.getNearbySteps(location);
    var value = scope_Values[handleNumber];
    var increment = nearbySteps.thisStep.step;
    var decrement = null;
    if (options.snap) {
      return [
        value - nearbySteps.stepBefore.startValue || null,
        nearbySteps.stepAfter.startValue - value || null
      ];
    }
    if (increment !== false) {
      if (value + increment > nearbySteps.stepAfter.startValue) {
        increment = nearbySteps.stepAfter.startValue - value;
      }
    }
    if (value > nearbySteps.thisStep.startValue) {
      decrement = nearbySteps.thisStep.step;
    } else if (nearbySteps.stepBefore.step === false) {
      decrement = false;
    } else {
      decrement = value - nearbySteps.stepBefore.highestStep;
    }
    if (location === 100) {
      increment = null;
    } else if (location === 0) {
      decrement = null;
    }
    var stepDecimals = scope_Spectrum.countStepDecimals();
    if (increment !== null && increment !== false) {
      increment = Number(increment.toFixed(stepDecimals));
    }
    if (decrement !== null && decrement !== false) {
      decrement = Number(decrement.toFixed(stepDecimals));
    }
    return [decrement, increment];
  }
  function getNextSteps() {
    return scope_HandleNumbers.map(getNextStepsForHandle);
  }
  function updateOptions(optionsToUpdate, fireSetEvent) {
    var v = valueGet();
    var updateAble = [
      "margin",
      "limit",
      "padding",
      "range",
      "animate",
      "snap",
      "step",
      "format",
      "pips",
      "tooltips"
    ];
    updateAble.forEach(function(name) {
      if (optionsToUpdate[name] !== void 0) {
        originalOptions[name] = optionsToUpdate[name];
      }
    });
    var newOptions = testOptions(originalOptions);
    updateAble.forEach(function(name) {
      if (optionsToUpdate[name] !== void 0) {
        options[name] = newOptions[name];
      }
    });
    scope_Spectrum = newOptions.spectrum;
    options.margin = newOptions.margin;
    options.limit = newOptions.limit;
    options.padding = newOptions.padding;
    if (options.pips) {
      pips(options.pips);
    } else {
      removePips();
    }
    if (options.tooltips) {
      tooltips();
    } else {
      removeTooltips();
    }
    scope_Locations = [];
    valueSet(isSet(optionsToUpdate.start) ? optionsToUpdate.start : v, fireSetEvent);
  }
  function setupSlider() {
    scope_Base = addSlider(scope_Target);
    addElements(options.connect, scope_Base);
    bindSliderEvents(options.events);
    valueSet(options.start);
    if (options.pips) {
      pips(options.pips);
    }
    if (options.tooltips) {
      tooltips();
    }
    aria();
  }
  setupSlider();
  var scope_Self = {
    destroy,
    steps: getNextSteps,
    on: bindEvent,
    off: removeEvent,
    get: valueGet,
    set: valueSet,
    setHandle: valueSetHandle,
    reset: valueReset,
    disable,
    enable,
    // Exposed for unit testing, don't use this in your application.
    __moveHandles: function(upward, proposal, handleNumbers) {
      moveHandles(upward, proposal, scope_Locations, handleNumbers);
    },
    options: originalOptions,
    updateOptions,
    target: scope_Target,
    removePips,
    removeTooltips,
    getPositions: function() {
      return scope_Locations.slice();
    },
    getTooltips: function() {
      return scope_Tooltips;
    },
    getOrigins: function() {
      return scope_Handles;
    },
    pips
    // Issue #594
  };
  return scope_Self;
}
function initialize(target, originalOptions) {
  if (!target || !target.nodeName) {
    throw new Error("noUiSlider: create requires a single element, got: " + target);
  }
  if (target.noUiSlider) {
    throw new Error("noUiSlider: Slider was already initialized.");
  }
  var options = testOptions(originalOptions);
  var api = scope(target, options, originalOptions);
  target.noUiSlider = api;
  return api;
}
var nouislider_default = {
  // Exposed for unit testing, don't use this in your application.
  __spectrum: Spectrum,
  // A reference to the default classes, allows global changes.
  // Use the cssClasses option for changes to one slider.
  cssClasses,
  create: initialize
};

// resources/js/slider.js
function slider({
  element,
  start,
  connect,
  range = {
    min: 0,
    max: 10
  },
  state,
  step,
  behaviour,
  snap,
  tooltips,
  onChange = console.log
}) {
  return {
    start,
    element,
    connect,
    range,
    component: null,
    state,
    step,
    behaviour,
    tooltips,
    onChange,
    init() {
      console.log(this.pips);
      this.component = document.getElementById(this.element);
      nouislider_default.cssClasses.target += " range-slider";
      let slider2 = nouislider_default.create(this.component, {
        start: window.Alpine.raw(start),
        connect: window.Alpine.raw(connect),
        range: window.Alpine.raw(range),
        tooltips,
        step: window.Alpine.raw(step),
        behaviour: window.Alpine.raw(behaviour),
        snap: window.Alpine.raw(snap)
      });
      this.component.noUiSlider.on("update", (values) => {
        document.addEventListener("livewire:load", function() {
          setInterval(() => Livewire.dispatch("nextSlot"), 4e3);
        });
        for (let i = 0; i < values.length; i++) {
          window.Livewire.dispatch(this.state[i], values[i]);
        }
      });
    }
  };
}
export {
  slider as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL25vdWlzbGlkZXIvZGlzdC9ub3Vpc2xpZGVyLm1qcyIsICIuLi8uLi9qcy9zbGlkZXIuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0IHZhciBQaXBzTW9kZTtcbihmdW5jdGlvbiAoUGlwc01vZGUpIHtcbiAgICBQaXBzTW9kZVtcIlJhbmdlXCJdID0gXCJyYW5nZVwiO1xuICAgIFBpcHNNb2RlW1wiU3RlcHNcIl0gPSBcInN0ZXBzXCI7XG4gICAgUGlwc01vZGVbXCJQb3NpdGlvbnNcIl0gPSBcInBvc2l0aW9uc1wiO1xuICAgIFBpcHNNb2RlW1wiQ291bnRcIl0gPSBcImNvdW50XCI7XG4gICAgUGlwc01vZGVbXCJWYWx1ZXNcIl0gPSBcInZhbHVlc1wiO1xufSkoUGlwc01vZGUgfHwgKFBpcHNNb2RlID0ge30pKTtcbmV4cG9ydCB2YXIgUGlwc1R5cGU7XG4oZnVuY3Rpb24gKFBpcHNUeXBlKSB7XG4gICAgUGlwc1R5cGVbUGlwc1R5cGVbXCJOb25lXCJdID0gLTFdID0gXCJOb25lXCI7XG4gICAgUGlwc1R5cGVbUGlwc1R5cGVbXCJOb1ZhbHVlXCJdID0gMF0gPSBcIk5vVmFsdWVcIjtcbiAgICBQaXBzVHlwZVtQaXBzVHlwZVtcIkxhcmdlVmFsdWVcIl0gPSAxXSA9IFwiTGFyZ2VWYWx1ZVwiO1xuICAgIFBpcHNUeXBlW1BpcHNUeXBlW1wiU21hbGxWYWx1ZVwiXSA9IDJdID0gXCJTbWFsbFZhbHVlXCI7XG59KShQaXBzVHlwZSB8fCAoUGlwc1R5cGUgPSB7fSkpO1xuLy9yZWdpb24gSGVscGVyIE1ldGhvZHNcbmZ1bmN0aW9uIGlzVmFsaWRGb3JtYXR0ZXIoZW50cnkpIHtcbiAgICByZXR1cm4gaXNWYWxpZFBhcnRpYWxGb3JtYXR0ZXIoZW50cnkpICYmIHR5cGVvZiBlbnRyeS5mcm9tID09PSBcImZ1bmN0aW9uXCI7XG59XG5mdW5jdGlvbiBpc1ZhbGlkUGFydGlhbEZvcm1hdHRlcihlbnRyeSkge1xuICAgIC8vIHBhcnRpYWwgZm9ybWF0dGVycyBvbmx5IG5lZWQgYSB0byBmdW5jdGlvbiBhbmQgbm90IGEgZnJvbSBmdW5jdGlvblxuICAgIHJldHVybiB0eXBlb2YgZW50cnkgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGVudHJ5LnRvID09PSBcImZ1bmN0aW9uXCI7XG59XG5mdW5jdGlvbiByZW1vdmVFbGVtZW50KGVsKSB7XG4gICAgZWwucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChlbCk7XG59XG5mdW5jdGlvbiBpc1NldCh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkO1xufVxuLy8gQmluZGFibGUgdmVyc2lvblxuZnVuY3Rpb24gcHJldmVudERlZmF1bHQoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbn1cbi8vIFJlbW92ZXMgZHVwbGljYXRlcyBmcm9tIGFuIGFycmF5LlxuZnVuY3Rpb24gdW5pcXVlKGFycmF5KSB7XG4gICAgcmV0dXJuIGFycmF5LmZpbHRlcihmdW5jdGlvbiAoYSkge1xuICAgICAgICByZXR1cm4gIXRoaXNbYV0gPyAodGhpc1thXSA9IHRydWUpIDogZmFsc2U7XG4gICAgfSwge30pO1xufVxuLy8gUm91bmQgYSB2YWx1ZSB0byB0aGUgY2xvc2VzdCAndG8nLlxuZnVuY3Rpb24gY2xvc2VzdCh2YWx1ZSwgdG8pIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZCh2YWx1ZSAvIHRvKSAqIHRvO1xufVxuLy8gQ3VycmVudCBwb3NpdGlvbiBvZiBhbiBlbGVtZW50IHJlbGF0aXZlIHRvIHRoZSBkb2N1bWVudC5cbmZ1bmN0aW9uIG9mZnNldChlbGVtLCBvcmllbnRhdGlvbikge1xuICAgIHZhciByZWN0ID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICB2YXIgZG9jID0gZWxlbS5vd25lckRvY3VtZW50O1xuICAgIHZhciBkb2NFbGVtID0gZG9jLmRvY3VtZW50RWxlbWVudDtcbiAgICB2YXIgcGFnZU9mZnNldCA9IGdldFBhZ2VPZmZzZXQoZG9jKTtcbiAgICAvLyBnZXRCb3VuZGluZ0NsaWVudFJlY3QgY29udGFpbnMgbGVmdCBzY3JvbGwgaW4gQ2hyb21lIG9uIEFuZHJvaWQuXG4gICAgLy8gSSBoYXZlbid0IGZvdW5kIGEgZmVhdHVyZSBkZXRlY3Rpb24gdGhhdCBwcm92ZXMgdGhpcy4gV29yc3QgY2FzZVxuICAgIC8vIHNjZW5hcmlvIG9uIG1pcy1tYXRjaDogdGhlICd0YXAnIGZlYXR1cmUgb24gaG9yaXpvbnRhbCBzbGlkZXJzIGJyZWFrcy5cbiAgICBpZiAoL3dlYmtpdC4qQ2hyb21lLipNb2JpbGUvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSB7XG4gICAgICAgIHBhZ2VPZmZzZXQueCA9IDA7XG4gICAgfVxuICAgIHJldHVybiBvcmllbnRhdGlvbiA/IHJlY3QudG9wICsgcGFnZU9mZnNldC55IC0gZG9jRWxlbS5jbGllbnRUb3AgOiByZWN0LmxlZnQgKyBwYWdlT2Zmc2V0LnggLSBkb2NFbGVtLmNsaWVudExlZnQ7XG59XG4vLyBDaGVja3Mgd2hldGhlciBhIHZhbHVlIGlzIG51bWVyaWNhbC5cbmZ1bmN0aW9uIGlzTnVtZXJpYyhhKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBhID09PSBcIm51bWJlclwiICYmICFpc05hTihhKSAmJiBpc0Zpbml0ZShhKTtcbn1cbi8vIFNldHMgYSBjbGFzcyBhbmQgcmVtb3ZlcyBpdCBhZnRlciBbZHVyYXRpb25dIG1zLlxuZnVuY3Rpb24gYWRkQ2xhc3NGb3IoZWxlbWVudCwgY2xhc3NOYW1lLCBkdXJhdGlvbikge1xuICAgIGlmIChkdXJhdGlvbiA+IDApIHtcbiAgICAgICAgYWRkQ2xhc3MoZWxlbWVudCwgY2xhc3NOYW1lKTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZW1vdmVDbGFzcyhlbGVtZW50LCBjbGFzc05hbWUpO1xuICAgICAgICB9LCBkdXJhdGlvbik7XG4gICAgfVxufVxuLy8gTGltaXRzIGEgdmFsdWUgdG8gMCAtIDEwMFxuZnVuY3Rpb24gbGltaXQoYSkge1xuICAgIHJldHVybiBNYXRoLm1heChNYXRoLm1pbihhLCAxMDApLCAwKTtcbn1cbi8vIFdyYXBzIGEgdmFyaWFibGUgYXMgYW4gYXJyYXksIGlmIGl0IGlzbid0IG9uZSB5ZXQuXG4vLyBOb3RlIHRoYXQgYW4gaW5wdXQgYXJyYXkgaXMgcmV0dXJuZWQgYnkgcmVmZXJlbmNlIVxuZnVuY3Rpb24gYXNBcnJheShhKSB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYSkgPyBhIDogW2FdO1xufVxuLy8gQ291bnRzIGRlY2ltYWxzXG5mdW5jdGlvbiBjb3VudERlY2ltYWxzKG51bVN0cikge1xuICAgIG51bVN0ciA9IFN0cmluZyhudW1TdHIpO1xuICAgIHZhciBwaWVjZXMgPSBudW1TdHIuc3BsaXQoXCIuXCIpO1xuICAgIHJldHVybiBwaWVjZXMubGVuZ3RoID4gMSA/IHBpZWNlc1sxXS5sZW5ndGggOiAwO1xufVxuLy8gaHR0cDovL3lvdW1pZ2h0bm90bmVlZGpxdWVyeS5jb20vI2FkZF9jbGFzc1xuZnVuY3Rpb24gYWRkQ2xhc3MoZWwsIGNsYXNzTmFtZSkge1xuICAgIGlmIChlbC5jbGFzc0xpc3QgJiYgIS9cXHMvLnRlc3QoY2xhc3NOYW1lKSkge1xuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBlbC5jbGFzc05hbWUgKz0gXCIgXCIgKyBjbGFzc05hbWU7XG4gICAgfVxufVxuLy8gaHR0cDovL3lvdW1pZ2h0bm90bmVlZGpxdWVyeS5jb20vI3JlbW92ZV9jbGFzc1xuZnVuY3Rpb24gcmVtb3ZlQ2xhc3MoZWwsIGNsYXNzTmFtZSkge1xuICAgIGlmIChlbC5jbGFzc0xpc3QgJiYgIS9cXHMvLnRlc3QoY2xhc3NOYW1lKSkge1xuICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBlbC5jbGFzc05hbWUgPSBlbC5jbGFzc05hbWUucmVwbGFjZShuZXcgUmVnRXhwKFwiKF58XFxcXGIpXCIgKyBjbGFzc05hbWUuc3BsaXQoXCIgXCIpLmpvaW4oXCJ8XCIpICsgXCIoXFxcXGJ8JClcIiwgXCJnaVwiKSwgXCIgXCIpO1xuICAgIH1cbn1cbi8vIGh0dHBzOi8vcGxhaW5qcy5jb20vamF2YXNjcmlwdC9hdHRyaWJ1dGVzL2FkZGluZy1yZW1vdmluZy1hbmQtdGVzdGluZy1mb3ItY2xhc3Nlcy05L1xuZnVuY3Rpb24gaGFzQ2xhc3MoZWwsIGNsYXNzTmFtZSkge1xuICAgIHJldHVybiBlbC5jbGFzc0xpc3QgPyBlbC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKSA6IG5ldyBSZWdFeHAoXCJcXFxcYlwiICsgY2xhc3NOYW1lICsgXCJcXFxcYlwiKS50ZXN0KGVsLmNsYXNzTmFtZSk7XG59XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2luZG93L3Njcm9sbFkjTm90ZXNcbmZ1bmN0aW9uIGdldFBhZ2VPZmZzZXQoZG9jKSB7XG4gICAgdmFyIHN1cHBvcnRQYWdlT2Zmc2V0ID0gd2luZG93LnBhZ2VYT2Zmc2V0ICE9PSB1bmRlZmluZWQ7XG4gICAgdmFyIGlzQ1NTMUNvbXBhdCA9IChkb2MuY29tcGF0TW9kZSB8fCBcIlwiKSA9PT0gXCJDU1MxQ29tcGF0XCI7XG4gICAgdmFyIHggPSBzdXBwb3J0UGFnZU9mZnNldFxuICAgICAgICA/IHdpbmRvdy5wYWdlWE9mZnNldFxuICAgICAgICA6IGlzQ1NTMUNvbXBhdFxuICAgICAgICAgICAgPyBkb2MuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnRcbiAgICAgICAgICAgIDogZG9jLmJvZHkuc2Nyb2xsTGVmdDtcbiAgICB2YXIgeSA9IHN1cHBvcnRQYWdlT2Zmc2V0XG4gICAgICAgID8gd2luZG93LnBhZ2VZT2Zmc2V0XG4gICAgICAgIDogaXNDU1MxQ29tcGF0XG4gICAgICAgICAgICA/IGRvYy5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wXG4gICAgICAgICAgICA6IGRvYy5ib2R5LnNjcm9sbFRvcDtcbiAgICByZXR1cm4ge1xuICAgICAgICB4OiB4LFxuICAgICAgICB5OiB5LFxuICAgIH07XG59XG4vLyB3ZSBwcm92aWRlIGEgZnVuY3Rpb24gdG8gY29tcHV0ZSBjb25zdGFudHMgaW5zdGVhZFxuLy8gb2YgYWNjZXNzaW5nIHdpbmRvdy4qIGFzIHNvb24gYXMgdGhlIG1vZHVsZSBuZWVkcyBpdFxuLy8gc28gdGhhdCB3ZSBkbyBub3QgY29tcHV0ZSBhbnl0aGluZyBpZiBub3QgbmVlZGVkXG5mdW5jdGlvbiBnZXRBY3Rpb25zKCkge1xuICAgIC8vIERldGVybWluZSB0aGUgZXZlbnRzIHRvIGJpbmQuIElFMTEgaW1wbGVtZW50cyBwb2ludGVyRXZlbnRzIHdpdGhvdXRcbiAgICAvLyBhIHByZWZpeCwgd2hpY2ggYnJlYWtzIGNvbXBhdGliaWxpdHkgd2l0aCB0aGUgSUUxMCBpbXBsZW1lbnRhdGlvbi5cbiAgICByZXR1cm4gd2luZG93Lm5hdmlnYXRvci5wb2ludGVyRW5hYmxlZFxuICAgICAgICA/IHtcbiAgICAgICAgICAgIHN0YXJ0OiBcInBvaW50ZXJkb3duXCIsXG4gICAgICAgICAgICBtb3ZlOiBcInBvaW50ZXJtb3ZlXCIsXG4gICAgICAgICAgICBlbmQ6IFwicG9pbnRlcnVwXCIsXG4gICAgICAgIH1cbiAgICAgICAgOiB3aW5kb3cubmF2aWdhdG9yLm1zUG9pbnRlckVuYWJsZWRcbiAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgIHN0YXJ0OiBcIk1TUG9pbnRlckRvd25cIixcbiAgICAgICAgICAgICAgICBtb3ZlOiBcIk1TUG9pbnRlck1vdmVcIixcbiAgICAgICAgICAgICAgICBlbmQ6IFwiTVNQb2ludGVyVXBcIixcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDoge1xuICAgICAgICAgICAgICAgIHN0YXJ0OiBcIm1vdXNlZG93biB0b3VjaHN0YXJ0XCIsXG4gICAgICAgICAgICAgICAgbW92ZTogXCJtb3VzZW1vdmUgdG91Y2htb3ZlXCIsXG4gICAgICAgICAgICAgICAgZW5kOiBcIm1vdXNldXAgdG91Y2hlbmRcIixcbiAgICAgICAgICAgIH07XG59XG4vLyBodHRwczovL2dpdGh1Yi5jb20vV0lDRy9FdmVudExpc3RlbmVyT3B0aW9ucy9ibG9iL2doLXBhZ2VzL2V4cGxhaW5lci5tZFxuLy8gSXNzdWUgIzc4NVxuZnVuY3Rpb24gZ2V0U3VwcG9ydHNQYXNzaXZlKCkge1xuICAgIHZhciBzdXBwb3J0c1Bhc3NpdmUgPSBmYWxzZTtcbiAgICAvKiBlc2xpbnQtZGlzYWJsZSAqL1xuICAgIHRyeSB7XG4gICAgICAgIHZhciBvcHRzID0gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCBcInBhc3NpdmVcIiwge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc3VwcG9ydHNQYXNzaXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidGVzdFwiLCBudWxsLCBvcHRzKTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHsgfVxuICAgIC8qIGVzbGludC1lbmFibGUgKi9cbiAgICByZXR1cm4gc3VwcG9ydHNQYXNzaXZlO1xufVxuZnVuY3Rpb24gZ2V0U3VwcG9ydHNUb3VjaEFjdGlvbk5vbmUoKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5DU1MgJiYgQ1NTLnN1cHBvcnRzICYmIENTUy5zdXBwb3J0cyhcInRvdWNoLWFjdGlvblwiLCBcIm5vbmVcIik7XG59XG4vL2VuZHJlZ2lvblxuLy9yZWdpb24gUmFuZ2UgQ2FsY3VsYXRpb25cbi8vIERldGVybWluZSB0aGUgc2l6ZSBvZiBhIHN1Yi1yYW5nZSBpbiByZWxhdGlvbiB0byBhIGZ1bGwgcmFuZ2UuXG5mdW5jdGlvbiBzdWJSYW5nZVJhdGlvKHBhLCBwYikge1xuICAgIHJldHVybiAxMDAgLyAocGIgLSBwYSk7XG59XG4vLyAocGVyY2VudGFnZSkgSG93IG1hbnkgcGVyY2VudCBpcyB0aGlzIHZhbHVlIG9mIHRoaXMgcmFuZ2U/XG5mdW5jdGlvbiBmcm9tUGVyY2VudGFnZShyYW5nZSwgdmFsdWUsIHN0YXJ0UmFuZ2UpIHtcbiAgICByZXR1cm4gKHZhbHVlICogMTAwKSAvIChyYW5nZVtzdGFydFJhbmdlICsgMV0gLSByYW5nZVtzdGFydFJhbmdlXSk7XG59XG4vLyAocGVyY2VudGFnZSkgV2hlcmUgaXMgdGhpcyB2YWx1ZSBvbiB0aGlzIHJhbmdlP1xuZnVuY3Rpb24gdG9QZXJjZW50YWdlKHJhbmdlLCB2YWx1ZSkge1xuICAgIHJldHVybiBmcm9tUGVyY2VudGFnZShyYW5nZSwgcmFuZ2VbMF0gPCAwID8gdmFsdWUgKyBNYXRoLmFicyhyYW5nZVswXSkgOiB2YWx1ZSAtIHJhbmdlWzBdLCAwKTtcbn1cbi8vICh2YWx1ZSkgSG93IG11Y2ggaXMgdGhpcyBwZXJjZW50YWdlIG9uIHRoaXMgcmFuZ2U/XG5mdW5jdGlvbiBpc1BlcmNlbnRhZ2UocmFuZ2UsIHZhbHVlKSB7XG4gICAgcmV0dXJuICh2YWx1ZSAqIChyYW5nZVsxXSAtIHJhbmdlWzBdKSkgLyAxMDAgKyByYW5nZVswXTtcbn1cbmZ1bmN0aW9uIGdldEoodmFsdWUsIGFycikge1xuICAgIHZhciBqID0gMTtcbiAgICB3aGlsZSAodmFsdWUgPj0gYXJyW2pdKSB7XG4gICAgICAgIGogKz0gMTtcbiAgICB9XG4gICAgcmV0dXJuIGo7XG59XG4vLyAocGVyY2VudGFnZSkgSW5wdXQgYSB2YWx1ZSwgZmluZCB3aGVyZSwgb24gYSBzY2FsZSBvZiAwLTEwMCwgaXQgYXBwbGllcy5cbmZ1bmN0aW9uIHRvU3RlcHBpbmcoeFZhbCwgeFBjdCwgdmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPj0geFZhbC5zbGljZSgtMSlbMF0pIHtcbiAgICAgICAgcmV0dXJuIDEwMDtcbiAgICB9XG4gICAgdmFyIGogPSBnZXRKKHZhbHVlLCB4VmFsKTtcbiAgICB2YXIgdmEgPSB4VmFsW2ogLSAxXTtcbiAgICB2YXIgdmIgPSB4VmFsW2pdO1xuICAgIHZhciBwYSA9IHhQY3RbaiAtIDFdO1xuICAgIHZhciBwYiA9IHhQY3Rbal07XG4gICAgcmV0dXJuIHBhICsgdG9QZXJjZW50YWdlKFt2YSwgdmJdLCB2YWx1ZSkgLyBzdWJSYW5nZVJhdGlvKHBhLCBwYik7XG59XG4vLyAodmFsdWUpIElucHV0IGEgcGVyY2VudGFnZSwgZmluZCB3aGVyZSBpdCBpcyBvbiB0aGUgc3BlY2lmaWVkIHJhbmdlLlxuZnVuY3Rpb24gZnJvbVN0ZXBwaW5nKHhWYWwsIHhQY3QsIHZhbHVlKSB7XG4gICAgLy8gVGhlcmUgaXMgbm8gcmFuZ2UgZ3JvdXAgdGhhdCBmaXRzIDEwMFxuICAgIGlmICh2YWx1ZSA+PSAxMDApIHtcbiAgICAgICAgcmV0dXJuIHhWYWwuc2xpY2UoLTEpWzBdO1xuICAgIH1cbiAgICB2YXIgaiA9IGdldEoodmFsdWUsIHhQY3QpO1xuICAgIHZhciB2YSA9IHhWYWxbaiAtIDFdO1xuICAgIHZhciB2YiA9IHhWYWxbal07XG4gICAgdmFyIHBhID0geFBjdFtqIC0gMV07XG4gICAgdmFyIHBiID0geFBjdFtqXTtcbiAgICByZXR1cm4gaXNQZXJjZW50YWdlKFt2YSwgdmJdLCAodmFsdWUgLSBwYSkgKiBzdWJSYW5nZVJhdGlvKHBhLCBwYikpO1xufVxuLy8gKHBlcmNlbnRhZ2UpIEdldCB0aGUgc3RlcCB0aGF0IGFwcGxpZXMgYXQgYSBjZXJ0YWluIHZhbHVlLlxuZnVuY3Rpb24gZ2V0U3RlcCh4UGN0LCB4U3RlcHMsIHNuYXAsIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09PSAxMDApIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICB2YXIgaiA9IGdldEoodmFsdWUsIHhQY3QpO1xuICAgIHZhciBhID0geFBjdFtqIC0gMV07XG4gICAgdmFyIGIgPSB4UGN0W2pdO1xuICAgIC8vIElmICdzbmFwJyBpcyBzZXQsIHN0ZXBzIGFyZSB1c2VkIGFzIGZpeGVkIHBvaW50cyBvbiB0aGUgc2xpZGVyLlxuICAgIGlmIChzbmFwKSB7XG4gICAgICAgIC8vIEZpbmQgdGhlIGNsb3Nlc3QgcG9zaXRpb24sIGEgb3IgYi5cbiAgICAgICAgaWYgKHZhbHVlIC0gYSA+IChiIC0gYSkgLyAyKSB7XG4gICAgICAgICAgICByZXR1cm4gYjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYTtcbiAgICB9XG4gICAgaWYgKCF4U3RlcHNbaiAtIDFdKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHhQY3RbaiAtIDFdICsgY2xvc2VzdCh2YWx1ZSAtIHhQY3RbaiAtIDFdLCB4U3RlcHNbaiAtIDFdKTtcbn1cbi8vZW5kcmVnaW9uXG4vL3JlZ2lvbiBTcGVjdHJ1bVxudmFyIFNwZWN0cnVtID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFNwZWN0cnVtKGVudHJ5LCBzbmFwLCBzaW5nbGVTdGVwKSB7XG4gICAgICAgIHRoaXMueFBjdCA9IFtdO1xuICAgICAgICB0aGlzLnhWYWwgPSBbXTtcbiAgICAgICAgdGhpcy54U3RlcHMgPSBbXTtcbiAgICAgICAgdGhpcy54TnVtU3RlcHMgPSBbXTtcbiAgICAgICAgdGhpcy54SGlnaGVzdENvbXBsZXRlU3RlcCA9IFtdO1xuICAgICAgICB0aGlzLnhTdGVwcyA9IFtzaW5nbGVTdGVwIHx8IGZhbHNlXTtcbiAgICAgICAgdGhpcy54TnVtU3RlcHMgPSBbZmFsc2VdO1xuICAgICAgICB0aGlzLnNuYXAgPSBzbmFwO1xuICAgICAgICB2YXIgaW5kZXg7XG4gICAgICAgIHZhciBvcmRlcmVkID0gW107XG4gICAgICAgIC8vIE1hcCB0aGUgb2JqZWN0IGtleXMgdG8gYW4gYXJyYXkuXG4gICAgICAgIE9iamVjdC5rZXlzKGVudHJ5KS5mb3JFYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAgICAgb3JkZXJlZC5wdXNoKFthc0FycmF5KGVudHJ5W2luZGV4XSksIGluZGV4XSk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBTb3J0IGFsbCBlbnRyaWVzIGJ5IHZhbHVlIChudW1lcmljIHNvcnQpLlxuICAgICAgICBvcmRlcmVkLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBhWzBdWzBdIC0gYlswXVswXTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIENvbnZlcnQgYWxsIGVudHJpZXMgdG8gc3VicmFuZ2VzLlxuICAgICAgICBmb3IgKGluZGV4ID0gMDsgaW5kZXggPCBvcmRlcmVkLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVFbnRyeVBvaW50KG9yZGVyZWRbaW5kZXhdWzFdLCBvcmRlcmVkW2luZGV4XVswXSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gU3RvcmUgdGhlIGFjdHVhbCBzdGVwIHZhbHVlcy5cbiAgICAgICAgLy8geFN0ZXBzIGlzIHNvcnRlZCBpbiB0aGUgc2FtZSBvcmRlciBhcyB4UGN0IGFuZCB4VmFsLlxuICAgICAgICB0aGlzLnhOdW1TdGVwcyA9IHRoaXMueFN0ZXBzLnNsaWNlKDApO1xuICAgICAgICAvLyBDb252ZXJ0IGFsbCBudW1lcmljIHN0ZXBzIHRvIHRoZSBwZXJjZW50YWdlIG9mIHRoZSBzdWJyYW5nZSB0aGV5IHJlcHJlc2VudC5cbiAgICAgICAgZm9yIChpbmRleCA9IDA7IGluZGV4IDwgdGhpcy54TnVtU3RlcHMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZVN0ZXBQb2ludChpbmRleCwgdGhpcy54TnVtU3RlcHNbaW5kZXhdKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBTcGVjdHJ1bS5wcm90b3R5cGUuZ2V0RGlzdGFuY2UgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdmFyIGRpc3RhbmNlcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy54TnVtU3RlcHMubGVuZ3RoIC0gMTsgaW5kZXgrKykge1xuICAgICAgICAgICAgZGlzdGFuY2VzW2luZGV4XSA9IGZyb21QZXJjZW50YWdlKHRoaXMueFZhbCwgdmFsdWUsIGluZGV4KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGlzdGFuY2VzO1xuICAgIH07XG4gICAgLy8gQ2FsY3VsYXRlIHRoZSBwZXJjZW50dWFsIGRpc3RhbmNlIG92ZXIgdGhlIHdob2xlIHNjYWxlIG9mIHJhbmdlcy5cbiAgICAvLyBkaXJlY3Rpb246IDAgPSBiYWNrd2FyZHMgLyAxID0gZm9yd2FyZHNcbiAgICBTcGVjdHJ1bS5wcm90b3R5cGUuZ2V0QWJzb2x1dGVEaXN0YW5jZSA9IGZ1bmN0aW9uICh2YWx1ZSwgZGlzdGFuY2VzLCBkaXJlY3Rpb24pIHtcbiAgICAgICAgdmFyIHhQY3RfaW5kZXggPSAwO1xuICAgICAgICAvLyBDYWxjdWxhdGUgcmFuZ2Ugd2hlcmUgdG8gc3RhcnQgY2FsY3VsYXRpb25cbiAgICAgICAgaWYgKHZhbHVlIDwgdGhpcy54UGN0W3RoaXMueFBjdC5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgd2hpbGUgKHZhbHVlID4gdGhpcy54UGN0W3hQY3RfaW5kZXggKyAxXSkge1xuICAgICAgICAgICAgICAgIHhQY3RfaW5kZXgrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh2YWx1ZSA9PT0gdGhpcy54UGN0W3RoaXMueFBjdC5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgeFBjdF9pbmRleCA9IHRoaXMueFBjdC5sZW5ndGggLSAyO1xuICAgICAgICB9XG4gICAgICAgIC8vIElmIGxvb2tpbmcgYmFja3dhcmRzIGFuZCB0aGUgdmFsdWUgaXMgZXhhY3RseSBhdCBhIHJhbmdlIHNlcGFyYXRvciB0aGVuIGxvb2sgb25lIHJhbmdlIGZ1cnRoZXJcbiAgICAgICAgaWYgKCFkaXJlY3Rpb24gJiYgdmFsdWUgPT09IHRoaXMueFBjdFt4UGN0X2luZGV4ICsgMV0pIHtcbiAgICAgICAgICAgIHhQY3RfaW5kZXgrKztcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGlzdGFuY2VzID09PSBudWxsKSB7XG4gICAgICAgICAgICBkaXN0YW5jZXMgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc3RhcnRfZmFjdG9yO1xuICAgICAgICB2YXIgcmVzdF9mYWN0b3IgPSAxO1xuICAgICAgICB2YXIgcmVzdF9yZWxfZGlzdGFuY2UgPSBkaXN0YW5jZXNbeFBjdF9pbmRleF07XG4gICAgICAgIHZhciByYW5nZV9wY3QgPSAwO1xuICAgICAgICB2YXIgcmVsX3JhbmdlX2Rpc3RhbmNlID0gMDtcbiAgICAgICAgdmFyIGFic19kaXN0YW5jZV9jb3VudGVyID0gMDtcbiAgICAgICAgdmFyIHJhbmdlX2NvdW50ZXIgPSAwO1xuICAgICAgICAvLyBDYWxjdWxhdGUgd2hhdCBwYXJ0IG9mIHRoZSBzdGFydCByYW5nZSB0aGUgdmFsdWUgaXNcbiAgICAgICAgaWYgKGRpcmVjdGlvbikge1xuICAgICAgICAgICAgc3RhcnRfZmFjdG9yID0gKHZhbHVlIC0gdGhpcy54UGN0W3hQY3RfaW5kZXhdKSAvICh0aGlzLnhQY3RbeFBjdF9pbmRleCArIDFdIC0gdGhpcy54UGN0W3hQY3RfaW5kZXhdKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHN0YXJ0X2ZhY3RvciA9ICh0aGlzLnhQY3RbeFBjdF9pbmRleCArIDFdIC0gdmFsdWUpIC8gKHRoaXMueFBjdFt4UGN0X2luZGV4ICsgMV0gLSB0aGlzLnhQY3RbeFBjdF9pbmRleF0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIERvIHVudGlsIHRoZSBjb21wbGV0ZSBkaXN0YW5jZSBhY3Jvc3MgcmFuZ2VzIGlzIGNhbGN1bGF0ZWRcbiAgICAgICAgd2hpbGUgKHJlc3RfcmVsX2Rpc3RhbmNlID4gMCkge1xuICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBwZXJjZW50YWdlIG9mIHRvdGFsIHJhbmdlXG4gICAgICAgICAgICByYW5nZV9wY3QgPSB0aGlzLnhQY3RbeFBjdF9pbmRleCArIDEgKyByYW5nZV9jb3VudGVyXSAtIHRoaXMueFBjdFt4UGN0X2luZGV4ICsgcmFuZ2VfY291bnRlcl07XG4gICAgICAgICAgICAvLyBEZXRlY3QgaWYgdGhlIG1hcmdpbiwgcGFkZGluZyBvciBsaW1pdCBpcyBsYXJnZXIgdGhlbiB0aGUgY3VycmVudCByYW5nZSBhbmQgY2FsY3VsYXRlXG4gICAgICAgICAgICBpZiAoZGlzdGFuY2VzW3hQY3RfaW5kZXggKyByYW5nZV9jb3VudGVyXSAqIHJlc3RfZmFjdG9yICsgMTAwIC0gc3RhcnRfZmFjdG9yICogMTAwID4gMTAwKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgbGFyZ2VyIHRoZW4gdGFrZSB0aGUgcGVyY2VudHVhbCBkaXN0YW5jZSBvZiB0aGUgd2hvbGUgcmFuZ2VcbiAgICAgICAgICAgICAgICByZWxfcmFuZ2VfZGlzdGFuY2UgPSByYW5nZV9wY3QgKiBzdGFydF9mYWN0b3I7XG4gICAgICAgICAgICAgICAgLy8gUmVzdCBmYWN0b3Igb2YgcmVsYXRpdmUgcGVyY2VudHVhbCBkaXN0YW5jZSBzdGlsbCB0byBiZSBjYWxjdWxhdGVkXG4gICAgICAgICAgICAgICAgcmVzdF9mYWN0b3IgPSAocmVzdF9yZWxfZGlzdGFuY2UgLSAxMDAgKiBzdGFydF9mYWN0b3IpIC8gZGlzdGFuY2VzW3hQY3RfaW5kZXggKyByYW5nZV9jb3VudGVyXTtcbiAgICAgICAgICAgICAgICAvLyBTZXQgc3RhcnQgZmFjdG9yIHRvIDEgYXMgZm9yIG5leHQgcmFuZ2UgaXQgZG9lcyBub3QgYXBwbHkuXG4gICAgICAgICAgICAgICAgc3RhcnRfZmFjdG9yID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIElmIHNtYWxsZXIgb3IgZXF1YWwgdGhlbiB0YWtlIHRoZSBwZXJjZW50dWFsIGRpc3RhbmNlIG9mIHRoZSBjYWxjdWxhdGUgcGVyY2VudHVhbCBwYXJ0IG9mIHRoYXQgcmFuZ2VcbiAgICAgICAgICAgICAgICByZWxfcmFuZ2VfZGlzdGFuY2UgPSAoKGRpc3RhbmNlc1t4UGN0X2luZGV4ICsgcmFuZ2VfY291bnRlcl0gKiByYW5nZV9wY3QpIC8gMTAwKSAqIHJlc3RfZmFjdG9yO1xuICAgICAgICAgICAgICAgIC8vIE5vIHJlc3QgbGVmdCBhcyB0aGUgcmVzdCBmaXRzIGluIGN1cnJlbnQgcmFuZ2VcbiAgICAgICAgICAgICAgICByZXN0X2ZhY3RvciA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgYWJzX2Rpc3RhbmNlX2NvdW50ZXIgPSBhYnNfZGlzdGFuY2VfY291bnRlciAtIHJlbF9yYW5nZV9kaXN0YW5jZTtcbiAgICAgICAgICAgICAgICAvLyBMaW1pdCByYW5nZSB0byBmaXJzdCByYW5nZSB3aGVuIGRpc3RhbmNlIGJlY29tZXMgb3V0c2lkZSBvZiBtaW5pbXVtIHJhbmdlXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMueFBjdC5sZW5ndGggKyByYW5nZV9jb3VudGVyID49IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2VfY291bnRlci0tO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGFic19kaXN0YW5jZV9jb3VudGVyID0gYWJzX2Rpc3RhbmNlX2NvdW50ZXIgKyByZWxfcmFuZ2VfZGlzdGFuY2U7XG4gICAgICAgICAgICAgICAgLy8gTGltaXQgcmFuZ2UgdG8gbGFzdCByYW5nZSB3aGVuIGRpc3RhbmNlIGJlY29tZXMgb3V0c2lkZSBvZiBtYXhpbXVtIHJhbmdlXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMueFBjdC5sZW5ndGggLSByYW5nZV9jb3VudGVyID49IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2VfY291bnRlcisrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFJlc3Qgb2YgcmVsYXRpdmUgcGVyY2VudHVhbCBkaXN0YW5jZSBzdGlsbCB0byBiZSBjYWxjdWxhdGVkXG4gICAgICAgICAgICByZXN0X3JlbF9kaXN0YW5jZSA9IGRpc3RhbmNlc1t4UGN0X2luZGV4ICsgcmFuZ2VfY291bnRlcl0gKiByZXN0X2ZhY3RvcjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWUgKyBhYnNfZGlzdGFuY2VfY291bnRlcjtcbiAgICB9O1xuICAgIFNwZWN0cnVtLnByb3RvdHlwZS50b1N0ZXBwaW5nID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZhbHVlID0gdG9TdGVwcGluZyh0aGlzLnhWYWwsIHRoaXMueFBjdCwgdmFsdWUpO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcbiAgICBTcGVjdHJ1bS5wcm90b3R5cGUuZnJvbVN0ZXBwaW5nID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBmcm9tU3RlcHBpbmcodGhpcy54VmFsLCB0aGlzLnhQY3QsIHZhbHVlKTtcbiAgICB9O1xuICAgIFNwZWN0cnVtLnByb3RvdHlwZS5nZXRTdGVwID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZhbHVlID0gZ2V0U3RlcCh0aGlzLnhQY3QsIHRoaXMueFN0ZXBzLCB0aGlzLnNuYXAsIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG4gICAgU3BlY3RydW0ucHJvdG90eXBlLmdldERlZmF1bHRTdGVwID0gZnVuY3Rpb24gKHZhbHVlLCBpc0Rvd24sIHNpemUpIHtcbiAgICAgICAgdmFyIGogPSBnZXRKKHZhbHVlLCB0aGlzLnhQY3QpO1xuICAgICAgICAvLyBXaGVuIGF0IHRoZSB0b3Agb3Igc3RlcHBpbmcgZG93biwgbG9vayBhdCB0aGUgcHJldmlvdXMgc3ViLXJhbmdlXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gMTAwIHx8IChpc0Rvd24gJiYgdmFsdWUgPT09IHRoaXMueFBjdFtqIC0gMV0pKSB7XG4gICAgICAgICAgICBqID0gTWF0aC5tYXgoaiAtIDEsIDEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAodGhpcy54VmFsW2pdIC0gdGhpcy54VmFsW2ogLSAxXSkgLyBzaXplO1xuICAgIH07XG4gICAgU3BlY3RydW0ucHJvdG90eXBlLmdldE5lYXJieVN0ZXBzID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZhciBqID0gZ2V0Sih2YWx1ZSwgdGhpcy54UGN0KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0ZXBCZWZvcmU6IHtcbiAgICAgICAgICAgICAgICBzdGFydFZhbHVlOiB0aGlzLnhWYWxbaiAtIDJdLFxuICAgICAgICAgICAgICAgIHN0ZXA6IHRoaXMueE51bVN0ZXBzW2ogLSAyXSxcbiAgICAgICAgICAgICAgICBoaWdoZXN0U3RlcDogdGhpcy54SGlnaGVzdENvbXBsZXRlU3RlcFtqIC0gMl0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGhpc1N0ZXA6IHtcbiAgICAgICAgICAgICAgICBzdGFydFZhbHVlOiB0aGlzLnhWYWxbaiAtIDFdLFxuICAgICAgICAgICAgICAgIHN0ZXA6IHRoaXMueE51bVN0ZXBzW2ogLSAxXSxcbiAgICAgICAgICAgICAgICBoaWdoZXN0U3RlcDogdGhpcy54SGlnaGVzdENvbXBsZXRlU3RlcFtqIC0gMV0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3RlcEFmdGVyOiB7XG4gICAgICAgICAgICAgICAgc3RhcnRWYWx1ZTogdGhpcy54VmFsW2pdLFxuICAgICAgICAgICAgICAgIHN0ZXA6IHRoaXMueE51bVN0ZXBzW2pdLFxuICAgICAgICAgICAgICAgIGhpZ2hlc3RTdGVwOiB0aGlzLnhIaWdoZXN0Q29tcGxldGVTdGVwW2pdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIFNwZWN0cnVtLnByb3RvdHlwZS5jb3VudFN0ZXBEZWNpbWFscyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHN0ZXBEZWNpbWFscyA9IHRoaXMueE51bVN0ZXBzLm1hcChjb3VudERlY2ltYWxzKTtcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4LmFwcGx5KG51bGwsIHN0ZXBEZWNpbWFscyk7XG4gICAgfTtcbiAgICBTcGVjdHJ1bS5wcm90b3R5cGUuaGFzTm9TaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy54VmFsWzBdID09PSB0aGlzLnhWYWxbdGhpcy54VmFsLmxlbmd0aCAtIDFdO1xuICAgIH07XG4gICAgLy8gT3V0c2lkZSB0ZXN0aW5nXG4gICAgU3BlY3RydW0ucHJvdG90eXBlLmNvbnZlcnQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U3RlcCh0aGlzLnRvU3RlcHBpbmcodmFsdWUpKTtcbiAgICB9O1xuICAgIFNwZWN0cnVtLnByb3RvdHlwZS5oYW5kbGVFbnRyeVBvaW50ID0gZnVuY3Rpb24gKGluZGV4LCB2YWx1ZSkge1xuICAgICAgICB2YXIgcGVyY2VudGFnZTtcbiAgICAgICAgLy8gQ292ZXJ0IG1pbi9tYXggc3ludGF4IHRvIDAgYW5kIDEwMC5cbiAgICAgICAgaWYgKGluZGV4ID09PSBcIm1pblwiKSB7XG4gICAgICAgICAgICBwZXJjZW50YWdlID0gMDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpbmRleCA9PT0gXCJtYXhcIikge1xuICAgICAgICAgICAgcGVyY2VudGFnZSA9IDEwMDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHBlcmNlbnRhZ2UgPSBwYXJzZUZsb2F0KGluZGV4KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBDaGVjayBmb3IgY29ycmVjdCBpbnB1dC5cbiAgICAgICAgaWYgKCFpc051bWVyaWMocGVyY2VudGFnZSkgfHwgIWlzTnVtZXJpYyh2YWx1ZVswXSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXI6ICdyYW5nZScgdmFsdWUgaXNuJ3QgbnVtZXJpYy5cIik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gU3RvcmUgdmFsdWVzLlxuICAgICAgICB0aGlzLnhQY3QucHVzaChwZXJjZW50YWdlKTtcbiAgICAgICAgdGhpcy54VmFsLnB1c2godmFsdWVbMF0pO1xuICAgICAgICB2YXIgdmFsdWUxID0gTnVtYmVyKHZhbHVlWzFdKTtcbiAgICAgICAgLy8gTmFOIHdpbGwgZXZhbHVhdGUgdG8gZmFsc2UgdG9vLCBidXQgdG8ga2VlcFxuICAgICAgICAvLyBsb2dnaW5nIGNsZWFyLCBzZXQgc3RlcCBleHBsaWNpdGx5LiBNYWtlIHN1cmVcbiAgICAgICAgLy8gbm90IHRvIG92ZXJyaWRlIHRoZSAnc3RlcCcgc2V0dGluZyB3aXRoIGZhbHNlLlxuICAgICAgICBpZiAoIXBlcmNlbnRhZ2UpIHtcbiAgICAgICAgICAgIGlmICghaXNOYU4odmFsdWUxKSkge1xuICAgICAgICAgICAgICAgIHRoaXMueFN0ZXBzWzBdID0gdmFsdWUxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy54U3RlcHMucHVzaChpc05hTih2YWx1ZTEpID8gZmFsc2UgOiB2YWx1ZTEpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMueEhpZ2hlc3RDb21wbGV0ZVN0ZXAucHVzaCgwKTtcbiAgICB9O1xuICAgIFNwZWN0cnVtLnByb3RvdHlwZS5oYW5kbGVTdGVwUG9pbnQgPSBmdW5jdGlvbiAoaSwgbikge1xuICAgICAgICAvLyBJZ25vcmUgJ2ZhbHNlJyBzdGVwcGluZy5cbiAgICAgICAgaWYgKCFuKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gU3RlcCBvdmVyIHplcm8tbGVuZ3RoIHJhbmdlcyAoIzk0OCk7XG4gICAgICAgIGlmICh0aGlzLnhWYWxbaV0gPT09IHRoaXMueFZhbFtpICsgMV0pIHtcbiAgICAgICAgICAgIHRoaXMueFN0ZXBzW2ldID0gdGhpcy54SGlnaGVzdENvbXBsZXRlU3RlcFtpXSA9IHRoaXMueFZhbFtpXTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBGYWN0b3IgdG8gcmFuZ2UgcmF0aW9cbiAgICAgICAgdGhpcy54U3RlcHNbaV0gPVxuICAgICAgICAgICAgZnJvbVBlcmNlbnRhZ2UoW3RoaXMueFZhbFtpXSwgdGhpcy54VmFsW2kgKyAxXV0sIG4sIDApIC8gc3ViUmFuZ2VSYXRpbyh0aGlzLnhQY3RbaV0sIHRoaXMueFBjdFtpICsgMV0pO1xuICAgICAgICB2YXIgdG90YWxTdGVwcyA9ICh0aGlzLnhWYWxbaSArIDFdIC0gdGhpcy54VmFsW2ldKSAvIHRoaXMueE51bVN0ZXBzW2ldO1xuICAgICAgICB2YXIgaGlnaGVzdFN0ZXAgPSBNYXRoLmNlaWwoTnVtYmVyKHRvdGFsU3RlcHMudG9GaXhlZCgzKSkgLSAxKTtcbiAgICAgICAgdmFyIHN0ZXAgPSB0aGlzLnhWYWxbaV0gKyB0aGlzLnhOdW1TdGVwc1tpXSAqIGhpZ2hlc3RTdGVwO1xuICAgICAgICB0aGlzLnhIaWdoZXN0Q29tcGxldGVTdGVwW2ldID0gc3RlcDtcbiAgICB9O1xuICAgIHJldHVybiBTcGVjdHJ1bTtcbn0oKSk7XG4vL2VuZHJlZ2lvblxuLy9yZWdpb24gT3B0aW9uc1xuLypcdEV2ZXJ5IGlucHV0IG9wdGlvbiBpcyB0ZXN0ZWQgYW5kIHBhcnNlZC4gVGhpcyB3aWxsIHByZXZlbnRcbiAgICBlbmRsZXNzIHZhbGlkYXRpb24gaW4gaW50ZXJuYWwgbWV0aG9kcy4gVGhlc2UgdGVzdHMgYXJlXG4gICAgc3RydWN0dXJlZCB3aXRoIGFuIGl0ZW0gZm9yIGV2ZXJ5IG9wdGlvbiBhdmFpbGFibGUuIEFuXG4gICAgb3B0aW9uIGNhbiBiZSBtYXJrZWQgYXMgcmVxdWlyZWQgYnkgc2V0dGluZyB0aGUgJ3InIGZsYWcuXG4gICAgVGhlIHRlc3RpbmcgZnVuY3Rpb24gaXMgcHJvdmlkZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM6XG4gICAgICAgIC0gVGhlIHByb3ZpZGVkIHZhbHVlIGZvciB0aGUgb3B0aW9uO1xuICAgICAgICAtIEEgcmVmZXJlbmNlIHRvIHRoZSBvcHRpb25zIG9iamVjdDtcbiAgICAgICAgLSBUaGUgbmFtZSBmb3IgdGhlIG9wdGlvbjtcblxuICAgIFRoZSB0ZXN0aW5nIGZ1bmN0aW9uIHJldHVybnMgZmFsc2Ugd2hlbiBhbiBlcnJvciBpcyBkZXRlY3RlZCxcbiAgICBvciB0cnVlIHdoZW4gZXZlcnl0aGluZyBpcyBPSy4gSXQgY2FuIGFsc28gbW9kaWZ5IHRoZSBvcHRpb25cbiAgICBvYmplY3QsIHRvIG1ha2Ugc3VyZSBhbGwgdmFsdWVzIGNhbiBiZSBjb3JyZWN0bHkgbG9vcGVkIGVsc2V3aGVyZS4gKi9cbi8vcmVnaW9uIERlZmF1bHRzXG52YXIgZGVmYXVsdEZvcm1hdHRlciA9IHtcbiAgICB0bzogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gXCJcIiA6IHZhbHVlLnRvRml4ZWQoMik7XG4gICAgfSxcbiAgICBmcm9tOiBOdW1iZXIsXG59O1xudmFyIGNzc0NsYXNzZXMgPSB7XG4gICAgdGFyZ2V0OiBcInRhcmdldFwiLFxuICAgIGJhc2U6IFwiYmFzZVwiLFxuICAgIG9yaWdpbjogXCJvcmlnaW5cIixcbiAgICBoYW5kbGU6IFwiaGFuZGxlXCIsXG4gICAgaGFuZGxlTG93ZXI6IFwiaGFuZGxlLWxvd2VyXCIsXG4gICAgaGFuZGxlVXBwZXI6IFwiaGFuZGxlLXVwcGVyXCIsXG4gICAgdG91Y2hBcmVhOiBcInRvdWNoLWFyZWFcIixcbiAgICBob3Jpem9udGFsOiBcImhvcml6b250YWxcIixcbiAgICB2ZXJ0aWNhbDogXCJ2ZXJ0aWNhbFwiLFxuICAgIGJhY2tncm91bmQ6IFwiYmFja2dyb3VuZFwiLFxuICAgIGNvbm5lY3Q6IFwiY29ubmVjdFwiLFxuICAgIGNvbm5lY3RzOiBcImNvbm5lY3RzXCIsXG4gICAgbHRyOiBcImx0clwiLFxuICAgIHJ0bDogXCJydGxcIixcbiAgICB0ZXh0RGlyZWN0aW9uTHRyOiBcInR4dC1kaXItbHRyXCIsXG4gICAgdGV4dERpcmVjdGlvblJ0bDogXCJ0eHQtZGlyLXJ0bFwiLFxuICAgIGRyYWdnYWJsZTogXCJkcmFnZ2FibGVcIixcbiAgICBkcmFnOiBcInN0YXRlLWRyYWdcIixcbiAgICB0YXA6IFwic3RhdGUtdGFwXCIsXG4gICAgYWN0aXZlOiBcImFjdGl2ZVwiLFxuICAgIHRvb2x0aXA6IFwidG9vbHRpcFwiLFxuICAgIHBpcHM6IFwicGlwc1wiLFxuICAgIHBpcHNIb3Jpem9udGFsOiBcInBpcHMtaG9yaXpvbnRhbFwiLFxuICAgIHBpcHNWZXJ0aWNhbDogXCJwaXBzLXZlcnRpY2FsXCIsXG4gICAgbWFya2VyOiBcIm1hcmtlclwiLFxuICAgIG1hcmtlckhvcml6b250YWw6IFwibWFya2VyLWhvcml6b250YWxcIixcbiAgICBtYXJrZXJWZXJ0aWNhbDogXCJtYXJrZXItdmVydGljYWxcIixcbiAgICBtYXJrZXJOb3JtYWw6IFwibWFya2VyLW5vcm1hbFwiLFxuICAgIG1hcmtlckxhcmdlOiBcIm1hcmtlci1sYXJnZVwiLFxuICAgIG1hcmtlclN1YjogXCJtYXJrZXItc3ViXCIsXG4gICAgdmFsdWU6IFwidmFsdWVcIixcbiAgICB2YWx1ZUhvcml6b250YWw6IFwidmFsdWUtaG9yaXpvbnRhbFwiLFxuICAgIHZhbHVlVmVydGljYWw6IFwidmFsdWUtdmVydGljYWxcIixcbiAgICB2YWx1ZU5vcm1hbDogXCJ2YWx1ZS1ub3JtYWxcIixcbiAgICB2YWx1ZUxhcmdlOiBcInZhbHVlLWxhcmdlXCIsXG4gICAgdmFsdWVTdWI6IFwidmFsdWUtc3ViXCIsXG59O1xuLy8gTmFtZXNwYWNlcyBvZiBpbnRlcm5hbCBldmVudCBsaXN0ZW5lcnNcbnZhciBJTlRFUk5BTF9FVkVOVF9OUyA9IHtcbiAgICB0b29sdGlwczogXCIuX190b29sdGlwc1wiLFxuICAgIGFyaWE6IFwiLl9fYXJpYVwiLFxufTtcbi8vZW5kcmVnaW9uXG5mdW5jdGlvbiB0ZXN0U3RlcChwYXJzZWQsIGVudHJ5KSB7XG4gICAgaWYgKCFpc051bWVyaWMoZW50cnkpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXI6ICdzdGVwJyBpcyBub3QgbnVtZXJpYy5cIik7XG4gICAgfVxuICAgIC8vIFRoZSBzdGVwIG9wdGlvbiBjYW4gc3RpbGwgYmUgdXNlZCB0byBzZXQgc3RlcHBpbmdcbiAgICAvLyBmb3IgbGluZWFyIHNsaWRlcnMuIE92ZXJ3cml0dGVuIGlmIHNldCBpbiAncmFuZ2UnLlxuICAgIHBhcnNlZC5zaW5nbGVTdGVwID0gZW50cnk7XG59XG5mdW5jdGlvbiB0ZXN0S2V5Ym9hcmRQYWdlTXVsdGlwbGllcihwYXJzZWQsIGVudHJ5KSB7XG4gICAgaWYgKCFpc051bWVyaWMoZW50cnkpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXI6ICdrZXlib2FyZFBhZ2VNdWx0aXBsaWVyJyBpcyBub3QgbnVtZXJpYy5cIik7XG4gICAgfVxuICAgIHBhcnNlZC5rZXlib2FyZFBhZ2VNdWx0aXBsaWVyID0gZW50cnk7XG59XG5mdW5jdGlvbiB0ZXN0S2V5Ym9hcmRNdWx0aXBsaWVyKHBhcnNlZCwgZW50cnkpIHtcbiAgICBpZiAoIWlzTnVtZXJpYyhlbnRyeSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogJ2tleWJvYXJkTXVsdGlwbGllcicgaXMgbm90IG51bWVyaWMuXCIpO1xuICAgIH1cbiAgICBwYXJzZWQua2V5Ym9hcmRNdWx0aXBsaWVyID0gZW50cnk7XG59XG5mdW5jdGlvbiB0ZXN0S2V5Ym9hcmREZWZhdWx0U3RlcChwYXJzZWQsIGVudHJ5KSB7XG4gICAgaWYgKCFpc051bWVyaWMoZW50cnkpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXI6ICdrZXlib2FyZERlZmF1bHRTdGVwJyBpcyBub3QgbnVtZXJpYy5cIik7XG4gICAgfVxuICAgIHBhcnNlZC5rZXlib2FyZERlZmF1bHRTdGVwID0gZW50cnk7XG59XG5mdW5jdGlvbiB0ZXN0UmFuZ2UocGFyc2VkLCBlbnRyeSkge1xuICAgIC8vIEZpbHRlciBpbmNvcnJlY3QgaW5wdXQuXG4gICAgaWYgKHR5cGVvZiBlbnRyeSAhPT0gXCJvYmplY3RcIiB8fCBBcnJheS5pc0FycmF5KGVudHJ5KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyOiAncmFuZ2UnIGlzIG5vdCBhbiBvYmplY3QuXCIpO1xuICAgIH1cbiAgICAvLyBDYXRjaCBtaXNzaW5nIHN0YXJ0IG9yIGVuZC5cbiAgICBpZiAoZW50cnkubWluID09PSB1bmRlZmluZWQgfHwgZW50cnkubWF4ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogTWlzc2luZyAnbWluJyBvciAnbWF4JyBpbiAncmFuZ2UnLlwiKTtcbiAgICB9XG4gICAgcGFyc2VkLnNwZWN0cnVtID0gbmV3IFNwZWN0cnVtKGVudHJ5LCBwYXJzZWQuc25hcCB8fCBmYWxzZSwgcGFyc2VkLnNpbmdsZVN0ZXApO1xufVxuZnVuY3Rpb24gdGVzdFN0YXJ0KHBhcnNlZCwgZW50cnkpIHtcbiAgICBlbnRyeSA9IGFzQXJyYXkoZW50cnkpO1xuICAgIC8vIFZhbGlkYXRlIGlucHV0LiBWYWx1ZXMgYXJlbid0IHRlc3RlZCwgYXMgdGhlIHB1YmxpYyAudmFsIG1ldGhvZFxuICAgIC8vIHdpbGwgYWx3YXlzIHByb3ZpZGUgYSB2YWxpZCBsb2NhdGlvbi5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZW50cnkpIHx8ICFlbnRyeS5sZW5ndGgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogJ3N0YXJ0JyBvcHRpb24gaXMgaW5jb3JyZWN0LlwiKTtcbiAgICB9XG4gICAgLy8gU3RvcmUgdGhlIG51bWJlciBvZiBoYW5kbGVzLlxuICAgIHBhcnNlZC5oYW5kbGVzID0gZW50cnkubGVuZ3RoO1xuICAgIC8vIFdoZW4gdGhlIHNsaWRlciBpcyBpbml0aWFsaXplZCwgdGhlIC52YWwgbWV0aG9kIHdpbGxcbiAgICAvLyBiZSBjYWxsZWQgd2l0aCB0aGUgc3RhcnQgb3B0aW9ucy5cbiAgICBwYXJzZWQuc3RhcnQgPSBlbnRyeTtcbn1cbmZ1bmN0aW9uIHRlc3RTbmFwKHBhcnNlZCwgZW50cnkpIHtcbiAgICBpZiAodHlwZW9mIGVudHJ5ICE9PSBcImJvb2xlYW5cIikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyOiAnc25hcCcgb3B0aW9uIG11c3QgYmUgYSBib29sZWFuLlwiKTtcbiAgICB9XG4gICAgLy8gRW5mb3JjZSAxMDAlIHN0ZXBwaW5nIHdpdGhpbiBzdWJyYW5nZXMuXG4gICAgcGFyc2VkLnNuYXAgPSBlbnRyeTtcbn1cbmZ1bmN0aW9uIHRlc3RBbmltYXRlKHBhcnNlZCwgZW50cnkpIHtcbiAgICBpZiAodHlwZW9mIGVudHJ5ICE9PSBcImJvb2xlYW5cIikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyOiAnYW5pbWF0ZScgb3B0aW9uIG11c3QgYmUgYSBib29sZWFuLlwiKTtcbiAgICB9XG4gICAgLy8gRW5mb3JjZSAxMDAlIHN0ZXBwaW5nIHdpdGhpbiBzdWJyYW5nZXMuXG4gICAgcGFyc2VkLmFuaW1hdGUgPSBlbnRyeTtcbn1cbmZ1bmN0aW9uIHRlc3RBbmltYXRpb25EdXJhdGlvbihwYXJzZWQsIGVudHJ5KSB7XG4gICAgaWYgKHR5cGVvZiBlbnRyeSAhPT0gXCJudW1iZXJcIikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyOiAnYW5pbWF0aW9uRHVyYXRpb24nIG9wdGlvbiBtdXN0IGJlIGEgbnVtYmVyLlwiKTtcbiAgICB9XG4gICAgcGFyc2VkLmFuaW1hdGlvbkR1cmF0aW9uID0gZW50cnk7XG59XG5mdW5jdGlvbiB0ZXN0Q29ubmVjdChwYXJzZWQsIGVudHJ5KSB7XG4gICAgdmFyIGNvbm5lY3QgPSBbZmFsc2VdO1xuICAgIHZhciBpO1xuICAgIC8vIE1hcCBsZWdhY3kgb3B0aW9uc1xuICAgIGlmIChlbnRyeSA9PT0gXCJsb3dlclwiKSB7XG4gICAgICAgIGVudHJ5ID0gW3RydWUsIGZhbHNlXTtcbiAgICB9XG4gICAgZWxzZSBpZiAoZW50cnkgPT09IFwidXBwZXJcIikge1xuICAgICAgICBlbnRyeSA9IFtmYWxzZSwgdHJ1ZV07XG4gICAgfVxuICAgIC8vIEhhbmRsZSBib29sZWFuIG9wdGlvbnNcbiAgICBpZiAoZW50cnkgPT09IHRydWUgfHwgZW50cnkgPT09IGZhbHNlKSB7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBwYXJzZWQuaGFuZGxlczsgaSsrKSB7XG4gICAgICAgICAgICBjb25uZWN0LnB1c2goZW50cnkpO1xuICAgICAgICB9XG4gICAgICAgIGNvbm5lY3QucHVzaChmYWxzZSk7XG4gICAgfVxuICAgIC8vIFJlamVjdCBpbnZhbGlkIGlucHV0XG4gICAgZWxzZSBpZiAoIUFycmF5LmlzQXJyYXkoZW50cnkpIHx8ICFlbnRyeS5sZW5ndGggfHwgZW50cnkubGVuZ3RoICE9PSBwYXJzZWQuaGFuZGxlcyArIDEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogJ2Nvbm5lY3QnIG9wdGlvbiBkb2Vzbid0IG1hdGNoIGhhbmRsZSBjb3VudC5cIik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb25uZWN0ID0gZW50cnk7XG4gICAgfVxuICAgIHBhcnNlZC5jb25uZWN0ID0gY29ubmVjdDtcbn1cbmZ1bmN0aW9uIHRlc3RPcmllbnRhdGlvbihwYXJzZWQsIGVudHJ5KSB7XG4gICAgLy8gU2V0IG9yaWVudGF0aW9uIHRvIGFuIGEgbnVtZXJpY2FsIHZhbHVlIGZvciBlYXN5XG4gICAgLy8gYXJyYXkgc2VsZWN0aW9uLlxuICAgIHN3aXRjaCAoZW50cnkpIHtcbiAgICAgICAgY2FzZSBcImhvcml6b250YWxcIjpcbiAgICAgICAgICAgIHBhcnNlZC5vcnQgPSAwO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJ2ZXJ0aWNhbFwiOlxuICAgICAgICAgICAgcGFyc2VkLm9ydCA9IDE7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXI6ICdvcmllbnRhdGlvbicgb3B0aW9uIGlzIGludmFsaWQuXCIpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHRlc3RNYXJnaW4ocGFyc2VkLCBlbnRyeSkge1xuICAgIGlmICghaXNOdW1lcmljKGVudHJ5KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyOiAnbWFyZ2luJyBvcHRpb24gbXVzdCBiZSBudW1lcmljLlwiKTtcbiAgICB9XG4gICAgLy8gSXNzdWUgIzU4MlxuICAgIGlmIChlbnRyeSA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHBhcnNlZC5tYXJnaW4gPSBwYXJzZWQuc3BlY3RydW0uZ2V0RGlzdGFuY2UoZW50cnkpO1xufVxuZnVuY3Rpb24gdGVzdExpbWl0KHBhcnNlZCwgZW50cnkpIHtcbiAgICBpZiAoIWlzTnVtZXJpYyhlbnRyeSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogJ2xpbWl0JyBvcHRpb24gbXVzdCBiZSBudW1lcmljLlwiKTtcbiAgICB9XG4gICAgcGFyc2VkLmxpbWl0ID0gcGFyc2VkLnNwZWN0cnVtLmdldERpc3RhbmNlKGVudHJ5KTtcbiAgICBpZiAoIXBhcnNlZC5saW1pdCB8fCBwYXJzZWQuaGFuZGxlcyA8IDIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogJ2xpbWl0JyBvcHRpb24gaXMgb25seSBzdXBwb3J0ZWQgb24gbGluZWFyIHNsaWRlcnMgd2l0aCAyIG9yIG1vcmUgaGFuZGxlcy5cIik7XG4gICAgfVxufVxuZnVuY3Rpb24gdGVzdFBhZGRpbmcocGFyc2VkLCBlbnRyeSkge1xuICAgIHZhciBpbmRleDtcbiAgICBpZiAoIWlzTnVtZXJpYyhlbnRyeSkgJiYgIUFycmF5LmlzQXJyYXkoZW50cnkpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXI6ICdwYWRkaW5nJyBvcHRpb24gbXVzdCBiZSBudW1lcmljIG9yIGFycmF5IG9mIGV4YWN0bHkgMiBudW1iZXJzLlwiKTtcbiAgICB9XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZW50cnkpICYmICEoZW50cnkubGVuZ3RoID09PSAyIHx8IGlzTnVtZXJpYyhlbnRyeVswXSkgfHwgaXNOdW1lcmljKGVudHJ5WzFdKSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogJ3BhZGRpbmcnIG9wdGlvbiBtdXN0IGJlIG51bWVyaWMgb3IgYXJyYXkgb2YgZXhhY3RseSAyIG51bWJlcnMuXCIpO1xuICAgIH1cbiAgICBpZiAoZW50cnkgPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZW50cnkpKSB7XG4gICAgICAgIGVudHJ5ID0gW2VudHJ5LCBlbnRyeV07XG4gICAgfVxuICAgIC8vICdnZXREaXN0YW5jZScgcmV0dXJucyBmYWxzZSBmb3IgaW52YWxpZCB2YWx1ZXMuXG4gICAgcGFyc2VkLnBhZGRpbmcgPSBbcGFyc2VkLnNwZWN0cnVtLmdldERpc3RhbmNlKGVudHJ5WzBdKSwgcGFyc2VkLnNwZWN0cnVtLmdldERpc3RhbmNlKGVudHJ5WzFdKV07XG4gICAgZm9yIChpbmRleCA9IDA7IGluZGV4IDwgcGFyc2VkLnNwZWN0cnVtLnhOdW1TdGVwcy5sZW5ndGggLSAxOyBpbmRleCsrKSB7XG4gICAgICAgIC8vIGxhc3QgXCJyYW5nZVwiIGNhbid0IGNvbnRhaW4gc3RlcCBzaXplIGFzIGl0IGlzIHB1cmVseSBhbiBlbmRwb2ludC5cbiAgICAgICAgaWYgKHBhcnNlZC5wYWRkaW5nWzBdW2luZGV4XSA8IDAgfHwgcGFyc2VkLnBhZGRpbmdbMV1baW5kZXhdIDwgMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogJ3BhZGRpbmcnIG9wdGlvbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyKHMpLlwiKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB2YXIgdG90YWxQYWRkaW5nID0gZW50cnlbMF0gKyBlbnRyeVsxXTtcbiAgICB2YXIgZmlyc3RWYWx1ZSA9IHBhcnNlZC5zcGVjdHJ1bS54VmFsWzBdO1xuICAgIHZhciBsYXN0VmFsdWUgPSBwYXJzZWQuc3BlY3RydW0ueFZhbFtwYXJzZWQuc3BlY3RydW0ueFZhbC5sZW5ndGggLSAxXTtcbiAgICBpZiAodG90YWxQYWRkaW5nIC8gKGxhc3RWYWx1ZSAtIGZpcnN0VmFsdWUpID4gMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyOiAncGFkZGluZycgb3B0aW9uIG11c3Qgbm90IGV4Y2VlZCAxMDAlIG9mIHRoZSByYW5nZS5cIik7XG4gICAgfVxufVxuZnVuY3Rpb24gdGVzdERpcmVjdGlvbihwYXJzZWQsIGVudHJ5KSB7XG4gICAgLy8gU2V0IGRpcmVjdGlvbiBhcyBhIG51bWVyaWNhbCB2YWx1ZSBmb3IgZWFzeSBwYXJzaW5nLlxuICAgIC8vIEludmVydCBjb25uZWN0aW9uIGZvciBSVEwgc2xpZGVycywgc28gdGhhdCB0aGUgcHJvcGVyXG4gICAgLy8gaGFuZGxlcyBnZXQgdGhlIGNvbm5lY3QvYmFja2dyb3VuZCBjbGFzc2VzLlxuICAgIHN3aXRjaCAoZW50cnkpIHtcbiAgICAgICAgY2FzZSBcImx0clwiOlxuICAgICAgICAgICAgcGFyc2VkLmRpciA9IDA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInJ0bFwiOlxuICAgICAgICAgICAgcGFyc2VkLmRpciA9IDE7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXI6ICdkaXJlY3Rpb24nIG9wdGlvbiB3YXMgbm90IHJlY29nbml6ZWQuXCIpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHRlc3RCZWhhdmlvdXIocGFyc2VkLCBlbnRyeSkge1xuICAgIC8vIE1ha2Ugc3VyZSB0aGUgaW5wdXQgaXMgYSBzdHJpbmcuXG4gICAgaWYgKHR5cGVvZiBlbnRyeSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyOiAnYmVoYXZpb3VyJyBtdXN0IGJlIGEgc3RyaW5nIGNvbnRhaW5pbmcgb3B0aW9ucy5cIik7XG4gICAgfVxuICAgIC8vIENoZWNrIGlmIHRoZSBzdHJpbmcgY29udGFpbnMgYW55IGtleXdvcmRzLlxuICAgIC8vIE5vbmUgYXJlIHJlcXVpcmVkLlxuICAgIHZhciB0YXAgPSBlbnRyeS5pbmRleE9mKFwidGFwXCIpID49IDA7XG4gICAgdmFyIGRyYWcgPSBlbnRyeS5pbmRleE9mKFwiZHJhZ1wiKSA+PSAwO1xuICAgIHZhciBmaXhlZCA9IGVudHJ5LmluZGV4T2YoXCJmaXhlZFwiKSA+PSAwO1xuICAgIHZhciBzbmFwID0gZW50cnkuaW5kZXhPZihcInNuYXBcIikgPj0gMDtcbiAgICB2YXIgaG92ZXIgPSBlbnRyeS5pbmRleE9mKFwiaG92ZXJcIikgPj0gMDtcbiAgICB2YXIgdW5jb25zdHJhaW5lZCA9IGVudHJ5LmluZGV4T2YoXCJ1bmNvbnN0cmFpbmVkXCIpID49IDA7XG4gICAgdmFyIGRyYWdBbGwgPSBlbnRyeS5pbmRleE9mKFwiZHJhZy1hbGxcIikgPj0gMDtcbiAgICB2YXIgc21vb3RoU3RlcHMgPSBlbnRyeS5pbmRleE9mKFwic21vb3RoLXN0ZXBzXCIpID49IDA7XG4gICAgaWYgKGZpeGVkKSB7XG4gICAgICAgIGlmIChwYXJzZWQuaGFuZGxlcyAhPT0gMikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogJ2ZpeGVkJyBiZWhhdmlvdXIgbXVzdCBiZSB1c2VkIHdpdGggMiBoYW5kbGVzXCIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFVzZSBtYXJnaW4gdG8gZW5mb3JjZSBmaXhlZCBzdGF0ZVxuICAgICAgICB0ZXN0TWFyZ2luKHBhcnNlZCwgcGFyc2VkLnN0YXJ0WzFdIC0gcGFyc2VkLnN0YXJ0WzBdKTtcbiAgICB9XG4gICAgaWYgKHVuY29uc3RyYWluZWQgJiYgKHBhcnNlZC5tYXJnaW4gfHwgcGFyc2VkLmxpbWl0KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyOiAndW5jb25zdHJhaW5lZCcgYmVoYXZpb3VyIGNhbm5vdCBiZSB1c2VkIHdpdGggbWFyZ2luIG9yIGxpbWl0XCIpO1xuICAgIH1cbiAgICBwYXJzZWQuZXZlbnRzID0ge1xuICAgICAgICB0YXA6IHRhcCB8fCBzbmFwLFxuICAgICAgICBkcmFnOiBkcmFnLFxuICAgICAgICBkcmFnQWxsOiBkcmFnQWxsLFxuICAgICAgICBzbW9vdGhTdGVwczogc21vb3RoU3RlcHMsXG4gICAgICAgIGZpeGVkOiBmaXhlZCxcbiAgICAgICAgc25hcDogc25hcCxcbiAgICAgICAgaG92ZXI6IGhvdmVyLFxuICAgICAgICB1bmNvbnN0cmFpbmVkOiB1bmNvbnN0cmFpbmVkLFxuICAgIH07XG59XG5mdW5jdGlvbiB0ZXN0VG9vbHRpcHMocGFyc2VkLCBlbnRyeSkge1xuICAgIGlmIChlbnRyeSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZW50cnkgPT09IHRydWUgfHwgaXNWYWxpZFBhcnRpYWxGb3JtYXR0ZXIoZW50cnkpKSB7XG4gICAgICAgIHBhcnNlZC50b29sdGlwcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcnNlZC5oYW5kbGVzOyBpKyspIHtcbiAgICAgICAgICAgIHBhcnNlZC50b29sdGlwcy5wdXNoKGVudHJ5KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZW50cnkgPSBhc0FycmF5KGVudHJ5KTtcbiAgICAgICAgaWYgKGVudHJ5Lmxlbmd0aCAhPT0gcGFyc2VkLmhhbmRsZXMpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXI6IG11c3QgcGFzcyBhIGZvcm1hdHRlciBmb3IgYWxsIGhhbmRsZXMuXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVudHJ5LmZvckVhY2goZnVuY3Rpb24gKGZvcm1hdHRlcikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBmb3JtYXR0ZXIgIT09IFwiYm9vbGVhblwiICYmICFpc1ZhbGlkUGFydGlhbEZvcm1hdHRlcihmb3JtYXR0ZXIpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogJ3Rvb2x0aXBzJyBtdXN0IGJlIHBhc3NlZCBhIGZvcm1hdHRlciBvciAnZmFsc2UnLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHBhcnNlZC50b29sdGlwcyA9IGVudHJ5O1xuICAgIH1cbn1cbmZ1bmN0aW9uIHRlc3RIYW5kbGVBdHRyaWJ1dGVzKHBhcnNlZCwgZW50cnkpIHtcbiAgICBpZiAoZW50cnkubGVuZ3RoICE9PSBwYXJzZWQuaGFuZGxlcykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyOiBtdXN0IHBhc3MgYSBhdHRyaWJ1dGVzIGZvciBhbGwgaGFuZGxlcy5cIik7XG4gICAgfVxuICAgIHBhcnNlZC5oYW5kbGVBdHRyaWJ1dGVzID0gZW50cnk7XG59XG5mdW5jdGlvbiB0ZXN0QXJpYUZvcm1hdChwYXJzZWQsIGVudHJ5KSB7XG4gICAgaWYgKCFpc1ZhbGlkUGFydGlhbEZvcm1hdHRlcihlbnRyeSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogJ2FyaWFGb3JtYXQnIHJlcXVpcmVzICd0bycgbWV0aG9kLlwiKTtcbiAgICB9XG4gICAgcGFyc2VkLmFyaWFGb3JtYXQgPSBlbnRyeTtcbn1cbmZ1bmN0aW9uIHRlc3RGb3JtYXQocGFyc2VkLCBlbnRyeSkge1xuICAgIGlmICghaXNWYWxpZEZvcm1hdHRlcihlbnRyeSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogJ2Zvcm1hdCcgcmVxdWlyZXMgJ3RvJyBhbmQgJ2Zyb20nIG1ldGhvZHMuXCIpO1xuICAgIH1cbiAgICBwYXJzZWQuZm9ybWF0ID0gZW50cnk7XG59XG5mdW5jdGlvbiB0ZXN0S2V5Ym9hcmRTdXBwb3J0KHBhcnNlZCwgZW50cnkpIHtcbiAgICBpZiAodHlwZW9mIGVudHJ5ICE9PSBcImJvb2xlYW5cIikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyOiAna2V5Ym9hcmRTdXBwb3J0JyBvcHRpb24gbXVzdCBiZSBhIGJvb2xlYW4uXCIpO1xuICAgIH1cbiAgICBwYXJzZWQua2V5Ym9hcmRTdXBwb3J0ID0gZW50cnk7XG59XG5mdW5jdGlvbiB0ZXN0RG9jdW1lbnRFbGVtZW50KHBhcnNlZCwgZW50cnkpIHtcbiAgICAvLyBUaGlzIGlzIGFuIGFkdmFuY2VkIG9wdGlvbi4gUGFzc2VkIHZhbHVlcyBhcmUgdXNlZCB3aXRob3V0IHZhbGlkYXRpb24uXG4gICAgcGFyc2VkLmRvY3VtZW50RWxlbWVudCA9IGVudHJ5O1xufVxuZnVuY3Rpb24gdGVzdENzc1ByZWZpeChwYXJzZWQsIGVudHJ5KSB7XG4gICAgaWYgKHR5cGVvZiBlbnRyeSAhPT0gXCJzdHJpbmdcIiAmJiBlbnRyeSAhPT0gZmFsc2UpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogJ2Nzc1ByZWZpeCcgbXVzdCBiZSBhIHN0cmluZyBvciBgZmFsc2VgLlwiKTtcbiAgICB9XG4gICAgcGFyc2VkLmNzc1ByZWZpeCA9IGVudHJ5O1xufVxuZnVuY3Rpb24gdGVzdENzc0NsYXNzZXMocGFyc2VkLCBlbnRyeSkge1xuICAgIGlmICh0eXBlb2YgZW50cnkgIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogJ2Nzc0NsYXNzZXMnIG11c3QgYmUgYW4gb2JqZWN0LlwiKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBwYXJzZWQuY3NzUHJlZml4ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHBhcnNlZC5jc3NDbGFzc2VzID0ge307XG4gICAgICAgIE9iamVjdC5rZXlzKGVudHJ5KS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIHBhcnNlZC5jc3NDbGFzc2VzW2tleV0gPSBwYXJzZWQuY3NzUHJlZml4ICsgZW50cnlba2V5XTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBwYXJzZWQuY3NzQ2xhc3NlcyA9IGVudHJ5O1xuICAgIH1cbn1cbi8vIFRlc3QgYWxsIGRldmVsb3BlciBzZXR0aW5ncyBhbmQgcGFyc2UgdG8gYXNzdW1wdGlvbi1zYWZlIHZhbHVlcy5cbmZ1bmN0aW9uIHRlc3RPcHRpb25zKG9wdGlvbnMpIHtcbiAgICAvLyBUbyBwcm92ZSBhIGZpeCBmb3IgIzUzNywgZnJlZXplIG9wdGlvbnMgaGVyZS5cbiAgICAvLyBJZiB0aGUgb2JqZWN0IGlzIG1vZGlmaWVkLCBhbiBlcnJvciB3aWxsIGJlIHRocm93bi5cbiAgICAvLyBPYmplY3QuZnJlZXplKG9wdGlvbnMpO1xuICAgIHZhciBwYXJzZWQgPSB7XG4gICAgICAgIG1hcmdpbjogbnVsbCxcbiAgICAgICAgbGltaXQ6IG51bGwsXG4gICAgICAgIHBhZGRpbmc6IG51bGwsXG4gICAgICAgIGFuaW1hdGU6IHRydWUsXG4gICAgICAgIGFuaW1hdGlvbkR1cmF0aW9uOiAzMDAsXG4gICAgICAgIGFyaWFGb3JtYXQ6IGRlZmF1bHRGb3JtYXR0ZXIsXG4gICAgICAgIGZvcm1hdDogZGVmYXVsdEZvcm1hdHRlcixcbiAgICB9O1xuICAgIC8vIFRlc3RzIGFyZSBleGVjdXRlZCBpbiB0aGUgb3JkZXIgdGhleSBhcmUgcHJlc2VudGVkIGhlcmUuXG4gICAgdmFyIHRlc3RzID0ge1xuICAgICAgICBzdGVwOiB7IHI6IGZhbHNlLCB0OiB0ZXN0U3RlcCB9LFxuICAgICAgICBrZXlib2FyZFBhZ2VNdWx0aXBsaWVyOiB7IHI6IGZhbHNlLCB0OiB0ZXN0S2V5Ym9hcmRQYWdlTXVsdGlwbGllciB9LFxuICAgICAgICBrZXlib2FyZE11bHRpcGxpZXI6IHsgcjogZmFsc2UsIHQ6IHRlc3RLZXlib2FyZE11bHRpcGxpZXIgfSxcbiAgICAgICAga2V5Ym9hcmREZWZhdWx0U3RlcDogeyByOiBmYWxzZSwgdDogdGVzdEtleWJvYXJkRGVmYXVsdFN0ZXAgfSxcbiAgICAgICAgc3RhcnQ6IHsgcjogdHJ1ZSwgdDogdGVzdFN0YXJ0IH0sXG4gICAgICAgIGNvbm5lY3Q6IHsgcjogdHJ1ZSwgdDogdGVzdENvbm5lY3QgfSxcbiAgICAgICAgZGlyZWN0aW9uOiB7IHI6IHRydWUsIHQ6IHRlc3REaXJlY3Rpb24gfSxcbiAgICAgICAgc25hcDogeyByOiBmYWxzZSwgdDogdGVzdFNuYXAgfSxcbiAgICAgICAgYW5pbWF0ZTogeyByOiBmYWxzZSwgdDogdGVzdEFuaW1hdGUgfSxcbiAgICAgICAgYW5pbWF0aW9uRHVyYXRpb246IHsgcjogZmFsc2UsIHQ6IHRlc3RBbmltYXRpb25EdXJhdGlvbiB9LFxuICAgICAgICByYW5nZTogeyByOiB0cnVlLCB0OiB0ZXN0UmFuZ2UgfSxcbiAgICAgICAgb3JpZW50YXRpb246IHsgcjogZmFsc2UsIHQ6IHRlc3RPcmllbnRhdGlvbiB9LFxuICAgICAgICBtYXJnaW46IHsgcjogZmFsc2UsIHQ6IHRlc3RNYXJnaW4gfSxcbiAgICAgICAgbGltaXQ6IHsgcjogZmFsc2UsIHQ6IHRlc3RMaW1pdCB9LFxuICAgICAgICBwYWRkaW5nOiB7IHI6IGZhbHNlLCB0OiB0ZXN0UGFkZGluZyB9LFxuICAgICAgICBiZWhhdmlvdXI6IHsgcjogdHJ1ZSwgdDogdGVzdEJlaGF2aW91ciB9LFxuICAgICAgICBhcmlhRm9ybWF0OiB7IHI6IGZhbHNlLCB0OiB0ZXN0QXJpYUZvcm1hdCB9LFxuICAgICAgICBmb3JtYXQ6IHsgcjogZmFsc2UsIHQ6IHRlc3RGb3JtYXQgfSxcbiAgICAgICAgdG9vbHRpcHM6IHsgcjogZmFsc2UsIHQ6IHRlc3RUb29sdGlwcyB9LFxuICAgICAgICBrZXlib2FyZFN1cHBvcnQ6IHsgcjogdHJ1ZSwgdDogdGVzdEtleWJvYXJkU3VwcG9ydCB9LFxuICAgICAgICBkb2N1bWVudEVsZW1lbnQ6IHsgcjogZmFsc2UsIHQ6IHRlc3REb2N1bWVudEVsZW1lbnQgfSxcbiAgICAgICAgY3NzUHJlZml4OiB7IHI6IHRydWUsIHQ6IHRlc3RDc3NQcmVmaXggfSxcbiAgICAgICAgY3NzQ2xhc3NlczogeyByOiB0cnVlLCB0OiB0ZXN0Q3NzQ2xhc3NlcyB9LFxuICAgICAgICBoYW5kbGVBdHRyaWJ1dGVzOiB7IHI6IGZhbHNlLCB0OiB0ZXN0SGFuZGxlQXR0cmlidXRlcyB9LFxuICAgIH07XG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgICBjb25uZWN0OiBmYWxzZSxcbiAgICAgICAgZGlyZWN0aW9uOiBcImx0clwiLFxuICAgICAgICBiZWhhdmlvdXI6IFwidGFwXCIsXG4gICAgICAgIG9yaWVudGF0aW9uOiBcImhvcml6b250YWxcIixcbiAgICAgICAga2V5Ym9hcmRTdXBwb3J0OiB0cnVlLFxuICAgICAgICBjc3NQcmVmaXg6IFwibm9VaS1cIixcbiAgICAgICAgY3NzQ2xhc3NlczogY3NzQ2xhc3NlcyxcbiAgICAgICAga2V5Ym9hcmRQYWdlTXVsdGlwbGllcjogNSxcbiAgICAgICAga2V5Ym9hcmRNdWx0aXBsaWVyOiAxLFxuICAgICAgICBrZXlib2FyZERlZmF1bHRTdGVwOiAxMCxcbiAgICB9O1xuICAgIC8vIEFyaWFGb3JtYXQgZGVmYXVsdHMgdG8gcmVndWxhciBmb3JtYXQsIGlmIGFueS5cbiAgICBpZiAob3B0aW9ucy5mb3JtYXQgJiYgIW9wdGlvbnMuYXJpYUZvcm1hdCkge1xuICAgICAgICBvcHRpb25zLmFyaWFGb3JtYXQgPSBvcHRpb25zLmZvcm1hdDtcbiAgICB9XG4gICAgLy8gUnVuIGFsbCBvcHRpb25zIHRocm91Z2ggYSB0ZXN0aW5nIG1lY2hhbmlzbSB0byBlbnN1cmUgY29ycmVjdFxuICAgIC8vIGlucHV0LiBJdCBzaG91bGQgYmUgbm90ZWQgdGhhdCBvcHRpb25zIG1pZ2h0IGdldCBtb2RpZmllZCB0b1xuICAgIC8vIGJlIGhhbmRsZWQgcHJvcGVybHkuIEUuZy4gd3JhcHBpbmcgaW50ZWdlcnMgaW4gYXJyYXlzLlxuICAgIE9iamVjdC5rZXlzKHRlc3RzKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIC8vIElmIHRoZSBvcHRpb24gaXNuJ3Qgc2V0LCBidXQgaXQgaXMgcmVxdWlyZWQsIHRocm93IGFuIGVycm9yLlxuICAgICAgICBpZiAoIWlzU2V0KG9wdGlvbnNbbmFtZV0pICYmIGRlZmF1bHRzW25hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmICh0ZXN0c1tuYW1lXS5yKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogJ1wiICsgbmFtZSArIFwiJyBpcyByZXF1aXJlZC5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGVzdHNbbmFtZV0udChwYXJzZWQsICFpc1NldChvcHRpb25zW25hbWVdKSA/IGRlZmF1bHRzW25hbWVdIDogb3B0aW9uc1tuYW1lXSk7XG4gICAgfSk7XG4gICAgLy8gRm9yd2FyZCBwaXBzIG9wdGlvbnNcbiAgICBwYXJzZWQucGlwcyA9IG9wdGlvbnMucGlwcztcbiAgICAvLyBBbGwgcmVjZW50IGJyb3dzZXJzIGFjY2VwdCB1bnByZWZpeGVkIHRyYW5zZm9ybS5cbiAgICAvLyBXZSBuZWVkIC1tcy0gZm9yIElFOSBhbmQgLXdlYmtpdC0gZm9yIG9sZGVyIEFuZHJvaWQ7XG4gICAgLy8gQXNzdW1lIHVzZSBvZiAtd2Via2l0LSBpZiB1bnByZWZpeGVkIGFuZCAtbXMtIGFyZSBub3Qgc3VwcG9ydGVkLlxuICAgIC8vIGh0dHBzOi8vY2FuaXVzZS5jb20vI2ZlYXQ9dHJhbnNmb3JtczJkXG4gICAgdmFyIGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHZhciBtc1ByZWZpeCA9IGQuc3R5bGUubXNUcmFuc2Zvcm0gIT09IHVuZGVmaW5lZDtcbiAgICB2YXIgbm9QcmVmaXggPSBkLnN0eWxlLnRyYW5zZm9ybSAhPT0gdW5kZWZpbmVkO1xuICAgIHBhcnNlZC50cmFuc2Zvcm1SdWxlID0gbm9QcmVmaXggPyBcInRyYW5zZm9ybVwiIDogbXNQcmVmaXggPyBcIm1zVHJhbnNmb3JtXCIgOiBcIndlYmtpdFRyYW5zZm9ybVwiO1xuICAgIC8vIFBpcHMgZG9uJ3QgbW92ZSwgc28gd2UgY2FuIHBsYWNlIHRoZW0gdXNpbmcgbGVmdC90b3AuXG4gICAgdmFyIHN0eWxlcyA9IFtcbiAgICAgICAgW1wibGVmdFwiLCBcInRvcFwiXSxcbiAgICAgICAgW1wicmlnaHRcIiwgXCJib3R0b21cIl0sXG4gICAgXTtcbiAgICBwYXJzZWQuc3R5bGUgPSBzdHlsZXNbcGFyc2VkLmRpcl1bcGFyc2VkLm9ydF07XG4gICAgcmV0dXJuIHBhcnNlZDtcbn1cbi8vZW5kcmVnaW9uXG5mdW5jdGlvbiBzY29wZSh0YXJnZXQsIG9wdGlvbnMsIG9yaWdpbmFsT3B0aW9ucykge1xuICAgIHZhciBhY3Rpb25zID0gZ2V0QWN0aW9ucygpO1xuICAgIHZhciBzdXBwb3J0c1RvdWNoQWN0aW9uTm9uZSA9IGdldFN1cHBvcnRzVG91Y2hBY3Rpb25Ob25lKCk7XG4gICAgdmFyIHN1cHBvcnRzUGFzc2l2ZSA9IHN1cHBvcnRzVG91Y2hBY3Rpb25Ob25lICYmIGdldFN1cHBvcnRzUGFzc2l2ZSgpO1xuICAgIC8vIEFsbCB2YXJpYWJsZXMgbG9jYWwgdG8gJ3Njb3BlJyBhcmUgcHJlZml4ZWQgd2l0aCAnc2NvcGVfJ1xuICAgIC8vIFNsaWRlciBET00gTm9kZXNcbiAgICB2YXIgc2NvcGVfVGFyZ2V0ID0gdGFyZ2V0O1xuICAgIHZhciBzY29wZV9CYXNlO1xuICAgIHZhciBzY29wZV9IYW5kbGVzO1xuICAgIHZhciBzY29wZV9Db25uZWN0cztcbiAgICB2YXIgc2NvcGVfUGlwcztcbiAgICB2YXIgc2NvcGVfVG9vbHRpcHM7XG4gICAgLy8gU2xpZGVyIHN0YXRlIHZhbHVlc1xuICAgIHZhciBzY29wZV9TcGVjdHJ1bSA9IG9wdGlvbnMuc3BlY3RydW07XG4gICAgdmFyIHNjb3BlX1ZhbHVlcyA9IFtdO1xuICAgIHZhciBzY29wZV9Mb2NhdGlvbnMgPSBbXTtcbiAgICB2YXIgc2NvcGVfSGFuZGxlTnVtYmVycyA9IFtdO1xuICAgIHZhciBzY29wZV9BY3RpdmVIYW5kbGVzQ291bnQgPSAwO1xuICAgIHZhciBzY29wZV9FdmVudHMgPSB7fTtcbiAgICAvLyBEb2N1bWVudCBOb2Rlc1xuICAgIHZhciBzY29wZV9Eb2N1bWVudCA9IHRhcmdldC5vd25lckRvY3VtZW50O1xuICAgIHZhciBzY29wZV9Eb2N1bWVudEVsZW1lbnQgPSBvcHRpb25zLmRvY3VtZW50RWxlbWVudCB8fCBzY29wZV9Eb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgdmFyIHNjb3BlX0JvZHkgPSBzY29wZV9Eb2N1bWVudC5ib2R5O1xuICAgIC8vIEZvciBob3Jpem9udGFsIHNsaWRlcnMgaW4gc3RhbmRhcmQgbHRyIGRvY3VtZW50cyxcbiAgICAvLyBtYWtlIC5ub1VpLW9yaWdpbiBvdmVyZmxvdyB0byB0aGUgbGVmdCBzbyB0aGUgZG9jdW1lbnQgZG9lc24ndCBzY3JvbGwuXG4gICAgdmFyIHNjb3BlX0Rpck9mZnNldCA9IHNjb3BlX0RvY3VtZW50LmRpciA9PT0gXCJydGxcIiB8fCBvcHRpb25zLm9ydCA9PT0gMSA/IDAgOiAxMDA7XG4gICAgLy8gQ3JlYXRlcyBhIG5vZGUsIGFkZHMgaXQgdG8gdGFyZ2V0LCByZXR1cm5zIHRoZSBuZXcgbm9kZS5cbiAgICBmdW5jdGlvbiBhZGROb2RlVG8oYWRkVGFyZ2V0LCBjbGFzc05hbWUpIHtcbiAgICAgICAgdmFyIGRpdiA9IHNjb3BlX0RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGlmIChjbGFzc05hbWUpIHtcbiAgICAgICAgICAgIGFkZENsYXNzKGRpdiwgY2xhc3NOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBhZGRUYXJnZXQuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICAgICAgcmV0dXJuIGRpdjtcbiAgICB9XG4gICAgLy8gQXBwZW5kIGEgb3JpZ2luIHRvIHRoZSBiYXNlXG4gICAgZnVuY3Rpb24gYWRkT3JpZ2luKGJhc2UsIGhhbmRsZU51bWJlcikge1xuICAgICAgICB2YXIgb3JpZ2luID0gYWRkTm9kZVRvKGJhc2UsIG9wdGlvbnMuY3NzQ2xhc3Nlcy5vcmlnaW4pO1xuICAgICAgICB2YXIgaGFuZGxlID0gYWRkTm9kZVRvKG9yaWdpbiwgb3B0aW9ucy5jc3NDbGFzc2VzLmhhbmRsZSk7XG4gICAgICAgIGFkZE5vZGVUbyhoYW5kbGUsIG9wdGlvbnMuY3NzQ2xhc3Nlcy50b3VjaEFyZWEpO1xuICAgICAgICBoYW5kbGUuc2V0QXR0cmlidXRlKFwiZGF0YS1oYW5kbGVcIiwgU3RyaW5nKGhhbmRsZU51bWJlcikpO1xuICAgICAgICBpZiAob3B0aW9ucy5rZXlib2FyZFN1cHBvcnQpIHtcbiAgICAgICAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0hUTUwvR2xvYmFsX2F0dHJpYnV0ZXMvdGFiaW5kZXhcbiAgICAgICAgICAgIC8vIDAgPSBmb2N1c2FibGUgYW5kIHJlYWNoYWJsZVxuICAgICAgICAgICAgaGFuZGxlLnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIFwiMFwiKTtcbiAgICAgICAgICAgIGhhbmRsZS5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXZlbnRLZXlkb3duKGV2ZW50LCBoYW5kbGVOdW1iZXIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMuaGFuZGxlQXR0cmlidXRlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlc18xID0gb3B0aW9ucy5oYW5kbGVBdHRyaWJ1dGVzW2hhbmRsZU51bWJlcl07XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzXzEpLmZvckVhY2goZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgICAgIGhhbmRsZS5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlLCBhdHRyaWJ1dGVzXzFbYXR0cmlidXRlXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBoYW5kbGUuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcInNsaWRlclwiKTtcbiAgICAgICAgaGFuZGxlLnNldEF0dHJpYnV0ZShcImFyaWEtb3JpZW50YXRpb25cIiwgb3B0aW9ucy5vcnQgPyBcInZlcnRpY2FsXCIgOiBcImhvcml6b250YWxcIik7XG4gICAgICAgIGlmIChoYW5kbGVOdW1iZXIgPT09IDApIHtcbiAgICAgICAgICAgIGFkZENsYXNzKGhhbmRsZSwgb3B0aW9ucy5jc3NDbGFzc2VzLmhhbmRsZUxvd2VyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChoYW5kbGVOdW1iZXIgPT09IG9wdGlvbnMuaGFuZGxlcyAtIDEpIHtcbiAgICAgICAgICAgIGFkZENsYXNzKGhhbmRsZSwgb3B0aW9ucy5jc3NDbGFzc2VzLmhhbmRsZVVwcGVyKTtcbiAgICAgICAgfVxuICAgICAgICBvcmlnaW4uaGFuZGxlID0gaGFuZGxlO1xuICAgICAgICByZXR1cm4gb3JpZ2luO1xuICAgIH1cbiAgICAvLyBJbnNlcnQgbm9kZXMgZm9yIGNvbm5lY3QgZWxlbWVudHNcbiAgICBmdW5jdGlvbiBhZGRDb25uZWN0KGJhc2UsIGFkZCkge1xuICAgICAgICBpZiAoIWFkZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhZGROb2RlVG8oYmFzZSwgb3B0aW9ucy5jc3NDbGFzc2VzLmNvbm5lY3QpO1xuICAgIH1cbiAgICAvLyBBZGQgaGFuZGxlcyB0byB0aGUgc2xpZGVyIGJhc2UuXG4gICAgZnVuY3Rpb24gYWRkRWxlbWVudHMoY29ubmVjdE9wdGlvbnMsIGJhc2UpIHtcbiAgICAgICAgdmFyIGNvbm5lY3RCYXNlID0gYWRkTm9kZVRvKGJhc2UsIG9wdGlvbnMuY3NzQ2xhc3Nlcy5jb25uZWN0cyk7XG4gICAgICAgIHNjb3BlX0hhbmRsZXMgPSBbXTtcbiAgICAgICAgc2NvcGVfQ29ubmVjdHMgPSBbXTtcbiAgICAgICAgc2NvcGVfQ29ubmVjdHMucHVzaChhZGRDb25uZWN0KGNvbm5lY3RCYXNlLCBjb25uZWN0T3B0aW9uc1swXSkpO1xuICAgICAgICAvLyBbOjo6Ok89PT09Tz09PT1PPT09PV1cbiAgICAgICAgLy8gY29ubmVjdE9wdGlvbnMgPSBbMCwgMSwgMSwgMV1cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvcHRpb25zLmhhbmRsZXM7IGkrKykge1xuICAgICAgICAgICAgLy8gS2VlcCBhIGxpc3Qgb2YgYWxsIGFkZGVkIGhhbmRsZXMuXG4gICAgICAgICAgICBzY29wZV9IYW5kbGVzLnB1c2goYWRkT3JpZ2luKGJhc2UsIGkpKTtcbiAgICAgICAgICAgIHNjb3BlX0hhbmRsZU51bWJlcnNbaV0gPSBpO1xuICAgICAgICAgICAgc2NvcGVfQ29ubmVjdHMucHVzaChhZGRDb25uZWN0KGNvbm5lY3RCYXNlLCBjb25uZWN0T3B0aW9uc1tpICsgMV0pKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBJbml0aWFsaXplIGEgc2luZ2xlIHNsaWRlci5cbiAgICBmdW5jdGlvbiBhZGRTbGlkZXIoYWRkVGFyZ2V0KSB7XG4gICAgICAgIC8vIEFwcGx5IGNsYXNzZXMgYW5kIGRhdGEgdG8gdGhlIHRhcmdldC5cbiAgICAgICAgYWRkQ2xhc3MoYWRkVGFyZ2V0LCBvcHRpb25zLmNzc0NsYXNzZXMudGFyZ2V0KTtcbiAgICAgICAgaWYgKG9wdGlvbnMuZGlyID09PSAwKSB7XG4gICAgICAgICAgICBhZGRDbGFzcyhhZGRUYXJnZXQsIG9wdGlvbnMuY3NzQ2xhc3Nlcy5sdHIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYWRkQ2xhc3MoYWRkVGFyZ2V0LCBvcHRpb25zLmNzc0NsYXNzZXMucnRsKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5vcnQgPT09IDApIHtcbiAgICAgICAgICAgIGFkZENsYXNzKGFkZFRhcmdldCwgb3B0aW9ucy5jc3NDbGFzc2VzLmhvcml6b250YWwpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYWRkQ2xhc3MoYWRkVGFyZ2V0LCBvcHRpb25zLmNzc0NsYXNzZXMudmVydGljYWwpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0ZXh0RGlyZWN0aW9uID0gZ2V0Q29tcHV0ZWRTdHlsZShhZGRUYXJnZXQpLmRpcmVjdGlvbjtcbiAgICAgICAgaWYgKHRleHREaXJlY3Rpb24gPT09IFwicnRsXCIpIHtcbiAgICAgICAgICAgIGFkZENsYXNzKGFkZFRhcmdldCwgb3B0aW9ucy5jc3NDbGFzc2VzLnRleHREaXJlY3Rpb25SdGwpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYWRkQ2xhc3MoYWRkVGFyZ2V0LCBvcHRpb25zLmNzc0NsYXNzZXMudGV4dERpcmVjdGlvbkx0cik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFkZE5vZGVUbyhhZGRUYXJnZXQsIG9wdGlvbnMuY3NzQ2xhc3Nlcy5iYXNlKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gYWRkVG9vbHRpcChoYW5kbGUsIGhhbmRsZU51bWJlcikge1xuICAgICAgICBpZiAoIW9wdGlvbnMudG9vbHRpcHMgfHwgIW9wdGlvbnMudG9vbHRpcHNbaGFuZGxlTnVtYmVyXSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhZGROb2RlVG8oaGFuZGxlLmZpcnN0Q2hpbGQsIG9wdGlvbnMuY3NzQ2xhc3Nlcy50b29sdGlwKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNTbGlkZXJEaXNhYmxlZCgpIHtcbiAgICAgICAgcmV0dXJuIHNjb3BlX1RhcmdldC5oYXNBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICB9XG4gICAgLy8gRGlzYWJsZSB0aGUgc2xpZGVyIGRyYWdnaW5nIGlmIGFueSBoYW5kbGUgaXMgZGlzYWJsZWRcbiAgICBmdW5jdGlvbiBpc0hhbmRsZURpc2FibGVkKGhhbmRsZU51bWJlcikge1xuICAgICAgICB2YXIgaGFuZGxlT3JpZ2luID0gc2NvcGVfSGFuZGxlc1toYW5kbGVOdW1iZXJdO1xuICAgICAgICByZXR1cm4gaGFuZGxlT3JpZ2luLmhhc0F0dHJpYnV0ZShcImRpc2FibGVkXCIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBkaXNhYmxlKGhhbmRsZU51bWJlcikge1xuICAgICAgICBpZiAoaGFuZGxlTnVtYmVyICE9PSBudWxsICYmIGhhbmRsZU51bWJlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzY29wZV9IYW5kbGVzW2hhbmRsZU51bWJlcl0uc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIiwgXCJcIik7XG4gICAgICAgICAgICBzY29wZV9IYW5kbGVzW2hhbmRsZU51bWJlcl0uaGFuZGxlLnJlbW92ZUF0dHJpYnV0ZShcInRhYmluZGV4XCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc2NvcGVfVGFyZ2V0LnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwiXCIpO1xuICAgICAgICAgICAgc2NvcGVfSGFuZGxlcy5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGUpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGUuaGFuZGxlLnJlbW92ZUF0dHJpYnV0ZShcInRhYmluZGV4XCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gZW5hYmxlKGhhbmRsZU51bWJlcikge1xuICAgICAgICBpZiAoaGFuZGxlTnVtYmVyICE9PSBudWxsICYmIGhhbmRsZU51bWJlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzY29wZV9IYW5kbGVzW2hhbmRsZU51bWJlcl0ucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICBzY29wZV9IYW5kbGVzW2hhbmRsZU51bWJlcl0uaGFuZGxlLnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIFwiMFwiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHNjb3BlX1RhcmdldC5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgIHNjb3BlX0hhbmRsZXMuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlLnJlbW92ZUF0dHJpYnV0ZShcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgICAgIGhhbmRsZS5oYW5kbGUuc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgXCIwXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gcmVtb3ZlVG9vbHRpcHMoKSB7XG4gICAgICAgIGlmIChzY29wZV9Ub29sdGlwcykge1xuICAgICAgICAgICAgcmVtb3ZlRXZlbnQoXCJ1cGRhdGVcIiArIElOVEVSTkFMX0VWRU5UX05TLnRvb2x0aXBzKTtcbiAgICAgICAgICAgIHNjb3BlX1Rvb2x0aXBzLmZvckVhY2goZnVuY3Rpb24gKHRvb2x0aXApIHtcbiAgICAgICAgICAgICAgICBpZiAodG9vbHRpcCkge1xuICAgICAgICAgICAgICAgICAgICByZW1vdmVFbGVtZW50KHRvb2x0aXApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc2NvcGVfVG9vbHRpcHMgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIFRoZSB0b29sdGlwcyBvcHRpb24gaXMgYSBzaG9ydGhhbmQgZm9yIHVzaW5nIHRoZSAndXBkYXRlJyBldmVudC5cbiAgICBmdW5jdGlvbiB0b29sdGlwcygpIHtcbiAgICAgICAgcmVtb3ZlVG9vbHRpcHMoKTtcbiAgICAgICAgLy8gVG9vbHRpcHMgYXJlIGFkZGVkIHdpdGggb3B0aW9ucy50b29sdGlwcyBpbiBvcmlnaW5hbCBvcmRlci5cbiAgICAgICAgc2NvcGVfVG9vbHRpcHMgPSBzY29wZV9IYW5kbGVzLm1hcChhZGRUb29sdGlwKTtcbiAgICAgICAgYmluZEV2ZW50KFwidXBkYXRlXCIgKyBJTlRFUk5BTF9FVkVOVF9OUy50b29sdGlwcywgZnVuY3Rpb24gKHZhbHVlcywgaGFuZGxlTnVtYmVyLCB1bmVuY29kZWQpIHtcbiAgICAgICAgICAgIGlmICghc2NvcGVfVG9vbHRpcHMgfHwgIW9wdGlvbnMudG9vbHRpcHMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2NvcGVfVG9vbHRpcHNbaGFuZGxlTnVtYmVyXSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZm9ybWF0dGVkVmFsdWUgPSB2YWx1ZXNbaGFuZGxlTnVtYmVyXTtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnRvb2x0aXBzW2hhbmRsZU51bWJlcl0gIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBmb3JtYXR0ZWRWYWx1ZSA9IG9wdGlvbnMudG9vbHRpcHNbaGFuZGxlTnVtYmVyXS50byh1bmVuY29kZWRbaGFuZGxlTnVtYmVyXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzY29wZV9Ub29sdGlwc1toYW5kbGVOdW1iZXJdLmlubmVySFRNTCA9IGZvcm1hdHRlZFZhbHVlO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gYXJpYSgpIHtcbiAgICAgICAgcmVtb3ZlRXZlbnQoXCJ1cGRhdGVcIiArIElOVEVSTkFMX0VWRU5UX05TLmFyaWEpO1xuICAgICAgICBiaW5kRXZlbnQoXCJ1cGRhdGVcIiArIElOVEVSTkFMX0VWRU5UX05TLmFyaWEsIGZ1bmN0aW9uICh2YWx1ZXMsIGhhbmRsZU51bWJlciwgdW5lbmNvZGVkLCB0YXAsIHBvc2l0aW9ucykge1xuICAgICAgICAgICAgLy8gVXBkYXRlIEFyaWEgVmFsdWVzIGZvciBhbGwgaGFuZGxlcywgYXMgYSBjaGFuZ2UgaW4gb25lIGNoYW5nZXMgbWluIGFuZCBtYXggdmFsdWVzIGZvciB0aGUgbmV4dC5cbiAgICAgICAgICAgIHNjb3BlX0hhbmRsZU51bWJlcnMuZm9yRWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgICAgICAgICB2YXIgaGFuZGxlID0gc2NvcGVfSGFuZGxlc1tpbmRleF07XG4gICAgICAgICAgICAgICAgdmFyIG1pbiA9IGNoZWNrSGFuZGxlUG9zaXRpb24oc2NvcGVfTG9jYXRpb25zLCBpbmRleCwgMCwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgdmFyIG1heCA9IGNoZWNrSGFuZGxlUG9zaXRpb24oc2NvcGVfTG9jYXRpb25zLCBpbmRleCwgMTAwLCB0cnVlLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB2YXIgbm93ID0gcG9zaXRpb25zW2luZGV4XTtcbiAgICAgICAgICAgICAgICAvLyBGb3JtYXR0ZWQgdmFsdWUgZm9yIGRpc3BsYXlcbiAgICAgICAgICAgICAgICB2YXIgdGV4dCA9IFN0cmluZyhvcHRpb25zLmFyaWFGb3JtYXQudG8odW5lbmNvZGVkW2luZGV4XSkpO1xuICAgICAgICAgICAgICAgIC8vIE1hcCB0byBzbGlkZXIgcmFuZ2UgdmFsdWVzXG4gICAgICAgICAgICAgICAgbWluID0gc2NvcGVfU3BlY3RydW0uZnJvbVN0ZXBwaW5nKG1pbikudG9GaXhlZCgxKTtcbiAgICAgICAgICAgICAgICBtYXggPSBzY29wZV9TcGVjdHJ1bS5mcm9tU3RlcHBpbmcobWF4KS50b0ZpeGVkKDEpO1xuICAgICAgICAgICAgICAgIG5vdyA9IHNjb3BlX1NwZWN0cnVtLmZyb21TdGVwcGluZyhub3cpLnRvRml4ZWQoMSk7XG4gICAgICAgICAgICAgICAgaGFuZGxlLmNoaWxkcmVuWzBdLnNldEF0dHJpYnV0ZShcImFyaWEtdmFsdWVtaW5cIiwgbWluKTtcbiAgICAgICAgICAgICAgICBoYW5kbGUuY2hpbGRyZW5bMF0uc2V0QXR0cmlidXRlKFwiYXJpYS12YWx1ZW1heFwiLCBtYXgpO1xuICAgICAgICAgICAgICAgIGhhbmRsZS5jaGlsZHJlblswXS5zZXRBdHRyaWJ1dGUoXCJhcmlhLXZhbHVlbm93XCIsIG5vdyk7XG4gICAgICAgICAgICAgICAgaGFuZGxlLmNoaWxkcmVuWzBdLnNldEF0dHJpYnV0ZShcImFyaWEtdmFsdWV0ZXh0XCIsIHRleHQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXRHcm91cChwaXBzKSB7XG4gICAgICAgIC8vIFVzZSB0aGUgcmFuZ2UuXG4gICAgICAgIGlmIChwaXBzLm1vZGUgPT09IFBpcHNNb2RlLlJhbmdlIHx8IHBpcHMubW9kZSA9PT0gUGlwc01vZGUuU3RlcHMpIHtcbiAgICAgICAgICAgIHJldHVybiBzY29wZV9TcGVjdHJ1bS54VmFsO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwaXBzLm1vZGUgPT09IFBpcHNNb2RlLkNvdW50KSB7XG4gICAgICAgICAgICBpZiAocGlwcy52YWx1ZXMgPCAyKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogJ3ZhbHVlcycgKD49IDIpIHJlcXVpcmVkIGZvciBtb2RlICdjb3VudCcuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gRGl2aWRlIDAgLSAxMDAgaW4gJ2NvdW50JyBwYXJ0cy5cbiAgICAgICAgICAgIHZhciBpbnRlcnZhbCA9IHBpcHMudmFsdWVzIC0gMTtcbiAgICAgICAgICAgIHZhciBzcHJlYWQgPSAxMDAgLyBpbnRlcnZhbDtcbiAgICAgICAgICAgIHZhciB2YWx1ZXMgPSBbXTtcbiAgICAgICAgICAgIC8vIExpc3QgdGhlc2UgcGFydHMgYW5kIGhhdmUgdGhlbSBoYW5kbGVkIGFzICdwb3NpdGlvbnMnLlxuICAgICAgICAgICAgd2hpbGUgKGludGVydmFsLS0pIHtcbiAgICAgICAgICAgICAgICB2YWx1ZXNbaW50ZXJ2YWxdID0gaW50ZXJ2YWwgKiBzcHJlYWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZXMucHVzaCgxMDApO1xuICAgICAgICAgICAgcmV0dXJuIG1hcFRvUmFuZ2UodmFsdWVzLCBwaXBzLnN0ZXBwZWQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwaXBzLm1vZGUgPT09IFBpcHNNb2RlLlBvc2l0aW9ucykge1xuICAgICAgICAgICAgLy8gTWFwIGFsbCBwZXJjZW50YWdlcyB0byBvbi1yYW5nZSB2YWx1ZXMuXG4gICAgICAgICAgICByZXR1cm4gbWFwVG9SYW5nZShwaXBzLnZhbHVlcywgcGlwcy5zdGVwcGVkKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGlwcy5tb2RlID09PSBQaXBzTW9kZS5WYWx1ZXMpIHtcbiAgICAgICAgICAgIC8vIElmIHRoZSB2YWx1ZSBtdXN0IGJlIHN0ZXBwZWQsIGl0IG5lZWRzIHRvIGJlIGNvbnZlcnRlZCB0byBhIHBlcmNlbnRhZ2UgZmlyc3QuXG4gICAgICAgICAgICBpZiAocGlwcy5zdGVwcGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBpcHMudmFsdWVzLm1hcChmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ29udmVydCB0byBwZXJjZW50YWdlLCBhcHBseSBzdGVwLCByZXR1cm4gdG8gdmFsdWUuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzY29wZV9TcGVjdHJ1bS5mcm9tU3RlcHBpbmcoc2NvcGVfU3BlY3RydW0uZ2V0U3RlcChzY29wZV9TcGVjdHJ1bS50b1N0ZXBwaW5nKHZhbHVlKSkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCB3ZSBjYW4gc2ltcGx5IHVzZSB0aGUgdmFsdWVzLlxuICAgICAgICAgICAgcmV0dXJuIHBpcHMudmFsdWVzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbXTsgLy8gcGlwcy5tb2RlID0gbmV2ZXJcbiAgICB9XG4gICAgZnVuY3Rpb24gbWFwVG9SYW5nZSh2YWx1ZXMsIHN0ZXBwZWQpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlcy5tYXAoZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gc2NvcGVfU3BlY3RydW0uZnJvbVN0ZXBwaW5nKHN0ZXBwZWQgPyBzY29wZV9TcGVjdHJ1bS5nZXRTdGVwKHZhbHVlKSA6IHZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlU3ByZWFkKHBpcHMpIHtcbiAgICAgICAgZnVuY3Rpb24gc2FmZUluY3JlbWVudCh2YWx1ZSwgaW5jcmVtZW50KSB7XG4gICAgICAgICAgICAvLyBBdm9pZCBmbG9hdGluZyBwb2ludCB2YXJpYW5jZSBieSBkcm9wcGluZyB0aGUgc21hbGxlc3QgZGVjaW1hbCBwbGFjZXMuXG4gICAgICAgICAgICByZXR1cm4gTnVtYmVyKCh2YWx1ZSArIGluY3JlbWVudCkudG9GaXhlZCg3KSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGdyb3VwID0gZ2V0R3JvdXAocGlwcyk7XG4gICAgICAgIHZhciBpbmRleGVzID0ge307XG4gICAgICAgIHZhciBmaXJzdEluUmFuZ2UgPSBzY29wZV9TcGVjdHJ1bS54VmFsWzBdO1xuICAgICAgICB2YXIgbGFzdEluUmFuZ2UgPSBzY29wZV9TcGVjdHJ1bS54VmFsW3Njb3BlX1NwZWN0cnVtLnhWYWwubGVuZ3RoIC0gMV07XG4gICAgICAgIHZhciBpZ25vcmVGaXJzdCA9IGZhbHNlO1xuICAgICAgICB2YXIgaWdub3JlTGFzdCA9IGZhbHNlO1xuICAgICAgICB2YXIgcHJldlBjdCA9IDA7XG4gICAgICAgIC8vIENyZWF0ZSBhIGNvcHkgb2YgdGhlIGdyb3VwLCBzb3J0IGl0IGFuZCBmaWx0ZXIgYXdheSBhbGwgZHVwbGljYXRlcy5cbiAgICAgICAgZ3JvdXAgPSB1bmlxdWUoZ3JvdXAuc2xpY2UoKS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gYSAtIGI7XG4gICAgICAgIH0pKTtcbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoZSByYW5nZSBzdGFydHMgd2l0aCB0aGUgZmlyc3QgZWxlbWVudC5cbiAgICAgICAgaWYgKGdyb3VwWzBdICE9PSBmaXJzdEluUmFuZ2UpIHtcbiAgICAgICAgICAgIGdyb3VwLnVuc2hpZnQoZmlyc3RJblJhbmdlKTtcbiAgICAgICAgICAgIGlnbm9yZUZpcnN0ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBMaWtld2lzZSBmb3IgdGhlIGxhc3Qgb25lLlxuICAgICAgICBpZiAoZ3JvdXBbZ3JvdXAubGVuZ3RoIC0gMV0gIT09IGxhc3RJblJhbmdlKSB7XG4gICAgICAgICAgICBncm91cC5wdXNoKGxhc3RJblJhbmdlKTtcbiAgICAgICAgICAgIGlnbm9yZUxhc3QgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGdyb3VwLmZvckVhY2goZnVuY3Rpb24gKGN1cnJlbnQsIGluZGV4KSB7XG4gICAgICAgICAgICAvLyBHZXQgdGhlIGN1cnJlbnQgc3RlcCBhbmQgdGhlIGxvd2VyICsgdXBwZXIgcG9zaXRpb25zLlxuICAgICAgICAgICAgdmFyIHN0ZXA7XG4gICAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICAgIHZhciBxO1xuICAgICAgICAgICAgdmFyIGxvdyA9IGN1cnJlbnQ7XG4gICAgICAgICAgICB2YXIgaGlnaCA9IGdyb3VwW2luZGV4ICsgMV07XG4gICAgICAgICAgICB2YXIgbmV3UGN0O1xuICAgICAgICAgICAgdmFyIHBjdERpZmZlcmVuY2U7XG4gICAgICAgICAgICB2YXIgcGN0UG9zO1xuICAgICAgICAgICAgdmFyIHR5cGU7XG4gICAgICAgICAgICB2YXIgc3RlcHM7XG4gICAgICAgICAgICB2YXIgcmVhbFN0ZXBzO1xuICAgICAgICAgICAgdmFyIHN0ZXBTaXplO1xuICAgICAgICAgICAgdmFyIGlzU3RlcHMgPSBwaXBzLm1vZGUgPT09IFBpcHNNb2RlLlN0ZXBzO1xuICAgICAgICAgICAgLy8gV2hlbiB1c2luZyAnc3RlcHMnIG1vZGUsIHVzZSB0aGUgcHJvdmlkZWQgc3RlcHMuXG4gICAgICAgICAgICAvLyBPdGhlcndpc2UsIHdlJ2xsIHN0ZXAgb24gdG8gdGhlIG5leHQgc3VicmFuZ2UuXG4gICAgICAgICAgICBpZiAoaXNTdGVwcykge1xuICAgICAgICAgICAgICAgIHN0ZXAgPSBzY29wZV9TcGVjdHJ1bS54TnVtU3RlcHNbaW5kZXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gRGVmYXVsdCB0byBhICdmdWxsJyBzdGVwLlxuICAgICAgICAgICAgaWYgKCFzdGVwKSB7XG4gICAgICAgICAgICAgICAgc3RlcCA9IGhpZ2ggLSBsb3c7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBJZiBoaWdoIGlzIHVuZGVmaW5lZCB3ZSBhcmUgYXQgdGhlIGxhc3Qgc3VicmFuZ2UuIE1ha2Ugc3VyZSBpdCBpdGVyYXRlcyBvbmNlICgjMTA4OClcbiAgICAgICAgICAgIGlmIChoaWdoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBoaWdoID0gbG93O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gTWFrZSBzdXJlIHN0ZXAgaXNuJ3QgMCwgd2hpY2ggd291bGQgY2F1c2UgYW4gaW5maW5pdGUgbG9vcCAoIzY1NClcbiAgICAgICAgICAgIHN0ZXAgPSBNYXRoLm1heChzdGVwLCAwLjAwMDAwMDEpO1xuICAgICAgICAgICAgLy8gRmluZCBhbGwgc3RlcHMgaW4gdGhlIHN1YnJhbmdlLlxuICAgICAgICAgICAgZm9yIChpID0gbG93OyBpIDw9IGhpZ2g7IGkgPSBzYWZlSW5jcmVtZW50KGksIHN0ZXApKSB7XG4gICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBwZXJjZW50YWdlIHZhbHVlIGZvciB0aGUgY3VycmVudCBzdGVwLFxuICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSB0aGUgc2l6ZSBmb3IgdGhlIHN1YnJhbmdlLlxuICAgICAgICAgICAgICAgIG5ld1BjdCA9IHNjb3BlX1NwZWN0cnVtLnRvU3RlcHBpbmcoaSk7XG4gICAgICAgICAgICAgICAgcGN0RGlmZmVyZW5jZSA9IG5ld1BjdCAtIHByZXZQY3Q7XG4gICAgICAgICAgICAgICAgc3RlcHMgPSBwY3REaWZmZXJlbmNlIC8gKHBpcHMuZGVuc2l0eSB8fCAxKTtcbiAgICAgICAgICAgICAgICByZWFsU3RlcHMgPSBNYXRoLnJvdW5kKHN0ZXBzKTtcbiAgICAgICAgICAgICAgICAvLyBUaGlzIHJhdGlvIHJlcHJlc2VudHMgdGhlIGFtb3VudCBvZiBwZXJjZW50YWdlLXNwYWNlIGEgcG9pbnQgaW5kaWNhdGVzLlxuICAgICAgICAgICAgICAgIC8vIEZvciBhIGRlbnNpdHkgMSB0aGUgcG9pbnRzL3BlcmNlbnRhZ2UgPSAxLiBGb3IgZGVuc2l0eSAyLCB0aGF0IHBlcmNlbnRhZ2UgbmVlZHMgdG8gYmUgcmUtZGl2aWRlZC5cbiAgICAgICAgICAgICAgICAvLyBSb3VuZCB0aGUgcGVyY2VudGFnZSBvZmZzZXQgdG8gYW4gZXZlbiBudW1iZXIsIHRoZW4gZGl2aWRlIGJ5IHR3b1xuICAgICAgICAgICAgICAgIC8vIHRvIHNwcmVhZCB0aGUgb2Zmc2V0IG9uIGJvdGggc2lkZXMgb2YgdGhlIHJhbmdlLlxuICAgICAgICAgICAgICAgIHN0ZXBTaXplID0gcGN0RGlmZmVyZW5jZSAvIHJlYWxTdGVwcztcbiAgICAgICAgICAgICAgICAvLyBEaXZpZGUgYWxsIHBvaW50cyBldmVubHksIGFkZGluZyB0aGUgY29ycmVjdCBudW1iZXIgdG8gdGhpcyBzdWJyYW5nZS5cbiAgICAgICAgICAgICAgICAvLyBSdW4gdXAgdG8gPD0gc28gdGhhdCAxMDAlIGdldHMgYSBwb2ludCwgZXZlbnQgaWYgaWdub3JlTGFzdCBpcyBzZXQuXG4gICAgICAgICAgICAgICAgZm9yIChxID0gMTsgcSA8PSByZWFsU3RlcHM7IHEgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBUaGUgcmF0aW8gYmV0d2VlbiB0aGUgcm91bmRlZCB2YWx1ZSBhbmQgdGhlIGFjdHVhbCBzaXplIG1pZ2h0IGJlIH4xJSBvZmYuXG4gICAgICAgICAgICAgICAgICAgIC8vIENvcnJlY3QgdGhlIHBlcmNlbnRhZ2Ugb2Zmc2V0IGJ5IHRoZSBudW1iZXIgb2YgcG9pbnRzXG4gICAgICAgICAgICAgICAgICAgIC8vIHBlciBzdWJyYW5nZS4gZGVuc2l0eSA9IDEgd2lsbCByZXN1bHQgaW4gMTAwIHBvaW50cyBvbiB0aGVcbiAgICAgICAgICAgICAgICAgICAgLy8gZnVsbCByYW5nZSwgMiBmb3IgNTAsIDQgZm9yIDI1LCBldGMuXG4gICAgICAgICAgICAgICAgICAgIHBjdFBvcyA9IHByZXZQY3QgKyBxICogc3RlcFNpemU7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ZXNbcGN0UG9zLnRvRml4ZWQoNSldID0gW3Njb3BlX1NwZWN0cnVtLmZyb21TdGVwcGluZyhwY3RQb3MpLCAwXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gRGV0ZXJtaW5lIHRoZSBwb2ludCB0eXBlLlxuICAgICAgICAgICAgICAgIHR5cGUgPSBncm91cC5pbmRleE9mKGkpID4gLTEgPyBQaXBzVHlwZS5MYXJnZVZhbHVlIDogaXNTdGVwcyA/IFBpcHNUeXBlLlNtYWxsVmFsdWUgOiBQaXBzVHlwZS5Ob1ZhbHVlO1xuICAgICAgICAgICAgICAgIC8vIEVuZm9yY2UgdGhlICdpZ25vcmVGaXJzdCcgb3B0aW9uIGJ5IG92ZXJ3cml0aW5nIHRoZSB0eXBlIGZvciAwLlxuICAgICAgICAgICAgICAgIGlmICghaW5kZXggJiYgaWdub3JlRmlyc3QgJiYgaSAhPT0gaGlnaCkge1xuICAgICAgICAgICAgICAgICAgICB0eXBlID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCEoaSA9PT0gaGlnaCAmJiBpZ25vcmVMYXN0KSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBNYXJrIHRoZSAndHlwZScgb2YgdGhpcyBwb2ludC4gMCA9IHBsYWluLCAxID0gcmVhbCB2YWx1ZSwgMiA9IHN0ZXAgdmFsdWUuXG4gICAgICAgICAgICAgICAgICAgIGluZGV4ZXNbbmV3UGN0LnRvRml4ZWQoNSldID0gW2ksIHR5cGVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBVcGRhdGUgdGhlIHBlcmNlbnRhZ2UgY291bnQuXG4gICAgICAgICAgICAgICAgcHJldlBjdCA9IG5ld1BjdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBpbmRleGVzO1xuICAgIH1cbiAgICBmdW5jdGlvbiBhZGRNYXJraW5nKHNwcmVhZCwgZmlsdGVyRnVuYywgZm9ybWF0dGVyKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIHZhciBlbGVtZW50ID0gc2NvcGVfRG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdmFyIHZhbHVlU2l6ZUNsYXNzZXMgPSAoX2EgPSB7fSxcbiAgICAgICAgICAgIF9hW1BpcHNUeXBlLk5vbmVdID0gXCJcIixcbiAgICAgICAgICAgIF9hW1BpcHNUeXBlLk5vVmFsdWVdID0gb3B0aW9ucy5jc3NDbGFzc2VzLnZhbHVlTm9ybWFsLFxuICAgICAgICAgICAgX2FbUGlwc1R5cGUuTGFyZ2VWYWx1ZV0gPSBvcHRpb25zLmNzc0NsYXNzZXMudmFsdWVMYXJnZSxcbiAgICAgICAgICAgIF9hW1BpcHNUeXBlLlNtYWxsVmFsdWVdID0gb3B0aW9ucy5jc3NDbGFzc2VzLnZhbHVlU3ViLFxuICAgICAgICAgICAgX2EpO1xuICAgICAgICB2YXIgbWFya2VyU2l6ZUNsYXNzZXMgPSAoX2IgPSB7fSxcbiAgICAgICAgICAgIF9iW1BpcHNUeXBlLk5vbmVdID0gXCJcIixcbiAgICAgICAgICAgIF9iW1BpcHNUeXBlLk5vVmFsdWVdID0gb3B0aW9ucy5jc3NDbGFzc2VzLm1hcmtlck5vcm1hbCxcbiAgICAgICAgICAgIF9iW1BpcHNUeXBlLkxhcmdlVmFsdWVdID0gb3B0aW9ucy5jc3NDbGFzc2VzLm1hcmtlckxhcmdlLFxuICAgICAgICAgICAgX2JbUGlwc1R5cGUuU21hbGxWYWx1ZV0gPSBvcHRpb25zLmNzc0NsYXNzZXMubWFya2VyU3ViLFxuICAgICAgICAgICAgX2IpO1xuICAgICAgICB2YXIgdmFsdWVPcmllbnRhdGlvbkNsYXNzZXMgPSBbb3B0aW9ucy5jc3NDbGFzc2VzLnZhbHVlSG9yaXpvbnRhbCwgb3B0aW9ucy5jc3NDbGFzc2VzLnZhbHVlVmVydGljYWxdO1xuICAgICAgICB2YXIgbWFya2VyT3JpZW50YXRpb25DbGFzc2VzID0gW29wdGlvbnMuY3NzQ2xhc3Nlcy5tYXJrZXJIb3Jpem9udGFsLCBvcHRpb25zLmNzc0NsYXNzZXMubWFya2VyVmVydGljYWxdO1xuICAgICAgICBhZGRDbGFzcyhlbGVtZW50LCBvcHRpb25zLmNzc0NsYXNzZXMucGlwcyk7XG4gICAgICAgIGFkZENsYXNzKGVsZW1lbnQsIG9wdGlvbnMub3J0ID09PSAwID8gb3B0aW9ucy5jc3NDbGFzc2VzLnBpcHNIb3Jpem9udGFsIDogb3B0aW9ucy5jc3NDbGFzc2VzLnBpcHNWZXJ0aWNhbCk7XG4gICAgICAgIGZ1bmN0aW9uIGdldENsYXNzZXModHlwZSwgc291cmNlKSB7XG4gICAgICAgICAgICB2YXIgYSA9IHNvdXJjZSA9PT0gb3B0aW9ucy5jc3NDbGFzc2VzLnZhbHVlO1xuICAgICAgICAgICAgdmFyIG9yaWVudGF0aW9uQ2xhc3NlcyA9IGEgPyB2YWx1ZU9yaWVudGF0aW9uQ2xhc3NlcyA6IG1hcmtlck9yaWVudGF0aW9uQ2xhc3NlcztcbiAgICAgICAgICAgIHZhciBzaXplQ2xhc3NlcyA9IGEgPyB2YWx1ZVNpemVDbGFzc2VzIDogbWFya2VyU2l6ZUNsYXNzZXM7XG4gICAgICAgICAgICByZXR1cm4gc291cmNlICsgXCIgXCIgKyBvcmllbnRhdGlvbkNsYXNzZXNbb3B0aW9ucy5vcnRdICsgXCIgXCIgKyBzaXplQ2xhc3Nlc1t0eXBlXTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBhZGRTcHJlYWQob2Zmc2V0LCB2YWx1ZSwgdHlwZSkge1xuICAgICAgICAgICAgLy8gQXBwbHkgdGhlIGZpbHRlciBmdW5jdGlvbiwgaWYgaXQgaXMgc2V0LlxuICAgICAgICAgICAgdHlwZSA9IGZpbHRlckZ1bmMgPyBmaWx0ZXJGdW5jKHZhbHVlLCB0eXBlKSA6IHR5cGU7XG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gUGlwc1R5cGUuTm9uZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEFkZCBhIG1hcmtlciBmb3IgZXZlcnkgcG9pbnRcbiAgICAgICAgICAgIHZhciBub2RlID0gYWRkTm9kZVRvKGVsZW1lbnQsIGZhbHNlKTtcbiAgICAgICAgICAgIG5vZGUuY2xhc3NOYW1lID0gZ2V0Q2xhc3Nlcyh0eXBlLCBvcHRpb25zLmNzc0NsYXNzZXMubWFya2VyKTtcbiAgICAgICAgICAgIG5vZGUuc3R5bGVbb3B0aW9ucy5zdHlsZV0gPSBvZmZzZXQgKyBcIiVcIjtcbiAgICAgICAgICAgIC8vIFZhbHVlcyBhcmUgb25seSBhcHBlbmRlZCBmb3IgcG9pbnRzIG1hcmtlZCAnMScgb3IgJzInLlxuICAgICAgICAgICAgaWYgKHR5cGUgPiBQaXBzVHlwZS5Ob1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgbm9kZSA9IGFkZE5vZGVUbyhlbGVtZW50LCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgbm9kZS5jbGFzc05hbWUgPSBnZXRDbGFzc2VzKHR5cGUsIG9wdGlvbnMuY3NzQ2xhc3Nlcy52YWx1ZSk7XG4gICAgICAgICAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoXCJkYXRhLXZhbHVlXCIsIFN0cmluZyh2YWx1ZSkpO1xuICAgICAgICAgICAgICAgIG5vZGUuc3R5bGVbb3B0aW9ucy5zdHlsZV0gPSBvZmZzZXQgKyBcIiVcIjtcbiAgICAgICAgICAgICAgICBub2RlLmlubmVySFRNTCA9IFN0cmluZyhmb3JtYXR0ZXIudG8odmFsdWUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBBcHBlbmQgYWxsIHBvaW50cy5cbiAgICAgICAgT2JqZWN0LmtleXMoc3ByZWFkKS5mb3JFYWNoKGZ1bmN0aW9uIChvZmZzZXQpIHtcbiAgICAgICAgICAgIGFkZFNwcmVhZChvZmZzZXQsIHNwcmVhZFtvZmZzZXRdWzBdLCBzcHJlYWRbb2Zmc2V0XVsxXSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVtb3ZlUGlwcygpIHtcbiAgICAgICAgaWYgKHNjb3BlX1BpcHMpIHtcbiAgICAgICAgICAgIHJlbW92ZUVsZW1lbnQoc2NvcGVfUGlwcyk7XG4gICAgICAgICAgICBzY29wZV9QaXBzID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBwaXBzKHBpcHMpIHtcbiAgICAgICAgLy8gRml4ICM2NjlcbiAgICAgICAgcmVtb3ZlUGlwcygpO1xuICAgICAgICB2YXIgc3ByZWFkID0gZ2VuZXJhdGVTcHJlYWQocGlwcyk7XG4gICAgICAgIHZhciBmaWx0ZXIgPSBwaXBzLmZpbHRlcjtcbiAgICAgICAgdmFyIGZvcm1hdCA9IHBpcHMuZm9ybWF0IHx8IHtcbiAgICAgICAgICAgIHRvOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gU3RyaW5nKE1hdGgucm91bmQodmFsdWUpKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIHNjb3BlX1BpcHMgPSBzY29wZV9UYXJnZXQuYXBwZW5kQ2hpbGQoYWRkTWFya2luZyhzcHJlYWQsIGZpbHRlciwgZm9ybWF0KSk7XG4gICAgICAgIHJldHVybiBzY29wZV9QaXBzO1xuICAgIH1cbiAgICAvLyBTaG9ydGhhbmQgZm9yIGJhc2UgZGltZW5zaW9ucy5cbiAgICBmdW5jdGlvbiBiYXNlU2l6ZSgpIHtcbiAgICAgICAgdmFyIHJlY3QgPSBzY29wZV9CYXNlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB2YXIgYWx0ID0gKFwib2Zmc2V0XCIgKyBbXCJXaWR0aFwiLCBcIkhlaWdodFwiXVtvcHRpb25zLm9ydF0pO1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5vcnQgPT09IDAgPyByZWN0LndpZHRoIHx8IHNjb3BlX0Jhc2VbYWx0XSA6IHJlY3QuaGVpZ2h0IHx8IHNjb3BlX0Jhc2VbYWx0XTtcbiAgICB9XG4gICAgLy8gSGFuZGxlciBmb3IgYXR0YWNoaW5nIGV2ZW50cyB0cm91Z2ggYSBwcm94eS5cbiAgICBmdW5jdGlvbiBhdHRhY2hFdmVudChldmVudHMsIGVsZW1lbnQsIGNhbGxiYWNrLCBkYXRhKSB7XG4gICAgICAgIC8vIFRoaXMgZnVuY3Rpb24gY2FuIGJlIHVzZWQgdG8gJ2ZpbHRlcicgZXZlbnRzIHRvIHRoZSBzbGlkZXIuXG4gICAgICAgIC8vIGVsZW1lbnQgaXMgYSBub2RlLCBub3QgYSBub2RlTGlzdFxuICAgICAgICB2YXIgbWV0aG9kID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgZSA9IGZpeEV2ZW50KGV2ZW50LCBkYXRhLnBhZ2VPZmZzZXQsIGRhdGEudGFyZ2V0IHx8IGVsZW1lbnQpO1xuICAgICAgICAgICAgLy8gZml4RXZlbnQgcmV0dXJucyBmYWxzZSBpZiB0aGlzIGV2ZW50IGhhcyBhIGRpZmZlcmVudCB0YXJnZXRcbiAgICAgICAgICAgIC8vIHdoZW4gaGFuZGxpbmcgKG11bHRpLSkgdG91Y2ggZXZlbnRzO1xuICAgICAgICAgICAgaWYgKCFlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZG9Ob3RSZWplY3QgaXMgcGFzc2VkIGJ5IGFsbCBlbmQgZXZlbnRzIHRvIG1ha2Ugc3VyZSByZWxlYXNlZCB0b3VjaGVzXG4gICAgICAgICAgICAvLyBhcmUgbm90IHJlamVjdGVkLCBsZWF2aW5nIHRoZSBzbGlkZXIgXCJzdHVja1wiIHRvIHRoZSBjdXJzb3I7XG4gICAgICAgICAgICBpZiAoaXNTbGlkZXJEaXNhYmxlZCgpICYmICFkYXRhLmRvTm90UmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gU3RvcCBpZiBhbiBhY3RpdmUgJ3RhcCcgdHJhbnNpdGlvbiBpcyB0YWtpbmcgcGxhY2UuXG4gICAgICAgICAgICBpZiAoaGFzQ2xhc3Moc2NvcGVfVGFyZ2V0LCBvcHRpb25zLmNzc0NsYXNzZXMudGFwKSAmJiAhZGF0YS5kb05vdFJlamVjdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIElnbm9yZSByaWdodCBvciBtaWRkbGUgY2xpY2tzIG9uIHN0YXJ0ICM0NTRcbiAgICAgICAgICAgIGlmIChldmVudHMgPT09IGFjdGlvbnMuc3RhcnQgJiYgZS5idXR0b25zICE9PSB1bmRlZmluZWQgJiYgZS5idXR0b25zID4gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIElnbm9yZSByaWdodCBvciBtaWRkbGUgY2xpY2tzIG9uIHN0YXJ0ICM0NTRcbiAgICAgICAgICAgIGlmIChkYXRhLmhvdmVyICYmIGUuYnV0dG9ucykge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vICdzdXBwb3J0c1Bhc3NpdmUnIGlzIG9ubHkgdHJ1ZSBpZiBhIGJyb3dzZXIgYWxzbyBzdXBwb3J0cyB0b3VjaC1hY3Rpb246IG5vbmUgaW4gQ1NTLlxuICAgICAgICAgICAgLy8gaU9TIHNhZmFyaSBkb2VzIG5vdCwgc28gaXQgZG9lc24ndCBnZXQgdG8gYmVuZWZpdCBmcm9tIHBhc3NpdmUgc2Nyb2xsaW5nLiBpT1MgZG9lcyBzdXBwb3J0XG4gICAgICAgICAgICAvLyB0b3VjaC1hY3Rpb246IG1hbmlwdWxhdGlvbiwgYnV0IHRoYXQgYWxsb3dzIHBhbm5pbmcsIHdoaWNoIGJyZWFrc1xuICAgICAgICAgICAgLy8gc2xpZGVycyBhZnRlciB6b29taW5nL29uIG5vbi1yZXNwb25zaXZlIHBhZ2VzLlxuICAgICAgICAgICAgLy8gU2VlOiBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTMzMTEyXG4gICAgICAgICAgICBpZiAoIXN1cHBvcnRzUGFzc2l2ZSkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGUuY2FsY1BvaW50ID0gZS5wb2ludHNbb3B0aW9ucy5vcnRdO1xuICAgICAgICAgICAgLy8gQ2FsbCB0aGUgZXZlbnQgaGFuZGxlciB3aXRoIHRoZSBldmVudCBbIGFuZCBhZGRpdGlvbmFsIGRhdGEgXS5cbiAgICAgICAgICAgIGNhbGxiYWNrKGUsIGRhdGEpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgbWV0aG9kcyA9IFtdO1xuICAgICAgICAvLyBCaW5kIGEgY2xvc3VyZSBvbiB0aGUgdGFyZ2V0IGZvciBldmVyeSBldmVudCB0eXBlLlxuICAgICAgICBldmVudHMuc3BsaXQoXCIgXCIpLmZvckVhY2goZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgbWV0aG9kLCBzdXBwb3J0c1Bhc3NpdmUgPyB7IHBhc3NpdmU6IHRydWUgfSA6IGZhbHNlKTtcbiAgICAgICAgICAgIG1ldGhvZHMucHVzaChbZXZlbnROYW1lLCBtZXRob2RdKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBtZXRob2RzO1xuICAgIH1cbiAgICAvLyBQcm92aWRlIGEgY2xlYW4gZXZlbnQgd2l0aCBzdGFuZGFyZGl6ZWQgb2Zmc2V0IHZhbHVlcy5cbiAgICBmdW5jdGlvbiBmaXhFdmVudChlLCBwYWdlT2Zmc2V0LCBldmVudFRhcmdldCkge1xuICAgICAgICAvLyBGaWx0ZXIgdGhlIGV2ZW50IHRvIHJlZ2lzdGVyIHRoZSB0eXBlLCB3aGljaCBjYW4gYmVcbiAgICAgICAgLy8gdG91Y2gsIG1vdXNlIG9yIHBvaW50ZXIuIE9mZnNldCBjaGFuZ2VzIG5lZWQgdG8gYmVcbiAgICAgICAgLy8gbWFkZSBvbiBhbiBldmVudCBzcGVjaWZpYyBiYXNpcy5cbiAgICAgICAgdmFyIHRvdWNoID0gZS50eXBlLmluZGV4T2YoXCJ0b3VjaFwiKSA9PT0gMDtcbiAgICAgICAgdmFyIG1vdXNlID0gZS50eXBlLmluZGV4T2YoXCJtb3VzZVwiKSA9PT0gMDtcbiAgICAgICAgdmFyIHBvaW50ZXIgPSBlLnR5cGUuaW5kZXhPZihcInBvaW50ZXJcIikgPT09IDA7XG4gICAgICAgIHZhciB4ID0gMDtcbiAgICAgICAgdmFyIHkgPSAwO1xuICAgICAgICAvLyBJRTEwIGltcGxlbWVudGVkIHBvaW50ZXIgZXZlbnRzIHdpdGggYSBwcmVmaXg7XG4gICAgICAgIGlmIChlLnR5cGUuaW5kZXhPZihcIk1TUG9pbnRlclwiKSA9PT0gMCkge1xuICAgICAgICAgICAgcG9pbnRlciA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRXJyb25lb3VzIGV2ZW50cyBzZWVtIHRvIGJlIHBhc3NlZCBpbiBvY2Nhc2lvbmFsbHkgb24gaU9TL2lQYWRPUyBhZnRlciB1c2VyIGZpbmlzaGVzIGludGVyYWN0aW5nIHdpdGhcbiAgICAgICAgLy8gdGhlIHNsaWRlci4gVGhleSBhcHBlYXIgdG8gYmUgb2YgdHlwZSBNb3VzZUV2ZW50LCB5ZXQgdGhleSBkb24ndCBoYXZlIHVzdWFsIHByb3BlcnRpZXMgc2V0LiBJZ25vcmVcbiAgICAgICAgLy8gZXZlbnRzIHRoYXQgaGF2ZSBubyB0b3VjaGVzIG9yIGJ1dHRvbnMgYXNzb2NpYXRlZCB3aXRoIHRoZW0uICgjMTA1NywgIzEwNzksICMxMDk1KVxuICAgICAgICBpZiAoZS50eXBlID09PSBcIm1vdXNlZG93blwiICYmICFlLmJ1dHRvbnMgJiYgIWUudG91Y2hlcykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRoZSBvbmx5IHRoaW5nIG9uZSBoYW5kbGUgc2hvdWxkIGJlIGNvbmNlcm5lZCBhYm91dCBpcyB0aGUgdG91Y2hlcyB0aGF0IG9yaWdpbmF0ZWQgb24gdG9wIG9mIGl0LlxuICAgICAgICBpZiAodG91Y2gpIHtcbiAgICAgICAgICAgIC8vIFJldHVybnMgdHJ1ZSBpZiBhIHRvdWNoIG9yaWdpbmF0ZWQgb24gdGhlIHRhcmdldC5cbiAgICAgICAgICAgIHZhciBpc1RvdWNoT25UYXJnZXQgPSBmdW5jdGlvbiAoY2hlY2tUb3VjaCkge1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSBjaGVja1RvdWNoLnRhcmdldDtcbiAgICAgICAgICAgICAgICByZXR1cm4gKHRhcmdldCA9PT0gZXZlbnRUYXJnZXQgfHxcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRUYXJnZXQuY29udGFpbnModGFyZ2V0KSB8fFxuICAgICAgICAgICAgICAgICAgICAoZS5jb21wb3NlZCAmJiBlLmNvbXBvc2VkUGF0aCgpLnNoaWZ0KCkgPT09IGV2ZW50VGFyZ2V0KSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy8gSW4gdGhlIGNhc2Ugb2YgdG91Y2hzdGFydCBldmVudHMsIHdlIG5lZWQgdG8gbWFrZSBzdXJlIHRoZXJlIGlzIHN0aWxsIG5vIG1vcmUgdGhhbiBvbmVcbiAgICAgICAgICAgIC8vIHRvdWNoIG9uIHRoZSB0YXJnZXQgc28gd2UgbG9vayBhbW9uZ3N0IGFsbCB0b3VjaGVzLlxuICAgICAgICAgICAgaWYgKGUudHlwZSA9PT0gXCJ0b3VjaHN0YXJ0XCIpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0VG91Y2hlcyA9IEFycmF5LnByb3RvdHlwZS5maWx0ZXIuY2FsbChlLnRvdWNoZXMsIGlzVG91Y2hPblRhcmdldCk7XG4gICAgICAgICAgICAgICAgLy8gRG8gbm90IHN1cHBvcnQgbW9yZSB0aGFuIG9uZSB0b3VjaCBwZXIgaGFuZGxlLlxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXRUb3VjaGVzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB4ID0gdGFyZ2V0VG91Y2hlc1swXS5wYWdlWDtcbiAgICAgICAgICAgICAgICB5ID0gdGFyZ2V0VG91Y2hlc1swXS5wYWdlWTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIEluIHRoZSBvdGhlciBjYXNlcywgZmluZCBvbiBjaGFuZ2VkVG91Y2hlcyBpcyBlbm91Z2guXG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldFRvdWNoID0gQXJyYXkucHJvdG90eXBlLmZpbmQuY2FsbChlLmNoYW5nZWRUb3VjaGVzLCBpc1RvdWNoT25UYXJnZXQpO1xuICAgICAgICAgICAgICAgIC8vIENhbmNlbCBpZiB0aGUgdGFyZ2V0IHRvdWNoIGhhcyBub3QgbW92ZWQuXG4gICAgICAgICAgICAgICAgaWYgKCF0YXJnZXRUb3VjaCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHggPSB0YXJnZXRUb3VjaC5wYWdlWDtcbiAgICAgICAgICAgICAgICB5ID0gdGFyZ2V0VG91Y2gucGFnZVk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcGFnZU9mZnNldCA9IHBhZ2VPZmZzZXQgfHwgZ2V0UGFnZU9mZnNldChzY29wZV9Eb2N1bWVudCk7XG4gICAgICAgIGlmIChtb3VzZSB8fCBwb2ludGVyKSB7XG4gICAgICAgICAgICB4ID0gZS5jbGllbnRYICsgcGFnZU9mZnNldC54O1xuICAgICAgICAgICAgeSA9IGUuY2xpZW50WSArIHBhZ2VPZmZzZXQueTtcbiAgICAgICAgfVxuICAgICAgICBlLnBhZ2VPZmZzZXQgPSBwYWdlT2Zmc2V0O1xuICAgICAgICBlLnBvaW50cyA9IFt4LCB5XTtcbiAgICAgICAgZS5jdXJzb3IgPSBtb3VzZSB8fCBwb2ludGVyOyAvLyBGaXggIzQzNVxuICAgICAgICByZXR1cm4gZTtcbiAgICB9XG4gICAgLy8gVHJhbnNsYXRlIGEgY29vcmRpbmF0ZSBpbiB0aGUgZG9jdW1lbnQgdG8gYSBwZXJjZW50YWdlIG9uIHRoZSBzbGlkZXJcbiAgICBmdW5jdGlvbiBjYWxjUG9pbnRUb1BlcmNlbnRhZ2UoY2FsY1BvaW50KSB7XG4gICAgICAgIHZhciBsb2NhdGlvbiA9IGNhbGNQb2ludCAtIG9mZnNldChzY29wZV9CYXNlLCBvcHRpb25zLm9ydCk7XG4gICAgICAgIHZhciBwcm9wb3NhbCA9IChsb2NhdGlvbiAqIDEwMCkgLyBiYXNlU2l6ZSgpO1xuICAgICAgICAvLyBDbGFtcCBwcm9wb3NhbCBiZXR3ZWVuIDAlIGFuZCAxMDAlXG4gICAgICAgIC8vIE91dC1vZi1ib3VuZCBjb29yZGluYXRlcyBtYXkgb2NjdXIgd2hlbiAubm9VaS1iYXNlIHBzZXVkby1lbGVtZW50c1xuICAgICAgICAvLyBhcmUgdXNlZCAoZS5nLiBjb250YWluZWQgaGFuZGxlcyBmZWF0dXJlKVxuICAgICAgICBwcm9wb3NhbCA9IGxpbWl0KHByb3Bvc2FsKTtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMuZGlyID8gMTAwIC0gcHJvcG9zYWwgOiBwcm9wb3NhbDtcbiAgICB9XG4gICAgLy8gRmluZCBoYW5kbGUgY2xvc2VzdCB0byBhIGNlcnRhaW4gcGVyY2VudGFnZSBvbiB0aGUgc2xpZGVyXG4gICAgZnVuY3Rpb24gZ2V0Q2xvc2VzdEhhbmRsZShjbGlja2VkUG9zaXRpb24pIHtcbiAgICAgICAgdmFyIHNtYWxsZXN0RGlmZmVyZW5jZSA9IDEwMDtcbiAgICAgICAgdmFyIGhhbmRsZU51bWJlciA9IGZhbHNlO1xuICAgICAgICBzY29wZV9IYW5kbGVzLmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZSwgaW5kZXgpIHtcbiAgICAgICAgICAgIC8vIERpc2FibGVkIGhhbmRsZXMgYXJlIGlnbm9yZWRcbiAgICAgICAgICAgIGlmIChpc0hhbmRsZURpc2FibGVkKGluZGV4KSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBoYW5kbGVQb3NpdGlvbiA9IHNjb3BlX0xvY2F0aW9uc1tpbmRleF07XG4gICAgICAgICAgICB2YXIgZGlmZmVyZW5jZVdpdGhUaGlzSGFuZGxlID0gTWF0aC5hYnMoaGFuZGxlUG9zaXRpb24gLSBjbGlja2VkUG9zaXRpb24pO1xuICAgICAgICAgICAgLy8gSW5pdGlhbCBzdGF0ZVxuICAgICAgICAgICAgdmFyIGNsaWNrQXRFZGdlID0gZGlmZmVyZW5jZVdpdGhUaGlzSGFuZGxlID09PSAxMDAgJiYgc21hbGxlc3REaWZmZXJlbmNlID09PSAxMDA7XG4gICAgICAgICAgICAvLyBEaWZmZXJlbmNlIHdpdGggdGhpcyBoYW5kbGUgaXMgc21hbGxlciB0aGFuIHRoZSBwcmV2aW91c2x5IGNoZWNrZWQgaGFuZGxlXG4gICAgICAgICAgICB2YXIgaXNDbG9zZXIgPSBkaWZmZXJlbmNlV2l0aFRoaXNIYW5kbGUgPCBzbWFsbGVzdERpZmZlcmVuY2U7XG4gICAgICAgICAgICB2YXIgaXNDbG9zZXJBZnRlciA9IGRpZmZlcmVuY2VXaXRoVGhpc0hhbmRsZSA8PSBzbWFsbGVzdERpZmZlcmVuY2UgJiYgY2xpY2tlZFBvc2l0aW9uID4gaGFuZGxlUG9zaXRpb247XG4gICAgICAgICAgICBpZiAoaXNDbG9zZXIgfHwgaXNDbG9zZXJBZnRlciB8fCBjbGlja0F0RWRnZSkge1xuICAgICAgICAgICAgICAgIGhhbmRsZU51bWJlciA9IGluZGV4O1xuICAgICAgICAgICAgICAgIHNtYWxsZXN0RGlmZmVyZW5jZSA9IGRpZmZlcmVuY2VXaXRoVGhpc0hhbmRsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBoYW5kbGVOdW1iZXI7XG4gICAgfVxuICAgIC8vIEZpcmUgJ2VuZCcgd2hlbiBhIG1vdXNlIG9yIHBlbiBsZWF2ZXMgdGhlIGRvY3VtZW50LlxuICAgIGZ1bmN0aW9uIGRvY3VtZW50TGVhdmUoZXZlbnQsIGRhdGEpIHtcbiAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT09IFwibW91c2VvdXRcIiAmJlxuICAgICAgICAgICAgZXZlbnQudGFyZ2V0Lm5vZGVOYW1lID09PSBcIkhUTUxcIiAmJlxuICAgICAgICAgICAgZXZlbnQucmVsYXRlZFRhcmdldCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgZXZlbnRFbmQoZXZlbnQsIGRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEhhbmRsZSBtb3ZlbWVudCBvbiBkb2N1bWVudCBmb3IgaGFuZGxlIGFuZCByYW5nZSBkcmFnLlxuICAgIGZ1bmN0aW9uIGV2ZW50TW92ZShldmVudCwgZGF0YSkge1xuICAgICAgICAvLyBGaXggIzQ5OFxuICAgICAgICAvLyBDaGVjayB2YWx1ZSBvZiAuYnV0dG9ucyBpbiAnc3RhcnQnIHRvIHdvcmsgYXJvdW5kIGEgYnVnIGluIElFMTAgbW9iaWxlIChkYXRhLmJ1dHRvbnNQcm9wZXJ0eSkuXG4gICAgICAgIC8vIGh0dHBzOi8vY29ubmVjdC5taWNyb3NvZnQuY29tL0lFL2ZlZWRiYWNrL2RldGFpbHMvOTI3MDA1L21vYmlsZS1pZTEwLXdpbmRvd3MtcGhvbmUtYnV0dG9ucy1wcm9wZXJ0eS1vZi1wb2ludGVybW92ZS1ldmVudC1hbHdheXMtemVyb1xuICAgICAgICAvLyBJRTkgaGFzIC5idXR0b25zIGFuZCAud2hpY2ggemVybyBvbiBtb3VzZW1vdmUuXG4gICAgICAgIC8vIEZpcmVmb3ggYnJlYWtzIHRoZSBzcGVjIE1ETiBkZWZpbmVzLlxuICAgICAgICBpZiAobmF2aWdhdG9yLmFwcFZlcnNpb24uaW5kZXhPZihcIk1TSUUgOVwiKSA9PT0gLTEgJiYgZXZlbnQuYnV0dG9ucyA9PT0gMCAmJiBkYXRhLmJ1dHRvbnNQcm9wZXJ0eSAhPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGV2ZW50RW5kKGV2ZW50LCBkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBDaGVjayBpZiB3ZSBhcmUgbW92aW5nIHVwIG9yIGRvd25cbiAgICAgICAgdmFyIG1vdmVtZW50ID0gKG9wdGlvbnMuZGlyID8gLTEgOiAxKSAqIChldmVudC5jYWxjUG9pbnQgLSBkYXRhLnN0YXJ0Q2FsY1BvaW50KTtcbiAgICAgICAgLy8gQ29udmVydCB0aGUgbW92ZW1lbnQgaW50byBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHNsaWRlciB3aWR0aC9oZWlnaHRcbiAgICAgICAgdmFyIHByb3Bvc2FsID0gKG1vdmVtZW50ICogMTAwKSAvIGRhdGEuYmFzZVNpemU7XG4gICAgICAgIG1vdmVIYW5kbGVzKG1vdmVtZW50ID4gMCwgcHJvcG9zYWwsIGRhdGEubG9jYXRpb25zLCBkYXRhLmhhbmRsZU51bWJlcnMsIGRhdGEuY29ubmVjdCk7XG4gICAgfVxuICAgIC8vIFVuYmluZCBtb3ZlIGV2ZW50cyBvbiBkb2N1bWVudCwgY2FsbCBjYWxsYmFja3MuXG4gICAgZnVuY3Rpb24gZXZlbnRFbmQoZXZlbnQsIGRhdGEpIHtcbiAgICAgICAgLy8gVGhlIGhhbmRsZSBpcyBubyBsb25nZXIgYWN0aXZlLCBzbyByZW1vdmUgdGhlIGNsYXNzLlxuICAgICAgICBpZiAoZGF0YS5oYW5kbGUpIHtcbiAgICAgICAgICAgIHJlbW92ZUNsYXNzKGRhdGEuaGFuZGxlLCBvcHRpb25zLmNzc0NsYXNzZXMuYWN0aXZlKTtcbiAgICAgICAgICAgIHNjb3BlX0FjdGl2ZUhhbmRsZXNDb3VudCAtPSAxO1xuICAgICAgICB9XG4gICAgICAgIC8vIFVuYmluZCB0aGUgbW92ZSBhbmQgZW5kIGV2ZW50cywgd2hpY2ggYXJlIGFkZGVkIG9uICdzdGFydCcuXG4gICAgICAgIGRhdGEubGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgICAgIHNjb3BlX0RvY3VtZW50RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGNbMF0sIGNbMV0pO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHNjb3BlX0FjdGl2ZUhhbmRsZXNDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIGRyYWdnaW5nIGNsYXNzLlxuICAgICAgICAgICAgcmVtb3ZlQ2xhc3Moc2NvcGVfVGFyZ2V0LCBvcHRpb25zLmNzc0NsYXNzZXMuZHJhZyk7XG4gICAgICAgICAgICBzZXRaaW5kZXgoKTtcbiAgICAgICAgICAgIC8vIFJlbW92ZSBjdXJzb3Igc3R5bGVzIGFuZCB0ZXh0LXNlbGVjdGlvbiBldmVudHMgYm91bmQgdG8gdGhlIGJvZHkuXG4gICAgICAgICAgICBpZiAoZXZlbnQuY3Vyc29yKSB7XG4gICAgICAgICAgICAgICAgc2NvcGVfQm9keS5zdHlsZS5jdXJzb3IgPSBcIlwiO1xuICAgICAgICAgICAgICAgIHNjb3BlX0JvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNlbGVjdHN0YXJ0XCIsIHByZXZlbnREZWZhdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5ldmVudHMuc21vb3RoU3RlcHMpIHtcbiAgICAgICAgICAgIGRhdGEuaGFuZGxlTnVtYmVycy5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGVOdW1iZXIpIHtcbiAgICAgICAgICAgICAgICBzZXRIYW5kbGUoaGFuZGxlTnVtYmVyLCBzY29wZV9Mb2NhdGlvbnNbaGFuZGxlTnVtYmVyXSwgdHJ1ZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZGF0YS5oYW5kbGVOdW1iZXJzLmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZU51bWJlcikge1xuICAgICAgICAgICAgICAgIGZpcmVFdmVudChcInVwZGF0ZVwiLCBoYW5kbGVOdW1iZXIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZGF0YS5oYW5kbGVOdW1iZXJzLmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZU51bWJlcikge1xuICAgICAgICAgICAgZmlyZUV2ZW50KFwiY2hhbmdlXCIsIGhhbmRsZU51bWJlcik7XG4gICAgICAgICAgICBmaXJlRXZlbnQoXCJzZXRcIiwgaGFuZGxlTnVtYmVyKTtcbiAgICAgICAgICAgIGZpcmVFdmVudChcImVuZFwiLCBoYW5kbGVOdW1iZXIpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8gQmluZCBtb3ZlIGV2ZW50cyBvbiBkb2N1bWVudC5cbiAgICBmdW5jdGlvbiBldmVudFN0YXJ0KGV2ZW50LCBkYXRhKSB7XG4gICAgICAgIC8vIElnbm9yZSBldmVudCBpZiBhbnkgaGFuZGxlIGlzIGRpc2FibGVkXG4gICAgICAgIGlmIChkYXRhLmhhbmRsZU51bWJlcnMuc29tZShpc0hhbmRsZURpc2FibGVkKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBoYW5kbGU7XG4gICAgICAgIGlmIChkYXRhLmhhbmRsZU51bWJlcnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICB2YXIgaGFuZGxlT3JpZ2luID0gc2NvcGVfSGFuZGxlc1tkYXRhLmhhbmRsZU51bWJlcnNbMF1dO1xuICAgICAgICAgICAgaGFuZGxlID0gaGFuZGxlT3JpZ2luLmNoaWxkcmVuWzBdO1xuICAgICAgICAgICAgc2NvcGVfQWN0aXZlSGFuZGxlc0NvdW50ICs9IDE7XG4gICAgICAgICAgICAvLyBNYXJrIHRoZSBoYW5kbGUgYXMgJ2FjdGl2ZScgc28gaXQgY2FuIGJlIHN0eWxlZC5cbiAgICAgICAgICAgIGFkZENsYXNzKGhhbmRsZSwgb3B0aW9ucy5jc3NDbGFzc2VzLmFjdGl2ZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQSBkcmFnIHNob3VsZCBuZXZlciBwcm9wYWdhdGUgdXAgdG8gdGhlICd0YXAnIGV2ZW50LlxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgLy8gUmVjb3JkIHRoZSBldmVudCBsaXN0ZW5lcnMuXG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgLy8gQXR0YWNoIHRoZSBtb3ZlIGFuZCBlbmQgZXZlbnRzLlxuICAgICAgICB2YXIgbW92ZUV2ZW50ID0gYXR0YWNoRXZlbnQoYWN0aW9ucy5tb3ZlLCBzY29wZV9Eb2N1bWVudEVsZW1lbnQsIGV2ZW50TW92ZSwge1xuICAgICAgICAgICAgLy8gVGhlIGV2ZW50IHRhcmdldCBoYXMgY2hhbmdlZCBzbyB3ZSBuZWVkIHRvIHByb3BhZ2F0ZSB0aGUgb3JpZ2luYWwgb25lIHNvIHRoYXQgd2Uga2VlcFxuICAgICAgICAgICAgLy8gcmVseWluZyBvbiBpdCB0byBleHRyYWN0IHRhcmdldCB0b3VjaGVzLlxuICAgICAgICAgICAgdGFyZ2V0OiBldmVudC50YXJnZXQsXG4gICAgICAgICAgICBoYW5kbGU6IGhhbmRsZSxcbiAgICAgICAgICAgIGNvbm5lY3Q6IGRhdGEuY29ubmVjdCxcbiAgICAgICAgICAgIGxpc3RlbmVyczogbGlzdGVuZXJzLFxuICAgICAgICAgICAgc3RhcnRDYWxjUG9pbnQ6IGV2ZW50LmNhbGNQb2ludCxcbiAgICAgICAgICAgIGJhc2VTaXplOiBiYXNlU2l6ZSgpLFxuICAgICAgICAgICAgcGFnZU9mZnNldDogZXZlbnQucGFnZU9mZnNldCxcbiAgICAgICAgICAgIGhhbmRsZU51bWJlcnM6IGRhdGEuaGFuZGxlTnVtYmVycyxcbiAgICAgICAgICAgIGJ1dHRvbnNQcm9wZXJ0eTogZXZlbnQuYnV0dG9ucyxcbiAgICAgICAgICAgIGxvY2F0aW9uczogc2NvcGVfTG9jYXRpb25zLnNsaWNlKCksXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgZW5kRXZlbnQgPSBhdHRhY2hFdmVudChhY3Rpb25zLmVuZCwgc2NvcGVfRG9jdW1lbnRFbGVtZW50LCBldmVudEVuZCwge1xuICAgICAgICAgICAgdGFyZ2V0OiBldmVudC50YXJnZXQsXG4gICAgICAgICAgICBoYW5kbGU6IGhhbmRsZSxcbiAgICAgICAgICAgIGxpc3RlbmVyczogbGlzdGVuZXJzLFxuICAgICAgICAgICAgZG9Ob3RSZWplY3Q6IHRydWUsXG4gICAgICAgICAgICBoYW5kbGVOdW1iZXJzOiBkYXRhLmhhbmRsZU51bWJlcnMsXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgb3V0RXZlbnQgPSBhdHRhY2hFdmVudChcIm1vdXNlb3V0XCIsIHNjb3BlX0RvY3VtZW50RWxlbWVudCwgZG9jdW1lbnRMZWF2ZSwge1xuICAgICAgICAgICAgdGFyZ2V0OiBldmVudC50YXJnZXQsXG4gICAgICAgICAgICBoYW5kbGU6IGhhbmRsZSxcbiAgICAgICAgICAgIGxpc3RlbmVyczogbGlzdGVuZXJzLFxuICAgICAgICAgICAgZG9Ob3RSZWplY3Q6IHRydWUsXG4gICAgICAgICAgICBoYW5kbGVOdW1iZXJzOiBkYXRhLmhhbmRsZU51bWJlcnMsXG4gICAgICAgIH0pO1xuICAgICAgICAvLyBXZSB3YW50IHRvIG1ha2Ugc3VyZSB3ZSBwdXNoZWQgdGhlIGxpc3RlbmVycyBpbiB0aGUgbGlzdGVuZXIgbGlzdCByYXRoZXIgdGhhbiBjcmVhdGluZ1xuICAgICAgICAvLyBhIG5ldyBvbmUgYXMgaXQgaGFzIGFscmVhZHkgYmVlbiBwYXNzZWQgdG8gdGhlIGV2ZW50IGhhbmRsZXJzLlxuICAgICAgICBsaXN0ZW5lcnMucHVzaC5hcHBseShsaXN0ZW5lcnMsIG1vdmVFdmVudC5jb25jYXQoZW5kRXZlbnQsIG91dEV2ZW50KSk7XG4gICAgICAgIC8vIFRleHQgc2VsZWN0aW9uIGlzbid0IGFuIGlzc3VlIG9uIHRvdWNoIGRldmljZXMsXG4gICAgICAgIC8vIHNvIGFkZGluZyBjdXJzb3Igc3R5bGVzIGNhbiBiZSBza2lwcGVkLlxuICAgICAgICBpZiAoZXZlbnQuY3Vyc29yKSB7XG4gICAgICAgICAgICAvLyBQcmV2ZW50IHRoZSAnSScgY3Vyc29yIGFuZCBleHRlbmQgdGhlIHJhbmdlLWRyYWcgY3Vyc29yLlxuICAgICAgICAgICAgc2NvcGVfQm9keS5zdHlsZS5jdXJzb3IgPSBnZXRDb21wdXRlZFN0eWxlKGV2ZW50LnRhcmdldCkuY3Vyc29yO1xuICAgICAgICAgICAgLy8gTWFyayB0aGUgdGFyZ2V0IHdpdGggYSBkcmFnZ2luZyBzdGF0ZS5cbiAgICAgICAgICAgIGlmIChzY29wZV9IYW5kbGVzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICBhZGRDbGFzcyhzY29wZV9UYXJnZXQsIG9wdGlvbnMuY3NzQ2xhc3Nlcy5kcmFnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFByZXZlbnQgdGV4dCBzZWxlY3Rpb24gd2hlbiBkcmFnZ2luZyB0aGUgaGFuZGxlcy5cbiAgICAgICAgICAgIC8vIEluIG5vVWlTbGlkZXIgPD0gOS4yLjAsIHRoaXMgd2FzIGhhbmRsZWQgYnkgY2FsbGluZyBwcmV2ZW50RGVmYXVsdCBvbiBtb3VzZS90b3VjaCBzdGFydC9tb3ZlLFxuICAgICAgICAgICAgLy8gd2hpY2ggaXMgc2Nyb2xsIGJsb2NraW5nLiBUaGUgc2VsZWN0c3RhcnQgZXZlbnQgaXMgc3VwcG9ydGVkIGJ5IEZpcmVGb3ggc3RhcnRpbmcgZnJvbSB2ZXJzaW9uIDUyLFxuICAgICAgICAgICAgLy8gbWVhbmluZyB0aGUgb25seSBob2xkb3V0IGlzIGlPUyBTYWZhcmkuIFRoaXMgZG9lc24ndCBtYXR0ZXI6IHRleHQgc2VsZWN0aW9uIGlzbid0IHRyaWdnZXJlZCB0aGVyZS5cbiAgICAgICAgICAgIC8vIFRoZSAnY3Vyc29yJyBmbGFnIGlzIGZhbHNlLlxuICAgICAgICAgICAgLy8gU2VlOiBodHRwOi8vY2FuaXVzZS5jb20vI3NlYXJjaD1zZWxlY3RzdGFydFxuICAgICAgICAgICAgc2NvcGVfQm9keS5hZGRFdmVudExpc3RlbmVyKFwic2VsZWN0c3RhcnRcIiwgcHJldmVudERlZmF1bHQsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICBkYXRhLmhhbmRsZU51bWJlcnMuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlTnVtYmVyKSB7XG4gICAgICAgICAgICBmaXJlRXZlbnQoXCJzdGFydFwiLCBoYW5kbGVOdW1iZXIpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8gTW92ZSBjbG9zZXN0IGhhbmRsZSB0byB0YXBwZWQgbG9jYXRpb24uXG4gICAgZnVuY3Rpb24gZXZlbnRUYXAoZXZlbnQpIHtcbiAgICAgICAgLy8gVGhlIHRhcCBldmVudCBzaG91bGRuJ3QgcHJvcGFnYXRlIHVwXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB2YXIgcHJvcG9zYWwgPSBjYWxjUG9pbnRUb1BlcmNlbnRhZ2UoZXZlbnQuY2FsY1BvaW50KTtcbiAgICAgICAgdmFyIGhhbmRsZU51bWJlciA9IGdldENsb3Nlc3RIYW5kbGUocHJvcG9zYWwpO1xuICAgICAgICAvLyBUYWNrbGUgdGhlIGNhc2UgdGhhdCBhbGwgaGFuZGxlcyBhcmUgJ2Rpc2FibGVkJy5cbiAgICAgICAgaWYgKGhhbmRsZU51bWJlciA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBGbGFnIHRoZSBzbGlkZXIgYXMgaXQgaXMgbm93IGluIGEgdHJhbnNpdGlvbmFsIHN0YXRlLlxuICAgICAgICAvLyBUcmFuc2l0aW9uIHRha2VzIGEgY29uZmlndXJhYmxlIGFtb3VudCBvZiBtcyAoZGVmYXVsdCAzMDApLiBSZS1lbmFibGUgdGhlIHNsaWRlciBhZnRlciB0aGF0LlxuICAgICAgICBpZiAoIW9wdGlvbnMuZXZlbnRzLnNuYXApIHtcbiAgICAgICAgICAgIGFkZENsYXNzRm9yKHNjb3BlX1RhcmdldCwgb3B0aW9ucy5jc3NDbGFzc2VzLnRhcCwgb3B0aW9ucy5hbmltYXRpb25EdXJhdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgc2V0SGFuZGxlKGhhbmRsZU51bWJlciwgcHJvcG9zYWwsIHRydWUsIHRydWUpO1xuICAgICAgICBzZXRaaW5kZXgoKTtcbiAgICAgICAgZmlyZUV2ZW50KFwic2xpZGVcIiwgaGFuZGxlTnVtYmVyLCB0cnVlKTtcbiAgICAgICAgZmlyZUV2ZW50KFwidXBkYXRlXCIsIGhhbmRsZU51bWJlciwgdHJ1ZSk7XG4gICAgICAgIGlmICghb3B0aW9ucy5ldmVudHMuc25hcCkge1xuICAgICAgICAgICAgZmlyZUV2ZW50KFwiY2hhbmdlXCIsIGhhbmRsZU51bWJlciwgdHJ1ZSk7XG4gICAgICAgICAgICBmaXJlRXZlbnQoXCJzZXRcIiwgaGFuZGxlTnVtYmVyLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGV2ZW50U3RhcnQoZXZlbnQsIHsgaGFuZGxlTnVtYmVyczogW2hhbmRsZU51bWJlcl0gfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gRmlyZXMgYSAnaG92ZXInIGV2ZW50IGZvciBhIGhvdmVyZWQgbW91c2UvcGVuIHBvc2l0aW9uLlxuICAgIGZ1bmN0aW9uIGV2ZW50SG92ZXIoZXZlbnQpIHtcbiAgICAgICAgdmFyIHByb3Bvc2FsID0gY2FsY1BvaW50VG9QZXJjZW50YWdlKGV2ZW50LmNhbGNQb2ludCk7XG4gICAgICAgIHZhciB0byA9IHNjb3BlX1NwZWN0cnVtLmdldFN0ZXAocHJvcG9zYWwpO1xuICAgICAgICB2YXIgdmFsdWUgPSBzY29wZV9TcGVjdHJ1bS5mcm9tU3RlcHBpbmcodG8pO1xuICAgICAgICBPYmplY3Qua2V5cyhzY29wZV9FdmVudHMpLmZvckVhY2goZnVuY3Rpb24gKHRhcmdldEV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoXCJob3ZlclwiID09PSB0YXJnZXRFdmVudC5zcGxpdChcIi5cIilbMF0pIHtcbiAgICAgICAgICAgICAgICBzY29wZV9FdmVudHNbdGFyZ2V0RXZlbnRdLmZvckVhY2goZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoc2NvcGVfU2VsZiwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8gSGFuZGxlcyBrZXlkb3duIG9uIGZvY3VzZWQgaGFuZGxlc1xuICAgIC8vIERvbid0IG1vdmUgdGhlIGRvY3VtZW50IHdoZW4gcHJlc3NpbmcgYXJyb3cga2V5cyBvbiBmb2N1c2VkIGhhbmRsZXNcbiAgICBmdW5jdGlvbiBldmVudEtleWRvd24oZXZlbnQsIGhhbmRsZU51bWJlcikge1xuICAgICAgICBpZiAoaXNTbGlkZXJEaXNhYmxlZCgpIHx8IGlzSGFuZGxlRGlzYWJsZWQoaGFuZGxlTnVtYmVyKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBob3Jpem9udGFsS2V5cyA9IFtcIkxlZnRcIiwgXCJSaWdodFwiXTtcbiAgICAgICAgdmFyIHZlcnRpY2FsS2V5cyA9IFtcIkRvd25cIiwgXCJVcFwiXTtcbiAgICAgICAgdmFyIGxhcmdlU3RlcEtleXMgPSBbXCJQYWdlRG93blwiLCBcIlBhZ2VVcFwiXTtcbiAgICAgICAgdmFyIGVkZ2VLZXlzID0gW1wiSG9tZVwiLCBcIkVuZFwiXTtcbiAgICAgICAgaWYgKG9wdGlvbnMuZGlyICYmICFvcHRpb25zLm9ydCkge1xuICAgICAgICAgICAgLy8gT24gYW4gcmlnaHQtdG8tbGVmdCBzbGlkZXIsIHRoZSBsZWZ0IGFuZCByaWdodCBrZXlzIGFjdCBpbnZlcnRlZFxuICAgICAgICAgICAgaG9yaXpvbnRhbEtleXMucmV2ZXJzZSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG9wdGlvbnMub3J0ICYmICFvcHRpb25zLmRpcikge1xuICAgICAgICAgICAgLy8gT24gYSB0b3AtdG8tYm90dG9tIHNsaWRlciwgdGhlIHVwIGFuZCBkb3duIGtleXMgYWN0IGludmVydGVkXG4gICAgICAgICAgICB2ZXJ0aWNhbEtleXMucmV2ZXJzZSgpO1xuICAgICAgICAgICAgbGFyZ2VTdGVwS2V5cy5yZXZlcnNlKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gU3RyaXAgXCJBcnJvd1wiIGZvciBJRSBjb21wYXRpYmlsaXR5LiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvS2V5Ym9hcmRFdmVudC9rZXlcbiAgICAgICAgdmFyIGtleSA9IGV2ZW50LmtleS5yZXBsYWNlKFwiQXJyb3dcIiwgXCJcIik7XG4gICAgICAgIHZhciBpc0xhcmdlRG93biA9IGtleSA9PT0gbGFyZ2VTdGVwS2V5c1swXTtcbiAgICAgICAgdmFyIGlzTGFyZ2VVcCA9IGtleSA9PT0gbGFyZ2VTdGVwS2V5c1sxXTtcbiAgICAgICAgdmFyIGlzRG93biA9IGtleSA9PT0gdmVydGljYWxLZXlzWzBdIHx8IGtleSA9PT0gaG9yaXpvbnRhbEtleXNbMF0gfHwgaXNMYXJnZURvd247XG4gICAgICAgIHZhciBpc1VwID0ga2V5ID09PSB2ZXJ0aWNhbEtleXNbMV0gfHwga2V5ID09PSBob3Jpem9udGFsS2V5c1sxXSB8fCBpc0xhcmdlVXA7XG4gICAgICAgIHZhciBpc01pbiA9IGtleSA9PT0gZWRnZUtleXNbMF07XG4gICAgICAgIHZhciBpc01heCA9IGtleSA9PT0gZWRnZUtleXNbMV07XG4gICAgICAgIGlmICghaXNEb3duICYmICFpc1VwICYmICFpc01pbiAmJiAhaXNNYXgpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciB0bztcbiAgICAgICAgaWYgKGlzVXAgfHwgaXNEb3duKSB7XG4gICAgICAgICAgICB2YXIgZGlyZWN0aW9uID0gaXNEb3duID8gMCA6IDE7XG4gICAgICAgICAgICB2YXIgc3RlcHMgPSBnZXROZXh0U3RlcHNGb3JIYW5kbGUoaGFuZGxlTnVtYmVyKTtcbiAgICAgICAgICAgIHZhciBzdGVwID0gc3RlcHNbZGlyZWN0aW9uXTtcbiAgICAgICAgICAgIC8vIEF0IHRoZSBlZGdlIG9mIGEgc2xpZGVyLCBkbyBub3RoaW5nXG4gICAgICAgICAgICBpZiAoc3RlcCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIE5vIHN0ZXAgc2V0LCB1c2UgdGhlIGRlZmF1bHQgb2YgMTAlIG9mIHRoZSBzdWItcmFuZ2VcbiAgICAgICAgICAgIGlmIChzdGVwID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHN0ZXAgPSBzY29wZV9TcGVjdHJ1bS5nZXREZWZhdWx0U3RlcChzY29wZV9Mb2NhdGlvbnNbaGFuZGxlTnVtYmVyXSwgaXNEb3duLCBvcHRpb25zLmtleWJvYXJkRGVmYXVsdFN0ZXApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzTGFyZ2VVcCB8fCBpc0xhcmdlRG93bikge1xuICAgICAgICAgICAgICAgIHN0ZXAgKj0gb3B0aW9ucy5rZXlib2FyZFBhZ2VNdWx0aXBsaWVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc3RlcCAqPSBvcHRpb25zLmtleWJvYXJkTXVsdGlwbGllcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFN0ZXAgb3ZlciB6ZXJvLWxlbmd0aCByYW5nZXMgKCM5NDgpO1xuICAgICAgICAgICAgc3RlcCA9IE1hdGgubWF4KHN0ZXAsIDAuMDAwMDAwMSk7XG4gICAgICAgICAgICAvLyBEZWNyZW1lbnQgZm9yIGRvd24gc3RlcHNcbiAgICAgICAgICAgIHN0ZXAgPSAoaXNEb3duID8gLTEgOiAxKSAqIHN0ZXA7XG4gICAgICAgICAgICB0byA9IHNjb3BlX1ZhbHVlc1toYW5kbGVOdW1iZXJdICsgc3RlcDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpc01heCkge1xuICAgICAgICAgICAgLy8gRW5kIGtleVxuICAgICAgICAgICAgdG8gPSBvcHRpb25zLnNwZWN0cnVtLnhWYWxbb3B0aW9ucy5zcGVjdHJ1bS54VmFsLmxlbmd0aCAtIDFdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gSG9tZSBrZXlcbiAgICAgICAgICAgIHRvID0gb3B0aW9ucy5zcGVjdHJ1bS54VmFsWzBdO1xuICAgICAgICB9XG4gICAgICAgIHNldEhhbmRsZShoYW5kbGVOdW1iZXIsIHNjb3BlX1NwZWN0cnVtLnRvU3RlcHBpbmcodG8pLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgZmlyZUV2ZW50KFwic2xpZGVcIiwgaGFuZGxlTnVtYmVyKTtcbiAgICAgICAgZmlyZUV2ZW50KFwidXBkYXRlXCIsIGhhbmRsZU51bWJlcik7XG4gICAgICAgIGZpcmVFdmVudChcImNoYW5nZVwiLCBoYW5kbGVOdW1iZXIpO1xuICAgICAgICBmaXJlRXZlbnQoXCJzZXRcIiwgaGFuZGxlTnVtYmVyKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBBdHRhY2ggZXZlbnRzIHRvIHNldmVyYWwgc2xpZGVyIHBhcnRzLlxuICAgIGZ1bmN0aW9uIGJpbmRTbGlkZXJFdmVudHMoYmVoYXZpb3VyKSB7XG4gICAgICAgIC8vIEF0dGFjaCB0aGUgc3RhbmRhcmQgZHJhZyBldmVudCB0byB0aGUgaGFuZGxlcy5cbiAgICAgICAgaWYgKCFiZWhhdmlvdXIuZml4ZWQpIHtcbiAgICAgICAgICAgIHNjb3BlX0hhbmRsZXMuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlLCBpbmRleCkge1xuICAgICAgICAgICAgICAgIC8vIFRoZXNlIGV2ZW50cyBhcmUgb25seSBib3VuZCB0byB0aGUgdmlzdWFsIGhhbmRsZVxuICAgICAgICAgICAgICAgIC8vIGVsZW1lbnQsIG5vdCB0aGUgJ3JlYWwnIG9yaWdpbiBlbGVtZW50LlxuICAgICAgICAgICAgICAgIGF0dGFjaEV2ZW50KGFjdGlvbnMuc3RhcnQsIGhhbmRsZS5jaGlsZHJlblswXSwgZXZlbnRTdGFydCwge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVOdW1iZXJzOiBbaW5kZXhdLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQXR0YWNoIHRoZSB0YXAgZXZlbnQgdG8gdGhlIHNsaWRlciBiYXNlLlxuICAgICAgICBpZiAoYmVoYXZpb3VyLnRhcCkge1xuICAgICAgICAgICAgYXR0YWNoRXZlbnQoYWN0aW9ucy5zdGFydCwgc2NvcGVfQmFzZSwgZXZlbnRUYXAsIHt9KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBGaXJlIGhvdmVyIGV2ZW50c1xuICAgICAgICBpZiAoYmVoYXZpb3VyLmhvdmVyKSB7XG4gICAgICAgICAgICBhdHRhY2hFdmVudChhY3Rpb25zLm1vdmUsIHNjb3BlX0Jhc2UsIGV2ZW50SG92ZXIsIHtcbiAgICAgICAgICAgICAgICBob3ZlcjogdHJ1ZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIE1ha2UgdGhlIHJhbmdlIGRyYWdnYWJsZS5cbiAgICAgICAgaWYgKGJlaGF2aW91ci5kcmFnKSB7XG4gICAgICAgICAgICBzY29wZV9Db25uZWN0cy5mb3JFYWNoKGZ1bmN0aW9uIChjb25uZWN0LCBpbmRleCkge1xuICAgICAgICAgICAgICAgIGlmIChjb25uZWN0ID09PSBmYWxzZSB8fCBpbmRleCA9PT0gMCB8fCBpbmRleCA9PT0gc2NvcGVfQ29ubmVjdHMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBoYW5kbGVCZWZvcmUgPSBzY29wZV9IYW5kbGVzW2luZGV4IC0gMV07XG4gICAgICAgICAgICAgICAgdmFyIGhhbmRsZUFmdGVyID0gc2NvcGVfSGFuZGxlc1tpbmRleF07XG4gICAgICAgICAgICAgICAgdmFyIGV2ZW50SG9sZGVycyA9IFtjb25uZWN0XTtcbiAgICAgICAgICAgICAgICB2YXIgaGFuZGxlc1RvRHJhZyA9IFtoYW5kbGVCZWZvcmUsIGhhbmRsZUFmdGVyXTtcbiAgICAgICAgICAgICAgICB2YXIgaGFuZGxlTnVtYmVyc1RvRHJhZyA9IFtpbmRleCAtIDEsIGluZGV4XTtcbiAgICAgICAgICAgICAgICBhZGRDbGFzcyhjb25uZWN0LCBvcHRpb25zLmNzc0NsYXNzZXMuZHJhZ2dhYmxlKTtcbiAgICAgICAgICAgICAgICAvLyBXaGVuIHRoZSByYW5nZSBpcyBmaXhlZCwgdGhlIGVudGlyZSByYW5nZSBjYW5cbiAgICAgICAgICAgICAgICAvLyBiZSBkcmFnZ2VkIGJ5IHRoZSBoYW5kbGVzLiBUaGUgaGFuZGxlIGluIHRoZSBmaXJzdFxuICAgICAgICAgICAgICAgIC8vIG9yaWdpbiB3aWxsIHByb3BhZ2F0ZSB0aGUgc3RhcnQgZXZlbnQgdXB3YXJkLFxuICAgICAgICAgICAgICAgIC8vIGJ1dCBpdCBuZWVkcyB0byBiZSBib3VuZCBtYW51YWxseSBvbiB0aGUgb3RoZXIuXG4gICAgICAgICAgICAgICAgaWYgKGJlaGF2aW91ci5maXhlZCkge1xuICAgICAgICAgICAgICAgICAgICBldmVudEhvbGRlcnMucHVzaChoYW5kbGVCZWZvcmUuY2hpbGRyZW5bMF0pO1xuICAgICAgICAgICAgICAgICAgICBldmVudEhvbGRlcnMucHVzaChoYW5kbGVBZnRlci5jaGlsZHJlblswXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChiZWhhdmlvdXIuZHJhZ0FsbCkge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVzVG9EcmFnID0gc2NvcGVfSGFuZGxlcztcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlTnVtYmVyc1RvRHJhZyA9IHNjb3BlX0hhbmRsZU51bWJlcnM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGV2ZW50SG9sZGVycy5mb3JFYWNoKGZ1bmN0aW9uIChldmVudEhvbGRlcikge1xuICAgICAgICAgICAgICAgICAgICBhdHRhY2hFdmVudChhY3Rpb25zLnN0YXJ0LCBldmVudEhvbGRlciwgZXZlbnRTdGFydCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlczogaGFuZGxlc1RvRHJhZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZU51bWJlcnM6IGhhbmRsZU51bWJlcnNUb0RyYWcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25uZWN0OiBjb25uZWN0LFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEF0dGFjaCBhbiBldmVudCB0byB0aGlzIHNsaWRlciwgcG9zc2libHkgaW5jbHVkaW5nIGEgbmFtZXNwYWNlXG4gICAgZnVuY3Rpb24gYmluZEV2ZW50KG5hbWVzcGFjZWRFdmVudCwgY2FsbGJhY2spIHtcbiAgICAgICAgc2NvcGVfRXZlbnRzW25hbWVzcGFjZWRFdmVudF0gPSBzY29wZV9FdmVudHNbbmFtZXNwYWNlZEV2ZW50XSB8fCBbXTtcbiAgICAgICAgc2NvcGVfRXZlbnRzW25hbWVzcGFjZWRFdmVudF0ucHVzaChjYWxsYmFjayk7XG4gICAgICAgIC8vIElmIHRoZSBldmVudCBib3VuZCBpcyAndXBkYXRlLCcgZmlyZSBpdCBpbW1lZGlhdGVseSBmb3IgYWxsIGhhbmRsZXMuXG4gICAgICAgIGlmIChuYW1lc3BhY2VkRXZlbnQuc3BsaXQoXCIuXCIpWzBdID09PSBcInVwZGF0ZVwiKSB7XG4gICAgICAgICAgICBzY29wZV9IYW5kbGVzLmZvckVhY2goZnVuY3Rpb24gKGEsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgZmlyZUV2ZW50KFwidXBkYXRlXCIsIGluZGV4KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzSW50ZXJuYWxOYW1lc3BhY2UobmFtZXNwYWNlKSB7XG4gICAgICAgIHJldHVybiBuYW1lc3BhY2UgPT09IElOVEVSTkFMX0VWRU5UX05TLmFyaWEgfHwgbmFtZXNwYWNlID09PSBJTlRFUk5BTF9FVkVOVF9OUy50b29sdGlwcztcbiAgICB9XG4gICAgLy8gVW5kbyBhdHRhY2htZW50IG9mIGV2ZW50XG4gICAgZnVuY3Rpb24gcmVtb3ZlRXZlbnQobmFtZXNwYWNlZEV2ZW50KSB7XG4gICAgICAgIHZhciBldmVudCA9IG5hbWVzcGFjZWRFdmVudCAmJiBuYW1lc3BhY2VkRXZlbnQuc3BsaXQoXCIuXCIpWzBdO1xuICAgICAgICB2YXIgbmFtZXNwYWNlID0gZXZlbnQgPyBuYW1lc3BhY2VkRXZlbnQuc3Vic3RyaW5nKGV2ZW50Lmxlbmd0aCkgOiBuYW1lc3BhY2VkRXZlbnQ7XG4gICAgICAgIE9iamVjdC5rZXlzKHNjb3BlX0V2ZW50cykuZm9yRWFjaChmdW5jdGlvbiAoYmluZCkge1xuICAgICAgICAgICAgdmFyIHRFdmVudCA9IGJpbmQuc3BsaXQoXCIuXCIpWzBdO1xuICAgICAgICAgICAgdmFyIHROYW1lc3BhY2UgPSBiaW5kLnN1YnN0cmluZyh0RXZlbnQubGVuZ3RoKTtcbiAgICAgICAgICAgIGlmICgoIWV2ZW50IHx8IGV2ZW50ID09PSB0RXZlbnQpICYmICghbmFtZXNwYWNlIHx8IG5hbWVzcGFjZSA9PT0gdE5hbWVzcGFjZSkpIHtcbiAgICAgICAgICAgICAgICAvLyBvbmx5IGRlbGV0ZSBwcm90ZWN0ZWQgaW50ZXJuYWwgZXZlbnQgaWYgaW50ZW50aW9uYWxcbiAgICAgICAgICAgICAgICBpZiAoIWlzSW50ZXJuYWxOYW1lc3BhY2UodE5hbWVzcGFjZSkgfHwgbmFtZXNwYWNlID09PSB0TmFtZXNwYWNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzY29wZV9FdmVudHNbYmluZF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8gRXh0ZXJuYWwgZXZlbnQgaGFuZGxpbmdcbiAgICBmdW5jdGlvbiBmaXJlRXZlbnQoZXZlbnROYW1lLCBoYW5kbGVOdW1iZXIsIHRhcCkge1xuICAgICAgICBPYmplY3Qua2V5cyhzY29wZV9FdmVudHMpLmZvckVhY2goZnVuY3Rpb24gKHRhcmdldEV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgZXZlbnRUeXBlID0gdGFyZ2V0RXZlbnQuc3BsaXQoXCIuXCIpWzBdO1xuICAgICAgICAgICAgaWYgKGV2ZW50TmFtZSA9PT0gZXZlbnRUeXBlKSB7XG4gICAgICAgICAgICAgICAgc2NvcGVfRXZlbnRzW3RhcmdldEV2ZW50XS5mb3JFYWNoKGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKFxuICAgICAgICAgICAgICAgICAgICAvLyBVc2UgdGhlIHNsaWRlciBwdWJsaWMgQVBJIGFzIHRoZSBzY29wZSAoJ3RoaXMnKVxuICAgICAgICAgICAgICAgICAgICBzY29wZV9TZWxmLCBcbiAgICAgICAgICAgICAgICAgICAgLy8gUmV0dXJuIHZhbHVlcyBhcyBhcnJheSwgc28gYXJnXzFbYXJnXzJdIGlzIGFsd2F5cyB2YWxpZC5cbiAgICAgICAgICAgICAgICAgICAgc2NvcGVfVmFsdWVzLm1hcChvcHRpb25zLmZvcm1hdC50byksIFxuICAgICAgICAgICAgICAgICAgICAvLyBIYW5kbGUgaW5kZXgsIDAgb3IgMVxuICAgICAgICAgICAgICAgICAgICBoYW5kbGVOdW1iZXIsIFxuICAgICAgICAgICAgICAgICAgICAvLyBVbi1mb3JtYXR0ZWQgc2xpZGVyIHZhbHVlc1xuICAgICAgICAgICAgICAgICAgICBzY29wZV9WYWx1ZXMuc2xpY2UoKSwgXG4gICAgICAgICAgICAgICAgICAgIC8vIEV2ZW50IGlzIGZpcmVkIGJ5IHRhcCwgdHJ1ZSBvciBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB0YXAgfHwgZmFsc2UsIFxuICAgICAgICAgICAgICAgICAgICAvLyBMZWZ0IG9mZnNldCBvZiB0aGUgaGFuZGxlLCBpbiByZWxhdGlvbiB0byB0aGUgc2xpZGVyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlX0xvY2F0aW9ucy5zbGljZSgpLCBcbiAgICAgICAgICAgICAgICAgICAgLy8gYWRkIHRoZSBzbGlkZXIgcHVibGljIEFQSSB0byBhbiBhY2Nlc3NpYmxlIHBhcmFtZXRlciB3aGVuIHRoaXMgaXMgdW5hdmFpbGFibGVcbiAgICAgICAgICAgICAgICAgICAgc2NvcGVfU2VsZik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBTcGxpdCBvdXQgdGhlIGhhbmRsZSBwb3NpdGlvbmluZyBsb2dpYyBzbyB0aGUgTW92ZSBldmVudCBjYW4gdXNlIGl0LCB0b29cbiAgICBmdW5jdGlvbiBjaGVja0hhbmRsZVBvc2l0aW9uKHJlZmVyZW5jZSwgaGFuZGxlTnVtYmVyLCB0bywgbG9va0JhY2t3YXJkLCBsb29rRm9yd2FyZCwgZ2V0VmFsdWUsIHNtb290aFN0ZXBzKSB7XG4gICAgICAgIHZhciBkaXN0YW5jZTtcbiAgICAgICAgLy8gRm9yIHNsaWRlcnMgd2l0aCBtdWx0aXBsZSBoYW5kbGVzLCBsaW1pdCBtb3ZlbWVudCB0byB0aGUgb3RoZXIgaGFuZGxlLlxuICAgICAgICAvLyBBcHBseSB0aGUgbWFyZ2luIG9wdGlvbiBieSBhZGRpbmcgaXQgdG8gdGhlIGhhbmRsZSBwb3NpdGlvbnMuXG4gICAgICAgIGlmIChzY29wZV9IYW5kbGVzLmxlbmd0aCA+IDEgJiYgIW9wdGlvbnMuZXZlbnRzLnVuY29uc3RyYWluZWQpIHtcbiAgICAgICAgICAgIGlmIChsb29rQmFja3dhcmQgJiYgaGFuZGxlTnVtYmVyID4gMCkge1xuICAgICAgICAgICAgICAgIGRpc3RhbmNlID0gc2NvcGVfU3BlY3RydW0uZ2V0QWJzb2x1dGVEaXN0YW5jZShyZWZlcmVuY2VbaGFuZGxlTnVtYmVyIC0gMV0sIG9wdGlvbnMubWFyZ2luLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgdG8gPSBNYXRoLm1heCh0bywgZGlzdGFuY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxvb2tGb3J3YXJkICYmIGhhbmRsZU51bWJlciA8IHNjb3BlX0hhbmRsZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgIGRpc3RhbmNlID0gc2NvcGVfU3BlY3RydW0uZ2V0QWJzb2x1dGVEaXN0YW5jZShyZWZlcmVuY2VbaGFuZGxlTnVtYmVyICsgMV0sIG9wdGlvbnMubWFyZ2luLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB0byA9IE1hdGgubWluKHRvLCBkaXN0YW5jZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gVGhlIGxpbWl0IG9wdGlvbiBoYXMgdGhlIG9wcG9zaXRlIGVmZmVjdCwgbGltaXRpbmcgaGFuZGxlcyB0byBhXG4gICAgICAgIC8vIG1heGltdW0gZGlzdGFuY2UgZnJvbSBhbm90aGVyLiBMaW1pdCBtdXN0IGJlID4gMCwgYXMgb3RoZXJ3aXNlXG4gICAgICAgIC8vIGhhbmRsZXMgd291bGQgYmUgdW5tb3ZhYmxlLlxuICAgICAgICBpZiAoc2NvcGVfSGFuZGxlcy5sZW5ndGggPiAxICYmIG9wdGlvbnMubGltaXQpIHtcbiAgICAgICAgICAgIGlmIChsb29rQmFja3dhcmQgJiYgaGFuZGxlTnVtYmVyID4gMCkge1xuICAgICAgICAgICAgICAgIGRpc3RhbmNlID0gc2NvcGVfU3BlY3RydW0uZ2V0QWJzb2x1dGVEaXN0YW5jZShyZWZlcmVuY2VbaGFuZGxlTnVtYmVyIC0gMV0sIG9wdGlvbnMubGltaXQsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB0byA9IE1hdGgubWluKHRvLCBkaXN0YW5jZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobG9va0ZvcndhcmQgJiYgaGFuZGxlTnVtYmVyIDwgc2NvcGVfSGFuZGxlcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgZGlzdGFuY2UgPSBzY29wZV9TcGVjdHJ1bS5nZXRBYnNvbHV0ZURpc3RhbmNlKHJlZmVyZW5jZVtoYW5kbGVOdW1iZXIgKyAxXSwgb3B0aW9ucy5saW1pdCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgdG8gPSBNYXRoLm1heCh0bywgZGlzdGFuY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFRoZSBwYWRkaW5nIG9wdGlvbiBrZWVwcyB0aGUgaGFuZGxlcyBhIGNlcnRhaW4gZGlzdGFuY2UgZnJvbSB0aGVcbiAgICAgICAgLy8gZWRnZXMgb2YgdGhlIHNsaWRlci4gUGFkZGluZyBtdXN0IGJlID4gMC5cbiAgICAgICAgaWYgKG9wdGlvbnMucGFkZGluZykge1xuICAgICAgICAgICAgaWYgKGhhbmRsZU51bWJlciA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGRpc3RhbmNlID0gc2NvcGVfU3BlY3RydW0uZ2V0QWJzb2x1dGVEaXN0YW5jZSgwLCBvcHRpb25zLnBhZGRpbmdbMF0sIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB0byA9IE1hdGgubWF4KHRvLCBkaXN0YW5jZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaGFuZGxlTnVtYmVyID09PSBzY29wZV9IYW5kbGVzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICBkaXN0YW5jZSA9IHNjb3BlX1NwZWN0cnVtLmdldEFic29sdXRlRGlzdGFuY2UoMTAwLCBvcHRpb25zLnBhZGRpbmdbMV0sIHRydWUpO1xuICAgICAgICAgICAgICAgIHRvID0gTWF0aC5taW4odG8sIGRpc3RhbmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNtb290aFN0ZXBzKSB7XG4gICAgICAgICAgICB0byA9IHNjb3BlX1NwZWN0cnVtLmdldFN0ZXAodG8pO1xuICAgICAgICB9XG4gICAgICAgIC8vIExpbWl0IHBlcmNlbnRhZ2UgdG8gdGhlIDAgLSAxMDAgcmFuZ2VcbiAgICAgICAgdG8gPSBsaW1pdCh0byk7XG4gICAgICAgIC8vIFJldHVybiBmYWxzZSBpZiBoYW5kbGUgY2FuJ3QgbW92ZVxuICAgICAgICBpZiAodG8gPT09IHJlZmVyZW5jZVtoYW5kbGVOdW1iZXJdICYmICFnZXRWYWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0bztcbiAgICB9XG4gICAgLy8gVXNlcyBzbGlkZXIgb3JpZW50YXRpb24gdG8gY3JlYXRlIENTUyBydWxlcy4gYSA9IGJhc2UgdmFsdWU7XG4gICAgZnVuY3Rpb24gaW5SdWxlT3JkZXIodiwgYSkge1xuICAgICAgICB2YXIgbyA9IG9wdGlvbnMub3J0O1xuICAgICAgICByZXR1cm4gKG8gPyBhIDogdikgKyBcIiwgXCIgKyAobyA/IHYgOiBhKTtcbiAgICB9XG4gICAgLy8gTW92ZXMgaGFuZGxlKHMpIGJ5IGEgcGVyY2VudGFnZVxuICAgIC8vIChib29sLCAlIHRvIG1vdmUsIFslIHdoZXJlIGhhbmRsZSBzdGFydGVkLCAuLi5dLCBbaW5kZXggaW4gc2NvcGVfSGFuZGxlcywgLi4uXSlcbiAgICBmdW5jdGlvbiBtb3ZlSGFuZGxlcyh1cHdhcmQsIHByb3Bvc2FsLCBsb2NhdGlvbnMsIGhhbmRsZU51bWJlcnMsIGNvbm5lY3QpIHtcbiAgICAgICAgdmFyIHByb3Bvc2FscyA9IGxvY2F0aW9ucy5zbGljZSgpO1xuICAgICAgICAvLyBTdG9yZSBmaXJzdCBoYW5kbGUgbm93LCBzbyB3ZSBzdGlsbCBoYXZlIGl0IGluIGNhc2UgaGFuZGxlTnVtYmVycyBpcyByZXZlcnNlZFxuICAgICAgICB2YXIgZmlyc3RIYW5kbGUgPSBoYW5kbGVOdW1iZXJzWzBdO1xuICAgICAgICB2YXIgc21vb3RoU3RlcHMgPSBvcHRpb25zLmV2ZW50cy5zbW9vdGhTdGVwcztcbiAgICAgICAgdmFyIGIgPSBbIXVwd2FyZCwgdXB3YXJkXTtcbiAgICAgICAgdmFyIGYgPSBbdXB3YXJkLCAhdXB3YXJkXTtcbiAgICAgICAgLy8gQ29weSBoYW5kbGVOdW1iZXJzIHNvIHdlIGRvbid0IGNoYW5nZSB0aGUgZGF0YXNldFxuICAgICAgICBoYW5kbGVOdW1iZXJzID0gaGFuZGxlTnVtYmVycy5zbGljZSgpO1xuICAgICAgICAvLyBDaGVjayB0byBzZWUgd2hpY2ggaGFuZGxlIGlzICdsZWFkaW5nJy5cbiAgICAgICAgLy8gSWYgdGhhdCBvbmUgY2FuJ3QgbW92ZSB0aGUgc2Vjb25kIGNhbid0IGVpdGhlci5cbiAgICAgICAgaWYgKHVwd2FyZCkge1xuICAgICAgICAgICAgaGFuZGxlTnVtYmVycy5yZXZlcnNlKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gU3RlcCAxOiBnZXQgdGhlIG1heGltdW0gcGVyY2VudGFnZSB0aGF0IGFueSBvZiB0aGUgaGFuZGxlcyBjYW4gbW92ZVxuICAgICAgICBpZiAoaGFuZGxlTnVtYmVycy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBoYW5kbGVOdW1iZXJzLmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZU51bWJlciwgbykge1xuICAgICAgICAgICAgICAgIHZhciB0byA9IGNoZWNrSGFuZGxlUG9zaXRpb24ocHJvcG9zYWxzLCBoYW5kbGVOdW1iZXIsIHByb3Bvc2Fsc1toYW5kbGVOdW1iZXJdICsgcHJvcG9zYWwsIGJbb10sIGZbb10sIGZhbHNlLCBzbW9vdGhTdGVwcyk7XG4gICAgICAgICAgICAgICAgLy8gU3RvcCBpZiBvbmUgb2YgdGhlIGhhbmRsZXMgY2FuJ3QgbW92ZS5cbiAgICAgICAgICAgICAgICBpZiAodG8gPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3Bvc2FsID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3Bvc2FsID0gdG8gLSBwcm9wb3NhbHNbaGFuZGxlTnVtYmVyXTtcbiAgICAgICAgICAgICAgICAgICAgcHJvcG9zYWxzW2hhbmRsZU51bWJlcl0gPSB0bztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBJZiB1c2luZyBvbmUgaGFuZGxlLCBjaGVjayBiYWNrd2FyZCBBTkQgZm9yd2FyZFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGIgPSBmID0gW3RydWVdO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzdGF0ZSA9IGZhbHNlO1xuICAgICAgICAvLyBTdGVwIDI6IFRyeSB0byBzZXQgdGhlIGhhbmRsZXMgd2l0aCB0aGUgZm91bmQgcGVyY2VudGFnZVxuICAgICAgICBoYW5kbGVOdW1iZXJzLmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZU51bWJlciwgbykge1xuICAgICAgICAgICAgc3RhdGUgPVxuICAgICAgICAgICAgICAgIHNldEhhbmRsZShoYW5kbGVOdW1iZXIsIGxvY2F0aW9uc1toYW5kbGVOdW1iZXJdICsgcHJvcG9zYWwsIGJbb10sIGZbb10sIGZhbHNlLCBzbW9vdGhTdGVwcykgfHwgc3RhdGU7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBTdGVwIDM6IElmIGEgaGFuZGxlIG1vdmVkLCBmaXJlIGV2ZW50c1xuICAgICAgICBpZiAoc3RhdGUpIHtcbiAgICAgICAgICAgIGhhbmRsZU51bWJlcnMuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlTnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgZmlyZUV2ZW50KFwidXBkYXRlXCIsIGhhbmRsZU51bWJlcik7XG4gICAgICAgICAgICAgICAgZmlyZUV2ZW50KFwic2xpZGVcIiwgaGFuZGxlTnVtYmVyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gSWYgdGFyZ2V0IGlzIGEgY29ubmVjdCwgdGhlbiBmaXJlIGRyYWcgZXZlbnRcbiAgICAgICAgICAgIGlmIChjb25uZWN0ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGZpcmVFdmVudChcImRyYWdcIiwgZmlyc3RIYW5kbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIFRha2VzIGEgYmFzZSB2YWx1ZSBhbmQgYW4gb2Zmc2V0LiBUaGlzIG9mZnNldCBpcyB1c2VkIGZvciB0aGUgY29ubmVjdCBiYXIgc2l6ZS5cbiAgICAvLyBJbiB0aGUgaW5pdGlhbCBkZXNpZ24gZm9yIHRoaXMgZmVhdHVyZSwgdGhlIG9yaWdpbiBlbGVtZW50IHdhcyAxJSB3aWRlLlxuICAgIC8vIFVuZm9ydHVuYXRlbHksIGEgcm91bmRpbmcgYnVnIGluIENocm9tZSBtYWtlcyBpdCBpbXBvc3NpYmxlIHRvIGltcGxlbWVudCB0aGlzIGZlYXR1cmVcbiAgICAvLyBpbiB0aGlzIG1hbm5lcjogaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9Nzk4MjIzXG4gICAgZnVuY3Rpb24gdHJhbnNmb3JtRGlyZWN0aW9uKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMuZGlyID8gMTAwIC0gYSAtIGIgOiBhO1xuICAgIH1cbiAgICAvLyBVcGRhdGVzIHNjb3BlX0xvY2F0aW9ucyBhbmQgc2NvcGVfVmFsdWVzLCB1cGRhdGVzIHZpc3VhbCBzdGF0ZVxuICAgIGZ1bmN0aW9uIHVwZGF0ZUhhbmRsZVBvc2l0aW9uKGhhbmRsZU51bWJlciwgdG8pIHtcbiAgICAgICAgLy8gVXBkYXRlIGxvY2F0aW9ucy5cbiAgICAgICAgc2NvcGVfTG9jYXRpb25zW2hhbmRsZU51bWJlcl0gPSB0bztcbiAgICAgICAgLy8gQ29udmVydCB0aGUgdmFsdWUgdG8gdGhlIHNsaWRlciBzdGVwcGluZy9yYW5nZS5cbiAgICAgICAgc2NvcGVfVmFsdWVzW2hhbmRsZU51bWJlcl0gPSBzY29wZV9TcGVjdHJ1bS5mcm9tU3RlcHBpbmcodG8pO1xuICAgICAgICB2YXIgdHJhbnNsYXRpb24gPSB0cmFuc2Zvcm1EaXJlY3Rpb24odG8sIDApIC0gc2NvcGVfRGlyT2Zmc2V0O1xuICAgICAgICB2YXIgdHJhbnNsYXRlUnVsZSA9IFwidHJhbnNsYXRlKFwiICsgaW5SdWxlT3JkZXIodHJhbnNsYXRpb24gKyBcIiVcIiwgXCIwXCIpICsgXCIpXCI7XG4gICAgICAgIHNjb3BlX0hhbmRsZXNbaGFuZGxlTnVtYmVyXS5zdHlsZVtvcHRpb25zLnRyYW5zZm9ybVJ1bGVdID0gdHJhbnNsYXRlUnVsZTtcbiAgICAgICAgdXBkYXRlQ29ubmVjdChoYW5kbGVOdW1iZXIpO1xuICAgICAgICB1cGRhdGVDb25uZWN0KGhhbmRsZU51bWJlciArIDEpO1xuICAgIH1cbiAgICAvLyBIYW5kbGVzIGJlZm9yZSB0aGUgc2xpZGVyIG1pZGRsZSBhcmUgc3RhY2tlZCBsYXRlciA9IGhpZ2hlcixcbiAgICAvLyBIYW5kbGVzIGFmdGVyIHRoZSBtaWRkbGUgbGF0ZXIgaXMgbG93ZXJcbiAgICAvLyBbWzddIFs4XSAuLi4uLi4uLi4uIHwgLi4uLi4uLi4uLiBbNV0gWzRdXG4gICAgZnVuY3Rpb24gc2V0WmluZGV4KCkge1xuICAgICAgICBzY29wZV9IYW5kbGVOdW1iZXJzLmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZU51bWJlcikge1xuICAgICAgICAgICAgdmFyIGRpciA9IHNjb3BlX0xvY2F0aW9uc1toYW5kbGVOdW1iZXJdID4gNTAgPyAtMSA6IDE7XG4gICAgICAgICAgICB2YXIgekluZGV4ID0gMyArIChzY29wZV9IYW5kbGVzLmxlbmd0aCArIGRpciAqIGhhbmRsZU51bWJlcik7XG4gICAgICAgICAgICBzY29wZV9IYW5kbGVzW2hhbmRsZU51bWJlcl0uc3R5bGUuekluZGV4ID0gU3RyaW5nKHpJbmRleCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBUZXN0IHN1Z2dlc3RlZCB2YWx1ZXMgYW5kIGFwcGx5IG1hcmdpbiwgc3RlcC5cbiAgICAvLyBpZiBleGFjdElucHV0IGlzIHRydWUsIGRvbid0IHJ1biBjaGVja0hhbmRsZVBvc2l0aW9uLCB0aGVuIHRoZSBoYW5kbGUgY2FuIGJlIHBsYWNlZCBpbiBiZXR3ZWVuIHN0ZXBzICgjNDM2KVxuICAgIGZ1bmN0aW9uIHNldEhhbmRsZShoYW5kbGVOdW1iZXIsIHRvLCBsb29rQmFja3dhcmQsIGxvb2tGb3J3YXJkLCBleGFjdElucHV0LCBzbW9vdGhTdGVwcykge1xuICAgICAgICBpZiAoIWV4YWN0SW5wdXQpIHtcbiAgICAgICAgICAgIHRvID0gY2hlY2tIYW5kbGVQb3NpdGlvbihzY29wZV9Mb2NhdGlvbnMsIGhhbmRsZU51bWJlciwgdG8sIGxvb2tCYWNrd2FyZCwgbG9va0ZvcndhcmQsIGZhbHNlLCBzbW9vdGhTdGVwcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRvID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHVwZGF0ZUhhbmRsZVBvc2l0aW9uKGhhbmRsZU51bWJlciwgdG8pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLy8gVXBkYXRlcyBzdHlsZSBhdHRyaWJ1dGUgZm9yIGNvbm5lY3Qgbm9kZXNcbiAgICBmdW5jdGlvbiB1cGRhdGVDb25uZWN0KGluZGV4KSB7XG4gICAgICAgIC8vIFNraXAgY29ubmVjdHMgc2V0IHRvIGZhbHNlXG4gICAgICAgIGlmICghc2NvcGVfQ29ubmVjdHNbaW5kZXhdKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGwgPSAwO1xuICAgICAgICB2YXIgaCA9IDEwMDtcbiAgICAgICAgaWYgKGluZGV4ICE9PSAwKSB7XG4gICAgICAgICAgICBsID0gc2NvcGVfTG9jYXRpb25zW2luZGV4IC0gMV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluZGV4ICE9PSBzY29wZV9Db25uZWN0cy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICBoID0gc2NvcGVfTG9jYXRpb25zW2luZGV4XTtcbiAgICAgICAgfVxuICAgICAgICAvLyBXZSB1c2UgdHdvIHJ1bGVzOlxuICAgICAgICAvLyAndHJhbnNsYXRlJyB0byBjaGFuZ2UgdGhlIGxlZnQvdG9wIG9mZnNldDtcbiAgICAgICAgLy8gJ3NjYWxlJyB0byBjaGFuZ2UgdGhlIHdpZHRoIG9mIHRoZSBlbGVtZW50O1xuICAgICAgICAvLyBBcyB0aGUgZWxlbWVudCBoYXMgYSB3aWR0aCBvZiAxMDAlLCBhIHRyYW5zbGF0aW9uIG9mIDEwMCUgaXMgZXF1YWwgdG8gMTAwJSBvZiB0aGUgcGFyZW50ICgubm9VaS1iYXNlKVxuICAgICAgICB2YXIgY29ubmVjdFdpZHRoID0gaCAtIGw7XG4gICAgICAgIHZhciB0cmFuc2xhdGVSdWxlID0gXCJ0cmFuc2xhdGUoXCIgKyBpblJ1bGVPcmRlcih0cmFuc2Zvcm1EaXJlY3Rpb24obCwgY29ubmVjdFdpZHRoKSArIFwiJVwiLCBcIjBcIikgKyBcIilcIjtcbiAgICAgICAgdmFyIHNjYWxlUnVsZSA9IFwic2NhbGUoXCIgKyBpblJ1bGVPcmRlcihjb25uZWN0V2lkdGggLyAxMDAsIFwiMVwiKSArIFwiKVwiO1xuICAgICAgICBzY29wZV9Db25uZWN0c1tpbmRleF0uc3R5bGVbb3B0aW9ucy50cmFuc2Zvcm1SdWxlXSA9XG4gICAgICAgICAgICB0cmFuc2xhdGVSdWxlICsgXCIgXCIgKyBzY2FsZVJ1bGU7XG4gICAgfVxuICAgIC8vIFBhcnNlcyB2YWx1ZSBwYXNzZWQgdG8gLnNldCBtZXRob2QuIFJldHVybnMgY3VycmVudCB2YWx1ZSBpZiBub3QgcGFyc2UtYWJsZS5cbiAgICBmdW5jdGlvbiByZXNvbHZlVG9WYWx1ZSh0bywgaGFuZGxlTnVtYmVyKSB7XG4gICAgICAgIC8vIFNldHRpbmcgd2l0aCBudWxsIGluZGljYXRlcyBhbiAnaWdub3JlJy5cbiAgICAgICAgLy8gSW5wdXR0aW5nICdmYWxzZScgaXMgaW52YWxpZC5cbiAgICAgICAgaWYgKHRvID09PSBudWxsIHx8IHRvID09PSBmYWxzZSB8fCB0byA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gc2NvcGVfTG9jYXRpb25zW2hhbmRsZU51bWJlcl07XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgYSBmb3JtYXR0ZWQgbnVtYmVyIHdhcyBwYXNzZWQsIGF0dGVtcHQgdG8gZGVjb2RlIGl0LlxuICAgICAgICBpZiAodHlwZW9mIHRvID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICB0byA9IFN0cmluZyh0byk7XG4gICAgICAgIH1cbiAgICAgICAgdG8gPSBvcHRpb25zLmZvcm1hdC5mcm9tKHRvKTtcbiAgICAgICAgaWYgKHRvICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgdG8gPSBzY29wZV9TcGVjdHJ1bS50b1N0ZXBwaW5nKHRvKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBJZiBwYXJzaW5nIHRoZSBudW1iZXIgZmFpbGVkLCB1c2UgdGhlIGN1cnJlbnQgdmFsdWUuXG4gICAgICAgIGlmICh0byA9PT0gZmFsc2UgfHwgaXNOYU4odG8pKSB7XG4gICAgICAgICAgICByZXR1cm4gc2NvcGVfTG9jYXRpb25zW2hhbmRsZU51bWJlcl07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRvO1xuICAgIH1cbiAgICAvLyBTZXQgdGhlIHNsaWRlciB2YWx1ZS5cbiAgICBmdW5jdGlvbiB2YWx1ZVNldChpbnB1dCwgZmlyZVNldEV2ZW50LCBleGFjdElucHV0KSB7XG4gICAgICAgIHZhciB2YWx1ZXMgPSBhc0FycmF5KGlucHV0KTtcbiAgICAgICAgdmFyIGlzSW5pdCA9IHNjb3BlX0xvY2F0aW9uc1swXSA9PT0gdW5kZWZpbmVkO1xuICAgICAgICAvLyBFdmVudCBmaXJlcyBieSBkZWZhdWx0XG4gICAgICAgIGZpcmVTZXRFdmVudCA9IGZpcmVTZXRFdmVudCA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IGZpcmVTZXRFdmVudDtcbiAgICAgICAgLy8gQW5pbWF0aW9uIGlzIG9wdGlvbmFsLlxuICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIGluaXRpYWwgdmFsdWVzIHdlcmUgc2V0IGJlZm9yZSB1c2luZyBhbmltYXRlZCBwbGFjZW1lbnQuXG4gICAgICAgIGlmIChvcHRpb25zLmFuaW1hdGUgJiYgIWlzSW5pdCkge1xuICAgICAgICAgICAgYWRkQ2xhc3NGb3Ioc2NvcGVfVGFyZ2V0LCBvcHRpb25zLmNzc0NsYXNzZXMudGFwLCBvcHRpb25zLmFuaW1hdGlvbkR1cmF0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBGaXJzdCBwYXNzLCB3aXRob3V0IGxvb2tBaGVhZCBidXQgd2l0aCBsb29rQmFja3dhcmQuIFZhbHVlcyBhcmUgc2V0IGZyb20gbGVmdCB0byByaWdodC5cbiAgICAgICAgc2NvcGVfSGFuZGxlTnVtYmVycy5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGVOdW1iZXIpIHtcbiAgICAgICAgICAgIHNldEhhbmRsZShoYW5kbGVOdW1iZXIsIHJlc29sdmVUb1ZhbHVlKHZhbHVlc1toYW5kbGVOdW1iZXJdLCBoYW5kbGVOdW1iZXIpLCB0cnVlLCBmYWxzZSwgZXhhY3RJbnB1dCk7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgaSA9IHNjb3BlX0hhbmRsZU51bWJlcnMubGVuZ3RoID09PSAxID8gMCA6IDE7XG4gICAgICAgIC8vIFNwcmVhZCBoYW5kbGVzIGV2ZW5seSBhY3Jvc3MgdGhlIHNsaWRlciBpZiB0aGUgcmFuZ2UgaGFzIG5vIHNpemUgKG1pbj1tYXgpXG4gICAgICAgIGlmIChpc0luaXQgJiYgc2NvcGVfU3BlY3RydW0uaGFzTm9TaXplKCkpIHtcbiAgICAgICAgICAgIGV4YWN0SW5wdXQgPSB0cnVlO1xuICAgICAgICAgICAgc2NvcGVfTG9jYXRpb25zWzBdID0gMDtcbiAgICAgICAgICAgIGlmIChzY29wZV9IYW5kbGVOdW1iZXJzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICB2YXIgc3BhY2VfMSA9IDEwMCAvIChzY29wZV9IYW5kbGVOdW1iZXJzLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgIHNjb3BlX0hhbmRsZU51bWJlcnMuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlTnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlX0xvY2F0aW9uc1toYW5kbGVOdW1iZXJdID0gaGFuZGxlTnVtYmVyICogc3BhY2VfMTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBTZWNvbmRhcnkgcGFzc2VzLiBOb3cgdGhhdCBhbGwgYmFzZSB2YWx1ZXMgYXJlIHNldCwgYXBwbHkgY29uc3RyYWludHMuXG4gICAgICAgIC8vIEl0ZXJhdGUgYWxsIGhhbmRsZXMgdG8gZW5zdXJlIGNvbnN0cmFpbnRzIGFyZSBhcHBsaWVkIGZvciB0aGUgZW50aXJlIHNsaWRlciAoSXNzdWUgIzEwMDkpXG4gICAgICAgIGZvciAoOyBpIDwgc2NvcGVfSGFuZGxlTnVtYmVycy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgc2NvcGVfSGFuZGxlTnVtYmVycy5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGVOdW1iZXIpIHtcbiAgICAgICAgICAgICAgICBzZXRIYW5kbGUoaGFuZGxlTnVtYmVyLCBzY29wZV9Mb2NhdGlvbnNbaGFuZGxlTnVtYmVyXSwgdHJ1ZSwgdHJ1ZSwgZXhhY3RJbnB1dCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBzZXRaaW5kZXgoKTtcbiAgICAgICAgc2NvcGVfSGFuZGxlTnVtYmVycy5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGVOdW1iZXIpIHtcbiAgICAgICAgICAgIGZpcmVFdmVudChcInVwZGF0ZVwiLCBoYW5kbGVOdW1iZXIpO1xuICAgICAgICAgICAgLy8gRmlyZSB0aGUgZXZlbnQgb25seSBmb3IgaGFuZGxlcyB0aGF0IHJlY2VpdmVkIGEgbmV3IHZhbHVlLCBhcyBwZXIgIzU3OVxuICAgICAgICAgICAgaWYgKHZhbHVlc1toYW5kbGVOdW1iZXJdICE9PSBudWxsICYmIGZpcmVTZXRFdmVudCkge1xuICAgICAgICAgICAgICAgIGZpcmVFdmVudChcInNldFwiLCBoYW5kbGVOdW1iZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8gUmVzZXQgc2xpZGVyIHRvIGluaXRpYWwgdmFsdWVzXG4gICAgZnVuY3Rpb24gdmFsdWVSZXNldChmaXJlU2V0RXZlbnQpIHtcbiAgICAgICAgdmFsdWVTZXQob3B0aW9ucy5zdGFydCwgZmlyZVNldEV2ZW50KTtcbiAgICB9XG4gICAgLy8gU2V0IHZhbHVlIGZvciBhIHNpbmdsZSBoYW5kbGVcbiAgICBmdW5jdGlvbiB2YWx1ZVNldEhhbmRsZShoYW5kbGVOdW1iZXIsIHZhbHVlLCBmaXJlU2V0RXZlbnQsIGV4YWN0SW5wdXQpIHtcbiAgICAgICAgLy8gRW5zdXJlIG51bWVyaWMgaW5wdXRcbiAgICAgICAgaGFuZGxlTnVtYmVyID0gTnVtYmVyKGhhbmRsZU51bWJlcik7XG4gICAgICAgIGlmICghKGhhbmRsZU51bWJlciA+PSAwICYmIGhhbmRsZU51bWJlciA8IHNjb3BlX0hhbmRsZU51bWJlcnMubGVuZ3RoKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogaW52YWxpZCBoYW5kbGUgbnVtYmVyLCBnb3Q6IFwiICsgaGFuZGxlTnVtYmVyKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBMb29rIGJvdGggYmFja3dhcmQgYW5kIGZvcndhcmQsIHNpbmNlIHdlIGRvbid0IHdhbnQgdGhpcyBoYW5kbGUgdG8gXCJwdXNoXCIgb3RoZXIgaGFuZGxlcyAoIzk2MCk7XG4gICAgICAgIC8vIFRoZSBleGFjdElucHV0IGFyZ3VtZW50IGNhbiBiZSB1c2VkIHRvIGlnbm9yZSBzbGlkZXIgc3RlcHBpbmcgKCM0MzYpXG4gICAgICAgIHNldEhhbmRsZShoYW5kbGVOdW1iZXIsIHJlc29sdmVUb1ZhbHVlKHZhbHVlLCBoYW5kbGVOdW1iZXIpLCB0cnVlLCB0cnVlLCBleGFjdElucHV0KTtcbiAgICAgICAgZmlyZUV2ZW50KFwidXBkYXRlXCIsIGhhbmRsZU51bWJlcik7XG4gICAgICAgIGlmIChmaXJlU2V0RXZlbnQpIHtcbiAgICAgICAgICAgIGZpcmVFdmVudChcInNldFwiLCBoYW5kbGVOdW1iZXIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEdldCB0aGUgc2xpZGVyIHZhbHVlLlxuICAgIGZ1bmN0aW9uIHZhbHVlR2V0KHVuZW5jb2RlZCkge1xuICAgICAgICBpZiAodW5lbmNvZGVkID09PSB2b2lkIDApIHsgdW5lbmNvZGVkID0gZmFsc2U7IH1cbiAgICAgICAgaWYgKHVuZW5jb2RlZCkge1xuICAgICAgICAgICAgLy8gcmV0dXJuIGEgY29weSBvZiB0aGUgcmF3IHZhbHVlc1xuICAgICAgICAgICAgcmV0dXJuIHNjb3BlX1ZhbHVlcy5sZW5ndGggPT09IDEgPyBzY29wZV9WYWx1ZXNbMF0gOiBzY29wZV9WYWx1ZXMuc2xpY2UoMCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHZhbHVlcyA9IHNjb3BlX1ZhbHVlcy5tYXAob3B0aW9ucy5mb3JtYXQudG8pO1xuICAgICAgICAvLyBJZiBvbmx5IG9uZSBoYW5kbGUgaXMgdXNlZCwgcmV0dXJuIGEgc2luZ2xlIHZhbHVlLlxuICAgICAgICBpZiAodmFsdWVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlc1swXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWVzO1xuICAgIH1cbiAgICAvLyBSZW1vdmVzIGNsYXNzZXMgZnJvbSB0aGUgcm9vdCBhbmQgZW1wdGllcyBpdC5cbiAgICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgICAgICAvLyByZW1vdmUgcHJvdGVjdGVkIGludGVybmFsIGxpc3RlbmVyc1xuICAgICAgICByZW1vdmVFdmVudChJTlRFUk5BTF9FVkVOVF9OUy5hcmlhKTtcbiAgICAgICAgcmVtb3ZlRXZlbnQoSU5URVJOQUxfRVZFTlRfTlMudG9vbHRpcHMpO1xuICAgICAgICBPYmplY3Qua2V5cyhvcHRpb25zLmNzc0NsYXNzZXMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgcmVtb3ZlQ2xhc3Moc2NvcGVfVGFyZ2V0LCBvcHRpb25zLmNzc0NsYXNzZXNba2V5XSk7XG4gICAgICAgIH0pO1xuICAgICAgICB3aGlsZSAoc2NvcGVfVGFyZ2V0LmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgIHNjb3BlX1RhcmdldC5yZW1vdmVDaGlsZChzY29wZV9UYXJnZXQuZmlyc3RDaGlsZCk7XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIHNjb3BlX1RhcmdldC5ub1VpU2xpZGVyO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXROZXh0U3RlcHNGb3JIYW5kbGUoaGFuZGxlTnVtYmVyKSB7XG4gICAgICAgIHZhciBsb2NhdGlvbiA9IHNjb3BlX0xvY2F0aW9uc1toYW5kbGVOdW1iZXJdO1xuICAgICAgICB2YXIgbmVhcmJ5U3RlcHMgPSBzY29wZV9TcGVjdHJ1bS5nZXROZWFyYnlTdGVwcyhsb2NhdGlvbik7XG4gICAgICAgIHZhciB2YWx1ZSA9IHNjb3BlX1ZhbHVlc1toYW5kbGVOdW1iZXJdO1xuICAgICAgICB2YXIgaW5jcmVtZW50ID0gbmVhcmJ5U3RlcHMudGhpc1N0ZXAuc3RlcDtcbiAgICAgICAgdmFyIGRlY3JlbWVudCA9IG51bGw7XG4gICAgICAgIC8vIElmIHNuYXBwZWQsIGRpcmVjdGx5IHVzZSBkZWZpbmVkIHN0ZXAgdmFsdWVcbiAgICAgICAgaWYgKG9wdGlvbnMuc25hcCkge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICB2YWx1ZSAtIG5lYXJieVN0ZXBzLnN0ZXBCZWZvcmUuc3RhcnRWYWx1ZSB8fCBudWxsLFxuICAgICAgICAgICAgICAgIG5lYXJieVN0ZXBzLnN0ZXBBZnRlci5zdGFydFZhbHVlIC0gdmFsdWUgfHwgbnVsbCxcbiAgICAgICAgICAgIF07XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgdGhlIG5leHQgdmFsdWUgaW4gdGhpcyBzdGVwIG1vdmVzIGludG8gdGhlIG5leHQgc3RlcCxcbiAgICAgICAgLy8gdGhlIGluY3JlbWVudCBpcyB0aGUgc3RhcnQgb2YgdGhlIG5leHQgc3RlcCAtIHRoZSBjdXJyZW50IHZhbHVlXG4gICAgICAgIGlmIChpbmNyZW1lbnQgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgKyBpbmNyZW1lbnQgPiBuZWFyYnlTdGVwcy5zdGVwQWZ0ZXIuc3RhcnRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGluY3JlbWVudCA9IG5lYXJieVN0ZXBzLnN0ZXBBZnRlci5zdGFydFZhbHVlIC0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgdGhlIHZhbHVlIGlzIGJleW9uZCB0aGUgc3RhcnRpbmcgcG9pbnRcbiAgICAgICAgaWYgKHZhbHVlID4gbmVhcmJ5U3RlcHMudGhpc1N0ZXAuc3RhcnRWYWx1ZSkge1xuICAgICAgICAgICAgZGVjcmVtZW50ID0gbmVhcmJ5U3RlcHMudGhpc1N0ZXAuc3RlcDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChuZWFyYnlTdGVwcy5zdGVwQmVmb3JlLnN0ZXAgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBkZWNyZW1lbnQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBJZiBhIGhhbmRsZSBpcyBhdCB0aGUgc3RhcnQgb2YgYSBzdGVwLCBpdCBhbHdheXMgc3RlcHMgYmFjayBpbnRvIHRoZSBwcmV2aW91cyBzdGVwIGZpcnN0XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZGVjcmVtZW50ID0gdmFsdWUgLSBuZWFyYnlTdGVwcy5zdGVwQmVmb3JlLmhpZ2hlc3RTdGVwO1xuICAgICAgICB9XG4gICAgICAgIC8vIE5vdywgaWYgYXQgdGhlIHNsaWRlciBlZGdlcywgdGhlcmUgaXMgbm8gaW4vZGVjcmVtZW50XG4gICAgICAgIGlmIChsb2NhdGlvbiA9PT0gMTAwKSB7XG4gICAgICAgICAgICBpbmNyZW1lbnQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGxvY2F0aW9uID09PSAwKSB7XG4gICAgICAgICAgICBkZWNyZW1lbnQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFzIHBlciAjMzkxLCB0aGUgY29tcGFyaXNvbiBmb3IgdGhlIGRlY3JlbWVudCBzdGVwIGNhbiBoYXZlIHNvbWUgcm91bmRpbmcgaXNzdWVzLlxuICAgICAgICB2YXIgc3RlcERlY2ltYWxzID0gc2NvcGVfU3BlY3RydW0uY291bnRTdGVwRGVjaW1hbHMoKTtcbiAgICAgICAgLy8gUm91bmQgcGVyICMzOTFcbiAgICAgICAgaWYgKGluY3JlbWVudCAhPT0gbnVsbCAmJiBpbmNyZW1lbnQgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBpbmNyZW1lbnQgPSBOdW1iZXIoaW5jcmVtZW50LnRvRml4ZWQoc3RlcERlY2ltYWxzKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRlY3JlbWVudCAhPT0gbnVsbCAmJiBkZWNyZW1lbnQgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBkZWNyZW1lbnQgPSBOdW1iZXIoZGVjcmVtZW50LnRvRml4ZWQoc3RlcERlY2ltYWxzKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtkZWNyZW1lbnQsIGluY3JlbWVudF07XG4gICAgfVxuICAgIC8vIEdldCB0aGUgY3VycmVudCBzdGVwIHNpemUgZm9yIHRoZSBzbGlkZXIuXG4gICAgZnVuY3Rpb24gZ2V0TmV4dFN0ZXBzKCkge1xuICAgICAgICByZXR1cm4gc2NvcGVfSGFuZGxlTnVtYmVycy5tYXAoZ2V0TmV4dFN0ZXBzRm9ySGFuZGxlKTtcbiAgICB9XG4gICAgLy8gVXBkYXRhYmxlOiBtYXJnaW4sIGxpbWl0LCBwYWRkaW5nLCBzdGVwLCByYW5nZSwgYW5pbWF0ZSwgc25hcFxuICAgIGZ1bmN0aW9uIHVwZGF0ZU9wdGlvbnMob3B0aW9uc1RvVXBkYXRlLCBmaXJlU2V0RXZlbnQpIHtcbiAgICAgICAgLy8gU3BlY3RydW0gaXMgY3JlYXRlZCB1c2luZyB0aGUgcmFuZ2UsIHNuYXAsIGRpcmVjdGlvbiBhbmQgc3RlcCBvcHRpb25zLlxuICAgICAgICAvLyAnc25hcCcgYW5kICdzdGVwJyBjYW4gYmUgdXBkYXRlZC5cbiAgICAgICAgLy8gSWYgJ3NuYXAnIGFuZCAnc3RlcCcgYXJlIG5vdCBwYXNzZWQsIHRoZXkgc2hvdWxkIHJlbWFpbiB1bmNoYW5nZWQuXG4gICAgICAgIHZhciB2ID0gdmFsdWVHZXQoKTtcbiAgICAgICAgdmFyIHVwZGF0ZUFibGUgPSBbXG4gICAgICAgICAgICBcIm1hcmdpblwiLFxuICAgICAgICAgICAgXCJsaW1pdFwiLFxuICAgICAgICAgICAgXCJwYWRkaW5nXCIsXG4gICAgICAgICAgICBcInJhbmdlXCIsXG4gICAgICAgICAgICBcImFuaW1hdGVcIixcbiAgICAgICAgICAgIFwic25hcFwiLFxuICAgICAgICAgICAgXCJzdGVwXCIsXG4gICAgICAgICAgICBcImZvcm1hdFwiLFxuICAgICAgICAgICAgXCJwaXBzXCIsXG4gICAgICAgICAgICBcInRvb2x0aXBzXCIsXG4gICAgICAgIF07XG4gICAgICAgIC8vIE9ubHkgY2hhbmdlIG9wdGlvbnMgdGhhdCB3ZSdyZSBhY3R1YWxseSBwYXNzZWQgdG8gdXBkYXRlLlxuICAgICAgICB1cGRhdGVBYmxlLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgIC8vIENoZWNrIGZvciB1bmRlZmluZWQuIG51bGwgcmVtb3ZlcyB0aGUgdmFsdWUuXG4gICAgICAgICAgICBpZiAob3B0aW9uc1RvVXBkYXRlW25hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBvcmlnaW5hbE9wdGlvbnNbbmFtZV0gPSBvcHRpb25zVG9VcGRhdGVbbmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgbmV3T3B0aW9ucyA9IHRlc3RPcHRpb25zKG9yaWdpbmFsT3B0aW9ucyk7XG4gICAgICAgIC8vIExvYWQgbmV3IG9wdGlvbnMgaW50byB0aGUgc2xpZGVyIHN0YXRlXG4gICAgICAgIHVwZGF0ZUFibGUuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnNUb1VwZGF0ZVtuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9uc1tuYW1lXSA9IG5ld09wdGlvbnNbbmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBzY29wZV9TcGVjdHJ1bSA9IG5ld09wdGlvbnMuc3BlY3RydW07XG4gICAgICAgIC8vIExpbWl0LCBtYXJnaW4gYW5kIHBhZGRpbmcgZGVwZW5kIG9uIHRoZSBzcGVjdHJ1bSBidXQgYXJlIHN0b3JlZCBvdXRzaWRlIG9mIGl0LiAoIzY3NylcbiAgICAgICAgb3B0aW9ucy5tYXJnaW4gPSBuZXdPcHRpb25zLm1hcmdpbjtcbiAgICAgICAgb3B0aW9ucy5saW1pdCA9IG5ld09wdGlvbnMubGltaXQ7XG4gICAgICAgIG9wdGlvbnMucGFkZGluZyA9IG5ld09wdGlvbnMucGFkZGluZztcbiAgICAgICAgLy8gVXBkYXRlIHBpcHMsIHJlbW92ZXMgZXhpc3RpbmcuXG4gICAgICAgIGlmIChvcHRpb25zLnBpcHMpIHtcbiAgICAgICAgICAgIHBpcHMob3B0aW9ucy5waXBzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlbW92ZVBpcHMoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBVcGRhdGUgdG9vbHRpcHMsIHJlbW92ZXMgZXhpc3RpbmcuXG4gICAgICAgIGlmIChvcHRpb25zLnRvb2x0aXBzKSB7XG4gICAgICAgICAgICB0b29sdGlwcygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmVtb3ZlVG9vbHRpcHMoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBJbnZhbGlkYXRlIHRoZSBjdXJyZW50IHBvc2l0aW9uaW5nIHNvIHZhbHVlU2V0IGZvcmNlcyBhbiB1cGRhdGUuXG4gICAgICAgIHNjb3BlX0xvY2F0aW9ucyA9IFtdO1xuICAgICAgICB2YWx1ZVNldChpc1NldChvcHRpb25zVG9VcGRhdGUuc3RhcnQpID8gb3B0aW9uc1RvVXBkYXRlLnN0YXJ0IDogdiwgZmlyZVNldEV2ZW50KTtcbiAgICB9XG4gICAgLy8gSW5pdGlhbGl6YXRpb24gc3RlcHNcbiAgICBmdW5jdGlvbiBzZXR1cFNsaWRlcigpIHtcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBiYXNlIGVsZW1lbnQsIGluaXRpYWxpemUgSFRNTCBhbmQgc2V0IGNsYXNzZXMuXG4gICAgICAgIC8vIEFkZCBoYW5kbGVzIGFuZCBjb25uZWN0IGVsZW1lbnRzLlxuICAgICAgICBzY29wZV9CYXNlID0gYWRkU2xpZGVyKHNjb3BlX1RhcmdldCk7XG4gICAgICAgIGFkZEVsZW1lbnRzKG9wdGlvbnMuY29ubmVjdCwgc2NvcGVfQmFzZSk7XG4gICAgICAgIC8vIEF0dGFjaCB1c2VyIGV2ZW50cy5cbiAgICAgICAgYmluZFNsaWRlckV2ZW50cyhvcHRpb25zLmV2ZW50cyk7XG4gICAgICAgIC8vIFVzZSB0aGUgcHVibGljIHZhbHVlIG1ldGhvZCB0byBzZXQgdGhlIHN0YXJ0IHZhbHVlcy5cbiAgICAgICAgdmFsdWVTZXQob3B0aW9ucy5zdGFydCk7XG4gICAgICAgIGlmIChvcHRpb25zLnBpcHMpIHtcbiAgICAgICAgICAgIHBpcHMob3B0aW9ucy5waXBzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy50b29sdGlwcykge1xuICAgICAgICAgICAgdG9vbHRpcHMoKTtcbiAgICAgICAgfVxuICAgICAgICBhcmlhKCk7XG4gICAgfVxuICAgIHNldHVwU2xpZGVyKCk7XG4gICAgdmFyIHNjb3BlX1NlbGYgPSB7XG4gICAgICAgIGRlc3Ryb3k6IGRlc3Ryb3ksXG4gICAgICAgIHN0ZXBzOiBnZXROZXh0U3RlcHMsXG4gICAgICAgIG9uOiBiaW5kRXZlbnQsXG4gICAgICAgIG9mZjogcmVtb3ZlRXZlbnQsXG4gICAgICAgIGdldDogdmFsdWVHZXQsXG4gICAgICAgIHNldDogdmFsdWVTZXQsXG4gICAgICAgIHNldEhhbmRsZTogdmFsdWVTZXRIYW5kbGUsXG4gICAgICAgIHJlc2V0OiB2YWx1ZVJlc2V0LFxuICAgICAgICBkaXNhYmxlOiBkaXNhYmxlLFxuICAgICAgICBlbmFibGU6IGVuYWJsZSxcbiAgICAgICAgLy8gRXhwb3NlZCBmb3IgdW5pdCB0ZXN0aW5nLCBkb24ndCB1c2UgdGhpcyBpbiB5b3VyIGFwcGxpY2F0aW9uLlxuICAgICAgICBfX21vdmVIYW5kbGVzOiBmdW5jdGlvbiAodXB3YXJkLCBwcm9wb3NhbCwgaGFuZGxlTnVtYmVycykge1xuICAgICAgICAgICAgbW92ZUhhbmRsZXModXB3YXJkLCBwcm9wb3NhbCwgc2NvcGVfTG9jYXRpb25zLCBoYW5kbGVOdW1iZXJzKTtcbiAgICAgICAgfSxcbiAgICAgICAgb3B0aW9uczogb3JpZ2luYWxPcHRpb25zLFxuICAgICAgICB1cGRhdGVPcHRpb25zOiB1cGRhdGVPcHRpb25zLFxuICAgICAgICB0YXJnZXQ6IHNjb3BlX1RhcmdldCxcbiAgICAgICAgcmVtb3ZlUGlwczogcmVtb3ZlUGlwcyxcbiAgICAgICAgcmVtb3ZlVG9vbHRpcHM6IHJlbW92ZVRvb2x0aXBzLFxuICAgICAgICBnZXRQb3NpdGlvbnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBzY29wZV9Mb2NhdGlvbnMuc2xpY2UoKTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0VG9vbHRpcHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBzY29wZV9Ub29sdGlwcztcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0T3JpZ2luczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHNjb3BlX0hhbmRsZXM7XG4gICAgICAgIH0sXG4gICAgICAgIHBpcHM6IHBpcHMsIC8vIElzc3VlICM1OTRcbiAgICB9O1xuICAgIHJldHVybiBzY29wZV9TZWxmO1xufVxuLy8gUnVuIHRoZSBzdGFuZGFyZCBpbml0aWFsaXplclxuZnVuY3Rpb24gaW5pdGlhbGl6ZSh0YXJnZXQsIG9yaWdpbmFsT3B0aW9ucykge1xuICAgIGlmICghdGFyZ2V0IHx8ICF0YXJnZXQubm9kZU5hbWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogY3JlYXRlIHJlcXVpcmVzIGEgc2luZ2xlIGVsZW1lbnQsIGdvdDogXCIgKyB0YXJnZXQpO1xuICAgIH1cbiAgICAvLyBUaHJvdyBhbiBlcnJvciBpZiB0aGUgc2xpZGVyIHdhcyBhbHJlYWR5IGluaXRpYWxpemVkLlxuICAgIGlmICh0YXJnZXQubm9VaVNsaWRlcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyOiBTbGlkZXIgd2FzIGFscmVhZHkgaW5pdGlhbGl6ZWQuXCIpO1xuICAgIH1cbiAgICAvLyBUZXN0IHRoZSBvcHRpb25zIGFuZCBjcmVhdGUgdGhlIHNsaWRlciBlbnZpcm9ubWVudDtcbiAgICB2YXIgb3B0aW9ucyA9IHRlc3RPcHRpb25zKG9yaWdpbmFsT3B0aW9ucyk7XG4gICAgdmFyIGFwaSA9IHNjb3BlKHRhcmdldCwgb3B0aW9ucywgb3JpZ2luYWxPcHRpb25zKTtcbiAgICB0YXJnZXQubm9VaVNsaWRlciA9IGFwaTtcbiAgICByZXR1cm4gYXBpO1xufVxuZXhwb3J0IHsgaW5pdGlhbGl6ZSBhcyBjcmVhdGUgfTtcbmV4cG9ydCB7IGNzc0NsYXNzZXMgfTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgICAvLyBFeHBvc2VkIGZvciB1bml0IHRlc3RpbmcsIGRvbid0IHVzZSB0aGlzIGluIHlvdXIgYXBwbGljYXRpb24uXG4gICAgX19zcGVjdHJ1bTogU3BlY3RydW0sXG4gICAgLy8gQSByZWZlcmVuY2UgdG8gdGhlIGRlZmF1bHQgY2xhc3NlcywgYWxsb3dzIGdsb2JhbCBjaGFuZ2VzLlxuICAgIC8vIFVzZSB0aGUgY3NzQ2xhc3NlcyBvcHRpb24gZm9yIGNoYW5nZXMgdG8gb25lIHNsaWRlci5cbiAgICBjc3NDbGFzc2VzOiBjc3NDbGFzc2VzLFxuICAgIGNyZWF0ZTogaW5pdGlhbGl6ZSxcbn07XG4iLCAiaW1wb3J0IG5vVWlTbGlkZXIgZnJvbSAnbm91aXNsaWRlcic7XG5pbXBvcnQgJ25vdWlzbGlkZXIvZGlzdC9ub3Vpc2xpZGVyLmNzcyc7XG5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2xpZGVyKHtcbiAgICBlbGVtZW50LFxuICAgIHN0YXJ0LFxuICAgIGNvbm5lY3QsXG4gICAgcmFuZ2UgPSB7XG4gICAgICAgIG1pbjogMCxcbiAgICAgICAgbWF4OiAxMFxuICAgIH0sXG4gICAgc3RhdGUsXG4gICAgc3RlcCxcbiAgICBiZWhhdmlvdXIsXG4gICAgc25hcCxcbiAgICB0b29sdGlwcyxcbiAgICBvbkNoYW5nZSA9IGNvbnNvbGUubG9nLFxufSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHN0YXJ0LFxuICAgICAgICBlbGVtZW50LFxuICAgICAgICBjb25uZWN0LFxuICAgICAgICByYW5nZSxcbiAgICAgICAgY29tcG9uZW50OiBudWxsLFxuICAgICAgICBzdGF0ZSxcbiAgICAgICAgc3RlcCxcbiAgICAgICAgYmVoYXZpb3VyLFxuICAgICAgICB0b29sdGlwcyxcbiAgICAgICAgb25DaGFuZ2UsXG4gICAgICAgIGluaXQoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnBpcHMpXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICBub1VpU2xpZGVyLmNzc0NsYXNzZXMudGFyZ2V0ICs9ICcgcmFuZ2Utc2xpZGVyJztcblxuICAgICAgICAgICAgbGV0IHNsaWRlciA9IG5vVWlTbGlkZXIuY3JlYXRlKHRoaXMuY29tcG9uZW50LCB7XG4gICAgICAgICAgICAgICAgc3RhcnQ6IHdpbmRvdy5BbHBpbmUucmF3KHN0YXJ0KSxcbiAgICAgICAgICAgICAgICBjb25uZWN0OiB3aW5kb3cuQWxwaW5lLnJhdyhjb25uZWN0KSxcbiAgICAgICAgICAgICAgICByYW5nZTogd2luZG93LkFscGluZS5yYXcocmFuZ2UpLFxuICAgICAgICAgICAgICAgIHRvb2x0aXBzLFxuICAgICAgICAgICAgICAgIHN0ZXA6IHdpbmRvdy5BbHBpbmUucmF3KHN0ZXApLFxuICAgICAgICAgICAgICAgIGJlaGF2aW91cjogd2luZG93LkFscGluZS5yYXcoYmVoYXZpb3VyKSxcbiAgICAgICAgICAgICAgICBzbmFwOiB3aW5kb3cuQWxwaW5lLnJhdyhzbmFwKSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudC5ub1VpU2xpZGVyLm9uKCd1cGRhdGUnLCAodmFsdWVzKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdsaXZld2lyZTpsb2FkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzZXRJbnRlcnZhbCgoKSA9PiBMaXZld2lyZS5kaXNwYXRjaCgnbmV4dFNsb3QnKSwgNDAwMCk7XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5MaXZld2lyZS5kaXNwYXRjaCh0aGlzLnN0YXRlW2ldLCB2YWx1ZXNbaV0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59Il0sCiAgIm1hcHBpbmdzIjogIjtBQUNPLElBQUk7QUFBQSxDQUNWLFNBQVVBLFdBQVU7QUFDakIsRUFBQUEsVUFBUyxPQUFPLElBQUk7QUFDcEIsRUFBQUEsVUFBUyxPQUFPLElBQUk7QUFDcEIsRUFBQUEsVUFBUyxXQUFXLElBQUk7QUFDeEIsRUFBQUEsVUFBUyxPQUFPLElBQUk7QUFDcEIsRUFBQUEsVUFBUyxRQUFRLElBQUk7QUFDekIsR0FBRyxhQUFhLFdBQVcsQ0FBQyxFQUFFO0FBQ3ZCLElBQUk7QUFBQSxDQUNWLFNBQVVDLFdBQVU7QUFDakIsRUFBQUEsVUFBU0EsVUFBUyxNQUFNLElBQUksRUFBRSxJQUFJO0FBQ2xDLEVBQUFBLFVBQVNBLFVBQVMsU0FBUyxJQUFJLENBQUMsSUFBSTtBQUNwQyxFQUFBQSxVQUFTQSxVQUFTLFlBQVksSUFBSSxDQUFDLElBQUk7QUFDdkMsRUFBQUEsVUFBU0EsVUFBUyxZQUFZLElBQUksQ0FBQyxJQUFJO0FBQzNDLEdBQUcsYUFBYSxXQUFXLENBQUMsRUFBRTtBQUU5QixTQUFTLGlCQUFpQixPQUFPO0FBQzdCLFNBQU8sd0JBQXdCLEtBQUssS0FBSyxPQUFPLE1BQU0sU0FBUztBQUNuRTtBQUNBLFNBQVMsd0JBQXdCLE9BQU87QUFFcEMsU0FBTyxPQUFPLFVBQVUsWUFBWSxPQUFPLE1BQU0sT0FBTztBQUM1RDtBQUNBLFNBQVMsY0FBYyxJQUFJO0FBQ3ZCLEtBQUcsY0FBYyxZQUFZLEVBQUU7QUFDbkM7QUFDQSxTQUFTLE1BQU0sT0FBTztBQUNsQixTQUFPLFVBQVUsUUFBUSxVQUFVO0FBQ3ZDO0FBRUEsU0FBUyxlQUFlLEdBQUc7QUFDdkIsSUFBRSxlQUFlO0FBQ3JCO0FBRUEsU0FBUyxPQUFPLE9BQU87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RWhDLFVBQUlDLFVBQVMsbUJBQVcsT0FBTyxLQUFLLFdBQVc7QUFBQSxRQUMzQyxPQUFPLE9BQU8sT0FBTyxJQUFJLEtBQUs7QUFBQSxRQUM5QixTQUFTLE9BQU8sT0FBTyxJQUFJLE9BQU87QUFBQSxRQUNsQyxPQUFPLE9BQU8sT0FBTyxJQUFJLEtBQUs7QUFBQSxRQUM5QjtBQUFBLFFBQ0EsTUFBTSxPQUFPLE9BQU8sSUFBSSxJQUFJO0FBQUEsUUFDNUIsV0FBVyxPQUFPLE9BQU8sSUFBSSxTQUFTO0FBQUEsUUFDdEMsTUFBTSxPQUFPLE9BQU8sSUFBSSxJQUFJO0FBQUEsTUFDaEMsQ0FBQztBQUVELFdBQUssVUFBVSxXQUFXLEdBQUcsVUFBVSxDQUFDLFdBQVc7QUFFL0MsaUJBQVMsaUJBQWlCLGlCQUFpQixXQUFZO0FBQ25ELHNCQUFZLE1BQU0sU0FBUyxTQUFTLFVBQVUsR0FBRyxHQUFJO0FBQUEsUUFDekQsQ0FBQztBQUVELGlCQUFTLElBQUksR0FBRyxJQUFJLE9BQU8sUUFBUSxLQUFLO0FBQ3BDLGlCQUFPLFNBQVMsU0FBUyxLQUFLLE1BQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDO0FBQUEsUUFDckQ7QUFBQSxNQUNKLENBQUM7QUFBQSxJQUNMO0FBQUEsRUFDSjtBQUNKOyIsCiAgIm5hbWVzIjogWyJQaXBzTW9kZSIsICJQaXBzVHlwZSIsICJTcGVjdHJ1bSIsICJpbmRleCIsICJwaXBzIiwgIm9mZnNldCIsICJ0YXJnZXQiLCAic2xpZGVyIl0KfQo=
