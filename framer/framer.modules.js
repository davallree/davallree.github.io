require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Gradient":[function(require,module,exports){

/*
	 * USING THE GRADIENT MODULE

	 * Require the module
	gradient = require "Gradient"

	 * Apply a gradient
	layerA.style.background = gradient.top("yellow", "red")
	layerA.style.background = gradient.bottom("yellow", "red")
	layerA.style.background = gradient.left("yellow", "red")
	layerA.style.background = gradient.right("yellow", "red")
	layerA.style.background = gradient.angle("yellow", "red", -60)

	 * Three-color gradient syntax
	layerA.style.background = gradient.topThreeColor("yellow", "red", "green")
	layerA.style.background = gradient.bottomThreeColor("yellow", "red", "green")
	layerA.style.background = gradient.leftThreeColor("yellow", "red", "green")
	layerA.style.background = gradient.rightThreeColor("yellow", "red", "green")
	layerA.style.background = gradient.angleThreeColor("yellow", "red", "green", -60)

	 * Radial gradients
	layerA.style.background = gradient.radial("yellow", "red")
	layerA.style.background = gradient.radialThreeColor("yellow", "red", "green")

	 * Reshape a radial gradient
	layerA.style.background = gradient.radial("yellow", "red", originX: 0.5, originY: 0, scaleX: 2, scaleY: 1)

	 * originX, originY, scaleX and scaleY are percentages.
	 * An originX,originY of 0,0 centers the gradient in the upper left while
	 * 1,1 centers it in the lower right. 0.5,0.5 is the default center.

	 * Optionally set the gradient's spread
	layerA.style.background = gradient.top("yellow", "red", spread: 0.5) # 1 is default, 0 is no transition between colors

	 * Optionally set the gradient's offset (linear gradients only)
	layerA.style.background = gradient.top("yellow", "red", offset: 10) # 0 is no offset, 100 will push the gradient out of view

	 * Optionally change the CSS prefix
	layerA.style.background = gradient.top("yellow", "red", prefix: "moz") # webkit is default, hyphens are added for you

	 * GRADIENT LAYERS
	 * While a gradient can be applied to any existing layer, for convenience it is
	 * possible to create two types of gradient layers. If you wish to animate your
	 * gradients you will need to do so using one of these classes.

	layerA = new gradient.Layer
		firstColor: <string> (hex or rgba or named color)
		secondColor: <string> (hex or rgba or named color)
		thirdColor: <string> (hex or rgba or named color)
		direction: <string> ("top" || "bottom" || "left" || "right") or <number> (in degrees)
		prefix: <string> (hyphens are added for you)
		spread: <number> (0 is no transition)
		offset: <number>

	layerA = new gradient.RadialLayer
		firstColor: <string> (hex or rgba or named color)
		secondColor: <string> (hex or rgba or named color)
		thirdColor: <string> (hex or rgba or named color)
		prefix: <string> (hyphens are added for you)
		spread: <number> (0 is no transition)
		offset: <number>
		gradientOriginX: <number> (0 is left, 1 is right)
		gradientOriginY: <number> (0 is top, 1 is bottom)
		gradientScaleX: <number> (percentage, 1 is 100% scale)
		gradientScaleY: <number> (percentage, 1 is 100% scale)

	 * ANIMATING GRADIENTS

	layerA.animateGradient(<arguments>)

	 * Arguments
	firstColor: <string> (hex or rgba or named color)
	secondColor: <string> (hex or rgba or named color)
	thirdColor: <string> (hex or rgba or named color)
	direction: <string> ("top" || "bottom" || "left" || "right") or <number> (in degrees)
	spread: <number>
	offset: <number>
	time: <number>
	curve: <string> ("linear" || "ease-in" || "ease-out" || "ease-in-out" )

	 * Arguments for radial gradient animation
	originX: <number> (0 is left, 1 is right)
	originY: <number> (0 is top, 1 is bottom)
	scaleX: <number> (percentage, 1 is 100% scale)
	scaleY: <number> (percentage, 1 is 100% scale)

	 * Examples
	layerA.animateGradient(direction: -60, spread: 2, offset: 0, time: 2)
	layerA.animateGradient(offset: -50, curve: "ease-in-out")
	layerA.animateGradient(secondColor: "blue", spread: 0.5, scaleX: 2, originY: 1)

	 * Detect animation start and end
	layerA.on "gradientAnimationStart", ->
		print "animation start"

	layerA.on "gradientAnimationEnd", ->
		print "animation end"
 */
var defaults, easeIn, easeInOut, easeOut, linear, makeGradientString, makeGradientThreeColorString, makeRadialGradientString, makeRadialGradientThreeColorString,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

makeGradientString = function(arg) {
  var angle, direction, firstColor, offset, prefix, secondColor, spread;
  direction = arg.direction, firstColor = arg.firstColor, secondColor = arg.secondColor, prefix = arg.prefix, spread = arg.spread, offset = arg.offset, angle = arg.angle;
  if (angle == null) {
    angle = false;
  }
  if (angle === true) {
    direction = direction + "deg";
  }
  return prefix + "linear-gradient(" + direction + ", " + firstColor + " " + (Utils.modulate(spread, [1, 0], [0, 50], false) + offset) + "%, " + secondColor + " " + (Utils.modulate(spread, [1, 0], [100, 50], false) + offset) + "%)";
};

makeGradientThreeColorString = function(arg) {
  var angle, direction, firstColor, offset, prefix, secondColor, spread, thirdColor;
  direction = arg.direction, firstColor = arg.firstColor, secondColor = arg.secondColor, thirdColor = arg.thirdColor, prefix = arg.prefix, spread = arg.spread, offset = arg.offset, angle = arg.angle;
  if (angle == null) {
    angle = false;
  }
  if (angle === true) {
    direction = direction + "deg";
  }
  return prefix + "linear-gradient(" + direction + ", " + firstColor + " " + (Utils.modulate(spread, [1, 0], [0, 50], false) + offset) + "%, " + secondColor + " " + (50 + offset) + "%, " + thirdColor + " " + (Utils.modulate(spread, [1, 0], [100, 50], false) + offset) + "%)";
};

makeRadialGradientString = function(arg) {
  var ellipseHeight, ellipseWidth, ellipseX, ellipseY, firstColor, prefix, secondColor, spread;
  firstColor = arg.firstColor, secondColor = arg.secondColor, prefix = arg.prefix, spread = arg.spread, ellipseX = arg.ellipseX, ellipseY = arg.ellipseY, ellipseWidth = arg.ellipseWidth, ellipseHeight = arg.ellipseHeight;
  return prefix + "radial-gradient(" + ellipseX + "% " + ellipseY + "%, " + ellipseWidth + "% " + ellipseHeight + "%, " + firstColor + " " + (Utils.modulate(spread, [1, 0], [0, 50], false)) + "%, " + secondColor + " " + (Utils.modulate(spread, [1, 0], [100, 50], false)) + "%)";
};

makeRadialGradientThreeColorString = function(arg) {
  var ellipseHeight, ellipseWidth, ellipseX, ellipseY, firstColor, prefix, secondColor, spread, thirdColor;
  firstColor = arg.firstColor, secondColor = arg.secondColor, thirdColor = arg.thirdColor, prefix = arg.prefix, spread = arg.spread, ellipseX = arg.ellipseX, ellipseY = arg.ellipseY, ellipseWidth = arg.ellipseWidth, ellipseHeight = arg.ellipseHeight;
  return prefix + "radial-gradient(" + ellipseX + "% " + ellipseY + "%, " + ellipseWidth + "% " + ellipseHeight + "%, " + firstColor + " " + (Utils.modulate(spread, [1, 0], [0, 50], false)) + "%, " + secondColor + " 50%, " + thirdColor + " " + (Utils.modulate(spread, [1, 0], [100, 50], false)) + "%)";
};

linear = function(t) {
  return t;
};

easeIn = function(t) {
  return t * t;
};

easeOut = function(t) {
  return t * (2 - t);
};

easeInOut = function(t) {
  if (t < .5) {
    return 4 * t * t * t;
  } else {
    return (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }
};

exports.top = function(firstColor, secondColor, arg) {
  var offset, prefix, ref, spread;
  if (firstColor == null) {
    firstColor = "white";
  }
  if (secondColor == null) {
    secondColor = "black";
  }
  ref = arg != null ? arg : {}, prefix = ref.prefix, spread = ref.spread, offset = ref.offset;
  if (prefix == null) {
    prefix = "webkit";
  }
  if (spread == null) {
    spread = 1;
  }
  if (offset == null) {
    offset = 0;
  }
  if (prefix !== "") {
    prefix = "-" + prefix + "-";
  }
  return makeGradientString({
    direction: "top",
    firstColor: firstColor,
    secondColor: secondColor,
    prefix: prefix,
    spread: spread,
    offset: offset
  });
};

exports.topThreeColor = function(firstColor, secondColor, thirdColor, arg) {
  var offset, prefix, ref, spread;
  if (firstColor == null) {
    firstColor = "white";
  }
  if (secondColor == null) {
    secondColor = "gray";
  }
  if (thirdColor == null) {
    thirdColor = "black";
  }
  ref = arg != null ? arg : {}, prefix = ref.prefix, spread = ref.spread, offset = ref.offset;
  if (prefix == null) {
    prefix = "webkit";
  }
  if (spread == null) {
    spread = 1;
  }
  if (offset == null) {
    offset = 0;
  }
  if (prefix !== "") {
    prefix = "-" + prefix + "-";
  }
  return makeGradientThreeColorString({
    direction: "top",
    firstColor: firstColor,
    secondColor: secondColor,
    thirdColor: thirdColor,
    prefix: prefix,
    spread: spread,
    offset: offset
  });
};

exports.bottom = function(firstColor, secondColor, arg) {
  var offset, prefix, ref, spread;
  if (firstColor == null) {
    firstColor = "white";
  }
  if (secondColor == null) {
    secondColor = "black";
  }
  ref = arg != null ? arg : {}, prefix = ref.prefix, spread = ref.spread, offset = ref.offset;
  if (prefix == null) {
    prefix = "webkit";
  }
  if (spread == null) {
    spread = 1;
  }
  if (offset == null) {
    offset = 0;
  }
  if (prefix !== "") {
    prefix = "-" + prefix + "-";
  }
  return makeGradientString({
    direction: "bottom",
    firstColor: firstColor,
    secondColor: secondColor,
    prefix: prefix,
    spread: spread,
    offset: offset
  });
};

exports.bottomThreeColor = function(firstColor, secondColor, thirdColor, arg) {
  var offset, prefix, ref, spread;
  if (firstColor == null) {
    firstColor = "white";
  }
  if (secondColor == null) {
    secondColor = "gray";
  }
  if (thirdColor == null) {
    thirdColor = "black";
  }
  ref = arg != null ? arg : {}, prefix = ref.prefix, spread = ref.spread, offset = ref.offset;
  if (prefix == null) {
    prefix = "webkit";
  }
  if (spread == null) {
    spread = 1;
  }
  if (offset == null) {
    offset = 0;
  }
  if (prefix !== "") {
    prefix = "-" + prefix + "-";
  }
  return makeGradientThreeColorString({
    direction: "bottom",
    firstColor: firstColor,
    secondColor: secondColor,
    thirdColor: thirdColor,
    prefix: prefix,
    spread: spread,
    offset: offset
  });
};

exports.left = function(firstColor, secondColor, arg) {
  var offset, prefix, ref, spread;
  if (firstColor == null) {
    firstColor = "white";
  }
  if (secondColor == null) {
    secondColor = "black";
  }
  ref = arg != null ? arg : {}, prefix = ref.prefix, spread = ref.spread, offset = ref.offset;
  if (prefix == null) {
    prefix = "webkit";
  }
  if (spread == null) {
    spread = 1;
  }
  if (offset == null) {
    offset = 0;
  }
  if (prefix !== "") {
    prefix = "-" + prefix + "-";
  }
  return makeGradientString({
    direction: "left",
    firstColor: firstColor,
    secondColor: secondColor,
    prefix: prefix,
    spread: spread,
    offset: offset
  });
};

exports.leftThreeColor = function(firstColor, secondColor, thirdColor, arg) {
  var offset, prefix, ref, spread;
  if (firstColor == null) {
    firstColor = "white";
  }
  if (secondColor == null) {
    secondColor = "gray";
  }
  if (thirdColor == null) {
    thirdColor = "black";
  }
  ref = arg != null ? arg : {}, prefix = ref.prefix, spread = ref.spread, offset = ref.offset;
  if (prefix == null) {
    prefix = "webkit";
  }
  if (spread == null) {
    spread = 1;
  }
  if (offset == null) {
    offset = 0;
  }
  if (prefix !== "") {
    prefix = "-" + prefix + "-";
  }
  return makeGradientThreeColorString({
    direction: "left",
    firstColor: firstColor,
    secondColor: secondColor,
    thirdColor: thirdColor,
    prefix: prefix,
    spread: spread,
    offset: offset
  });
};

exports.right = function(firstColor, secondColor, arg) {
  var offset, prefix, ref, spread;
  if (firstColor == null) {
    firstColor = "white";
  }
  if (secondColor == null) {
    secondColor = "black";
  }
  ref = arg != null ? arg : {}, prefix = ref.prefix, spread = ref.spread, offset = ref.offset;
  if (prefix == null) {
    prefix = "webkit";
  }
  if (spread == null) {
    spread = 1;
  }
  if (offset == null) {
    offset = 0;
  }
  if (prefix !== "") {
    prefix = "-" + prefix + "-";
  }
  return makeGradientString({
    direction: "right",
    firstColor: firstColor,
    secondColor: secondColor,
    prefix: prefix,
    spread: spread,
    offset: offset
  });
};

exports.rightThreeColor = function(firstColor, secondColor, thirdColor, arg) {
  var offset, prefix, ref, spread;
  if (firstColor == null) {
    firstColor = "white";
  }
  if (secondColor == null) {
    secondColor = "gray";
  }
  if (thirdColor == null) {
    thirdColor = "black";
  }
  ref = arg != null ? arg : {}, prefix = ref.prefix, spread = ref.spread, offset = ref.offset;
  if (prefix == null) {
    prefix = "webkit";
  }
  if (spread == null) {
    spread = 1;
  }
  if (offset == null) {
    offset = 0;
  }
  if (prefix !== "") {
    prefix = "-" + prefix + "-";
  }
  return makeGradientThreeColorString({
    direction: "right",
    firstColor: firstColor,
    secondColor: secondColor,
    thirdColor: thirdColor,
    prefix: prefix,
    spread: spread,
    offset: offset
  });
};

exports.angle = function(firstColor, secondColor, degrees, arg) {
  var offset, prefix, ref, spread;
  if (firstColor == null) {
    firstColor = "white";
  }
  if (secondColor == null) {
    secondColor = "black";
  }
  if (degrees == null) {
    degrees = 135;
  }
  ref = arg != null ? arg : {}, prefix = ref.prefix, spread = ref.spread, offset = ref.offset;
  if (prefix == null) {
    prefix = "webkit";
  }
  if (spread == null) {
    spread = 1;
  }
  if (offset == null) {
    offset = 0;
  }
  if (prefix !== "") {
    prefix = "-" + prefix + "-";
  }
  return makeGradientString({
    direction: degrees,
    firstColor: firstColor,
    secondColor: secondColor,
    prefix: prefix,
    spread: spread,
    offset: offset,
    angle: true
  });
};

exports.angleThreeColor = function(firstColor, secondColor, thirdColor, degrees, arg) {
  var offset, prefix, ref, spread;
  if (firstColor == null) {
    firstColor = "white";
  }
  if (secondColor == null) {
    secondColor = "gray";
  }
  if (thirdColor == null) {
    thirdColor = "black";
  }
  if (degrees == null) {
    degrees = 135;
  }
  ref = arg != null ? arg : {}, prefix = ref.prefix, spread = ref.spread, offset = ref.offset;
  if (prefix == null) {
    prefix = "webkit";
  }
  if (spread == null) {
    spread = 1;
  }
  if (offset == null) {
    offset = 0;
  }
  if (prefix !== "") {
    prefix = "-" + prefix + "-";
  }
  return makeGradientThreeColorString({
    direction: degrees,
    firstColor: firstColor,
    secondColor: secondColor,
    thirdColor: thirdColor,
    prefix: prefix,
    spread: spread,
    offset: offset,
    angle: true
  });
};

exports.radial = function(firstColor, secondColor, arg) {
  var originX, originY, prefix, ref, scaleX, scaleY, spread;
  if (firstColor == null) {
    firstColor = "white";
  }
  if (secondColor == null) {
    secondColor = "black";
  }
  ref = arg != null ? arg : {}, prefix = ref.prefix, spread = ref.spread, originX = ref.originX, originY = ref.originY, scaleX = ref.scaleX, scaleY = ref.scaleY;
  if (prefix == null) {
    prefix = "webkit";
  }
  if (spread == null) {
    spread = 1;
  }
  if (originX == null) {
    originX = 0.5;
  }
  if (originY == null) {
    originY = 0.5;
  }
  originX = originX * 100;
  originY = originY * 100;
  if (scaleX == null) {
    scaleX = 1;
  }
  if (scaleY == null) {
    scaleY = 1;
  }
  scaleX = Utils.modulate(scaleX, [0, 100], [0, 70]) * 100;
  scaleY = Utils.modulate(scaleY, [0, 100], [0, 70]) * 100;
  if (prefix !== "") {
    prefix = "-" + prefix + "-";
  }
  return makeRadialGradientString({
    firstColor: firstColor,
    secondColor: secondColor,
    prefix: prefix,
    spread: spread,
    ellipseX: originX,
    ellipseY: originY,
    ellipseWidth: scaleX,
    ellipseHeight: scaleY
  });
};

defaults = {
  direction: "top",
  firstColor: "white",
  secondColor: "black",
  thirdColor: "",
  prefix: "webkit",
  spread: 1,
  offset: 0,
  angle: false,
  gradientOriginX: 0.5,
  gradientOriginY: 0.5,
  gradientScaleX: 1,
  gradientScaleY: 1
};

exports.radialThreeColor = function(firstColor, secondColor, thirdColor, arg) {
  var originX, originY, prefix, ref, scaleX, scaleY, spread;
  if (firstColor == null) {
    firstColor = "white";
  }
  if (secondColor == null) {
    secondColor = "gray";
  }
  if (thirdColor == null) {
    thirdColor = "black";
  }
  ref = arg != null ? arg : {}, prefix = ref.prefix, spread = ref.spread, originX = ref.originX, originY = ref.originY, scaleX = ref.scaleX, scaleY = ref.scaleY;
  if (prefix == null) {
    prefix = "webkit";
  }
  if (spread == null) {
    spread = 1;
  }
  if (originX == null) {
    originX = 0.5;
  }
  if (originY == null) {
    originY = 0.5;
  }
  originX = originX * 100;
  originY = originY * 100;
  if (scaleX == null) {
    scaleX = 1;
  }
  if (scaleY == null) {
    scaleY = 1;
  }
  scaleX = Utils.modulate(scaleX, [0, 100], [0, 70]) * 100;
  scaleY = Utils.modulate(scaleY, [0, 100], [0, 70]) * 100;
  if (prefix !== "") {
    prefix = "-" + prefix + "-";
  }
  return makeRadialGradientThreeColorString({
    firstColor: firstColor,
    secondColor: secondColor,
    thirdColor: thirdColor,
    prefix: prefix,
    spread: spread,
    ellipseX: originX,
    ellipseY: originY,
    ellipseWidth: scaleX,
    ellipseHeight: scaleY
  });
};

exports.Layer = (function(superClass) {
  extend(Layer, superClass);

  function Layer(options) {
    var gradient;
    this.options = options != null ? options : {};
    this.options = _.assign({}, defaults, this.options);
    Layer.__super__.constructor.call(this, this.options);
    if (this.options.prefix !== "") {
      this.options.prefix = "-" + this.options.prefix + "-";
    }
    if (typeof this.options.direction === "number") {
      this.options.angle = true;
    }
    gradient = "";
    if (this.options.thirdColor === "") {
      gradient = makeGradientString({
        direction: this.options.direction,
        firstColor: this.options.firstColor,
        secondColor: this.options.secondColor,
        prefix: this.options.prefix,
        spread: this.options.spread,
        offset: this.options.offset,
        angle: this.options.angle
      });
    } else {
      gradient = makeGradientThreeColorString({
        direction: this.options.direction,
        firstColor: this.options.firstColor,
        secondColor: this.options.secondColor,
        thirdColor: this.options.thirdColor,
        prefix: this.options.prefix,
        spread: this.options.spread,
        offset: this.options.offset,
        angle: this.options.angle
      });
    }
    this.style.background = gradient;
  }

  Layer.prototype.animateGradient = function(arg, frame) {
    var curve, direction, easedFrame, firstColor, frameDirection, frameFirstColor, frameOffset, frameSecondColor, frameSpread, frameThirdColor, gradient, offset, ref, secondColor, spread, startDirection, targetDirection, thirdColor, time, totalFrames;
    ref = arg != null ? arg : {}, firstColor = ref.firstColor, secondColor = ref.secondColor, thirdColor = ref.thirdColor, spread = ref.spread, offset = ref.offset, direction = ref.direction, time = ref.time, curve = ref.curve;
    if (frame == null) {
      frame = 0;
    }
    if (firstColor == null) {
      firstColor = this.options.firstColor;
    }
    if (secondColor == null) {
      secondColor = this.options.secondColor;
    }
    if (thirdColor == null) {
      thirdColor = this.options.thirdColor;
    }
    if (spread == null) {
      spread = this.options.spread;
    }
    if (offset == null) {
      offset = this.options.offset;
    }
    if (direction == null) {
      direction = this.options.direction;
    }
    if (time == null) {
      time = Framer.Defaults.Animation.time;
    }
    if (curve == null) {
      curve = "ease-out";
    }
    totalFrames = time / Framer.Loop.delta;
    if (frame === 0) {
      this.emit("gradientAnimationStart");
    } else if (frame === totalFrames) {
      this.emit("gradientAnimationEnd");
    }
    if (typeof this.options.direction === "string") {
      switch (this.options.direction) {
        case "top":
          startDirection = -90;
          break;
        case "bottom":
          startDirection = 90;
          break;
        case "left":
          startDirection = 0;
          break;
        case "right":
          startDirection = 180;
      }
    } else {
      startDirection = this.options.direction;
    }
    if (typeof direction === "string") {
      switch (direction) {
        case "top":
          targetDirection = -90;
          break;
        case "bottom":
          targetDirection = 90;
          break;
        case "left":
          targetDirection = 0;
          break;
        case "right":
          targetDirection = 180;
      }
    } else {
      targetDirection = direction;
    }
    if (frame < totalFrames) {
      switch (curve) {
        case "linear":
          easedFrame = linear(frame / totalFrames);
          break;
        case "ease-in":
          easedFrame = easeIn(frame / totalFrames);
          break;
        case "ease-out":
          easedFrame = easeOut(frame / totalFrames);
          break;
        case "ease-in-out":
          easedFrame = easeInOut(frame / totalFrames);
          break;
        default:
          easedFrame = linear(frame / totalFrames);
      }
      frameFirstColor = Color.mix(this.options.firstColor, firstColor, easedFrame);
      frameSecondColor = Color.mix(this.options.secondColor, secondColor, easedFrame);
      if (this.options.thirdColor !== "") {
        frameThirdColor = Color.mix(this.options.thirdColor, thirdColor, easedFrame);
      }
      frameSpread = Utils.modulate(easedFrame, [0, 1], [this.options.spread, spread]);
      frameOffset = Utils.modulate(easedFrame, [0, 1], [this.options.offset, offset]);
      frameDirection = Utils.modulate(easedFrame, [0, 1], [startDirection, targetDirection]);
      if (this.options.thirdColor === "") {
        gradient = makeGradientString({
          direction: frameDirection,
          firstColor: frameFirstColor,
          secondColor: frameSecondColor,
          prefix: this.options.prefix,
          spread: frameSpread,
          offset: frameOffset,
          angle: true
        });
      } else {
        gradient = makeGradientThreeColorString({
          direction: frameDirection,
          firstColor: frameFirstColor,
          secondColor: frameSecondColor,
          thirdColor: frameThirdColor,
          prefix: this.options.prefix,
          spread: frameSpread,
          offset: frameOffset,
          angle: true
        });
      }
      this.style.background = gradient;
      return Utils.delay(Framer.Loop.delta, (function(_this) {
        return function() {
          return _this.animateGradient({
            firstColor: firstColor,
            secondColor: secondColor,
            thirdColor: thirdColor,
            spread: spread,
            offset: offset,
            direction: direction,
            time: time,
            curve: curve
          }, frame + 1);
        };
      })(this));
    }
  };

  return Layer;

})(Layer);

exports.RadialLayer = (function(superClass) {
  extend(RadialLayer, superClass);

  function RadialLayer(options) {
    var gradient, gradientOriginX, gradientOriginY, gradientScaleX, gradientScaleY;
    this.options = options != null ? options : {};
    this.options = _.assign({}, defaults, this.options);
    RadialLayer.__super__.constructor.call(this, this.options);
    if (this.options.prefix !== "") {
      this.options.prefix = "-" + this.options.prefix + "-";
    }
    gradientOriginX = this.options.gradientOriginX * 100;
    gradientOriginY = this.options.gradientOriginY * 100;
    gradientScaleX = Utils.modulate(this.options.gradientScaleX, [0, 100], [0, 70]) * 100;
    gradientScaleY = Utils.modulate(this.options.gradientScaleY, [0, 100], [0, 70]) * 100;
    gradient = "";
    if (this.options.thirdColor === "") {
      gradient = makeRadialGradientString({
        firstColor: this.options.firstColor,
        secondColor: this.options.secondColor,
        prefix: this.options.prefix,
        spread: this.options.spread,
        ellipseX: gradientOriginX,
        ellipseY: gradientOriginY,
        ellipseWidth: gradientScaleX,
        ellipseHeight: gradientScaleY
      });
    } else {
      gradient = makeRadialGradientThreeColorString({
        firstColor: this.options.firstColor,
        secondColor: this.options.secondColor,
        thirdColor: this.options.thirdColor,
        prefix: this.options.prefix,
        spread: this.options.spread,
        ellipseX: gradientOriginX,
        ellipseY: gradientOriginY,
        ellipseWidth: gradientScaleX,
        ellipseHeight: gradientScaleY
      });
    }
    this.style.background = gradient;
  }

  RadialLayer.prototype.animateGradient = function(arg, frame) {
    var curve, easedFrame, firstColor, frameFirstColor, frameOriginX, frameOriginY, frameScaleX, frameScaleY, frameSecondColor, frameSpread, frameThirdColor, gradient, originX, originY, ref, scaleX, scaleY, secondColor, spread, thirdColor, time, totalFrames;
    ref = arg != null ? arg : {}, firstColor = ref.firstColor, secondColor = ref.secondColor, thirdColor = ref.thirdColor, originX = ref.originX, originY = ref.originY, scaleX = ref.scaleX, scaleY = ref.scaleY, spread = ref.spread, time = ref.time, curve = ref.curve;
    if (frame == null) {
      frame = 0;
    }
    if (firstColor == null) {
      firstColor = this.options.firstColor;
    }
    if (secondColor == null) {
      secondColor = this.options.secondColor;
    }
    if (thirdColor == null) {
      thirdColor = this.options.thirdColor;
    }
    if (originX == null) {
      originX = this.options.gradientOriginX;
    }
    if (originY == null) {
      originY = this.options.gradientOriginY;
    }
    if (scaleX == null) {
      scaleX = this.options.gradientScaleX;
    }
    if (scaleY == null) {
      scaleY = this.options.gradientScaleY;
    }
    if (spread == null) {
      spread = this.options.spread;
    }
    if (time == null) {
      time = Framer.Defaults.Animation.time;
    }
    if (curve == null) {
      curve = "ease-out";
    }
    totalFrames = time / Framer.Loop.delta;
    if (frame === 0) {
      this.emit("gradientAnimationStart");
    } else if (frame === totalFrames) {
      this.emit("gradientAnimationEnd");
    }
    if (frame < totalFrames) {
      switch (curve) {
        case "linear":
          easedFrame = linear(frame / totalFrames);
          break;
        case "ease-in":
          easedFrame = easeIn(frame / totalFrames);
          break;
        case "ease-out":
          easedFrame = easeOut(frame / totalFrames);
          break;
        case "ease-in-out":
          easedFrame = easeInOut(frame / totalFrames);
          break;
        default:
          easedFrame = linear(frame / totalFrames);
      }
      frameFirstColor = Color.mix(this.options.firstColor, firstColor, easedFrame);
      frameSecondColor = Color.mix(this.options.secondColor, secondColor, easedFrame);
      if (this.options.thirdColor !== "") {
        frameThirdColor = Color.mix(this.options.thirdColor, thirdColor, easedFrame);
      }
      frameSpread = Utils.modulate(easedFrame, [0, 1], [this.options.spread, spread]);
      frameOriginX = Utils.modulate(easedFrame, [0, 1], [this.options.gradientOriginX, originX]) * 100;
      frameOriginY = Utils.modulate(easedFrame, [0, 1], [this.options.gradientOriginY, originY]) * 100;
      frameScaleX = Utils.modulate(easedFrame, [0, 1], [this.options.gradientScaleX, scaleX]);
      frameScaleY = Utils.modulate(frame, [0, 1], [this.options.gradientScaleY, scaleY]);
      frameScaleX = Utils.modulate(frameScaleX, [0, 100], [0, 70]) * 100;
      frameScaleY = Utils.modulate(frameScaleY, [0, 100], [0, 70]) * 100;
      if (this.options.thirdColor === "") {
        gradient = makeRadialGradientString({
          firstColor: frameFirstColor,
          secondColor: frameSecondColor,
          prefix: this.options.prefix,
          spread: frameSpread,
          ellipseX: frameOriginX,
          ellipseY: frameOriginY,
          ellipseWidth: frameScaleX,
          ellipseHeight: frameScaleY
        });
      } else {
        gradient = makeRadialGradientThreeColorString({
          firstColor: frameFirstColor,
          secondColor: frameSecondColor,
          thirdColor: frameThirdColor,
          prefix: this.options.prefix,
          spread: frameSpread,
          ellipseX: frameOriginX,
          ellipseY: frameOriginY,
          ellipseWidth: frameScaleX,
          ellipseHeight: frameScaleY
        });
      }
      this.style.background = gradient;
      return Utils.delay(Framer.Loop.delta, (function(_this) {
        return function() {
          return _this.animateGradient({
            firstColor: firstColor,
            secondColor: secondColor,
            thirdColor: thirdColor,
            originX: originX,
            originY: originY,
            scaleX: scaleX,
            scaleY: scaleY,
            spread: spread,
            time: time,
            curve: curve
          }, frame + 1);
        };
      })(this));
    }
  };

  return RadialLayer;

})(Layer);


},{}],"myModule":[function(require,module,exports){
exports.myVar = "myVariable";

exports.myFunction = function() {
  return print("myFunction is running");
};

exports.myArray = [1, 2, 3];


},{}],"simpleripple":[function(require,module,exports){
exports.ripple = function(event, layer) {
  var coords, feedbackcolor, ourfancylayer, rippleCircle, ripplecolor, ripplesize, superfeedback;
  ourfancylayer = layer;
  layer.clip = true;
  ripplecolor = "rgba(59, 59, 59, 0.10)";
  feedbackcolor = "rgba(135, 135, 135, 0.10)";
  ripplesize = layer.height;
  superfeedback = new Layer({
    parent: layer,
    name: "superfeedback",
    width: layer.width,
    height: layer.height,
    opacity: 0,
    backgroundColor: feedbackcolor
  });
  superfeedback.animate({
    opacity: 1,
    options: {
      time: 3,
      curve: "cubic-bezier(0.4, 0.0, 0.6, .5)"
    }
  });
  layer.onTouchEnd(function() {
    superfeedback.animate({
      opacity: 0,
      options: {
        time: 0.5,
        curve: "cubic-bezier(0.4, 0.0, 0.6, .5)"
      }
    });
    return Utils.delay(0.3, function() {
      return superfeedback.destroy();
    });
  });
  coords = Canvas.convertPointToLayer(event, layer);
  rippleCircle = new Layer({
    parent: layer,
    name: "simple ripple",
    scale: 0.2,
    width: ripplesize,
    height: ripplesize,
    backgroundColor: ripplecolor,
    borderRadius: ripplesize,
    x: coords.x - (ripplesize / 2),
    y: coords.y - (ripplesize / 2)
  });
  rippleCircle.animate({
    scale: 3,
    borderRadius: 60,
    opacity: 0,
    options: {
      time: 2
    }
  });
  return rippleCircle.onAnimationEnd(function() {
    return rippleCircle.destroy();
  });
};


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL2RhdmFsbHJlZS9Eb2N1bWVudHMvRnJhbWVyIFN0dWZmL0V4cGVyaW1lbnRzL21hZ2ljIGdyYWRpZW50cy5mcmFtZXIvbW9kdWxlcy9zaW1wbGVyaXBwbGUuY29mZmVlIiwiLi4vLi4vLi4vLi4vLi4vVXNlcnMvZGF2YWxscmVlL0RvY3VtZW50cy9GcmFtZXIgU3R1ZmYvRXhwZXJpbWVudHMvbWFnaWMgZ3JhZGllbnRzLmZyYW1lci9tb2R1bGVzL215TW9kdWxlLmNvZmZlZSIsIi4uLy4uLy4uLy4uLy4uL1VzZXJzL2RhdmFsbHJlZS9Eb2N1bWVudHMvRnJhbWVyIFN0dWZmL0V4cGVyaW1lbnRzL21hZ2ljIGdyYWRpZW50cy5mcmFtZXIvbW9kdWxlcy9HcmFkaWVudC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiMgQ3JlYXRlZCBieSBNYXJpZSBTY2h3ZWl6IG9uIDE2IFNlcHRlbWJlciAyMDE3XG4jIFxuIyBVc2UgdG8gY3JlYXRlIGFuZCBkZXNpZ24gYW4gYW5kcm9pZCByaXBwbGUgdG91Y2ggZWZmZWN0XG4jXG4jIFRvIEdldCBTdGFydGVkLi4uXG4jXG4jIDEuIFBsYWNlIHRoaXMgZmlsZSBpbiBGcmFtZXIgU3R1ZGlvIG1vZHVsZXMgZGlyZWN0b3J5XG4jXG4jIDIuIEluIHlvdXIgcHJvamVjdCBpbmNsdWRlOlxuIyAgICAgcmlwcGxlID0gcmVxdWlyZShcInNpbXBsZXJpcHBsZVwiKS5yaXBwbGVcbiNcbiMgMy4gQWN0aXZhdGUgdGhlIHJpcHBsZSBieSBhZGRpbmc6XG4jICAgICB5b3VybGF5ZXIub24oRXZlbnRzLlRvdWNoU3RhcnQsIHJpcHBsZSlcblxuXG5cbmV4cG9ydHMucmlwcGxlID0gKGV2ZW50LCBsYXllcikgLT5cbiMgQ29vcmRpbmF0ZXMgcmVsYXRpdmUgdG8gYSBwYXJlbnQgZWxlbWVudCBmb3IgdGhlIHJpcHBsZVxuXHRvdXJmYW5jeWxheWVyID0gbGF5ZXJcblx0bGF5ZXIuY2xpcCA9IHRydWVcblxuXHRcbiAgICAjVmFyaWFibGVzIHRvIGNvbmZpZ3VyZSB5b3VyIHJpcHBsZSBhbmQgZmVlZGJhY2tcblx0cmlwcGxlY29sb3IgPSBcInJnYmEoNTksIDU5LCA1OSwgMC4xMClcIlxuXHRmZWVkYmFja2NvbG9yID0gXCJyZ2JhKDEzNSwgMTM1LCAxMzUsIDAuMTApXCJcblx0cmlwcGxlc2l6ZSA9IGxheWVyLmhlaWdodFxuXG4gICAgIyBDcmVhdGUgYSB0b3VjaCBmZWVkYmFja1xuXG5cdHN1cGVyZmVlZGJhY2sgPSBuZXcgTGF5ZXJcblx0XHRwYXJlbnQ6IGxheWVyXG5cdFx0bmFtZTogXCJzdXBlcmZlZWRiYWNrXCJcblx0XHR3aWR0aDogbGF5ZXIud2lkdGhcblx0XHRoZWlnaHQ6IGxheWVyLmhlaWdodFxuXHRcdG9wYWNpdHk6IDBcblx0XHRiYWNrZ3JvdW5kQ29sb3I6ZmVlZGJhY2tjb2xvclxuXG5cdHN1cGVyZmVlZGJhY2suYW5pbWF0ZVxuXHRcdG9wYWNpdHk6IDFcblx0XHRvcHRpb25zOlxuXHRcdFx0dGltZTogM1xuXHRcdFx0Y3VydmU6IFwiY3ViaWMtYmV6aWVyKDAuNCwgMC4wLCAwLjYsIC41KVwiXG5cdFx0XHRcblx0bGF5ZXIub25Ub3VjaEVuZCAtPlxuXG5cdFx0I2hpZGUgZmVlZGJhY2sgbGF5ZXJcblx0XHRzdXBlcmZlZWRiYWNrLmFuaW1hdGVcblx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdG9wdGlvbnM6XG5cdFx0XHRcdHRpbWU6IDAuNVxuXHRcdFx0XHRjdXJ2ZTogXCJjdWJpYy1iZXppZXIoMC40LCAwLjAsIDAuNiwgLjUpXCJcblx0XHQjZGVzdHJveSBmZWVkYmFjayBsYXllclxuXHRcdFV0aWxzLmRlbGF5IDAuMywgLT5cdFxuXHRcdFx0c3VwZXJmZWVkYmFjay5kZXN0cm95KClcblxuXHRjb29yZHMgPSBDYW52YXMuY29udmVydFBvaW50VG9MYXllcihldmVudCwgbGF5ZXIpXG5cdCNwcmludCBjb29yZHNcblxuICAgICNDcmVhdGUgYSBMYXllciBuYW1lZCBzaW1wbGUgcmlwcGxlIGFuZCB0aGUgZXZlbnQgbGF5ZXIgYXMgcGFyZW50XG5cblx0cmlwcGxlQ2lyY2xlID0gbmV3IExheWVyXG5cdFx0cGFyZW50OiBsYXllclxuXHRcdG5hbWU6IFwic2ltcGxlIHJpcHBsZVwiXG5cdFx0c2NhbGU6IDAuMlxuXHRcdHdpZHRoOiByaXBwbGVzaXplXG5cdFx0aGVpZ2h0OiByaXBwbGVzaXplXG5cdFx0YmFja2dyb3VuZENvbG9yOnJpcHBsZWNvbG9yXG5cdFx0Ym9yZGVyUmFkaXVzOiByaXBwbGVzaXplXG5cdFx0eDogY29vcmRzLnggLSAocmlwcGxlc2l6ZSAvIDIpXG5cdFx0eTogY29vcmRzLnkgLSAocmlwcGxlc2l6ZSAvIDIpXG5cbiAgICAjQW5pbWF0ZSB0aGUgcmlwcGxlXG5cblx0cmlwcGxlQ2lyY2xlLmFuaW1hdGVcblx0XHRzY2FsZTogM1xuXHRcdGJvcmRlclJhZGl1czogNjBcblx0XHRvcGFjaXR5OiAwXG5cdFx0b3B0aW9uczpcblx0XHRcdHRpbWU6IDJcblx0XG4gICAgI0tpbGwgaXQgYWZ0ZXIgdGhlIGFuaW1hdGlvbiBoYXMgZW5kZWRcblxuXHRyaXBwbGVDaXJjbGUub25BbmltYXRpb25FbmQgLT5cblx0XHRyaXBwbGVDaXJjbGUuZGVzdHJveSgpXG4iLCIjIEFkZCB0aGUgZm9sbG93aW5nIGxpbmUgdG8geW91ciBwcm9qZWN0IGluIEZyYW1lciBTdHVkaW8uIFxuIyBteU1vZHVsZSA9IHJlcXVpcmUgXCJteU1vZHVsZVwiXG4jIFJlZmVyZW5jZSB0aGUgY29udGVudHMgYnkgbmFtZSwgbGlrZSBteU1vZHVsZS5teUZ1bmN0aW9uKCkgb3IgbXlNb2R1bGUubXlWYXJcblxuZXhwb3J0cy5teVZhciA9IFwibXlWYXJpYWJsZVwiXG5cbmV4cG9ydHMubXlGdW5jdGlvbiA9IC0+XG5cdHByaW50IFwibXlGdW5jdGlvbiBpcyBydW5uaW5nXCJcblxuZXhwb3J0cy5teUFycmF5ID0gWzEsIDIsIDNdIiwiIyMjXG5cdCMgVVNJTkcgVEhFIEdSQURJRU5UIE1PRFVMRVxuXG5cdCMgUmVxdWlyZSB0aGUgbW9kdWxlXG5cdGdyYWRpZW50ID0gcmVxdWlyZSBcIkdyYWRpZW50XCJcblxuXHQjIEFwcGx5IGEgZ3JhZGllbnRcblx0bGF5ZXJBLnN0eWxlLmJhY2tncm91bmQgPSBncmFkaWVudC50b3AoXCJ5ZWxsb3dcIiwgXCJyZWRcIilcblx0bGF5ZXJBLnN0eWxlLmJhY2tncm91bmQgPSBncmFkaWVudC5ib3R0b20oXCJ5ZWxsb3dcIiwgXCJyZWRcIilcblx0bGF5ZXJBLnN0eWxlLmJhY2tncm91bmQgPSBncmFkaWVudC5sZWZ0KFwieWVsbG93XCIsIFwicmVkXCIpXG5cdGxheWVyQS5zdHlsZS5iYWNrZ3JvdW5kID0gZ3JhZGllbnQucmlnaHQoXCJ5ZWxsb3dcIiwgXCJyZWRcIilcblx0bGF5ZXJBLnN0eWxlLmJhY2tncm91bmQgPSBncmFkaWVudC5hbmdsZShcInllbGxvd1wiLCBcInJlZFwiLCAtNjApXG5cblx0IyBUaHJlZS1jb2xvciBncmFkaWVudCBzeW50YXhcblx0bGF5ZXJBLnN0eWxlLmJhY2tncm91bmQgPSBncmFkaWVudC50b3BUaHJlZUNvbG9yKFwieWVsbG93XCIsIFwicmVkXCIsIFwiZ3JlZW5cIilcblx0bGF5ZXJBLnN0eWxlLmJhY2tncm91bmQgPSBncmFkaWVudC5ib3R0b21UaHJlZUNvbG9yKFwieWVsbG93XCIsIFwicmVkXCIsIFwiZ3JlZW5cIilcblx0bGF5ZXJBLnN0eWxlLmJhY2tncm91bmQgPSBncmFkaWVudC5sZWZ0VGhyZWVDb2xvcihcInllbGxvd1wiLCBcInJlZFwiLCBcImdyZWVuXCIpXG5cdGxheWVyQS5zdHlsZS5iYWNrZ3JvdW5kID0gZ3JhZGllbnQucmlnaHRUaHJlZUNvbG9yKFwieWVsbG93XCIsIFwicmVkXCIsIFwiZ3JlZW5cIilcblx0bGF5ZXJBLnN0eWxlLmJhY2tncm91bmQgPSBncmFkaWVudC5hbmdsZVRocmVlQ29sb3IoXCJ5ZWxsb3dcIiwgXCJyZWRcIiwgXCJncmVlblwiLCAtNjApXG5cblx0IyBSYWRpYWwgZ3JhZGllbnRzXG5cdGxheWVyQS5zdHlsZS5iYWNrZ3JvdW5kID0gZ3JhZGllbnQucmFkaWFsKFwieWVsbG93XCIsIFwicmVkXCIpXG5cdGxheWVyQS5zdHlsZS5iYWNrZ3JvdW5kID0gZ3JhZGllbnQucmFkaWFsVGhyZWVDb2xvcihcInllbGxvd1wiLCBcInJlZFwiLCBcImdyZWVuXCIpXG5cblx0IyBSZXNoYXBlIGEgcmFkaWFsIGdyYWRpZW50XG5cdGxheWVyQS5zdHlsZS5iYWNrZ3JvdW5kID0gZ3JhZGllbnQucmFkaWFsKFwieWVsbG93XCIsIFwicmVkXCIsIG9yaWdpblg6IDAuNSwgb3JpZ2luWTogMCwgc2NhbGVYOiAyLCBzY2FsZVk6IDEpXG5cblx0IyBvcmlnaW5YLCBvcmlnaW5ZLCBzY2FsZVggYW5kIHNjYWxlWSBhcmUgcGVyY2VudGFnZXMuXG5cdCMgQW4gb3JpZ2luWCxvcmlnaW5ZIG9mIDAsMCBjZW50ZXJzIHRoZSBncmFkaWVudCBpbiB0aGUgdXBwZXIgbGVmdCB3aGlsZVxuXHQjIDEsMSBjZW50ZXJzIGl0IGluIHRoZSBsb3dlciByaWdodC4gMC41LDAuNSBpcyB0aGUgZGVmYXVsdCBjZW50ZXIuXG5cblx0IyBPcHRpb25hbGx5IHNldCB0aGUgZ3JhZGllbnQncyBzcHJlYWRcblx0bGF5ZXJBLnN0eWxlLmJhY2tncm91bmQgPSBncmFkaWVudC50b3AoXCJ5ZWxsb3dcIiwgXCJyZWRcIiwgc3ByZWFkOiAwLjUpICMgMSBpcyBkZWZhdWx0LCAwIGlzIG5vIHRyYW5zaXRpb24gYmV0d2VlbiBjb2xvcnNcblxuXHQjIE9wdGlvbmFsbHkgc2V0IHRoZSBncmFkaWVudCdzIG9mZnNldCAobGluZWFyIGdyYWRpZW50cyBvbmx5KVxuXHRsYXllckEuc3R5bGUuYmFja2dyb3VuZCA9IGdyYWRpZW50LnRvcChcInllbGxvd1wiLCBcInJlZFwiLCBvZmZzZXQ6IDEwKSAjIDAgaXMgbm8gb2Zmc2V0LCAxMDAgd2lsbCBwdXNoIHRoZSBncmFkaWVudCBvdXQgb2Ygdmlld1xuXG5cdCMgT3B0aW9uYWxseSBjaGFuZ2UgdGhlIENTUyBwcmVmaXhcblx0bGF5ZXJBLnN0eWxlLmJhY2tncm91bmQgPSBncmFkaWVudC50b3AoXCJ5ZWxsb3dcIiwgXCJyZWRcIiwgcHJlZml4OiBcIm1velwiKSAjIHdlYmtpdCBpcyBkZWZhdWx0LCBoeXBoZW5zIGFyZSBhZGRlZCBmb3IgeW91XG5cblx0IyBHUkFESUVOVCBMQVlFUlNcblx0IyBXaGlsZSBhIGdyYWRpZW50IGNhbiBiZSBhcHBsaWVkIHRvIGFueSBleGlzdGluZyBsYXllciwgZm9yIGNvbnZlbmllbmNlIGl0IGlzXG5cdCMgcG9zc2libGUgdG8gY3JlYXRlIHR3byB0eXBlcyBvZiBncmFkaWVudCBsYXllcnMuIElmIHlvdSB3aXNoIHRvIGFuaW1hdGUgeW91clxuXHQjIGdyYWRpZW50cyB5b3Ugd2lsbCBuZWVkIHRvIGRvIHNvIHVzaW5nIG9uZSBvZiB0aGVzZSBjbGFzc2VzLlxuXG5cdGxheWVyQSA9IG5ldyBncmFkaWVudC5MYXllclxuXHRcdGZpcnN0Q29sb3I6IDxzdHJpbmc+IChoZXggb3IgcmdiYSBvciBuYW1lZCBjb2xvcilcblx0XHRzZWNvbmRDb2xvcjogPHN0cmluZz4gKGhleCBvciByZ2JhIG9yIG5hbWVkIGNvbG9yKVxuXHRcdHRoaXJkQ29sb3I6IDxzdHJpbmc+IChoZXggb3IgcmdiYSBvciBuYW1lZCBjb2xvcilcblx0XHRkaXJlY3Rpb246IDxzdHJpbmc+IChcInRvcFwiIHx8IFwiYm90dG9tXCIgfHwgXCJsZWZ0XCIgfHwgXCJyaWdodFwiKSBvciA8bnVtYmVyPiAoaW4gZGVncmVlcylcblx0XHRwcmVmaXg6IDxzdHJpbmc+IChoeXBoZW5zIGFyZSBhZGRlZCBmb3IgeW91KVxuXHRcdHNwcmVhZDogPG51bWJlcj4gKDAgaXMgbm8gdHJhbnNpdGlvbilcblx0XHRvZmZzZXQ6IDxudW1iZXI+XG5cblx0bGF5ZXJBID0gbmV3IGdyYWRpZW50LlJhZGlhbExheWVyXG5cdFx0Zmlyc3RDb2xvcjogPHN0cmluZz4gKGhleCBvciByZ2JhIG9yIG5hbWVkIGNvbG9yKVxuXHRcdHNlY29uZENvbG9yOiA8c3RyaW5nPiAoaGV4IG9yIHJnYmEgb3IgbmFtZWQgY29sb3IpXG5cdFx0dGhpcmRDb2xvcjogPHN0cmluZz4gKGhleCBvciByZ2JhIG9yIG5hbWVkIGNvbG9yKVxuXHRcdHByZWZpeDogPHN0cmluZz4gKGh5cGhlbnMgYXJlIGFkZGVkIGZvciB5b3UpXG5cdFx0c3ByZWFkOiA8bnVtYmVyPiAoMCBpcyBubyB0cmFuc2l0aW9uKVxuXHRcdG9mZnNldDogPG51bWJlcj5cblx0XHRncmFkaWVudE9yaWdpblg6IDxudW1iZXI+ICgwIGlzIGxlZnQsIDEgaXMgcmlnaHQpXG5cdFx0Z3JhZGllbnRPcmlnaW5ZOiA8bnVtYmVyPiAoMCBpcyB0b3AsIDEgaXMgYm90dG9tKVxuXHRcdGdyYWRpZW50U2NhbGVYOiA8bnVtYmVyPiAocGVyY2VudGFnZSwgMSBpcyAxMDAlIHNjYWxlKVxuXHRcdGdyYWRpZW50U2NhbGVZOiA8bnVtYmVyPiAocGVyY2VudGFnZSwgMSBpcyAxMDAlIHNjYWxlKVxuXG5cdCMgQU5JTUFUSU5HIEdSQURJRU5UU1xuXG5cdGxheWVyQS5hbmltYXRlR3JhZGllbnQoPGFyZ3VtZW50cz4pXG5cblx0IyBBcmd1bWVudHNcblx0Zmlyc3RDb2xvcjogPHN0cmluZz4gKGhleCBvciByZ2JhIG9yIG5hbWVkIGNvbG9yKVxuXHRzZWNvbmRDb2xvcjogPHN0cmluZz4gKGhleCBvciByZ2JhIG9yIG5hbWVkIGNvbG9yKVxuXHR0aGlyZENvbG9yOiA8c3RyaW5nPiAoaGV4IG9yIHJnYmEgb3IgbmFtZWQgY29sb3IpXG5cdGRpcmVjdGlvbjogPHN0cmluZz4gKFwidG9wXCIgfHwgXCJib3R0b21cIiB8fCBcImxlZnRcIiB8fCBcInJpZ2h0XCIpIG9yIDxudW1iZXI+IChpbiBkZWdyZWVzKVxuXHRzcHJlYWQ6IDxudW1iZXI+XG5cdG9mZnNldDogPG51bWJlcj5cblx0dGltZTogPG51bWJlcj5cblx0Y3VydmU6IDxzdHJpbmc+IChcImxpbmVhclwiIHx8IFwiZWFzZS1pblwiIHx8IFwiZWFzZS1vdXRcIiB8fCBcImVhc2UtaW4tb3V0XCIgKVxuXG5cdCMgQXJndW1lbnRzIGZvciByYWRpYWwgZ3JhZGllbnQgYW5pbWF0aW9uXG5cdG9yaWdpblg6IDxudW1iZXI+ICgwIGlzIGxlZnQsIDEgaXMgcmlnaHQpXG5cdG9yaWdpblk6IDxudW1iZXI+ICgwIGlzIHRvcCwgMSBpcyBib3R0b20pXG5cdHNjYWxlWDogPG51bWJlcj4gKHBlcmNlbnRhZ2UsIDEgaXMgMTAwJSBzY2FsZSlcblx0c2NhbGVZOiA8bnVtYmVyPiAocGVyY2VudGFnZSwgMSBpcyAxMDAlIHNjYWxlKVxuXG5cdCMgRXhhbXBsZXNcblx0bGF5ZXJBLmFuaW1hdGVHcmFkaWVudChkaXJlY3Rpb246IC02MCwgc3ByZWFkOiAyLCBvZmZzZXQ6IDAsIHRpbWU6IDIpXG5cdGxheWVyQS5hbmltYXRlR3JhZGllbnQob2Zmc2V0OiAtNTAsIGN1cnZlOiBcImVhc2UtaW4tb3V0XCIpXG5cdGxheWVyQS5hbmltYXRlR3JhZGllbnQoc2Vjb25kQ29sb3I6IFwiYmx1ZVwiLCBzcHJlYWQ6IDAuNSwgc2NhbGVYOiAyLCBvcmlnaW5ZOiAxKVxuXG5cdCMgRGV0ZWN0IGFuaW1hdGlvbiBzdGFydCBhbmQgZW5kXG5cdGxheWVyQS5vbiBcImdyYWRpZW50QW5pbWF0aW9uU3RhcnRcIiwgLT5cblx0XHRwcmludCBcImFuaW1hdGlvbiBzdGFydFwiXG5cblx0bGF5ZXJBLm9uIFwiZ3JhZGllbnRBbmltYXRpb25FbmRcIiwgLT5cblx0XHRwcmludCBcImFuaW1hdGlvbiBlbmRcIlxuIyMjXG5cbiMgc3RyaW5nIGdlbmVyYXRvcnNcbm1ha2VHcmFkaWVudFN0cmluZyA9ICh7ZGlyZWN0aW9uLCBmaXJzdENvbG9yLCBzZWNvbmRDb2xvciwgcHJlZml4LCBzcHJlYWQsIG9mZnNldCwgYW5nbGV9KSAtPlxuXHRhbmdsZSA/PSBmYWxzZVxuXHRpZiBhbmdsZSA9PSB0cnVlXG5cdFx0ZGlyZWN0aW9uID0gZGlyZWN0aW9uICsgXCJkZWdcIlxuXHRyZXR1cm4gXCIje3ByZWZpeH1saW5lYXItZ3JhZGllbnQoI3tkaXJlY3Rpb259LCAje2ZpcnN0Q29sb3J9ICN7VXRpbHMubW9kdWxhdGUoc3ByZWFkLCBbMSwgMF0sIFswLCA1MF0sIGZhbHNlKSArIG9mZnNldH0lLCAje3NlY29uZENvbG9yfSAje1V0aWxzLm1vZHVsYXRlKHNwcmVhZCwgWzEsIDBdLCBbMTAwLCA1MF0sIGZhbHNlKSArIG9mZnNldH0lKVwiXG5cbm1ha2VHcmFkaWVudFRocmVlQ29sb3JTdHJpbmcgPSAoe2RpcmVjdGlvbiwgZmlyc3RDb2xvciwgc2Vjb25kQ29sb3IsIHRoaXJkQ29sb3IsIHByZWZpeCwgc3ByZWFkLCBvZmZzZXQsIGFuZ2xlfSkgLT5cblx0YW5nbGUgPz0gZmFsc2Vcblx0aWYgYW5nbGUgPT0gdHJ1ZVxuXHRcdGRpcmVjdGlvbiA9IGRpcmVjdGlvbiArIFwiZGVnXCJcblx0cmV0dXJuIFwiI3twcmVmaXh9bGluZWFyLWdyYWRpZW50KCN7ZGlyZWN0aW9ufSwgI3tmaXJzdENvbG9yfSAje1V0aWxzLm1vZHVsYXRlKHNwcmVhZCwgWzEsIDBdLCBbMCwgNTBdLCBmYWxzZSkgKyBvZmZzZXR9JSwgI3tzZWNvbmRDb2xvcn0gI3s1MCArIG9mZnNldH0lLCAje3RoaXJkQ29sb3J9ICN7VXRpbHMubW9kdWxhdGUoc3ByZWFkLCBbMSwgMF0sIFsxMDAsIDUwXSwgZmFsc2UpICsgb2Zmc2V0fSUpXCJcblxubWFrZVJhZGlhbEdyYWRpZW50U3RyaW5nID0gKHtmaXJzdENvbG9yLCBzZWNvbmRDb2xvciwgcHJlZml4LCBzcHJlYWQsIGVsbGlwc2VYLCBlbGxpcHNlWSwgZWxsaXBzZVdpZHRoLCBlbGxpcHNlSGVpZ2h0fSkgLT5cblx0cmV0dXJuIFwiI3twcmVmaXh9cmFkaWFsLWdyYWRpZW50KCN7ZWxsaXBzZVh9JSAje2VsbGlwc2VZfSUsICN7ZWxsaXBzZVdpZHRofSUgI3tlbGxpcHNlSGVpZ2h0fSUsICN7Zmlyc3RDb2xvcn0gI3tVdGlscy5tb2R1bGF0ZShzcHJlYWQsIFsxLCAwXSwgWzAsIDUwXSwgZmFsc2UpfSUsICN7c2Vjb25kQ29sb3J9ICN7VXRpbHMubW9kdWxhdGUoc3ByZWFkLCBbMSwgMF0sIFsxMDAsIDUwXSwgZmFsc2UpfSUpXCJcblxubWFrZVJhZGlhbEdyYWRpZW50VGhyZWVDb2xvclN0cmluZyA9ICh7Zmlyc3RDb2xvciwgc2Vjb25kQ29sb3IsIHRoaXJkQ29sb3IsIHByZWZpeCwgc3ByZWFkLCBlbGxpcHNlWCwgZWxsaXBzZVksIGVsbGlwc2VXaWR0aCwgZWxsaXBzZUhlaWdodH0pIC0+XG5cdHJldHVybiBcIiN7cHJlZml4fXJhZGlhbC1ncmFkaWVudCgje2VsbGlwc2VYfSUgI3tlbGxpcHNlWX0lLCAje2VsbGlwc2VXaWR0aH0lICN7ZWxsaXBzZUhlaWdodH0lLCAje2ZpcnN0Q29sb3J9ICN7VXRpbHMubW9kdWxhdGUoc3ByZWFkLCBbMSwgMF0sIFswLCA1MF0sIGZhbHNlKX0lLCAje3NlY29uZENvbG9yfSA1MCUsICN7dGhpcmRDb2xvcn0gI3tVdGlscy5tb2R1bGF0ZShzcHJlYWQsIFsxLCAwXSwgWzEwMCwgNTBdLCBmYWxzZSl9JSlcIlxuXG4jIGFuaW1hdGlvbiBjdXJ2ZXNcbmxpbmVhciA9ICh0KSAtPlxuXHRyZXR1cm4gdFxuXG5lYXNlSW4gPSAodCkgLT5cblx0IyBxdWFkIGZ1bmN0aW9uXG5cdHJldHVybiB0KnRcblxuZWFzZU91dCA9ICh0KSAtPlxuXHQjIHF1YWQgZnVuY3Rpb25cblx0cmV0dXJuIHQqKDItdClcblxuZWFzZUluT3V0ID0gKHQpIC0+XG5cdCMgY3ViaWMgZnVuY3Rpb25cblx0aWYgdCA8IC41XG5cdFx0cmV0dXJuIDQgKiB0ICogdCAqIHRcblx0ZWxzZVxuXHRcdHJldHVybiAodCAtIDEpICogKDIgKiB0IC0gMikgKiAoMiAqIHQgLSAyKSArIDFcblxuIyBncmFkaWVudCBkaXJlY3Rpb25zXG5leHBvcnRzLnRvcCA9IChmaXJzdENvbG9yID0gXCJ3aGl0ZVwiLCBzZWNvbmRDb2xvciA9IFwiYmxhY2tcIiwge3ByZWZpeCwgc3ByZWFkLCBvZmZzZXR9ID0ge30pIC0+XG5cdHByZWZpeCA/PSBcIndlYmtpdFwiXG5cdHNwcmVhZCA/PSAxXG5cdG9mZnNldCA/PSAwXG5cdGlmIHByZWZpeCAhPSBcIlwiXG5cdFx0cHJlZml4ID0gXCItXCIgKyBwcmVmaXggKyBcIi1cIlxuXHRyZXR1cm4gbWFrZUdyYWRpZW50U3RyaW5nKGRpcmVjdGlvbjogXCJ0b3BcIiwgZmlyc3RDb2xvcjogZmlyc3RDb2xvciwgc2Vjb25kQ29sb3I6IHNlY29uZENvbG9yLCBwcmVmaXg6IHByZWZpeCwgc3ByZWFkOiBzcHJlYWQsIG9mZnNldDogb2Zmc2V0KVxuXG5leHBvcnRzLnRvcFRocmVlQ29sb3IgPSAoZmlyc3RDb2xvciA9IFwid2hpdGVcIiwgc2Vjb25kQ29sb3IgPSBcImdyYXlcIiwgdGhpcmRDb2xvciA9IFwiYmxhY2tcIiwge3ByZWZpeCwgc3ByZWFkLCBvZmZzZXR9ID0ge30pIC0+XG5cdHByZWZpeCA/PSBcIndlYmtpdFwiXG5cdHNwcmVhZCA/PSAxXG5cdG9mZnNldCA/PSAwXG5cdGlmIHByZWZpeCAhPSBcIlwiXG5cdFx0cHJlZml4ID0gXCItXCIgKyBwcmVmaXggKyBcIi1cIlxuXHRyZXR1cm4gbWFrZUdyYWRpZW50VGhyZWVDb2xvclN0cmluZyhkaXJlY3Rpb246IFwidG9wXCIsIGZpcnN0Q29sb3I6IGZpcnN0Q29sb3IsIHNlY29uZENvbG9yOiBzZWNvbmRDb2xvciwgdGhpcmRDb2xvcjogdGhpcmRDb2xvciwgcHJlZml4OiBwcmVmaXgsIHNwcmVhZDogc3ByZWFkLCBvZmZzZXQ6IG9mZnNldClcblxuZXhwb3J0cy5ib3R0b20gPSAoZmlyc3RDb2xvciA9IFwid2hpdGVcIiwgc2Vjb25kQ29sb3IgPSBcImJsYWNrXCIsIHtwcmVmaXgsIHNwcmVhZCwgb2Zmc2V0fSA9IHt9KSAtPlxuXHRwcmVmaXggPz0gXCJ3ZWJraXRcIlxuXHRzcHJlYWQgPz0gMVxuXHRvZmZzZXQgPz0gMFxuXHRpZiBwcmVmaXggIT0gXCJcIlxuXHRcdHByZWZpeCA9IFwiLVwiICsgcHJlZml4ICsgXCItXCJcblx0cmV0dXJuIG1ha2VHcmFkaWVudFN0cmluZyhkaXJlY3Rpb246IFwiYm90dG9tXCIsIGZpcnN0Q29sb3I6IGZpcnN0Q29sb3IsIHNlY29uZENvbG9yOiBzZWNvbmRDb2xvciwgcHJlZml4OiBwcmVmaXgsIHNwcmVhZDogc3ByZWFkLCBvZmZzZXQ6IG9mZnNldClcblxuZXhwb3J0cy5ib3R0b21UaHJlZUNvbG9yID0gKGZpcnN0Q29sb3IgPSBcIndoaXRlXCIsIHNlY29uZENvbG9yID0gXCJncmF5XCIsIHRoaXJkQ29sb3IgPSBcImJsYWNrXCIsIHtwcmVmaXgsIHNwcmVhZCwgb2Zmc2V0fSA9IHt9KSAtPlxuXHRwcmVmaXggPz0gXCJ3ZWJraXRcIlxuXHRzcHJlYWQgPz0gMVxuXHRvZmZzZXQgPz0gMFxuXHRpZiBwcmVmaXggIT0gXCJcIlxuXHRcdHByZWZpeCA9IFwiLVwiICsgcHJlZml4ICsgXCItXCJcblx0cmV0dXJuIG1ha2VHcmFkaWVudFRocmVlQ29sb3JTdHJpbmcoZGlyZWN0aW9uOiBcImJvdHRvbVwiLCBmaXJzdENvbG9yOiBmaXJzdENvbG9yLCBzZWNvbmRDb2xvcjogc2Vjb25kQ29sb3IsIHRoaXJkQ29sb3I6IHRoaXJkQ29sb3IsIHByZWZpeDogcHJlZml4LCBzcHJlYWQ6IHNwcmVhZCwgb2Zmc2V0OiBvZmZzZXQpXG5cbmV4cG9ydHMubGVmdCA9IChmaXJzdENvbG9yID0gXCJ3aGl0ZVwiLCBzZWNvbmRDb2xvciA9IFwiYmxhY2tcIiwge3ByZWZpeCwgc3ByZWFkLCBvZmZzZXR9ID0ge30pIC0+XG5cdHByZWZpeCA/PSBcIndlYmtpdFwiXG5cdHNwcmVhZCA/PSAxXG5cdG9mZnNldCA/PSAwXG5cdGlmIHByZWZpeCAhPSBcIlwiXG5cdFx0cHJlZml4ID0gXCItXCIgKyBwcmVmaXggKyBcIi1cIlxuXHRyZXR1cm4gbWFrZUdyYWRpZW50U3RyaW5nKGRpcmVjdGlvbjogXCJsZWZ0XCIsIGZpcnN0Q29sb3I6IGZpcnN0Q29sb3IsIHNlY29uZENvbG9yOiBzZWNvbmRDb2xvciwgcHJlZml4OiBwcmVmaXgsIHNwcmVhZDogc3ByZWFkLCBvZmZzZXQ6IG9mZnNldClcblxuZXhwb3J0cy5sZWZ0VGhyZWVDb2xvciA9IChmaXJzdENvbG9yID0gXCJ3aGl0ZVwiLCBzZWNvbmRDb2xvciA9IFwiZ3JheVwiLCB0aGlyZENvbG9yID0gXCJibGFja1wiLCB7cHJlZml4LCBzcHJlYWQsIG9mZnNldH0gPSB7fSkgLT5cblx0cHJlZml4ID89IFwid2Via2l0XCJcblx0c3ByZWFkID89IDFcblx0b2Zmc2V0ID89IDBcblx0aWYgcHJlZml4ICE9IFwiXCJcblx0XHRwcmVmaXggPSBcIi1cIiArIHByZWZpeCArIFwiLVwiXG5cdHJldHVybiBtYWtlR3JhZGllbnRUaHJlZUNvbG9yU3RyaW5nKGRpcmVjdGlvbjogXCJsZWZ0XCIsIGZpcnN0Q29sb3I6IGZpcnN0Q29sb3IsIHNlY29uZENvbG9yOiBzZWNvbmRDb2xvciwgdGhpcmRDb2xvcjogdGhpcmRDb2xvciwgcHJlZml4OiBwcmVmaXgsIHNwcmVhZDogc3ByZWFkLCBvZmZzZXQ6IG9mZnNldClcblxuZXhwb3J0cy5yaWdodCA9IChmaXJzdENvbG9yID0gXCJ3aGl0ZVwiLCBzZWNvbmRDb2xvciA9IFwiYmxhY2tcIiwge3ByZWZpeCwgc3ByZWFkLCBvZmZzZXR9ID0ge30pIC0+XG5cdHByZWZpeCA/PSBcIndlYmtpdFwiXG5cdHNwcmVhZCA/PSAxXG5cdG9mZnNldCA/PSAwXG5cdGlmIHByZWZpeCAhPSBcIlwiXG5cdFx0cHJlZml4ID0gXCItXCIgKyBwcmVmaXggKyBcIi1cIlxuXHRyZXR1cm4gbWFrZUdyYWRpZW50U3RyaW5nKGRpcmVjdGlvbjogXCJyaWdodFwiLCBmaXJzdENvbG9yOiBmaXJzdENvbG9yLCBzZWNvbmRDb2xvcjogc2Vjb25kQ29sb3IsIHByZWZpeDogcHJlZml4LCBzcHJlYWQ6IHNwcmVhZCwgb2Zmc2V0OiBvZmZzZXQpXG5cbmV4cG9ydHMucmlnaHRUaHJlZUNvbG9yID0gKGZpcnN0Q29sb3IgPSBcIndoaXRlXCIsIHNlY29uZENvbG9yID0gXCJncmF5XCIsIHRoaXJkQ29sb3IgPSBcImJsYWNrXCIsIHtwcmVmaXgsIHNwcmVhZCwgb2Zmc2V0fSA9IHt9KSAtPlxuXHRwcmVmaXggPz0gXCJ3ZWJraXRcIlxuXHRzcHJlYWQgPz0gMVxuXHRvZmZzZXQgPz0gMFxuXHRpZiBwcmVmaXggIT0gXCJcIlxuXHRcdHByZWZpeCA9IFwiLVwiICsgcHJlZml4ICsgXCItXCJcblx0cmV0dXJuIG1ha2VHcmFkaWVudFRocmVlQ29sb3JTdHJpbmcoZGlyZWN0aW9uOiBcInJpZ2h0XCIsIGZpcnN0Q29sb3I6IGZpcnN0Q29sb3IsIHNlY29uZENvbG9yOiBzZWNvbmRDb2xvciwgdGhpcmRDb2xvcjogdGhpcmRDb2xvciwgcHJlZml4OiBwcmVmaXgsIHNwcmVhZDogc3ByZWFkLCBvZmZzZXQ6IG9mZnNldClcblxuZXhwb3J0cy5hbmdsZSA9IChmaXJzdENvbG9yID0gXCJ3aGl0ZVwiLCBzZWNvbmRDb2xvciA9IFwiYmxhY2tcIiwgZGVncmVlcyA9IDEzNSwge3ByZWZpeCwgc3ByZWFkLCBvZmZzZXR9ID0ge30pIC0+XG5cdHByZWZpeCA/PSBcIndlYmtpdFwiXG5cdHNwcmVhZCA/PSAxXG5cdG9mZnNldCA/PSAwXG5cdGlmIHByZWZpeCAhPSBcIlwiXG5cdFx0cHJlZml4ID0gXCItXCIgKyBwcmVmaXggKyBcIi1cIlxuXHRyZXR1cm4gbWFrZUdyYWRpZW50U3RyaW5nKGRpcmVjdGlvbjogZGVncmVlcywgZmlyc3RDb2xvcjogZmlyc3RDb2xvciwgc2Vjb25kQ29sb3I6IHNlY29uZENvbG9yLCBwcmVmaXg6IHByZWZpeCwgc3ByZWFkOiBzcHJlYWQsIG9mZnNldDogb2Zmc2V0LCBhbmdsZTogdHJ1ZSlcblxuZXhwb3J0cy5hbmdsZVRocmVlQ29sb3IgPSAoZmlyc3RDb2xvciA9IFwid2hpdGVcIiwgc2Vjb25kQ29sb3IgPSBcImdyYXlcIiwgdGhpcmRDb2xvciA9IFwiYmxhY2tcIiwgZGVncmVlcyA9IDEzNSwge3ByZWZpeCwgc3ByZWFkLCBvZmZzZXR9ID0ge30pIC0+XG5cdHByZWZpeCA/PSBcIndlYmtpdFwiXG5cdHNwcmVhZCA/PSAxXG5cdG9mZnNldCA/PSAwXG5cdGlmIHByZWZpeCAhPSBcIlwiXG5cdFx0cHJlZml4ID0gXCItXCIgKyBwcmVmaXggKyBcIi1cIlxuXHRyZXR1cm4gbWFrZUdyYWRpZW50VGhyZWVDb2xvclN0cmluZyhkaXJlY3Rpb246IGRlZ3JlZXMsIGZpcnN0Q29sb3I6IGZpcnN0Q29sb3IsIHNlY29uZENvbG9yOiBzZWNvbmRDb2xvciwgdGhpcmRDb2xvcjogdGhpcmRDb2xvciwgcHJlZml4OiBwcmVmaXgsIHNwcmVhZDogc3ByZWFkLCBvZmZzZXQ6IG9mZnNldCwgYW5nbGU6IHRydWUpXG5cbmV4cG9ydHMucmFkaWFsID0gKGZpcnN0Q29sb3IgPSBcIndoaXRlXCIsIHNlY29uZENvbG9yID0gXCJibGFja1wiLCB7cHJlZml4LCBzcHJlYWQsIG9yaWdpblgsIG9yaWdpblksIHNjYWxlWCwgc2NhbGVZfSA9IHt9KSAtPlxuXHRwcmVmaXggPz0gXCJ3ZWJraXRcIlxuXHRzcHJlYWQgPz0gMVxuXHRvcmlnaW5YID89IDAuNVxuXHRvcmlnaW5ZID89IDAuNVxuXHRvcmlnaW5YID0gb3JpZ2luWCAqIDEwMFxuXHRvcmlnaW5ZID0gb3JpZ2luWSAqIDEwMFxuXHRzY2FsZVggPz0gMVxuXHRzY2FsZVkgPz0gMVxuXHRzY2FsZVggPSBVdGlscy5tb2R1bGF0ZShzY2FsZVgsIFswLCAxMDBdLCBbMCwgNzBdKSAqIDEwMFxuXHRzY2FsZVkgPSBVdGlscy5tb2R1bGF0ZShzY2FsZVksIFswLCAxMDBdLCBbMCwgNzBdKSAqIDEwMFxuXHRpZiBwcmVmaXggIT0gXCJcIlxuXHRcdHByZWZpeCA9IFwiLVwiICsgcHJlZml4ICsgXCItXCJcblx0cmV0dXJuIG1ha2VSYWRpYWxHcmFkaWVudFN0cmluZyhmaXJzdENvbG9yOiBmaXJzdENvbG9yLCBzZWNvbmRDb2xvcjogc2Vjb25kQ29sb3IsIHByZWZpeDogcHJlZml4LCBzcHJlYWQ6IHNwcmVhZCwgZWxsaXBzZVg6IG9yaWdpblgsIGVsbGlwc2VZOiBvcmlnaW5ZLCBlbGxpcHNlV2lkdGg6IHNjYWxlWCwgZWxsaXBzZUhlaWdodDogc2NhbGVZKVxuXG5kZWZhdWx0cyA9XG5cdGRpcmVjdGlvbjogXCJ0b3BcIlxuXHRmaXJzdENvbG9yOiBcIndoaXRlXCJcblx0c2Vjb25kQ29sb3I6IFwiYmxhY2tcIlxuXHR0aGlyZENvbG9yOiBcIlwiXG5cdHByZWZpeDogXCJ3ZWJraXRcIlxuXHRzcHJlYWQ6IDFcblx0b2Zmc2V0OiAwXG5cdGFuZ2xlOiBmYWxzZVxuXHRncmFkaWVudE9yaWdpblg6IDAuNVxuXHRncmFkaWVudE9yaWdpblk6IDAuNVxuXHRncmFkaWVudFNjYWxlWDogMVxuXHRncmFkaWVudFNjYWxlWTogMVxuXG5leHBvcnRzLnJhZGlhbFRocmVlQ29sb3IgPSAoZmlyc3RDb2xvciA9IFwid2hpdGVcIiwgc2Vjb25kQ29sb3IgPSBcImdyYXlcIiwgdGhpcmRDb2xvciA9IFwiYmxhY2tcIiwge3ByZWZpeCwgc3ByZWFkLCBvcmlnaW5YLCBvcmlnaW5ZLCBzY2FsZVgsIHNjYWxlWX0gPSB7fSkgLT5cblx0cHJlZml4ID89IFwid2Via2l0XCJcblx0c3ByZWFkID89IDFcblx0b3JpZ2luWCA/PSAwLjVcblx0b3JpZ2luWSA/PSAwLjVcblx0b3JpZ2luWCA9IG9yaWdpblggKiAxMDBcblx0b3JpZ2luWSA9IG9yaWdpblkgKiAxMDBcblx0c2NhbGVYID89IDFcblx0c2NhbGVZID89IDFcblx0c2NhbGVYID0gVXRpbHMubW9kdWxhdGUoc2NhbGVYLCBbMCwgMTAwXSwgWzAsIDcwXSkgKiAxMDBcblx0c2NhbGVZID0gVXRpbHMubW9kdWxhdGUoc2NhbGVZLCBbMCwgMTAwXSwgWzAsIDcwXSkgKiAxMDBcblx0aWYgcHJlZml4ICE9IFwiXCJcblx0XHRwcmVmaXggPSBcIi1cIiArIHByZWZpeCArIFwiLVwiXG5cdHJldHVybiBtYWtlUmFkaWFsR3JhZGllbnRUaHJlZUNvbG9yU3RyaW5nKGZpcnN0Q29sb3I6IGZpcnN0Q29sb3IsIHNlY29uZENvbG9yOiBzZWNvbmRDb2xvciwgdGhpcmRDb2xvcjogdGhpcmRDb2xvciwgcHJlZml4OiBwcmVmaXgsIHNwcmVhZDogc3ByZWFkLCBlbGxpcHNlWDogb3JpZ2luWCwgZWxsaXBzZVk6IG9yaWdpblksIGVsbGlwc2VXaWR0aDogc2NhbGVYLCBlbGxpcHNlSGVpZ2h0OiBzY2FsZVkpXG5cbiMgZ3JhZGllbnQgbGF5ZXJzXG5jbGFzcyBleHBvcnRzLkxheWVyIGV4dGVuZHMgTGF5ZXJcblx0Y29uc3RydWN0b3I6IChAb3B0aW9ucz17fSkgLT5cblx0XHRAb3B0aW9ucyA9IF8uYXNzaWduKHt9LCBkZWZhdWx0cywgQG9wdGlvbnMpXG5cdFx0c3VwZXIgQG9wdGlvbnNcblx0XHRpZiBAb3B0aW9ucy5wcmVmaXggIT0gXCJcIlxuXHRcdFx0QG9wdGlvbnMucHJlZml4ID0gXCItXCIgKyBAb3B0aW9ucy5wcmVmaXggKyBcIi1cIlxuXHRcdGlmIHR5cGVvZiBAb3B0aW9ucy5kaXJlY3Rpb24gaXMgXCJudW1iZXJcIlxuXHRcdFx0QG9wdGlvbnMuYW5nbGUgPSB0cnVlXG5cdFx0Z3JhZGllbnQgPSBcIlwiXG5cdFx0aWYgQG9wdGlvbnMudGhpcmRDb2xvciA9PSBcIlwiXG5cdFx0XHRncmFkaWVudCA9IG1ha2VHcmFkaWVudFN0cmluZyhkaXJlY3Rpb246IEBvcHRpb25zLmRpcmVjdGlvbiwgZmlyc3RDb2xvcjogQG9wdGlvbnMuZmlyc3RDb2xvciwgc2Vjb25kQ29sb3I6IEBvcHRpb25zLnNlY29uZENvbG9yLCBwcmVmaXg6IEBvcHRpb25zLnByZWZpeCwgc3ByZWFkOiBAb3B0aW9ucy5zcHJlYWQsIG9mZnNldDogQG9wdGlvbnMub2Zmc2V0LCBhbmdsZTogQG9wdGlvbnMuYW5nbGUpXG5cdFx0ZWxzZVxuXHRcdFx0Z3JhZGllbnQgPSBtYWtlR3JhZGllbnRUaHJlZUNvbG9yU3RyaW5nKGRpcmVjdGlvbjogQG9wdGlvbnMuZGlyZWN0aW9uLCBmaXJzdENvbG9yOiBAb3B0aW9ucy5maXJzdENvbG9yLCBzZWNvbmRDb2xvcjogQG9wdGlvbnMuc2Vjb25kQ29sb3IsIHRoaXJkQ29sb3I6IEBvcHRpb25zLnRoaXJkQ29sb3IsIHByZWZpeDogQG9wdGlvbnMucHJlZml4LCBzcHJlYWQ6IEBvcHRpb25zLnNwcmVhZCwgb2Zmc2V0OiBAb3B0aW9ucy5vZmZzZXQsIGFuZ2xlOiBAb3B0aW9ucy5hbmdsZSlcblx0XHRALnN0eWxlLmJhY2tncm91bmQgPSBncmFkaWVudFxuXG5cdGFuaW1hdGVHcmFkaWVudDogKHtmaXJzdENvbG9yLCBzZWNvbmRDb2xvciwgdGhpcmRDb2xvciwgc3ByZWFkLCBvZmZzZXQsIGRpcmVjdGlvbiwgdGltZSwgY3VydmV9ID0ge30sIGZyYW1lID0gMCkgLT5cblx0XHRmaXJzdENvbG9yID89IEBvcHRpb25zLmZpcnN0Q29sb3Jcblx0XHRzZWNvbmRDb2xvciA/PSBAb3B0aW9ucy5zZWNvbmRDb2xvclxuXHRcdHRoaXJkQ29sb3IgPz0gQG9wdGlvbnMudGhpcmRDb2xvclxuXHRcdHNwcmVhZCA/PSBAb3B0aW9ucy5zcHJlYWRcblx0XHRvZmZzZXQgPz0gQG9wdGlvbnMub2Zmc2V0XG5cdFx0ZGlyZWN0aW9uID89IEBvcHRpb25zLmRpcmVjdGlvblxuXHRcdHRpbWUgPz0gRnJhbWVyLkRlZmF1bHRzLkFuaW1hdGlvbi50aW1lXG5cdFx0Y3VydmUgPz0gXCJlYXNlLW91dFwiXG5cdFx0dG90YWxGcmFtZXMgPSB0aW1lIC8gRnJhbWVyLkxvb3AuZGVsdGFcblx0XHRpZiBmcmFtZSA9PSAwXG5cdFx0XHRALmVtaXQgXCJncmFkaWVudEFuaW1hdGlvblN0YXJ0XCJcblx0XHRlbHNlIGlmIGZyYW1lID09IHRvdGFsRnJhbWVzXG5cdFx0XHRALmVtaXQgXCJncmFkaWVudEFuaW1hdGlvbkVuZFwiXG5cdFx0aWYgdHlwZW9mIEBvcHRpb25zLmRpcmVjdGlvbiBpcyBcInN0cmluZ1wiXG5cdFx0XHRzd2l0Y2ggQG9wdGlvbnMuZGlyZWN0aW9uXG5cdFx0XHRcdHdoZW4gXCJ0b3BcIlxuXHRcdFx0XHRcdHN0YXJ0RGlyZWN0aW9uID0gLTkwXG5cdFx0XHRcdHdoZW4gXCJib3R0b21cIlxuXHRcdFx0XHRcdHN0YXJ0RGlyZWN0aW9uID0gOTBcblx0XHRcdFx0d2hlbiBcImxlZnRcIlxuXHRcdFx0XHRcdHN0YXJ0RGlyZWN0aW9uID0gMFxuXHRcdFx0XHR3aGVuIFwicmlnaHRcIlxuXHRcdFx0XHRcdHN0YXJ0RGlyZWN0aW9uID0gMTgwXG5cdFx0ZWxzZVxuXHRcdFx0c3RhcnREaXJlY3Rpb24gPSBAb3B0aW9ucy5kaXJlY3Rpb25cblx0XHRpZiB0eXBlb2YgZGlyZWN0aW9uIGlzIFwic3RyaW5nXCJcblx0XHRcdHN3aXRjaCBkaXJlY3Rpb25cblx0XHRcdFx0d2hlbiBcInRvcFwiXG5cdFx0XHRcdFx0dGFyZ2V0RGlyZWN0aW9uID0gLTkwXG5cdFx0XHRcdHdoZW4gXCJib3R0b21cIlxuXHRcdFx0XHRcdHRhcmdldERpcmVjdGlvbiA9IDkwXG5cdFx0XHRcdHdoZW4gXCJsZWZ0XCJcblx0XHRcdFx0XHR0YXJnZXREaXJlY3Rpb24gPSAwXG5cdFx0XHRcdHdoZW4gXCJyaWdodFwiXG5cdFx0XHRcdFx0dGFyZ2V0RGlyZWN0aW9uID0gMTgwXG5cdFx0ZWxzZVxuXHRcdFx0dGFyZ2V0RGlyZWN0aW9uID0gZGlyZWN0aW9uXG5cdFx0aWYgZnJhbWUgPCB0b3RhbEZyYW1lc1xuXHRcdFx0c3dpdGNoIGN1cnZlXG5cdFx0XHRcdHdoZW4gXCJsaW5lYXJcIlxuXHRcdFx0XHRcdGVhc2VkRnJhbWUgPSBsaW5lYXIoZnJhbWUvdG90YWxGcmFtZXMpXG5cdFx0XHRcdHdoZW4gXCJlYXNlLWluXCJcblx0XHRcdFx0XHRlYXNlZEZyYW1lID0gZWFzZUluKGZyYW1lL3RvdGFsRnJhbWVzKVxuXHRcdFx0XHR3aGVuIFwiZWFzZS1vdXRcIlxuXHRcdFx0XHRcdGVhc2VkRnJhbWUgPSBlYXNlT3V0KGZyYW1lL3RvdGFsRnJhbWVzKVxuXHRcdFx0XHR3aGVuIFwiZWFzZS1pbi1vdXRcIlxuXHRcdFx0XHRcdGVhc2VkRnJhbWUgPSBlYXNlSW5PdXQoZnJhbWUvdG90YWxGcmFtZXMpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRlYXNlZEZyYW1lID0gbGluZWFyKGZyYW1lL3RvdGFsRnJhbWVzKVxuXHRcdFx0ZnJhbWVGaXJzdENvbG9yID0gQ29sb3IubWl4KEBvcHRpb25zLmZpcnN0Q29sb3IsIGZpcnN0Q29sb3IsIGVhc2VkRnJhbWUpXG5cdFx0XHRmcmFtZVNlY29uZENvbG9yID0gQ29sb3IubWl4KEBvcHRpb25zLnNlY29uZENvbG9yLCBzZWNvbmRDb2xvciwgZWFzZWRGcmFtZSlcblx0XHRcdGlmIEBvcHRpb25zLnRoaXJkQ29sb3IgIT0gXCJcIlxuXHRcdFx0XHRmcmFtZVRoaXJkQ29sb3IgPSBDb2xvci5taXgoQG9wdGlvbnMudGhpcmRDb2xvciwgdGhpcmRDb2xvciwgZWFzZWRGcmFtZSlcblx0XHRcdGZyYW1lU3ByZWFkID0gVXRpbHMubW9kdWxhdGUoZWFzZWRGcmFtZSwgWzAsIDFdLCBbQG9wdGlvbnMuc3ByZWFkLCBzcHJlYWRdKVxuXHRcdFx0ZnJhbWVPZmZzZXQgPSBVdGlscy5tb2R1bGF0ZShlYXNlZEZyYW1lLCBbMCwgMV0sIFtAb3B0aW9ucy5vZmZzZXQsIG9mZnNldF0pXG5cdFx0XHRmcmFtZURpcmVjdGlvbiA9IFV0aWxzLm1vZHVsYXRlKGVhc2VkRnJhbWUsIFswLCAxXSwgW3N0YXJ0RGlyZWN0aW9uLCB0YXJnZXREaXJlY3Rpb25dKVxuXHRcdFx0aWYgQG9wdGlvbnMudGhpcmRDb2xvciA9PSBcIlwiXG5cdFx0XHRcdGdyYWRpZW50ID0gbWFrZUdyYWRpZW50U3RyaW5nKGRpcmVjdGlvbjogZnJhbWVEaXJlY3Rpb24sIGZpcnN0Q29sb3I6IGZyYW1lRmlyc3RDb2xvciwgc2Vjb25kQ29sb3I6IGZyYW1lU2Vjb25kQ29sb3IsIHByZWZpeDogQG9wdGlvbnMucHJlZml4LCBzcHJlYWQ6IGZyYW1lU3ByZWFkLCBvZmZzZXQ6IGZyYW1lT2Zmc2V0LCBhbmdsZTogdHJ1ZSlcblx0XHRcdGVsc2Vcblx0XHRcdFx0Z3JhZGllbnQgPSBtYWtlR3JhZGllbnRUaHJlZUNvbG9yU3RyaW5nKGRpcmVjdGlvbjogZnJhbWVEaXJlY3Rpb24sIGZpcnN0Q29sb3I6IGZyYW1lRmlyc3RDb2xvciwgc2Vjb25kQ29sb3I6IGZyYW1lU2Vjb25kQ29sb3IsIHRoaXJkQ29sb3I6IGZyYW1lVGhpcmRDb2xvciwgcHJlZml4OiBAb3B0aW9ucy5wcmVmaXgsIHNwcmVhZDogZnJhbWVTcHJlYWQsIG9mZnNldDogZnJhbWVPZmZzZXQsIGFuZ2xlOiB0cnVlKVxuXHRcdFx0QC5zdHlsZS5iYWNrZ3JvdW5kID0gZ3JhZGllbnRcblx0XHRcdFV0aWxzLmRlbGF5IEZyYW1lci5Mb29wLmRlbHRhLCA9PlxuXHRcdFx0XHRAYW5pbWF0ZUdyYWRpZW50KHtmaXJzdENvbG9yOiBmaXJzdENvbG9yLCBzZWNvbmRDb2xvcjogc2Vjb25kQ29sb3IsIHRoaXJkQ29sb3I6IHRoaXJkQ29sb3IsIHNwcmVhZDogc3ByZWFkLCBvZmZzZXQ6IG9mZnNldCwgZGlyZWN0aW9uOiBkaXJlY3Rpb24sIHRpbWU6IHRpbWUsIGN1cnZlOiBjdXJ2ZX0sIGZyYW1lICsgMSlcblxuY2xhc3MgZXhwb3J0cy5SYWRpYWxMYXllciBleHRlbmRzIExheWVyXG5cdGNvbnN0cnVjdG9yOiAoQG9wdGlvbnM9e30pIC0+XG5cdFx0QG9wdGlvbnMgPSBfLmFzc2lnbih7fSwgZGVmYXVsdHMsIEBvcHRpb25zKVxuXHRcdHN1cGVyIEBvcHRpb25zXG5cdFx0aWYgQG9wdGlvbnMucHJlZml4ICE9IFwiXCJcblx0XHRcdEBvcHRpb25zLnByZWZpeCA9IFwiLVwiICsgQG9wdGlvbnMucHJlZml4ICsgXCItXCJcblx0XHRncmFkaWVudE9yaWdpblggPSBAb3B0aW9ucy5ncmFkaWVudE9yaWdpblggKiAxMDBcblx0XHRncmFkaWVudE9yaWdpblkgPSBAb3B0aW9ucy5ncmFkaWVudE9yaWdpblkgKiAxMDBcblx0XHRncmFkaWVudFNjYWxlWCA9IFV0aWxzLm1vZHVsYXRlKEBvcHRpb25zLmdyYWRpZW50U2NhbGVYLCBbMCwgMTAwXSwgWzAsIDcwXSkgKiAxMDBcblx0XHRncmFkaWVudFNjYWxlWSA9IFV0aWxzLm1vZHVsYXRlKEBvcHRpb25zLmdyYWRpZW50U2NhbGVZLCBbMCwgMTAwXSwgWzAsIDcwXSkgKiAxMDBcblx0XHRncmFkaWVudCA9IFwiXCJcblx0XHRpZiBAb3B0aW9ucy50aGlyZENvbG9yID09IFwiXCJcblx0XHRcdGdyYWRpZW50ID0gbWFrZVJhZGlhbEdyYWRpZW50U3RyaW5nKGZpcnN0Q29sb3I6IEBvcHRpb25zLmZpcnN0Q29sb3IsIHNlY29uZENvbG9yOiBAb3B0aW9ucy5zZWNvbmRDb2xvciwgcHJlZml4OiBAb3B0aW9ucy5wcmVmaXgsIHNwcmVhZDogQG9wdGlvbnMuc3ByZWFkLCBlbGxpcHNlWDogZ3JhZGllbnRPcmlnaW5YLCBlbGxpcHNlWTogZ3JhZGllbnRPcmlnaW5ZLCBlbGxpcHNlV2lkdGg6IGdyYWRpZW50U2NhbGVYLCBlbGxpcHNlSGVpZ2h0OiBncmFkaWVudFNjYWxlWSlcblx0XHRlbHNlXG5cdFx0XHRncmFkaWVudCA9IG1ha2VSYWRpYWxHcmFkaWVudFRocmVlQ29sb3JTdHJpbmcoZmlyc3RDb2xvcjogQG9wdGlvbnMuZmlyc3RDb2xvciwgc2Vjb25kQ29sb3I6IEBvcHRpb25zLnNlY29uZENvbG9yLCB0aGlyZENvbG9yOiBAb3B0aW9ucy50aGlyZENvbG9yLCBwcmVmaXg6IEBvcHRpb25zLnByZWZpeCwgc3ByZWFkOiBAb3B0aW9ucy5zcHJlYWQsIGVsbGlwc2VYOiBncmFkaWVudE9yaWdpblgsIGVsbGlwc2VZOiBncmFkaWVudE9yaWdpblksIGVsbGlwc2VXaWR0aDogZ3JhZGllbnRTY2FsZVgsIGVsbGlwc2VIZWlnaHQ6IGdyYWRpZW50U2NhbGVZKVxuXHRcdEAuc3R5bGUuYmFja2dyb3VuZCA9IGdyYWRpZW50XG5cblx0YW5pbWF0ZUdyYWRpZW50OiAoe2ZpcnN0Q29sb3IsIHNlY29uZENvbG9yLCB0aGlyZENvbG9yLCBvcmlnaW5YLCBvcmlnaW5ZLCBzY2FsZVgsIHNjYWxlWSwgc3ByZWFkLCB0aW1lLCBjdXJ2ZX0gPSB7fSwgZnJhbWUgPSAwKSAtPlxuXHRcdGZpcnN0Q29sb3IgPz0gQG9wdGlvbnMuZmlyc3RDb2xvclxuXHRcdHNlY29uZENvbG9yID89IEBvcHRpb25zLnNlY29uZENvbG9yXG5cdFx0dGhpcmRDb2xvciA/PSBAb3B0aW9ucy50aGlyZENvbG9yXG5cdFx0b3JpZ2luWCA/PSBAb3B0aW9ucy5ncmFkaWVudE9yaWdpblhcblx0XHRvcmlnaW5ZID89IEBvcHRpb25zLmdyYWRpZW50T3JpZ2luWVxuXHRcdHNjYWxlWCA/PSBAb3B0aW9ucy5ncmFkaWVudFNjYWxlWFxuXHRcdHNjYWxlWSA/PSBAb3B0aW9ucy5ncmFkaWVudFNjYWxlWVxuXHRcdHNwcmVhZCA/PSBAb3B0aW9ucy5zcHJlYWRcblx0XHR0aW1lID89IEZyYW1lci5EZWZhdWx0cy5BbmltYXRpb24udGltZVxuXHRcdGN1cnZlID89IFwiZWFzZS1vdXRcIlxuXHRcdHRvdGFsRnJhbWVzID0gdGltZSAvIEZyYW1lci5Mb29wLmRlbHRhXG5cdFx0aWYgZnJhbWUgPT0gMFxuXHRcdFx0QC5lbWl0IFwiZ3JhZGllbnRBbmltYXRpb25TdGFydFwiXG5cdFx0ZWxzZSBpZiBmcmFtZSA9PSB0b3RhbEZyYW1lc1xuXHRcdFx0QC5lbWl0IFwiZ3JhZGllbnRBbmltYXRpb25FbmRcIlxuXHRcdGlmIGZyYW1lIDwgdG90YWxGcmFtZXNcblx0XHRcdHN3aXRjaCBjdXJ2ZVxuXHRcdFx0XHR3aGVuIFwibGluZWFyXCJcblx0XHRcdFx0XHRlYXNlZEZyYW1lID0gbGluZWFyKGZyYW1lL3RvdGFsRnJhbWVzKVxuXHRcdFx0XHR3aGVuIFwiZWFzZS1pblwiXG5cdFx0XHRcdFx0ZWFzZWRGcmFtZSA9IGVhc2VJbihmcmFtZS90b3RhbEZyYW1lcylcblx0XHRcdFx0d2hlbiBcImVhc2Utb3V0XCJcblx0XHRcdFx0XHRlYXNlZEZyYW1lID0gZWFzZU91dChmcmFtZS90b3RhbEZyYW1lcylcblx0XHRcdFx0d2hlbiBcImVhc2UtaW4tb3V0XCJcblx0XHRcdFx0XHRlYXNlZEZyYW1lID0gZWFzZUluT3V0KGZyYW1lL3RvdGFsRnJhbWVzKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0ZWFzZWRGcmFtZSA9IGxpbmVhcihmcmFtZS90b3RhbEZyYW1lcylcblx0XHRcdGZyYW1lRmlyc3RDb2xvciA9IENvbG9yLm1peChAb3B0aW9ucy5maXJzdENvbG9yLCBmaXJzdENvbG9yLCBlYXNlZEZyYW1lKVxuXHRcdFx0ZnJhbWVTZWNvbmRDb2xvciA9IENvbG9yLm1peChAb3B0aW9ucy5zZWNvbmRDb2xvciwgc2Vjb25kQ29sb3IsIGVhc2VkRnJhbWUpXG5cdFx0XHRpZiBAb3B0aW9ucy50aGlyZENvbG9yICE9IFwiXCJcblx0XHRcdFx0ZnJhbWVUaGlyZENvbG9yID0gQ29sb3IubWl4KEBvcHRpb25zLnRoaXJkQ29sb3IsIHRoaXJkQ29sb3IsIGVhc2VkRnJhbWUpXG5cdFx0XHRmcmFtZVNwcmVhZCA9IFV0aWxzLm1vZHVsYXRlKGVhc2VkRnJhbWUsIFswLCAxXSwgW0BvcHRpb25zLnNwcmVhZCwgc3ByZWFkXSlcblx0XHRcdGZyYW1lT3JpZ2luWCA9IFV0aWxzLm1vZHVsYXRlKGVhc2VkRnJhbWUsIFswLCAxXSwgW0BvcHRpb25zLmdyYWRpZW50T3JpZ2luWCwgb3JpZ2luWF0pICogMTAwXG5cdFx0XHRmcmFtZU9yaWdpblkgPSBVdGlscy5tb2R1bGF0ZShlYXNlZEZyYW1lLCBbMCwgMV0sIFtAb3B0aW9ucy5ncmFkaWVudE9yaWdpblksIG9yaWdpblldKSAqIDEwMFxuXHRcdFx0ZnJhbWVTY2FsZVggPSBVdGlscy5tb2R1bGF0ZShlYXNlZEZyYW1lLCBbMCwgMV0sIFtAb3B0aW9ucy5ncmFkaWVudFNjYWxlWCwgc2NhbGVYXSlcblxuXHRcdFx0ZnJhbWVTY2FsZVkgPSBVdGlscy5tb2R1bGF0ZShmcmFtZSwgWzAsIDFdLCBbQG9wdGlvbnMuZ3JhZGllbnRTY2FsZVksIHNjYWxlWV0pXG5cdFx0XHRmcmFtZVNjYWxlWCA9IFV0aWxzLm1vZHVsYXRlKGZyYW1lU2NhbGVYLCBbMCwgMTAwXSwgWzAsIDcwXSkgKiAxMDBcblx0XHRcdGZyYW1lU2NhbGVZID0gVXRpbHMubW9kdWxhdGUoZnJhbWVTY2FsZVksIFswLCAxMDBdLCBbMCwgNzBdKSAqIDEwMFxuXHRcdFx0aWYgQG9wdGlvbnMudGhpcmRDb2xvciA9PSBcIlwiXG5cdFx0XHRcdGdyYWRpZW50ID0gbWFrZVJhZGlhbEdyYWRpZW50U3RyaW5nKGZpcnN0Q29sb3I6IGZyYW1lRmlyc3RDb2xvciwgc2Vjb25kQ29sb3I6IGZyYW1lU2Vjb25kQ29sb3IsIHByZWZpeDogQG9wdGlvbnMucHJlZml4LCBzcHJlYWQ6IGZyYW1lU3ByZWFkLCBlbGxpcHNlWDogZnJhbWVPcmlnaW5YLCBlbGxpcHNlWTogZnJhbWVPcmlnaW5ZLCBlbGxpcHNlV2lkdGg6IGZyYW1lU2NhbGVYLCBlbGxpcHNlSGVpZ2h0OiBmcmFtZVNjYWxlWSlcblx0XHRcdGVsc2Vcblx0XHRcdFx0Z3JhZGllbnQgPSBtYWtlUmFkaWFsR3JhZGllbnRUaHJlZUNvbG9yU3RyaW5nKGZpcnN0Q29sb3I6IGZyYW1lRmlyc3RDb2xvciwgc2Vjb25kQ29sb3I6IGZyYW1lU2Vjb25kQ29sb3IsIHRoaXJkQ29sb3I6IGZyYW1lVGhpcmRDb2xvciwgcHJlZml4OiBAb3B0aW9ucy5wcmVmaXgsIHNwcmVhZDogZnJhbWVTcHJlYWQsIGVsbGlwc2VYOiBmcmFtZU9yaWdpblgsIGVsbGlwc2VZOiBmcmFtZU9yaWdpblksIGVsbGlwc2VXaWR0aDogZnJhbWVTY2FsZVgsIGVsbGlwc2VIZWlnaHQ6IGZyYW1lU2NhbGVZKVxuXHRcdFx0QC5zdHlsZS5iYWNrZ3JvdW5kID0gZ3JhZGllbnRcblx0XHRcdFV0aWxzLmRlbGF5IEZyYW1lci5Mb29wLmRlbHRhLCA9PlxuXHRcdFx0XHRAYW5pbWF0ZUdyYWRpZW50KHtmaXJzdENvbG9yOiBmaXJzdENvbG9yLCBzZWNvbmRDb2xvcjogc2Vjb25kQ29sb3IsIHRoaXJkQ29sb3I6IHRoaXJkQ29sb3IsIG9yaWdpblg6IG9yaWdpblgsIG9yaWdpblk6IG9yaWdpblksIHNjYWxlWDogc2NhbGVYLCBzY2FsZVk6IHNjYWxlWSwgc3ByZWFkOiBzcHJlYWQsIHRpbWU6IHRpbWUsIGN1cnZlOiBjdXJ2ZX0sIGZyYW1lICsgMSlcbiIsIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBR0FBOztBREFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUEsNEpBQUE7RUFBQTs7O0FBb0dBLGtCQUFBLEdBQXFCLFNBQUMsR0FB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
