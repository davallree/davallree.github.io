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
  ripplecolor = "rgba(61, 131, 235, 0.10)";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL2RhdmFsbHJlZS9Eb2N1bWVudHMvRnJhbWVyIFN0dWZmL0V4cGVyaW1lbnRzL21hZ2ljIGdyYWRpZW50cy5mcmFtZXIvbW9kdWxlcy9zaW1wbGVyaXBwbGUuY29mZmVlIiwiLi4vLi4vLi4vLi4vLi4vVXNlcnMvZGF2YWxscmVlL0RvY3VtZW50cy9GcmFtZXIgU3R1ZmYvRXhwZXJpbWVudHMvbWFnaWMgZ3JhZGllbnRzLmZyYW1lci9tb2R1bGVzL215TW9kdWxlLmNvZmZlZSIsIi4uLy4uLy4uLy4uLy4uL1VzZXJzL2RhdmFsbHJlZS9Eb2N1bWVudHMvRnJhbWVyIFN0dWZmL0V4cGVyaW1lbnRzL21hZ2ljIGdyYWRpZW50cy5mcmFtZXIvbW9kdWxlcy9HcmFkaWVudC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiMgQ3JlYXRlZCBieSBNYXJpZSBTY2h3ZWl6IG9uIDE2IFNlcHRlbWJlciAyMDE3XG4jIFxuIyBVc2UgdG8gY3JlYXRlIGFuZCBkZXNpZ24gYW4gYW5kcm9pZCByaXBwbGUgdG91Y2ggZWZmZWN0XG4jXG4jIFRvIEdldCBTdGFydGVkLi4uXG4jXG4jIDEuIFBsYWNlIHRoaXMgZmlsZSBpbiBGcmFtZXIgU3R1ZGlvIG1vZHVsZXMgZGlyZWN0b3J5XG4jXG4jIDIuIEluIHlvdXIgcHJvamVjdCBpbmNsdWRlOlxuIyAgICAgcmlwcGxlID0gcmVxdWlyZShcInNpbXBsZXJpcHBsZVwiKS5yaXBwbGVcbiNcbiMgMy4gQWN0aXZhdGUgdGhlIHJpcHBsZSBieSBhZGRpbmc6XG4jICAgICB5b3VybGF5ZXIub24oRXZlbnRzLlRvdWNoU3RhcnQsIHJpcHBsZSlcblxuXG5cbmV4cG9ydHMucmlwcGxlID0gKGV2ZW50LCBsYXllcikgLT5cbiMgQ29vcmRpbmF0ZXMgcmVsYXRpdmUgdG8gYSBwYXJlbnQgZWxlbWVudCBmb3IgdGhlIHJpcHBsZVxuXHRvdXJmYW5jeWxheWVyID0gbGF5ZXJcblx0bGF5ZXIuY2xpcCA9IHRydWVcblxuXHRcbiAgICAjVmFyaWFibGVzIHRvIGNvbmZpZ3VyZSB5b3VyIHJpcHBsZSBhbmQgZmVlZGJhY2tcblx0cmlwcGxlY29sb3IgPSBcInJnYmEoNjEsIDEzMSwgMjM1LCAwLjEwKVwiXG5cdGZlZWRiYWNrY29sb3IgPSBcInJnYmEoMTM1LCAxMzUsIDEzNSwgMC4xMClcIlxuXHRyaXBwbGVzaXplID0gbGF5ZXIuaGVpZ2h0XG5cbiAgICAjIENyZWF0ZSBhIHRvdWNoIGZlZWRiYWNrXG5cblx0c3VwZXJmZWVkYmFjayA9IG5ldyBMYXllclxuXHRcdHBhcmVudDogbGF5ZXJcblx0XHRuYW1lOiBcInN1cGVyZmVlZGJhY2tcIlxuXHRcdHdpZHRoOiBsYXllci53aWR0aFxuXHRcdGhlaWdodDogbGF5ZXIuaGVpZ2h0XG5cdFx0b3BhY2l0eTogMFxuXHRcdGJhY2tncm91bmRDb2xvcjpmZWVkYmFja2NvbG9yXG5cblx0c3VwZXJmZWVkYmFjay5hbmltYXRlXG5cdFx0b3BhY2l0eTogMVxuXHRcdG9wdGlvbnM6XG5cdFx0XHR0aW1lOiAzXG5cdFx0XHRjdXJ2ZTogXCJjdWJpYy1iZXppZXIoMC40LCAwLjAsIDAuNiwgLjUpXCJcblx0XHRcdFxuXHRsYXllci5vblRvdWNoRW5kIC0+XG5cblx0XHQjaGlkZSBmZWVkYmFjayBsYXllclxuXHRcdHN1cGVyZmVlZGJhY2suYW5pbWF0ZVxuXHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0b3B0aW9uczpcblx0XHRcdFx0dGltZTogMC41XG5cdFx0XHRcdGN1cnZlOiBcImN1YmljLWJlemllcigwLjQsIDAuMCwgMC42LCAuNSlcIlxuXHRcdCNkZXN0cm95IGZlZWRiYWNrIGxheWVyXG5cdFx0VXRpbHMuZGVsYXkgMC4zLCAtPlx0XG5cdFx0XHRzdXBlcmZlZWRiYWNrLmRlc3Ryb3koKVxuXG5cdGNvb3JkcyA9IENhbnZhcy5jb252ZXJ0UG9pbnRUb0xheWVyKGV2ZW50LCBsYXllcilcblx0I3ByaW50IGNvb3Jkc1xuXG4gICAgI0NyZWF0ZSBhIExheWVyIG5hbWVkIHNpbXBsZSByaXBwbGUgYW5kIHRoZSBldmVudCBsYXllciBhcyBwYXJlbnRcblxuXHRyaXBwbGVDaXJjbGUgPSBuZXcgTGF5ZXJcblx0XHRwYXJlbnQ6IGxheWVyXG5cdFx0bmFtZTogXCJzaW1wbGUgcmlwcGxlXCJcblx0XHRzY2FsZTogMC4yXG5cdFx0d2lkdGg6IHJpcHBsZXNpemVcblx0XHRoZWlnaHQ6IHJpcHBsZXNpemVcblx0XHRiYWNrZ3JvdW5kQ29sb3I6cmlwcGxlY29sb3Jcblx0XHRib3JkZXJSYWRpdXM6IHJpcHBsZXNpemVcblx0XHR4OiBjb29yZHMueCAtIChyaXBwbGVzaXplIC8gMilcblx0XHR5OiBjb29yZHMueSAtIChyaXBwbGVzaXplIC8gMilcblxuICAgICNBbmltYXRlIHRoZSByaXBwbGVcblxuXHRyaXBwbGVDaXJjbGUuYW5pbWF0ZVxuXHRcdHNjYWxlOiAzXG5cdFx0Ym9yZGVyUmFkaXVzOiA2MFxuXHRcdG9wYWNpdHk6IDBcblx0XHRvcHRpb25zOlxuXHRcdFx0dGltZTogMlxuXHRcbiAgICAjS2lsbCBpdCBhZnRlciB0aGUgYW5pbWF0aW9uIGhhcyBlbmRlZFxuXG5cdHJpcHBsZUNpcmNsZS5vbkFuaW1hdGlvbkVuZCAtPlxuXHRcdHJpcHBsZUNpcmNsZS5kZXN0cm95KClcbiIsIiMgQWRkIHRoZSBmb2xsb3dpbmcgbGluZSB0byB5b3VyIHByb2plY3QgaW4gRnJhbWVyIFN0dWRpby4gXG4jIG15TW9kdWxlID0gcmVxdWlyZSBcIm15TW9kdWxlXCJcbiMgUmVmZXJlbmNlIHRoZSBjb250ZW50cyBieSBuYW1lLCBsaWtlIG15TW9kdWxlLm15RnVuY3Rpb24oKSBvciBteU1vZHVsZS5teVZhclxuXG5leHBvcnRzLm15VmFyID0gXCJteVZhcmlhYmxlXCJcblxuZXhwb3J0cy5teUZ1bmN0aW9uID0gLT5cblx0cHJpbnQgXCJteUZ1bmN0aW9uIGlzIHJ1bm5pbmdcIlxuXG5leHBvcnRzLm15QXJyYXkgPSBbMSwgMiwgM10iLCIjIyNcblx0IyBVU0lORyBUSEUgR1JBRElFTlQgTU9EVUxFXG5cblx0IyBSZXF1aXJlIHRoZSBtb2R1bGVcblx0Z3JhZGllbnQgPSByZXF1aXJlIFwiR3JhZGllbnRcIlxuXG5cdCMgQXBwbHkgYSBncmFkaWVudFxuXHRsYXllckEuc3R5bGUuYmFja2dyb3VuZCA9IGdyYWRpZW50LnRvcChcInllbGxvd1wiLCBcInJlZFwiKVxuXHRsYXllckEuc3R5bGUuYmFja2dyb3VuZCA9IGdyYWRpZW50LmJvdHRvbShcInllbGxvd1wiLCBcInJlZFwiKVxuXHRsYXllckEuc3R5bGUuYmFja2dyb3VuZCA9IGdyYWRpZW50LmxlZnQoXCJ5ZWxsb3dcIiwgXCJyZWRcIilcblx0bGF5ZXJBLnN0eWxlLmJhY2tncm91bmQgPSBncmFkaWVudC5yaWdodChcInllbGxvd1wiLCBcInJlZFwiKVxuXHRsYXllckEuc3R5bGUuYmFja2dyb3VuZCA9IGdyYWRpZW50LmFuZ2xlKFwieWVsbG93XCIsIFwicmVkXCIsIC02MClcblxuXHQjIFRocmVlLWNvbG9yIGdyYWRpZW50IHN5bnRheFxuXHRsYXllckEuc3R5bGUuYmFja2dyb3VuZCA9IGdyYWRpZW50LnRvcFRocmVlQ29sb3IoXCJ5ZWxsb3dcIiwgXCJyZWRcIiwgXCJncmVlblwiKVxuXHRsYXllckEuc3R5bGUuYmFja2dyb3VuZCA9IGdyYWRpZW50LmJvdHRvbVRocmVlQ29sb3IoXCJ5ZWxsb3dcIiwgXCJyZWRcIiwgXCJncmVlblwiKVxuXHRsYXllckEuc3R5bGUuYmFja2dyb3VuZCA9IGdyYWRpZW50LmxlZnRUaHJlZUNvbG9yKFwieWVsbG93XCIsIFwicmVkXCIsIFwiZ3JlZW5cIilcblx0bGF5ZXJBLnN0eWxlLmJhY2tncm91bmQgPSBncmFkaWVudC5yaWdodFRocmVlQ29sb3IoXCJ5ZWxsb3dcIiwgXCJyZWRcIiwgXCJncmVlblwiKVxuXHRsYXllckEuc3R5bGUuYmFja2dyb3VuZCA9IGdyYWRpZW50LmFuZ2xlVGhyZWVDb2xvcihcInllbGxvd1wiLCBcInJlZFwiLCBcImdyZWVuXCIsIC02MClcblxuXHQjIFJhZGlhbCBncmFkaWVudHNcblx0bGF5ZXJBLnN0eWxlLmJhY2tncm91bmQgPSBncmFkaWVudC5yYWRpYWwoXCJ5ZWxsb3dcIiwgXCJyZWRcIilcblx0bGF5ZXJBLnN0eWxlLmJhY2tncm91bmQgPSBncmFkaWVudC5yYWRpYWxUaHJlZUNvbG9yKFwieWVsbG93XCIsIFwicmVkXCIsIFwiZ3JlZW5cIilcblxuXHQjIFJlc2hhcGUgYSByYWRpYWwgZ3JhZGllbnRcblx0bGF5ZXJBLnN0eWxlLmJhY2tncm91bmQgPSBncmFkaWVudC5yYWRpYWwoXCJ5ZWxsb3dcIiwgXCJyZWRcIiwgb3JpZ2luWDogMC41LCBvcmlnaW5ZOiAwLCBzY2FsZVg6IDIsIHNjYWxlWTogMSlcblxuXHQjIG9yaWdpblgsIG9yaWdpblksIHNjYWxlWCBhbmQgc2NhbGVZIGFyZSBwZXJjZW50YWdlcy5cblx0IyBBbiBvcmlnaW5YLG9yaWdpblkgb2YgMCwwIGNlbnRlcnMgdGhlIGdyYWRpZW50IGluIHRoZSB1cHBlciBsZWZ0IHdoaWxlXG5cdCMgMSwxIGNlbnRlcnMgaXQgaW4gdGhlIGxvd2VyIHJpZ2h0LiAwLjUsMC41IGlzIHRoZSBkZWZhdWx0IGNlbnRlci5cblxuXHQjIE9wdGlvbmFsbHkgc2V0IHRoZSBncmFkaWVudCdzIHNwcmVhZFxuXHRsYXllckEuc3R5bGUuYmFja2dyb3VuZCA9IGdyYWRpZW50LnRvcChcInllbGxvd1wiLCBcInJlZFwiLCBzcHJlYWQ6IDAuNSkgIyAxIGlzIGRlZmF1bHQsIDAgaXMgbm8gdHJhbnNpdGlvbiBiZXR3ZWVuIGNvbG9yc1xuXG5cdCMgT3B0aW9uYWxseSBzZXQgdGhlIGdyYWRpZW50J3Mgb2Zmc2V0IChsaW5lYXIgZ3JhZGllbnRzIG9ubHkpXG5cdGxheWVyQS5zdHlsZS5iYWNrZ3JvdW5kID0gZ3JhZGllbnQudG9wKFwieWVsbG93XCIsIFwicmVkXCIsIG9mZnNldDogMTApICMgMCBpcyBubyBvZmZzZXQsIDEwMCB3aWxsIHB1c2ggdGhlIGdyYWRpZW50IG91dCBvZiB2aWV3XG5cblx0IyBPcHRpb25hbGx5IGNoYW5nZSB0aGUgQ1NTIHByZWZpeFxuXHRsYXllckEuc3R5bGUuYmFja2dyb3VuZCA9IGdyYWRpZW50LnRvcChcInllbGxvd1wiLCBcInJlZFwiLCBwcmVmaXg6IFwibW96XCIpICMgd2Via2l0IGlzIGRlZmF1bHQsIGh5cGhlbnMgYXJlIGFkZGVkIGZvciB5b3VcblxuXHQjIEdSQURJRU5UIExBWUVSU1xuXHQjIFdoaWxlIGEgZ3JhZGllbnQgY2FuIGJlIGFwcGxpZWQgdG8gYW55IGV4aXN0aW5nIGxheWVyLCBmb3IgY29udmVuaWVuY2UgaXQgaXNcblx0IyBwb3NzaWJsZSB0byBjcmVhdGUgdHdvIHR5cGVzIG9mIGdyYWRpZW50IGxheWVycy4gSWYgeW91IHdpc2ggdG8gYW5pbWF0ZSB5b3VyXG5cdCMgZ3JhZGllbnRzIHlvdSB3aWxsIG5lZWQgdG8gZG8gc28gdXNpbmcgb25lIG9mIHRoZXNlIGNsYXNzZXMuXG5cblx0bGF5ZXJBID0gbmV3IGdyYWRpZW50LkxheWVyXG5cdFx0Zmlyc3RDb2xvcjogPHN0cmluZz4gKGhleCBvciByZ2JhIG9yIG5hbWVkIGNvbG9yKVxuXHRcdHNlY29uZENvbG9yOiA8c3RyaW5nPiAoaGV4IG9yIHJnYmEgb3IgbmFtZWQgY29sb3IpXG5cdFx0dGhpcmRDb2xvcjogPHN0cmluZz4gKGhleCBvciByZ2JhIG9yIG5hbWVkIGNvbG9yKVxuXHRcdGRpcmVjdGlvbjogPHN0cmluZz4gKFwidG9wXCIgfHwgXCJib3R0b21cIiB8fCBcImxlZnRcIiB8fCBcInJpZ2h0XCIpIG9yIDxudW1iZXI+IChpbiBkZWdyZWVzKVxuXHRcdHByZWZpeDogPHN0cmluZz4gKGh5cGhlbnMgYXJlIGFkZGVkIGZvciB5b3UpXG5cdFx0c3ByZWFkOiA8bnVtYmVyPiAoMCBpcyBubyB0cmFuc2l0aW9uKVxuXHRcdG9mZnNldDogPG51bWJlcj5cblxuXHRsYXllckEgPSBuZXcgZ3JhZGllbnQuUmFkaWFsTGF5ZXJcblx0XHRmaXJzdENvbG9yOiA8c3RyaW5nPiAoaGV4IG9yIHJnYmEgb3IgbmFtZWQgY29sb3IpXG5cdFx0c2Vjb25kQ29sb3I6IDxzdHJpbmc+IChoZXggb3IgcmdiYSBvciBuYW1lZCBjb2xvcilcblx0XHR0aGlyZENvbG9yOiA8c3RyaW5nPiAoaGV4IG9yIHJnYmEgb3IgbmFtZWQgY29sb3IpXG5cdFx0cHJlZml4OiA8c3RyaW5nPiAoaHlwaGVucyBhcmUgYWRkZWQgZm9yIHlvdSlcblx0XHRzcHJlYWQ6IDxudW1iZXI+ICgwIGlzIG5vIHRyYW5zaXRpb24pXG5cdFx0b2Zmc2V0OiA8bnVtYmVyPlxuXHRcdGdyYWRpZW50T3JpZ2luWDogPG51bWJlcj4gKDAgaXMgbGVmdCwgMSBpcyByaWdodClcblx0XHRncmFkaWVudE9yaWdpblk6IDxudW1iZXI+ICgwIGlzIHRvcCwgMSBpcyBib3R0b20pXG5cdFx0Z3JhZGllbnRTY2FsZVg6IDxudW1iZXI+IChwZXJjZW50YWdlLCAxIGlzIDEwMCUgc2NhbGUpXG5cdFx0Z3JhZGllbnRTY2FsZVk6IDxudW1iZXI+IChwZXJjZW50YWdlLCAxIGlzIDEwMCUgc2NhbGUpXG5cblx0IyBBTklNQVRJTkcgR1JBRElFTlRTXG5cblx0bGF5ZXJBLmFuaW1hdGVHcmFkaWVudCg8YXJndW1lbnRzPilcblxuXHQjIEFyZ3VtZW50c1xuXHRmaXJzdENvbG9yOiA8c3RyaW5nPiAoaGV4IG9yIHJnYmEgb3IgbmFtZWQgY29sb3IpXG5cdHNlY29uZENvbG9yOiA8c3RyaW5nPiAoaGV4IG9yIHJnYmEgb3IgbmFtZWQgY29sb3IpXG5cdHRoaXJkQ29sb3I6IDxzdHJpbmc+IChoZXggb3IgcmdiYSBvciBuYW1lZCBjb2xvcilcblx0ZGlyZWN0aW9uOiA8c3RyaW5nPiAoXCJ0b3BcIiB8fCBcImJvdHRvbVwiIHx8IFwibGVmdFwiIHx8IFwicmlnaHRcIikgb3IgPG51bWJlcj4gKGluIGRlZ3JlZXMpXG5cdHNwcmVhZDogPG51bWJlcj5cblx0b2Zmc2V0OiA8bnVtYmVyPlxuXHR0aW1lOiA8bnVtYmVyPlxuXHRjdXJ2ZTogPHN0cmluZz4gKFwibGluZWFyXCIgfHwgXCJlYXNlLWluXCIgfHwgXCJlYXNlLW91dFwiIHx8IFwiZWFzZS1pbi1vdXRcIiApXG5cblx0IyBBcmd1bWVudHMgZm9yIHJhZGlhbCBncmFkaWVudCBhbmltYXRpb25cblx0b3JpZ2luWDogPG51bWJlcj4gKDAgaXMgbGVmdCwgMSBpcyByaWdodClcblx0b3JpZ2luWTogPG51bWJlcj4gKDAgaXMgdG9wLCAxIGlzIGJvdHRvbSlcblx0c2NhbGVYOiA8bnVtYmVyPiAocGVyY2VudGFnZSwgMSBpcyAxMDAlIHNjYWxlKVxuXHRzY2FsZVk6IDxudW1iZXI+IChwZXJjZW50YWdlLCAxIGlzIDEwMCUgc2NhbGUpXG5cblx0IyBFeGFtcGxlc1xuXHRsYXllckEuYW5pbWF0ZUdyYWRpZW50KGRpcmVjdGlvbjogLTYwLCBzcHJlYWQ6IDIsIG9mZnNldDogMCwgdGltZTogMilcblx0bGF5ZXJBLmFuaW1hdGVHcmFkaWVudChvZmZzZXQ6IC01MCwgY3VydmU6IFwiZWFzZS1pbi1vdXRcIilcblx0bGF5ZXJBLmFuaW1hdGVHcmFkaWVudChzZWNvbmRDb2xvcjogXCJibHVlXCIsIHNwcmVhZDogMC41LCBzY2FsZVg6IDIsIG9yaWdpblk6IDEpXG5cblx0IyBEZXRlY3QgYW5pbWF0aW9uIHN0YXJ0IGFuZCBlbmRcblx0bGF5ZXJBLm9uIFwiZ3JhZGllbnRBbmltYXRpb25TdGFydFwiLCAtPlxuXHRcdHByaW50IFwiYW5pbWF0aW9uIHN0YXJ0XCJcblxuXHRsYXllckEub24gXCJncmFkaWVudEFuaW1hdGlvbkVuZFwiLCAtPlxuXHRcdHByaW50IFwiYW5pbWF0aW9uIGVuZFwiXG4jIyNcblxuIyBzdHJpbmcgZ2VuZXJhdG9yc1xubWFrZUdyYWRpZW50U3RyaW5nID0gKHtkaXJlY3Rpb24sIGZpcnN0Q29sb3IsIHNlY29uZENvbG9yLCBwcmVmaXgsIHNwcmVhZCwgb2Zmc2V0LCBhbmdsZX0pIC0+XG5cdGFuZ2xlID89IGZhbHNlXG5cdGlmIGFuZ2xlID09IHRydWVcblx0XHRkaXJlY3Rpb24gPSBkaXJlY3Rpb24gKyBcImRlZ1wiXG5cdHJldHVybiBcIiN7cHJlZml4fWxpbmVhci1ncmFkaWVudCgje2RpcmVjdGlvbn0sICN7Zmlyc3RDb2xvcn0gI3tVdGlscy5tb2R1bGF0ZShzcHJlYWQsIFsxLCAwXSwgWzAsIDUwXSwgZmFsc2UpICsgb2Zmc2V0fSUsICN7c2Vjb25kQ29sb3J9ICN7VXRpbHMubW9kdWxhdGUoc3ByZWFkLCBbMSwgMF0sIFsxMDAsIDUwXSwgZmFsc2UpICsgb2Zmc2V0fSUpXCJcblxubWFrZUdyYWRpZW50VGhyZWVDb2xvclN0cmluZyA9ICh7ZGlyZWN0aW9uLCBmaXJzdENvbG9yLCBzZWNvbmRDb2xvciwgdGhpcmRDb2xvciwgcHJlZml4LCBzcHJlYWQsIG9mZnNldCwgYW5nbGV9KSAtPlxuXHRhbmdsZSA/PSBmYWxzZVxuXHRpZiBhbmdsZSA9PSB0cnVlXG5cdFx0ZGlyZWN0aW9uID0gZGlyZWN0aW9uICsgXCJkZWdcIlxuXHRyZXR1cm4gXCIje3ByZWZpeH1saW5lYXItZ3JhZGllbnQoI3tkaXJlY3Rpb259LCAje2ZpcnN0Q29sb3J9ICN7VXRpbHMubW9kdWxhdGUoc3ByZWFkLCBbMSwgMF0sIFswLCA1MF0sIGZhbHNlKSArIG9mZnNldH0lLCAje3NlY29uZENvbG9yfSAjezUwICsgb2Zmc2V0fSUsICN7dGhpcmRDb2xvcn0gI3tVdGlscy5tb2R1bGF0ZShzcHJlYWQsIFsxLCAwXSwgWzEwMCwgNTBdLCBmYWxzZSkgKyBvZmZzZXR9JSlcIlxuXG5tYWtlUmFkaWFsR3JhZGllbnRTdHJpbmcgPSAoe2ZpcnN0Q29sb3IsIHNlY29uZENvbG9yLCBwcmVmaXgsIHNwcmVhZCwgZWxsaXBzZVgsIGVsbGlwc2VZLCBlbGxpcHNlV2lkdGgsIGVsbGlwc2VIZWlnaHR9KSAtPlxuXHRyZXR1cm4gXCIje3ByZWZpeH1yYWRpYWwtZ3JhZGllbnQoI3tlbGxpcHNlWH0lICN7ZWxsaXBzZVl9JSwgI3tlbGxpcHNlV2lkdGh9JSAje2VsbGlwc2VIZWlnaHR9JSwgI3tmaXJzdENvbG9yfSAje1V0aWxzLm1vZHVsYXRlKHNwcmVhZCwgWzEsIDBdLCBbMCwgNTBdLCBmYWxzZSl9JSwgI3tzZWNvbmRDb2xvcn0gI3tVdGlscy5tb2R1bGF0ZShzcHJlYWQsIFsxLCAwXSwgWzEwMCwgNTBdLCBmYWxzZSl9JSlcIlxuXG5tYWtlUmFkaWFsR3JhZGllbnRUaHJlZUNvbG9yU3RyaW5nID0gKHtmaXJzdENvbG9yLCBzZWNvbmRDb2xvciwgdGhpcmRDb2xvciwgcHJlZml4LCBzcHJlYWQsIGVsbGlwc2VYLCBlbGxpcHNlWSwgZWxsaXBzZVdpZHRoLCBlbGxpcHNlSGVpZ2h0fSkgLT5cblx0cmV0dXJuIFwiI3twcmVmaXh9cmFkaWFsLWdyYWRpZW50KCN7ZWxsaXBzZVh9JSAje2VsbGlwc2VZfSUsICN7ZWxsaXBzZVdpZHRofSUgI3tlbGxpcHNlSGVpZ2h0fSUsICN7Zmlyc3RDb2xvcn0gI3tVdGlscy5tb2R1bGF0ZShzcHJlYWQsIFsxLCAwXSwgWzAsIDUwXSwgZmFsc2UpfSUsICN7c2Vjb25kQ29sb3J9IDUwJSwgI3t0aGlyZENvbG9yfSAje1V0aWxzLm1vZHVsYXRlKHNwcmVhZCwgWzEsIDBdLCBbMTAwLCA1MF0sIGZhbHNlKX0lKVwiXG5cbiMgYW5pbWF0aW9uIGN1cnZlc1xubGluZWFyID0gKHQpIC0+XG5cdHJldHVybiB0XG5cbmVhc2VJbiA9ICh0KSAtPlxuXHQjIHF1YWQgZnVuY3Rpb25cblx0cmV0dXJuIHQqdFxuXG5lYXNlT3V0ID0gKHQpIC0+XG5cdCMgcXVhZCBmdW5jdGlvblxuXHRyZXR1cm4gdCooMi10KVxuXG5lYXNlSW5PdXQgPSAodCkgLT5cblx0IyBjdWJpYyBmdW5jdGlvblxuXHRpZiB0IDwgLjVcblx0XHRyZXR1cm4gNCAqIHQgKiB0ICogdFxuXHRlbHNlXG5cdFx0cmV0dXJuICh0IC0gMSkgKiAoMiAqIHQgLSAyKSAqICgyICogdCAtIDIpICsgMVxuXG4jIGdyYWRpZW50IGRpcmVjdGlvbnNcbmV4cG9ydHMudG9wID0gKGZpcnN0Q29sb3IgPSBcIndoaXRlXCIsIHNlY29uZENvbG9yID0gXCJibGFja1wiLCB7cHJlZml4LCBzcHJlYWQsIG9mZnNldH0gPSB7fSkgLT5cblx0cHJlZml4ID89IFwid2Via2l0XCJcblx0c3ByZWFkID89IDFcblx0b2Zmc2V0ID89IDBcblx0aWYgcHJlZml4ICE9IFwiXCJcblx0XHRwcmVmaXggPSBcIi1cIiArIHByZWZpeCArIFwiLVwiXG5cdHJldHVybiBtYWtlR3JhZGllbnRTdHJpbmcoZGlyZWN0aW9uOiBcInRvcFwiLCBmaXJzdENvbG9yOiBmaXJzdENvbG9yLCBzZWNvbmRDb2xvcjogc2Vjb25kQ29sb3IsIHByZWZpeDogcHJlZml4LCBzcHJlYWQ6IHNwcmVhZCwgb2Zmc2V0OiBvZmZzZXQpXG5cbmV4cG9ydHMudG9wVGhyZWVDb2xvciA9IChmaXJzdENvbG9yID0gXCJ3aGl0ZVwiLCBzZWNvbmRDb2xvciA9IFwiZ3JheVwiLCB0aGlyZENvbG9yID0gXCJibGFja1wiLCB7cHJlZml4LCBzcHJlYWQsIG9mZnNldH0gPSB7fSkgLT5cblx0cHJlZml4ID89IFwid2Via2l0XCJcblx0c3ByZWFkID89IDFcblx0b2Zmc2V0ID89IDBcblx0aWYgcHJlZml4ICE9IFwiXCJcblx0XHRwcmVmaXggPSBcIi1cIiArIHByZWZpeCArIFwiLVwiXG5cdHJldHVybiBtYWtlR3JhZGllbnRUaHJlZUNvbG9yU3RyaW5nKGRpcmVjdGlvbjogXCJ0b3BcIiwgZmlyc3RDb2xvcjogZmlyc3RDb2xvciwgc2Vjb25kQ29sb3I6IHNlY29uZENvbG9yLCB0aGlyZENvbG9yOiB0aGlyZENvbG9yLCBwcmVmaXg6IHByZWZpeCwgc3ByZWFkOiBzcHJlYWQsIG9mZnNldDogb2Zmc2V0KVxuXG5leHBvcnRzLmJvdHRvbSA9IChmaXJzdENvbG9yID0gXCJ3aGl0ZVwiLCBzZWNvbmRDb2xvciA9IFwiYmxhY2tcIiwge3ByZWZpeCwgc3ByZWFkLCBvZmZzZXR9ID0ge30pIC0+XG5cdHByZWZpeCA/PSBcIndlYmtpdFwiXG5cdHNwcmVhZCA/PSAxXG5cdG9mZnNldCA/PSAwXG5cdGlmIHByZWZpeCAhPSBcIlwiXG5cdFx0cHJlZml4ID0gXCItXCIgKyBwcmVmaXggKyBcIi1cIlxuXHRyZXR1cm4gbWFrZUdyYWRpZW50U3RyaW5nKGRpcmVjdGlvbjogXCJib3R0b21cIiwgZmlyc3RDb2xvcjogZmlyc3RDb2xvciwgc2Vjb25kQ29sb3I6IHNlY29uZENvbG9yLCBwcmVmaXg6IHByZWZpeCwgc3ByZWFkOiBzcHJlYWQsIG9mZnNldDogb2Zmc2V0KVxuXG5leHBvcnRzLmJvdHRvbVRocmVlQ29sb3IgPSAoZmlyc3RDb2xvciA9IFwid2hpdGVcIiwgc2Vjb25kQ29sb3IgPSBcImdyYXlcIiwgdGhpcmRDb2xvciA9IFwiYmxhY2tcIiwge3ByZWZpeCwgc3ByZWFkLCBvZmZzZXR9ID0ge30pIC0+XG5cdHByZWZpeCA/PSBcIndlYmtpdFwiXG5cdHNwcmVhZCA/PSAxXG5cdG9mZnNldCA/PSAwXG5cdGlmIHByZWZpeCAhPSBcIlwiXG5cdFx0cHJlZml4ID0gXCItXCIgKyBwcmVmaXggKyBcIi1cIlxuXHRyZXR1cm4gbWFrZUdyYWRpZW50VGhyZWVDb2xvclN0cmluZyhkaXJlY3Rpb246IFwiYm90dG9tXCIsIGZpcnN0Q29sb3I6IGZpcnN0Q29sb3IsIHNlY29uZENvbG9yOiBzZWNvbmRDb2xvciwgdGhpcmRDb2xvcjogdGhpcmRDb2xvciwgcHJlZml4OiBwcmVmaXgsIHNwcmVhZDogc3ByZWFkLCBvZmZzZXQ6IG9mZnNldClcblxuZXhwb3J0cy5sZWZ0ID0gKGZpcnN0Q29sb3IgPSBcIndoaXRlXCIsIHNlY29uZENvbG9yID0gXCJibGFja1wiLCB7cHJlZml4LCBzcHJlYWQsIG9mZnNldH0gPSB7fSkgLT5cblx0cHJlZml4ID89IFwid2Via2l0XCJcblx0c3ByZWFkID89IDFcblx0b2Zmc2V0ID89IDBcblx0aWYgcHJlZml4ICE9IFwiXCJcblx0XHRwcmVmaXggPSBcIi1cIiArIHByZWZpeCArIFwiLVwiXG5cdHJldHVybiBtYWtlR3JhZGllbnRTdHJpbmcoZGlyZWN0aW9uOiBcImxlZnRcIiwgZmlyc3RDb2xvcjogZmlyc3RDb2xvciwgc2Vjb25kQ29sb3I6IHNlY29uZENvbG9yLCBwcmVmaXg6IHByZWZpeCwgc3ByZWFkOiBzcHJlYWQsIG9mZnNldDogb2Zmc2V0KVxuXG5leHBvcnRzLmxlZnRUaHJlZUNvbG9yID0gKGZpcnN0Q29sb3IgPSBcIndoaXRlXCIsIHNlY29uZENvbG9yID0gXCJncmF5XCIsIHRoaXJkQ29sb3IgPSBcImJsYWNrXCIsIHtwcmVmaXgsIHNwcmVhZCwgb2Zmc2V0fSA9IHt9KSAtPlxuXHRwcmVmaXggPz0gXCJ3ZWJraXRcIlxuXHRzcHJlYWQgPz0gMVxuXHRvZmZzZXQgPz0gMFxuXHRpZiBwcmVmaXggIT0gXCJcIlxuXHRcdHByZWZpeCA9IFwiLVwiICsgcHJlZml4ICsgXCItXCJcblx0cmV0dXJuIG1ha2VHcmFkaWVudFRocmVlQ29sb3JTdHJpbmcoZGlyZWN0aW9uOiBcImxlZnRcIiwgZmlyc3RDb2xvcjogZmlyc3RDb2xvciwgc2Vjb25kQ29sb3I6IHNlY29uZENvbG9yLCB0aGlyZENvbG9yOiB0aGlyZENvbG9yLCBwcmVmaXg6IHByZWZpeCwgc3ByZWFkOiBzcHJlYWQsIG9mZnNldDogb2Zmc2V0KVxuXG5leHBvcnRzLnJpZ2h0ID0gKGZpcnN0Q29sb3IgPSBcIndoaXRlXCIsIHNlY29uZENvbG9yID0gXCJibGFja1wiLCB7cHJlZml4LCBzcHJlYWQsIG9mZnNldH0gPSB7fSkgLT5cblx0cHJlZml4ID89IFwid2Via2l0XCJcblx0c3ByZWFkID89IDFcblx0b2Zmc2V0ID89IDBcblx0aWYgcHJlZml4ICE9IFwiXCJcblx0XHRwcmVmaXggPSBcIi1cIiArIHByZWZpeCArIFwiLVwiXG5cdHJldHVybiBtYWtlR3JhZGllbnRTdHJpbmcoZGlyZWN0aW9uOiBcInJpZ2h0XCIsIGZpcnN0Q29sb3I6IGZpcnN0Q29sb3IsIHNlY29uZENvbG9yOiBzZWNvbmRDb2xvciwgcHJlZml4OiBwcmVmaXgsIHNwcmVhZDogc3ByZWFkLCBvZmZzZXQ6IG9mZnNldClcblxuZXhwb3J0cy5yaWdodFRocmVlQ29sb3IgPSAoZmlyc3RDb2xvciA9IFwid2hpdGVcIiwgc2Vjb25kQ29sb3IgPSBcImdyYXlcIiwgdGhpcmRDb2xvciA9IFwiYmxhY2tcIiwge3ByZWZpeCwgc3ByZWFkLCBvZmZzZXR9ID0ge30pIC0+XG5cdHByZWZpeCA/PSBcIndlYmtpdFwiXG5cdHNwcmVhZCA/PSAxXG5cdG9mZnNldCA/PSAwXG5cdGlmIHByZWZpeCAhPSBcIlwiXG5cdFx0cHJlZml4ID0gXCItXCIgKyBwcmVmaXggKyBcIi1cIlxuXHRyZXR1cm4gbWFrZUdyYWRpZW50VGhyZWVDb2xvclN0cmluZyhkaXJlY3Rpb246IFwicmlnaHRcIiwgZmlyc3RDb2xvcjogZmlyc3RDb2xvciwgc2Vjb25kQ29sb3I6IHNlY29uZENvbG9yLCB0aGlyZENvbG9yOiB0aGlyZENvbG9yLCBwcmVmaXg6IHByZWZpeCwgc3ByZWFkOiBzcHJlYWQsIG9mZnNldDogb2Zmc2V0KVxuXG5leHBvcnRzLmFuZ2xlID0gKGZpcnN0Q29sb3IgPSBcIndoaXRlXCIsIHNlY29uZENvbG9yID0gXCJibGFja1wiLCBkZWdyZWVzID0gMTM1LCB7cHJlZml4LCBzcHJlYWQsIG9mZnNldH0gPSB7fSkgLT5cblx0cHJlZml4ID89IFwid2Via2l0XCJcblx0c3ByZWFkID89IDFcblx0b2Zmc2V0ID89IDBcblx0aWYgcHJlZml4ICE9IFwiXCJcblx0XHRwcmVmaXggPSBcIi1cIiArIHByZWZpeCArIFwiLVwiXG5cdHJldHVybiBtYWtlR3JhZGllbnRTdHJpbmcoZGlyZWN0aW9uOiBkZWdyZWVzLCBmaXJzdENvbG9yOiBmaXJzdENvbG9yLCBzZWNvbmRDb2xvcjogc2Vjb25kQ29sb3IsIHByZWZpeDogcHJlZml4LCBzcHJlYWQ6IHNwcmVhZCwgb2Zmc2V0OiBvZmZzZXQsIGFuZ2xlOiB0cnVlKVxuXG5leHBvcnRzLmFuZ2xlVGhyZWVDb2xvciA9IChmaXJzdENvbG9yID0gXCJ3aGl0ZVwiLCBzZWNvbmRDb2xvciA9IFwiZ3JheVwiLCB0aGlyZENvbG9yID0gXCJibGFja1wiLCBkZWdyZWVzID0gMTM1LCB7cHJlZml4LCBzcHJlYWQsIG9mZnNldH0gPSB7fSkgLT5cblx0cHJlZml4ID89IFwid2Via2l0XCJcblx0c3ByZWFkID89IDFcblx0b2Zmc2V0ID89IDBcblx0aWYgcHJlZml4ICE9IFwiXCJcblx0XHRwcmVmaXggPSBcIi1cIiArIHByZWZpeCArIFwiLVwiXG5cdHJldHVybiBtYWtlR3JhZGllbnRUaHJlZUNvbG9yU3RyaW5nKGRpcmVjdGlvbjogZGVncmVlcywgZmlyc3RDb2xvcjogZmlyc3RDb2xvciwgc2Vjb25kQ29sb3I6IHNlY29uZENvbG9yLCB0aGlyZENvbG9yOiB0aGlyZENvbG9yLCBwcmVmaXg6IHByZWZpeCwgc3ByZWFkOiBzcHJlYWQsIG9mZnNldDogb2Zmc2V0LCBhbmdsZTogdHJ1ZSlcblxuZXhwb3J0cy5yYWRpYWwgPSAoZmlyc3RDb2xvciA9IFwid2hpdGVcIiwgc2Vjb25kQ29sb3IgPSBcImJsYWNrXCIsIHtwcmVmaXgsIHNwcmVhZCwgb3JpZ2luWCwgb3JpZ2luWSwgc2NhbGVYLCBzY2FsZVl9ID0ge30pIC0+XG5cdHByZWZpeCA/PSBcIndlYmtpdFwiXG5cdHNwcmVhZCA/PSAxXG5cdG9yaWdpblggPz0gMC41XG5cdG9yaWdpblkgPz0gMC41XG5cdG9yaWdpblggPSBvcmlnaW5YICogMTAwXG5cdG9yaWdpblkgPSBvcmlnaW5ZICogMTAwXG5cdHNjYWxlWCA/PSAxXG5cdHNjYWxlWSA/PSAxXG5cdHNjYWxlWCA9IFV0aWxzLm1vZHVsYXRlKHNjYWxlWCwgWzAsIDEwMF0sIFswLCA3MF0pICogMTAwXG5cdHNjYWxlWSA9IFV0aWxzLm1vZHVsYXRlKHNjYWxlWSwgWzAsIDEwMF0sIFswLCA3MF0pICogMTAwXG5cdGlmIHByZWZpeCAhPSBcIlwiXG5cdFx0cHJlZml4ID0gXCItXCIgKyBwcmVmaXggKyBcIi1cIlxuXHRyZXR1cm4gbWFrZVJhZGlhbEdyYWRpZW50U3RyaW5nKGZpcnN0Q29sb3I6IGZpcnN0Q29sb3IsIHNlY29uZENvbG9yOiBzZWNvbmRDb2xvciwgcHJlZml4OiBwcmVmaXgsIHNwcmVhZDogc3ByZWFkLCBlbGxpcHNlWDogb3JpZ2luWCwgZWxsaXBzZVk6IG9yaWdpblksIGVsbGlwc2VXaWR0aDogc2NhbGVYLCBlbGxpcHNlSGVpZ2h0OiBzY2FsZVkpXG5cbmRlZmF1bHRzID1cblx0ZGlyZWN0aW9uOiBcInRvcFwiXG5cdGZpcnN0Q29sb3I6IFwid2hpdGVcIlxuXHRzZWNvbmRDb2xvcjogXCJibGFja1wiXG5cdHRoaXJkQ29sb3I6IFwiXCJcblx0cHJlZml4OiBcIndlYmtpdFwiXG5cdHNwcmVhZDogMVxuXHRvZmZzZXQ6IDBcblx0YW5nbGU6IGZhbHNlXG5cdGdyYWRpZW50T3JpZ2luWDogMC41XG5cdGdyYWRpZW50T3JpZ2luWTogMC41XG5cdGdyYWRpZW50U2NhbGVYOiAxXG5cdGdyYWRpZW50U2NhbGVZOiAxXG5cbmV4cG9ydHMucmFkaWFsVGhyZWVDb2xvciA9IChmaXJzdENvbG9yID0gXCJ3aGl0ZVwiLCBzZWNvbmRDb2xvciA9IFwiZ3JheVwiLCB0aGlyZENvbG9yID0gXCJibGFja1wiLCB7cHJlZml4LCBzcHJlYWQsIG9yaWdpblgsIG9yaWdpblksIHNjYWxlWCwgc2NhbGVZfSA9IHt9KSAtPlxuXHRwcmVmaXggPz0gXCJ3ZWJraXRcIlxuXHRzcHJlYWQgPz0gMVxuXHRvcmlnaW5YID89IDAuNVxuXHRvcmlnaW5ZID89IDAuNVxuXHRvcmlnaW5YID0gb3JpZ2luWCAqIDEwMFxuXHRvcmlnaW5ZID0gb3JpZ2luWSAqIDEwMFxuXHRzY2FsZVggPz0gMVxuXHRzY2FsZVkgPz0gMVxuXHRzY2FsZVggPSBVdGlscy5tb2R1bGF0ZShzY2FsZVgsIFswLCAxMDBdLCBbMCwgNzBdKSAqIDEwMFxuXHRzY2FsZVkgPSBVdGlscy5tb2R1bGF0ZShzY2FsZVksIFswLCAxMDBdLCBbMCwgNzBdKSAqIDEwMFxuXHRpZiBwcmVmaXggIT0gXCJcIlxuXHRcdHByZWZpeCA9IFwiLVwiICsgcHJlZml4ICsgXCItXCJcblx0cmV0dXJuIG1ha2VSYWRpYWxHcmFkaWVudFRocmVlQ29sb3JTdHJpbmcoZmlyc3RDb2xvcjogZmlyc3RDb2xvciwgc2Vjb25kQ29sb3I6IHNlY29uZENvbG9yLCB0aGlyZENvbG9yOiB0aGlyZENvbG9yLCBwcmVmaXg6IHByZWZpeCwgc3ByZWFkOiBzcHJlYWQsIGVsbGlwc2VYOiBvcmlnaW5YLCBlbGxpcHNlWTogb3JpZ2luWSwgZWxsaXBzZVdpZHRoOiBzY2FsZVgsIGVsbGlwc2VIZWlnaHQ6IHNjYWxlWSlcblxuIyBncmFkaWVudCBsYXllcnNcbmNsYXNzIGV4cG9ydHMuTGF5ZXIgZXh0ZW5kcyBMYXllclxuXHRjb25zdHJ1Y3RvcjogKEBvcHRpb25zPXt9KSAtPlxuXHRcdEBvcHRpb25zID0gXy5hc3NpZ24oe30sIGRlZmF1bHRzLCBAb3B0aW9ucylcblx0XHRzdXBlciBAb3B0aW9uc1xuXHRcdGlmIEBvcHRpb25zLnByZWZpeCAhPSBcIlwiXG5cdFx0XHRAb3B0aW9ucy5wcmVmaXggPSBcIi1cIiArIEBvcHRpb25zLnByZWZpeCArIFwiLVwiXG5cdFx0aWYgdHlwZW9mIEBvcHRpb25zLmRpcmVjdGlvbiBpcyBcIm51bWJlclwiXG5cdFx0XHRAb3B0aW9ucy5hbmdsZSA9IHRydWVcblx0XHRncmFkaWVudCA9IFwiXCJcblx0XHRpZiBAb3B0aW9ucy50aGlyZENvbG9yID09IFwiXCJcblx0XHRcdGdyYWRpZW50ID0gbWFrZUdyYWRpZW50U3RyaW5nKGRpcmVjdGlvbjogQG9wdGlvbnMuZGlyZWN0aW9uLCBmaXJzdENvbG9yOiBAb3B0aW9ucy5maXJzdENvbG9yLCBzZWNvbmRDb2xvcjogQG9wdGlvbnMuc2Vjb25kQ29sb3IsIHByZWZpeDogQG9wdGlvbnMucHJlZml4LCBzcHJlYWQ6IEBvcHRpb25zLnNwcmVhZCwgb2Zmc2V0OiBAb3B0aW9ucy5vZmZzZXQsIGFuZ2xlOiBAb3B0aW9ucy5hbmdsZSlcblx0XHRlbHNlXG5cdFx0XHRncmFkaWVudCA9IG1ha2VHcmFkaWVudFRocmVlQ29sb3JTdHJpbmcoZGlyZWN0aW9uOiBAb3B0aW9ucy5kaXJlY3Rpb24sIGZpcnN0Q29sb3I6IEBvcHRpb25zLmZpcnN0Q29sb3IsIHNlY29uZENvbG9yOiBAb3B0aW9ucy5zZWNvbmRDb2xvciwgdGhpcmRDb2xvcjogQG9wdGlvbnMudGhpcmRDb2xvciwgcHJlZml4OiBAb3B0aW9ucy5wcmVmaXgsIHNwcmVhZDogQG9wdGlvbnMuc3ByZWFkLCBvZmZzZXQ6IEBvcHRpb25zLm9mZnNldCwgYW5nbGU6IEBvcHRpb25zLmFuZ2xlKVxuXHRcdEAuc3R5bGUuYmFja2dyb3VuZCA9IGdyYWRpZW50XG5cblx0YW5pbWF0ZUdyYWRpZW50OiAoe2ZpcnN0Q29sb3IsIHNlY29uZENvbG9yLCB0aGlyZENvbG9yLCBzcHJlYWQsIG9mZnNldCwgZGlyZWN0aW9uLCB0aW1lLCBjdXJ2ZX0gPSB7fSwgZnJhbWUgPSAwKSAtPlxuXHRcdGZpcnN0Q29sb3IgPz0gQG9wdGlvbnMuZmlyc3RDb2xvclxuXHRcdHNlY29uZENvbG9yID89IEBvcHRpb25zLnNlY29uZENvbG9yXG5cdFx0dGhpcmRDb2xvciA/PSBAb3B0aW9ucy50aGlyZENvbG9yXG5cdFx0c3ByZWFkID89IEBvcHRpb25zLnNwcmVhZFxuXHRcdG9mZnNldCA/PSBAb3B0aW9ucy5vZmZzZXRcblx0XHRkaXJlY3Rpb24gPz0gQG9wdGlvbnMuZGlyZWN0aW9uXG5cdFx0dGltZSA/PSBGcmFtZXIuRGVmYXVsdHMuQW5pbWF0aW9uLnRpbWVcblx0XHRjdXJ2ZSA/PSBcImVhc2Utb3V0XCJcblx0XHR0b3RhbEZyYW1lcyA9IHRpbWUgLyBGcmFtZXIuTG9vcC5kZWx0YVxuXHRcdGlmIGZyYW1lID09IDBcblx0XHRcdEAuZW1pdCBcImdyYWRpZW50QW5pbWF0aW9uU3RhcnRcIlxuXHRcdGVsc2UgaWYgZnJhbWUgPT0gdG90YWxGcmFtZXNcblx0XHRcdEAuZW1pdCBcImdyYWRpZW50QW5pbWF0aW9uRW5kXCJcblx0XHRpZiB0eXBlb2YgQG9wdGlvbnMuZGlyZWN0aW9uIGlzIFwic3RyaW5nXCJcblx0XHRcdHN3aXRjaCBAb3B0aW9ucy5kaXJlY3Rpb25cblx0XHRcdFx0d2hlbiBcInRvcFwiXG5cdFx0XHRcdFx0c3RhcnREaXJlY3Rpb24gPSAtOTBcblx0XHRcdFx0d2hlbiBcImJvdHRvbVwiXG5cdFx0XHRcdFx0c3RhcnREaXJlY3Rpb24gPSA5MFxuXHRcdFx0XHR3aGVuIFwibGVmdFwiXG5cdFx0XHRcdFx0c3RhcnREaXJlY3Rpb24gPSAwXG5cdFx0XHRcdHdoZW4gXCJyaWdodFwiXG5cdFx0XHRcdFx0c3RhcnREaXJlY3Rpb24gPSAxODBcblx0XHRlbHNlXG5cdFx0XHRzdGFydERpcmVjdGlvbiA9IEBvcHRpb25zLmRpcmVjdGlvblxuXHRcdGlmIHR5cGVvZiBkaXJlY3Rpb24gaXMgXCJzdHJpbmdcIlxuXHRcdFx0c3dpdGNoIGRpcmVjdGlvblxuXHRcdFx0XHR3aGVuIFwidG9wXCJcblx0XHRcdFx0XHR0YXJnZXREaXJlY3Rpb24gPSAtOTBcblx0XHRcdFx0d2hlbiBcImJvdHRvbVwiXG5cdFx0XHRcdFx0dGFyZ2V0RGlyZWN0aW9uID0gOTBcblx0XHRcdFx0d2hlbiBcImxlZnRcIlxuXHRcdFx0XHRcdHRhcmdldERpcmVjdGlvbiA9IDBcblx0XHRcdFx0d2hlbiBcInJpZ2h0XCJcblx0XHRcdFx0XHR0YXJnZXREaXJlY3Rpb24gPSAxODBcblx0XHRlbHNlXG5cdFx0XHR0YXJnZXREaXJlY3Rpb24gPSBkaXJlY3Rpb25cblx0XHRpZiBmcmFtZSA8IHRvdGFsRnJhbWVzXG5cdFx0XHRzd2l0Y2ggY3VydmVcblx0XHRcdFx0d2hlbiBcImxpbmVhclwiXG5cdFx0XHRcdFx0ZWFzZWRGcmFtZSA9IGxpbmVhcihmcmFtZS90b3RhbEZyYW1lcylcblx0XHRcdFx0d2hlbiBcImVhc2UtaW5cIlxuXHRcdFx0XHRcdGVhc2VkRnJhbWUgPSBlYXNlSW4oZnJhbWUvdG90YWxGcmFtZXMpXG5cdFx0XHRcdHdoZW4gXCJlYXNlLW91dFwiXG5cdFx0XHRcdFx0ZWFzZWRGcmFtZSA9IGVhc2VPdXQoZnJhbWUvdG90YWxGcmFtZXMpXG5cdFx0XHRcdHdoZW4gXCJlYXNlLWluLW91dFwiXG5cdFx0XHRcdFx0ZWFzZWRGcmFtZSA9IGVhc2VJbk91dChmcmFtZS90b3RhbEZyYW1lcylcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGVhc2VkRnJhbWUgPSBsaW5lYXIoZnJhbWUvdG90YWxGcmFtZXMpXG5cdFx0XHRmcmFtZUZpcnN0Q29sb3IgPSBDb2xvci5taXgoQG9wdGlvbnMuZmlyc3RDb2xvciwgZmlyc3RDb2xvciwgZWFzZWRGcmFtZSlcblx0XHRcdGZyYW1lU2Vjb25kQ29sb3IgPSBDb2xvci5taXgoQG9wdGlvbnMuc2Vjb25kQ29sb3IsIHNlY29uZENvbG9yLCBlYXNlZEZyYW1lKVxuXHRcdFx0aWYgQG9wdGlvbnMudGhpcmRDb2xvciAhPSBcIlwiXG5cdFx0XHRcdGZyYW1lVGhpcmRDb2xvciA9IENvbG9yLm1peChAb3B0aW9ucy50aGlyZENvbG9yLCB0aGlyZENvbG9yLCBlYXNlZEZyYW1lKVxuXHRcdFx0ZnJhbWVTcHJlYWQgPSBVdGlscy5tb2R1bGF0ZShlYXNlZEZyYW1lLCBbMCwgMV0sIFtAb3B0aW9ucy5zcHJlYWQsIHNwcmVhZF0pXG5cdFx0XHRmcmFtZU9mZnNldCA9IFV0aWxzLm1vZHVsYXRlKGVhc2VkRnJhbWUsIFswLCAxXSwgW0BvcHRpb25zLm9mZnNldCwgb2Zmc2V0XSlcblx0XHRcdGZyYW1lRGlyZWN0aW9uID0gVXRpbHMubW9kdWxhdGUoZWFzZWRGcmFtZSwgWzAsIDFdLCBbc3RhcnREaXJlY3Rpb24sIHRhcmdldERpcmVjdGlvbl0pXG5cdFx0XHRpZiBAb3B0aW9ucy50aGlyZENvbG9yID09IFwiXCJcblx0XHRcdFx0Z3JhZGllbnQgPSBtYWtlR3JhZGllbnRTdHJpbmcoZGlyZWN0aW9uOiBmcmFtZURpcmVjdGlvbiwgZmlyc3RDb2xvcjogZnJhbWVGaXJzdENvbG9yLCBzZWNvbmRDb2xvcjogZnJhbWVTZWNvbmRDb2xvciwgcHJlZml4OiBAb3B0aW9ucy5wcmVmaXgsIHNwcmVhZDogZnJhbWVTcHJlYWQsIG9mZnNldDogZnJhbWVPZmZzZXQsIGFuZ2xlOiB0cnVlKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRncmFkaWVudCA9IG1ha2VHcmFkaWVudFRocmVlQ29sb3JTdHJpbmcoZGlyZWN0aW9uOiBmcmFtZURpcmVjdGlvbiwgZmlyc3RDb2xvcjogZnJhbWVGaXJzdENvbG9yLCBzZWNvbmRDb2xvcjogZnJhbWVTZWNvbmRDb2xvciwgdGhpcmRDb2xvcjogZnJhbWVUaGlyZENvbG9yLCBwcmVmaXg6IEBvcHRpb25zLnByZWZpeCwgc3ByZWFkOiBmcmFtZVNwcmVhZCwgb2Zmc2V0OiBmcmFtZU9mZnNldCwgYW5nbGU6IHRydWUpXG5cdFx0XHRALnN0eWxlLmJhY2tncm91bmQgPSBncmFkaWVudFxuXHRcdFx0VXRpbHMuZGVsYXkgRnJhbWVyLkxvb3AuZGVsdGEsID0+XG5cdFx0XHRcdEBhbmltYXRlR3JhZGllbnQoe2ZpcnN0Q29sb3I6IGZpcnN0Q29sb3IsIHNlY29uZENvbG9yOiBzZWNvbmRDb2xvciwgdGhpcmRDb2xvcjogdGhpcmRDb2xvciwgc3ByZWFkOiBzcHJlYWQsIG9mZnNldDogb2Zmc2V0LCBkaXJlY3Rpb246IGRpcmVjdGlvbiwgdGltZTogdGltZSwgY3VydmU6IGN1cnZlfSwgZnJhbWUgKyAxKVxuXG5jbGFzcyBleHBvcnRzLlJhZGlhbExheWVyIGV4dGVuZHMgTGF5ZXJcblx0Y29uc3RydWN0b3I6IChAb3B0aW9ucz17fSkgLT5cblx0XHRAb3B0aW9ucyA9IF8uYXNzaWduKHt9LCBkZWZhdWx0cywgQG9wdGlvbnMpXG5cdFx0c3VwZXIgQG9wdGlvbnNcblx0XHRpZiBAb3B0aW9ucy5wcmVmaXggIT0gXCJcIlxuXHRcdFx0QG9wdGlvbnMucHJlZml4ID0gXCItXCIgKyBAb3B0aW9ucy5wcmVmaXggKyBcIi1cIlxuXHRcdGdyYWRpZW50T3JpZ2luWCA9IEBvcHRpb25zLmdyYWRpZW50T3JpZ2luWCAqIDEwMFxuXHRcdGdyYWRpZW50T3JpZ2luWSA9IEBvcHRpb25zLmdyYWRpZW50T3JpZ2luWSAqIDEwMFxuXHRcdGdyYWRpZW50U2NhbGVYID0gVXRpbHMubW9kdWxhdGUoQG9wdGlvbnMuZ3JhZGllbnRTY2FsZVgsIFswLCAxMDBdLCBbMCwgNzBdKSAqIDEwMFxuXHRcdGdyYWRpZW50U2NhbGVZID0gVXRpbHMubW9kdWxhdGUoQG9wdGlvbnMuZ3JhZGllbnRTY2FsZVksIFswLCAxMDBdLCBbMCwgNzBdKSAqIDEwMFxuXHRcdGdyYWRpZW50ID0gXCJcIlxuXHRcdGlmIEBvcHRpb25zLnRoaXJkQ29sb3IgPT0gXCJcIlxuXHRcdFx0Z3JhZGllbnQgPSBtYWtlUmFkaWFsR3JhZGllbnRTdHJpbmcoZmlyc3RDb2xvcjogQG9wdGlvbnMuZmlyc3RDb2xvciwgc2Vjb25kQ29sb3I6IEBvcHRpb25zLnNlY29uZENvbG9yLCBwcmVmaXg6IEBvcHRpb25zLnByZWZpeCwgc3ByZWFkOiBAb3B0aW9ucy5zcHJlYWQsIGVsbGlwc2VYOiBncmFkaWVudE9yaWdpblgsIGVsbGlwc2VZOiBncmFkaWVudE9yaWdpblksIGVsbGlwc2VXaWR0aDogZ3JhZGllbnRTY2FsZVgsIGVsbGlwc2VIZWlnaHQ6IGdyYWRpZW50U2NhbGVZKVxuXHRcdGVsc2Vcblx0XHRcdGdyYWRpZW50ID0gbWFrZVJhZGlhbEdyYWRpZW50VGhyZWVDb2xvclN0cmluZyhmaXJzdENvbG9yOiBAb3B0aW9ucy5maXJzdENvbG9yLCBzZWNvbmRDb2xvcjogQG9wdGlvbnMuc2Vjb25kQ29sb3IsIHRoaXJkQ29sb3I6IEBvcHRpb25zLnRoaXJkQ29sb3IsIHByZWZpeDogQG9wdGlvbnMucHJlZml4LCBzcHJlYWQ6IEBvcHRpb25zLnNwcmVhZCwgZWxsaXBzZVg6IGdyYWRpZW50T3JpZ2luWCwgZWxsaXBzZVk6IGdyYWRpZW50T3JpZ2luWSwgZWxsaXBzZVdpZHRoOiBncmFkaWVudFNjYWxlWCwgZWxsaXBzZUhlaWdodDogZ3JhZGllbnRTY2FsZVkpXG5cdFx0QC5zdHlsZS5iYWNrZ3JvdW5kID0gZ3JhZGllbnRcblxuXHRhbmltYXRlR3JhZGllbnQ6ICh7Zmlyc3RDb2xvciwgc2Vjb25kQ29sb3IsIHRoaXJkQ29sb3IsIG9yaWdpblgsIG9yaWdpblksIHNjYWxlWCwgc2NhbGVZLCBzcHJlYWQsIHRpbWUsIGN1cnZlfSA9IHt9LCBmcmFtZSA9IDApIC0+XG5cdFx0Zmlyc3RDb2xvciA/PSBAb3B0aW9ucy5maXJzdENvbG9yXG5cdFx0c2Vjb25kQ29sb3IgPz0gQG9wdGlvbnMuc2Vjb25kQ29sb3Jcblx0XHR0aGlyZENvbG9yID89IEBvcHRpb25zLnRoaXJkQ29sb3Jcblx0XHRvcmlnaW5YID89IEBvcHRpb25zLmdyYWRpZW50T3JpZ2luWFxuXHRcdG9yaWdpblkgPz0gQG9wdGlvbnMuZ3JhZGllbnRPcmlnaW5ZXG5cdFx0c2NhbGVYID89IEBvcHRpb25zLmdyYWRpZW50U2NhbGVYXG5cdFx0c2NhbGVZID89IEBvcHRpb25zLmdyYWRpZW50U2NhbGVZXG5cdFx0c3ByZWFkID89IEBvcHRpb25zLnNwcmVhZFxuXHRcdHRpbWUgPz0gRnJhbWVyLkRlZmF1bHRzLkFuaW1hdGlvbi50aW1lXG5cdFx0Y3VydmUgPz0gXCJlYXNlLW91dFwiXG5cdFx0dG90YWxGcmFtZXMgPSB0aW1lIC8gRnJhbWVyLkxvb3AuZGVsdGFcblx0XHRpZiBmcmFtZSA9PSAwXG5cdFx0XHRALmVtaXQgXCJncmFkaWVudEFuaW1hdGlvblN0YXJ0XCJcblx0XHRlbHNlIGlmIGZyYW1lID09IHRvdGFsRnJhbWVzXG5cdFx0XHRALmVtaXQgXCJncmFkaWVudEFuaW1hdGlvbkVuZFwiXG5cdFx0aWYgZnJhbWUgPCB0b3RhbEZyYW1lc1xuXHRcdFx0c3dpdGNoIGN1cnZlXG5cdFx0XHRcdHdoZW4gXCJsaW5lYXJcIlxuXHRcdFx0XHRcdGVhc2VkRnJhbWUgPSBsaW5lYXIoZnJhbWUvdG90YWxGcmFtZXMpXG5cdFx0XHRcdHdoZW4gXCJlYXNlLWluXCJcblx0XHRcdFx0XHRlYXNlZEZyYW1lID0gZWFzZUluKGZyYW1lL3RvdGFsRnJhbWVzKVxuXHRcdFx0XHR3aGVuIFwiZWFzZS1vdXRcIlxuXHRcdFx0XHRcdGVhc2VkRnJhbWUgPSBlYXNlT3V0KGZyYW1lL3RvdGFsRnJhbWVzKVxuXHRcdFx0XHR3aGVuIFwiZWFzZS1pbi1vdXRcIlxuXHRcdFx0XHRcdGVhc2VkRnJhbWUgPSBlYXNlSW5PdXQoZnJhbWUvdG90YWxGcmFtZXMpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRlYXNlZEZyYW1lID0gbGluZWFyKGZyYW1lL3RvdGFsRnJhbWVzKVxuXHRcdFx0ZnJhbWVGaXJzdENvbG9yID0gQ29sb3IubWl4KEBvcHRpb25zLmZpcnN0Q29sb3IsIGZpcnN0Q29sb3IsIGVhc2VkRnJhbWUpXG5cdFx0XHRmcmFtZVNlY29uZENvbG9yID0gQ29sb3IubWl4KEBvcHRpb25zLnNlY29uZENvbG9yLCBzZWNvbmRDb2xvciwgZWFzZWRGcmFtZSlcblx0XHRcdGlmIEBvcHRpb25zLnRoaXJkQ29sb3IgIT0gXCJcIlxuXHRcdFx0XHRmcmFtZVRoaXJkQ29sb3IgPSBDb2xvci5taXgoQG9wdGlvbnMudGhpcmRDb2xvciwgdGhpcmRDb2xvciwgZWFzZWRGcmFtZSlcblx0XHRcdGZyYW1lU3ByZWFkID0gVXRpbHMubW9kdWxhdGUoZWFzZWRGcmFtZSwgWzAsIDFdLCBbQG9wdGlvbnMuc3ByZWFkLCBzcHJlYWRdKVxuXHRcdFx0ZnJhbWVPcmlnaW5YID0gVXRpbHMubW9kdWxhdGUoZWFzZWRGcmFtZSwgWzAsIDFdLCBbQG9wdGlvbnMuZ3JhZGllbnRPcmlnaW5YLCBvcmlnaW5YXSkgKiAxMDBcblx0XHRcdGZyYW1lT3JpZ2luWSA9IFV0aWxzLm1vZHVsYXRlKGVhc2VkRnJhbWUsIFswLCAxXSwgW0BvcHRpb25zLmdyYWRpZW50T3JpZ2luWSwgb3JpZ2luWV0pICogMTAwXG5cdFx0XHRmcmFtZVNjYWxlWCA9IFV0aWxzLm1vZHVsYXRlKGVhc2VkRnJhbWUsIFswLCAxXSwgW0BvcHRpb25zLmdyYWRpZW50U2NhbGVYLCBzY2FsZVhdKVxuXG5cdFx0XHRmcmFtZVNjYWxlWSA9IFV0aWxzLm1vZHVsYXRlKGZyYW1lLCBbMCwgMV0sIFtAb3B0aW9ucy5ncmFkaWVudFNjYWxlWSwgc2NhbGVZXSlcblx0XHRcdGZyYW1lU2NhbGVYID0gVXRpbHMubW9kdWxhdGUoZnJhbWVTY2FsZVgsIFswLCAxMDBdLCBbMCwgNzBdKSAqIDEwMFxuXHRcdFx0ZnJhbWVTY2FsZVkgPSBVdGlscy5tb2R1bGF0ZShmcmFtZVNjYWxlWSwgWzAsIDEwMF0sIFswLCA3MF0pICogMTAwXG5cdFx0XHRpZiBAb3B0aW9ucy50aGlyZENvbG9yID09IFwiXCJcblx0XHRcdFx0Z3JhZGllbnQgPSBtYWtlUmFkaWFsR3JhZGllbnRTdHJpbmcoZmlyc3RDb2xvcjogZnJhbWVGaXJzdENvbG9yLCBzZWNvbmRDb2xvcjogZnJhbWVTZWNvbmRDb2xvciwgcHJlZml4OiBAb3B0aW9ucy5wcmVmaXgsIHNwcmVhZDogZnJhbWVTcHJlYWQsIGVsbGlwc2VYOiBmcmFtZU9yaWdpblgsIGVsbGlwc2VZOiBmcmFtZU9yaWdpblksIGVsbGlwc2VXaWR0aDogZnJhbWVTY2FsZVgsIGVsbGlwc2VIZWlnaHQ6IGZyYW1lU2NhbGVZKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRncmFkaWVudCA9IG1ha2VSYWRpYWxHcmFkaWVudFRocmVlQ29sb3JTdHJpbmcoZmlyc3RDb2xvcjogZnJhbWVGaXJzdENvbG9yLCBzZWNvbmRDb2xvcjogZnJhbWVTZWNvbmRDb2xvciwgdGhpcmRDb2xvcjogZnJhbWVUaGlyZENvbG9yLCBwcmVmaXg6IEBvcHRpb25zLnByZWZpeCwgc3ByZWFkOiBmcmFtZVNwcmVhZCwgZWxsaXBzZVg6IGZyYW1lT3JpZ2luWCwgZWxsaXBzZVk6IGZyYW1lT3JpZ2luWSwgZWxsaXBzZVdpZHRoOiBmcmFtZVNjYWxlWCwgZWxsaXBzZUhlaWdodDogZnJhbWVTY2FsZVkpXG5cdFx0XHRALnN0eWxlLmJhY2tncm91bmQgPSBncmFkaWVudFxuXHRcdFx0VXRpbHMuZGVsYXkgRnJhbWVyLkxvb3AuZGVsdGEsID0+XG5cdFx0XHRcdEBhbmltYXRlR3JhZGllbnQoe2ZpcnN0Q29sb3I6IGZpcnN0Q29sb3IsIHNlY29uZENvbG9yOiBzZWNvbmRDb2xvciwgdGhpcmRDb2xvcjogdGhpcmRDb2xvciwgb3JpZ2luWDogb3JpZ2luWCwgb3JpZ2luWTogb3JpZ2luWSwgc2NhbGVYOiBzY2FsZVgsIHNjYWxlWTogc2NhbGVZLCBzcHJlYWQ6IHNwcmVhZCwgdGltZTogdGltZSwgY3VydmU6IGN1cnZlfSwgZnJhbWUgKyAxKVxuIiwiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFHQUE7O0FEQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBQSw0SkFBQTtFQUFBOzs7QUFvR0Esa0JBQUEsR0FBcUIsU0FBQyxH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
