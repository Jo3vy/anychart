goog.provide('anychart.math.Rect');
goog.require('acgraph');



/**
 * Define rectangle
 * @param {number} x X-coordinate of top-left point.
 * @param {number} y Y-coordinate of top-left point.
 * @param {number} w Width.
 * @param {number} h Height.
 * @constructor
 * @includeDoc
 */
anychart.math.Rect = acgraph.math.Rect;


//region --- Declarations for IDEA ---
//----------------------------------------------------------------------------------------------------------------------
//
//  Declarations for IDEA
//
//----------------------------------------------------------------------------------------------------------------------
// Prevents IDEA from throwing warnings about undefined fields.
/**
 * @type {number}
 */
anychart.math.Rect.prototype.left;


/**
 * @type {number}
 */
anychart.math.Rect.prototype.top;


/**
 * @type {number}
 */
anychart.math.Rect.prototype.width;


/**
 * @type {number}
 */
anychart.math.Rect.prototype.height;


/**
 * @return {!anychart.math.Rect} A copy of a rectangle.
 */
anychart.math.Rect.prototype.clone;


/**
 * @return {Array.<number>}
 */
anychart.math.Rect.prototype.toCoordinateBox = function() {
  return [this.left, this.top,
    this.left + this.width, this.top,
    this.left + this.width, this.top + this.height,
    this.left, this.top + this.height];
};


/**
 * @param {Array.<number>} value .
 * @return {anychart.math.Rect} .
 */
anychart.math.Rect.fromCoordinateBox = function(value) {
  /** @type {anychart.math.Rect} */
  var rect = new anychart.math.Rect(0, 0, 0, 0);
  var bounds = new anychart.math.Rect(value[0], value[1], 0, 0);
  for (var i = 2, len = value.length; i < len; i += 2) {
    rect.left = value[i];
    rect.top = value[i + 1];
    bounds.boundingRect(rect);
  }
  return bounds;
};


/**
 * Serializes the rect.
 * @return {!Object}
 */
anychart.math.Rect.prototype.serialize = function() {
  return {
    'left': this.left,
    'top': this.top,
    'width': this.width,
    'height': this.height
  };
};


/**
 * Creates the rect and deserializes it from the config.
 * @param {Object} config
 * @return {anychart.math.Rect} Deserialized rect.
 */
anychart.math.Rect.deserialize = function(config) {
  return new anychart.math.Rect(
      +config['left'] || 0,
      +config['top'] || 0,
      +config['width'] || 0,
      +config['height'] || 0);
};
//endregion


/**
 * Constructor function.
 * @param {number} x X-coordinate.
 * @param {number} y Y-coordinate.
 * @param {number} w Width.
 * @param {number} h Height.
 * @return {!anychart.math.Rect}
 */
anychart.math.rect = function(x, y, w, h) {
  return new anychart.math.Rect(x, y, w, h);
};


//exports
goog.exportSymbol('anychart.math.rect', anychart.math.rect);
