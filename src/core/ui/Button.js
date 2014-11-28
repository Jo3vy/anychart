goog.provide('anychart.core.ui.Button');
goog.require('acgraph');
goog.require('anychart.core.Text');
goog.require('anychart.core.ui.Background');
goog.require('anychart.core.utils.Padding');
goog.require('anychart.math');



/**
 * Button class. Button with text, if text is set.
 * @constructor
 * @extends {anychart.core.Text}
 */
anychart.core.ui.Button = function() {
  goog.base(this);

  /**
   * Width of a button.
   * @type {(string|number)?}
   * @private
   */
  this.width_ = null;

  /**
   * Height of a button.
   * @type {(string|number)?}
   * @private
   */
  this.height_ = null;

  /**
   * Start state of a button.
   * @type {anychart.core.ui.Button.State}
   * @private
   */
  this.state_ = anychart.core.ui.Button.State.NORMAL;

  /**
   * Is there events handling on a button.
   * @type {boolean}
   * @private
   */
  this.eventHandling_ = false;

  /**
   * Is a button checked.
   * @type {boolean}
   * @private
   */
  this.checkedInternal_ = false;

  /**
   * Is a button pushed.
   * Button clicked, but mouse is not released.
   * @type {boolean}
   * @private
   */
  this.pushing_ = false;

  // Initialize default state settings
  this.initStateSettings();

  this.invalidate(anychart.ConsistencyState.ALL);
};
goog.inherits(anychart.core.ui.Button, anychart.core.Text);


/**
 * Supported signals.
 * @type {number}
 */
anychart.core.ui.Button.prototype.SUPPORTED_SIGNALS = anychart.core.Text.prototype.SUPPORTED_SIGNALS;


/**
 * Supported consistency states.
 * @type {number}
 */
anychart.core.ui.Button.prototype.SUPPORTED_CONSISTENCY_STATES =
    anychart.core.Text.prototype.SUPPORTED_CONSISTENCY_STATES |
    anychart.ConsistencyState.BACKGROUND;


/**
 * State of a button.
 * @enum {number}
 */
anychart.core.ui.Button.State = {
  ALL: 0xFF,
  UNDEFINED: 0x00,
  DISABLED: 0x01,
  NORMAL: 0x02,
  HOVER: 0x04,
  PUSHED: 0x08,
  CHECKED: 0x10
};


/**
 * A bit mask of {@link anychart.core.ui.Button.State}s this button supports.
 * @type {number}
 * @private
 */
anychart.core.ui.Button.prototype.supportedStates_ =
    anychart.core.ui.Button.State.NORMAL |
    anychart.core.ui.Button.State.HOVER |
    anychart.core.ui.Button.State.PUSHED |
    anychart.core.ui.Button.State.CHECKED |
    anychart.core.ui.Button.State.DISABLED;


/**
 * Text element containing a button text.
 * @protected
 * @type {acgraph.vector.Text}
 */
anychart.core.ui.Button.prototype.textElement = null;


/**
 * Path containing background.
 * @protected
 * @type {acgraph.vector.Path}
 */
anychart.core.ui.Button.prototype.backgroundPath = null;


/**
 * States management method.
 * If works as a setter - turns state on and off.
 * If state is  UNDEFINED (all states are off) - NORMAL is set.
 * If works as getter returns state status (on or off).
 * TODO(AntonKagakin): button is single-state now - this means when set to false it always goes to
 * in NORMAL, and when set to true - overwrites previous value. Possible at some point it should become non single-state.
 *
 * @protected
 * @param {anychart.core.ui.Button.State} state State to work with.
 * @param {boolean=} opt_enable Whether to enable or disable state.
 * @return {(anychart.core.ui.Button|boolean)} Is a button in this state or self for method chaining.
 */
anychart.core.ui.Button.prototype.state = function(state, opt_enable) {
  if (goog.isDef(opt_enable)) {
    // If it is a setter - check of an element supports this state
    if (this.supportedStates(state) && opt_enable != this.state(state)) {
      this.state_ = /** @type {anychart.core.ui.Button.State} */ (opt_enable ? state : this.state_ & ~state);
      if (this.state_ == anychart.core.ui.Button.State.UNDEFINED) this.state_ = anychart.core.ui.Button.State.NORMAL;
      this.invalidate(anychart.ConsistencyState.BACKGROUND, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return !!(this.state_ & state);
};


/**
 * Getter for a supported state.
 * @param {anychart.core.ui.Button.State} state State to work with.
 * @return {(anychart.core.ui.Button|boolean)} Is state supported.
 *//**
 * Setter for state.
 * @param {anychart.core.ui.Button.State} state State to work with.
 * @param {boolean=} opt_enable Enable or disable support of the state.
 * @return {!anychart.core.ui.Button} An instance of the {@link anychart.core.ui.Button} class for method chaining.
 *//**
 * @ignoreDoc
 * Method to check supported states.
 * As a setter tells a button which state is supported (opt_enable=true) or not supported (opt_enable=false).
 * @param {anychart.core.ui.Button.State} state State to work with.
 * @param {boolean=} opt_enable Enable or disable support of the state.
 * @return {(anychart.core.ui.Button|boolean)} Is state supported or self for method chaining.
 */
anychart.core.ui.Button.prototype.supportedStates = function(state, opt_enable) {
  if (goog.isDef(opt_enable)) {
    // If a setter
    if (!opt_enable && this.state(state)) {
      // If we are removing state support and button is in this state now - we need to remove it first.
      this.state(state, false);
    }
    // set or remove state support
    this.supportedStates_ = opt_enable ?
        this.supportedStates_ | state : this.supportedStates_ & ~state;

    return this;
  }

  return !!(this.supportedStates_ & state);
};


/**
 * Getter for enabled normal state.
 * @return {boolean} Is state enabled.
 *//**
 * Setter for enabled normal state.
 * @param {boolean=} opt_enable Value to set.
 * @return {!anychart.core.ui.Button} An instance of the {@link anychart.core.ui.Button} class for method chaining.
 *//**
 * @ignoreDoc
 * @param {boolean=} opt_enable Value to set.
 * @return {(anychart.core.ui.Button|boolean)} Is state enabled or self for method chaining.
 */
anychart.core.ui.Button.prototype.normal = function(opt_enable) {
  return this.state(anychart.core.ui.Button.State.NORMAL, opt_enable);
};


/**
 * Getter for enabled hover state.
 * @return {boolean} Is state enabled.
 *//**
 * Setter for enabled hover state.
 * @param {boolean=} opt_enable Value to set.
 * @return {!anychart.core.ui.Button} An instance of the {@link anychart.core.ui.Button} class for method chaining.
 *//**
 * @ignoreDoc
 * @param {boolean=} opt_enable Value to set.
 * @return {(anychart.core.ui.Button|boolean)} Is state enabled or self for method chaining.
 */
anychart.core.ui.Button.prototype.hover = function(opt_enable) {
  return this.state(anychart.core.ui.Button.State.HOVER, opt_enable);
};


/**
 * Getter for enabled pushed state.
 * @return {boolean} Is state enabled.
 *//**
 * Setter for enabled pushed state.
 * @param {boolean=} opt_enable Value to set.
 * @return {!anychart.core.ui.Button} An instance of the {@link anychart.core.ui.Button} class for method chaining.
 *//**
 * @ignoreDoc
 * @param {boolean=} opt_enable Value to set.
 * @return {(anychart.core.ui.Button|boolean)} Is state enabled or self for method chaining.
 */
anychart.core.ui.Button.prototype.pushed = function(opt_enable) {
  return this.state(anychart.core.ui.Button.State.PUSHED, opt_enable);
};


/**
 * Getter for enabled checked state.
 * @return {boolean} Is state enabled.
 *//**
 * Setter for enabled checked state.
 * @param {boolean=} opt_enable Value to set.
 * @return {!anychart.core.ui.Button} An instance of the {@link anychart.core.ui.Button} class for method chaining.
 *//**
 * @ignoreDoc
 * @param {boolean=} opt_enable Value to set.
 * @return {(anychart.core.ui.Button|boolean)} Is state enabled or self for method chaining.
 */
anychart.core.ui.Button.prototype.checked = function(opt_enable) {
  return this.state(anychart.core.ui.Button.State.CHECKED, opt_enable);
};


/**
 * Getter for enabled disabled state.
 * @return {boolean} Is state enabled.
 *//**
 * Setter for enabled disabled state.
 * @param {boolean=} opt_enable Value to set.
 * @return {!anychart.core.ui.Button} An instance of the {@link anychart.core.ui.Button} class for method chaining.
 *//**
 * @ignoreDoc
 * @param {boolean=} opt_enable Value to set.
 * @return {(anychart.core.ui.Button|boolean)} Is state enabled or self for method chaining.
 */
anychart.core.ui.Button.prototype.disabled = function(opt_enable) {
  if (goog.isDef(opt_enable)) {
    this.enableEventHandling_(!opt_enable);
  }
  return this.state(anychart.core.ui.Button.State.DISABLED, opt_enable);
};


/**
 * Button padding.
 * @param {(string|number|anychart.core.utils.Space)=} opt_spaceOrTopOrTopAndBottom Space object or top or top and bottom
 *    space.
 * @param {(string|number)=} opt_rightOrRightAndLeft Right or right and left space.
 * @param {(string|number)=} opt_bottom Bottom space.
 * @param {(string|number)=} opt_left Left space.
 * @return {!(anychart.core.ui.Button|anychart.core.utils.Margin)} Padding or self for method chaining.
 */
anychart.core.ui.Button.prototype.padding = function(opt_spaceOrTopOrTopAndBottom, opt_rightOrRightAndLeft, opt_bottom, opt_left) {
  if (!this.padding_) {
    this.padding_ = new anychart.core.utils.Padding();
    this.registerDisposable(this.padding_);
    this.padding_.listenSignals(this.boundsInvalidated_, this);
  }
  if (goog.isDef(opt_spaceOrTopOrTopAndBottom)) {
    if (goog.isObject(opt_spaceOrTopOrTopAndBottom)) {
      this.padding_.deserialize(opt_spaceOrTopOrTopAndBottom);
    } else {
      this.padding_.set.apply(this.padding_, arguments);
    }
    return this;
  }
  return this.padding_;
};


/**
 * Listener for padding invalidation.
 * @param {anychart.SignalEvent} event Invalidation event.
 * @private
 */
anychart.core.ui.Button.prototype.boundsInvalidated_ = function(event) {
  if (event.hasSignal(anychart.Signal.NEEDS_REAPPLICATION)) {
    this.invalidate(anychart.ConsistencyState.BOUNDS,
        anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
  }
};


/**
 * Button text value.
 * @param {string=} opt_value Value to set.
 * @return {(anychart.core.ui.Button|string)} Text value or self for method chaining.
 */
anychart.core.ui.Button.prototype.text = function(opt_value) {
  return /** @type {!anychart.core.ui.Button|string} */(this.textSettings('text', opt_value));
};


/** @inheritDoc */
anychart.core.ui.Button.prototype.applyTextSettings = function(textElement, isInitial) {
  if (isInitial || 'text' in this.changedSettings || 'useHtml' in this.changedSettings) {
    if (!!this.settingsObj['useHtml'])
      textElement.htmlText(this.settingsObj['text']);
    else
      textElement.text(this.settingsObj['text']);
  }
  goog.base(this, 'applyTextSettings', textElement, isInitial);
  this.changedSettings = {};
};


/**
 * Getter for button position.
 * @return {anychart.math.Coordinate} Current button position.
 *//**
 * Setter for button position.
 * @param {anychart.math.Coordinate=} opt_value Value to set.
 * @return {!anychart.core.ui.Button} An instance of the {@link anychart.core.ui.Button} class for method chaining.
 *//**
 * @ignoreDoc
 * @param {anychart.math.Coordinate=} opt_value Button position.
 * @return {(anychart.math.Coordinate|anychart.core.ui.Button)} Button position or self for method chaining.
 */
anychart.core.ui.Button.prototype.position = function(opt_value) {
  if (goog.isDef(opt_value)) {
    this.position_ = opt_value;
    this.invalidate(anychart.ConsistencyState.BOUNDS,
        anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    return this;
  } else {
    return this.position_;
  }
};


/**
 * Button width.
 * @param {(number|string)=} opt_value Width value.
 * @return {(number|string|anychart.core.ui.Button)} Width of button or self for method chaining.
 */
anychart.core.ui.Button.prototype.width = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.width_ != opt_value) {
      this.width_ = opt_value;
      this.invalidate(anychart.ConsistencyState.BOUNDS | anychart.ConsistencyState.APPEARANCE,
          anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  }
  return this.width_;
};


/**
 * Button height.
 * @param {(number|string)=} opt_value Height value.
 * @return {(number|string|anychart.core.ui.Button)} Height of button or self for method chaining.
 */
anychart.core.ui.Button.prototype.height = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.height_ != opt_value) {
      this.height_ = opt_value;
      this.invalidate(anychart.ConsistencyState.BOUNDS | anychart.ConsistencyState.APPEARANCE,
          anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  }
  return this.height_;
};


/**
 * Text drawing method.
 * To change text display for all states you need to override this method.
 * NOTE:
 * when overriding you need to manage if this is a first time drawing (create textElement and backgroundPath),
 * as well as APPEARANCE and PIXEL_BOUNDS states.
 * @param {Object} textSettings Text settings.
 * @protected
 */
anychart.core.ui.Button.prototype.drawText = function(textSettings) {
  this.textSettings(textSettings);
  var isInitial = !this.textElement;

  if (isInitial) {
    this.textElement = acgraph.text();
    this.registerDisposable(this.textElement);
    this.textElement.disablePointerEvents(true);
  }

  this.applyTextSettings(/** @type {!acgraph.vector.Text} */ (this.textElement), isInitial);
  if (this.hasInvalidationState(anychart.ConsistencyState.BOUNDS)) {
    this.calculateButtonBounds_();

    var clipRect = new acgraph.math.Rect(0, 0, this.buttonBounds.width, this.buttonBounds.height);

    this.textElement.x(/** @type {number} */(this.textX));
    this.textElement.y(/** @type {number} */(this.textY));
    this.textElement.clip(clipRect);

    this.textElement.setTransformationMatrix(1, 0, 0, 1, 0, 0);
    this.textElement.translate(/** @type {number} */(this.buttonBounds.left), /** @type {number} */(this.buttonBounds.top));

    this.invalidate(anychart.ConsistencyState.BACKGROUND);
    this.markConsistent(anychart.ConsistencyState.BOUNDS);
  }
};


/**
 * Background drawing method.
 * To change background display you need to override this method.
 * NOTE:
 * when overriding you need to manage BACKGROUND_APPEARANCE state
 * @protected
 * @param {acgraph.vector.Fill} fill Fill setting for a background drawing state.
 * @param {acgraph.vector.Stroke} stroke Line setting for a background drawing state.
 */
anychart.core.ui.Button.prototype.drawBackground = function(fill, stroke) {
  if (!this.backgroundPath) {
    this.backgroundPath = acgraph.path();
    this.registerDisposable(this.backgroundPath);
  }

  var path = this.backgroundPath;
  var buttonBounds = this.buttonBounds;

  path.clear();

  var left = buttonBounds.left;
  var top = buttonBounds.top;
  var width = buttonBounds.width;
  var height = buttonBounds.height;

  path
      .moveTo(left, top)
      .lineTo(left + width, top)
      .lineTo(left + width, top + height)
      .lineTo(left, top + height)
      .close();

  path.fill(fill);
  path.stroke(stroke);
};


/**
 * Button drawing method.
 * To change button drawing for all states you need to override this method.
 * @protected
 * @param {*} settings State settings object.
 */
anychart.core.ui.Button.prototype.drawInternal = function(settings) {
  if (this.hasInvalidationState(anychart.ConsistencyState.APPEARANCE)) {
    this.drawText(settings['text']);
    this.markConsistent(anychart.ConsistencyState.APPEARANCE);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.BOUNDS)) {
    this.calculateButtonBounds_();
    this.drawText(settings['text']);
    this.invalidate(anychart.ConsistencyState.BACKGROUND);
    this.markConsistent(anychart.ConsistencyState.BOUNDS);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.BACKGROUND)) {
    this.drawBackground(settings['fill'], settings['stroke']);
    this.markConsistent(anychart.ConsistencyState.BACKGROUND);
  }
};


/**
 * NORMAL state drawing method.
 * To change NORMAL state display - override this method.
 * @protected
 * @param {*} settings NORMAL state settings object.
 */
anychart.core.ui.Button.prototype.drawNormal = function(settings) {
  this.drawInternal(settings);
};


/**
 * HOVER state display.
 * To change HOVER state display - override this method.
 * @protected
 * @param {*} settings HOVER state settings object.
 */
anychart.core.ui.Button.prototype.drawHover = function(settings) {
  this.drawInternal(settings);
};


/**
 * PUSHED state display.
 * To change PUSHED state display - override this method.
 * @protected
 * @param {*} settings PUSHED state settings object.
 */
anychart.core.ui.Button.prototype.drawPushed = function(settings) {
  this.drawInternal(settings);
};


/**
 * CHECKED state display.
 * To change CHECKED state display - override this method.
 * @protected
 * @param {*} settings CHECKED state settings object.
 */
anychart.core.ui.Button.prototype.drawChecked = function(settings) {
  this.drawInternal(settings);
};


/**
 * DISABLED state display.
 * To change DISABLED state display - override this method.
 * @protected
 * @param {*} settings DISABLED state settings object.
 */
anychart.core.ui.Button.prototype.drawDisabled = function(settings) {
  this.drawInternal(settings);
};


/**
 * Calculates actual button bounds.
 * @private
 */
anychart.core.ui.Button.prototype.calculateButtonBounds_ = function() {
  var container = /** @type {acgraph.vector.ILayer} */ (this.container());
  var stage = container ? container.getStage() : null;
  var parentBounds = /** @type {anychart.math.Rect} */(this.parentBounds());

  var parentWidth, parentHeight;

  if (parentBounds) {
    parentWidth = parentBounds.width;
    parentHeight = parentBounds.height;
  } else {
    parentWidth = parentHeight = undefined;
  }

  var hasText = !!(this.textElement);

  /** @type {anychart.math.Rect} */
  var textBounds;
  /** @type {number} */
  var textWidth;
  /** @type {number} */
  var textHeight;

  if (hasText) {
    textBounds = /** @type {anychart.math.Rect} */ (this.textElement.getBounds());
    textWidth = textBounds.width;
    textHeight = textBounds.height;
  }

  var isWidthSet = (goog.isDefAndNotNull(this.width_));
  var isHeightSet = (goog.isDefAndNotNull(this.height_));
  var padding = this.padding();

  /** @type {number} */
  var width;
  if (isWidthSet) { // button width or percent
    if (anychart.utils.isPercent(this.width_) && !goog.isDef(parentWidth)) { // if width set in percents, but no parent width is availble
      if (hasText) { // if there is text - adjust
        width = textWidth;
      } else { // or set width to 0
        width = 0;
      }
    } else { // in other case - calculating using parent width
      width = anychart.utils.normalizeSize(/** @type {number|string} */ (this.width_), parentWidth);
    }
    if (hasText) this.textX = anychart.utils.normalizeSize(/** @type {number|string} */ (padding.left()), width);
  } else { // if width is not set  - it is either the same as text width, or 0
    if (hasText) {// if there is text - adjust
      width = textWidth;
    } else { // or set to 0
      width = 0;
    }
    if (hasText) this.textX = anychart.utils.normalizeSize(/** @type {number|string} */ (padding.left()), width);
    // if width is not set - use padding
    width = padding.widenWidth(width);
  }

  if (parentBounds && parentWidth < width) {
    // if width becomes bigger than parent width - make it equal to parent width
    width = parentWidth;
  }

  /** @type {number} */
  var height;
  if (isHeightSet) {
    if (anychart.utils.isPercent(this.height_) && !goog.isDef(parentHeight)) {
      if (hasText) { // if there is text - adjust
        height = textHeight;
      } else { // or set to 0
        height = 0;
      }
    } else { // in other case - calculating using parent height
      height = anychart.utils.normalizeSize(/** @type {number|string} */ (this.height_), parentHeight);
    }
    if (hasText) this.textY = anychart.utils.normalizeSize(/** @type {number|string} */ (padding.top()), height);
  } else { // if height is not set  - it is either the same as text height, or 0
    if (hasText) { // if there is text - adjust
      height = textHeight;
    } else { // or set to 0
      height = 0;
    }
    if (hasText) this.textY = anychart.utils.normalizeSize(/** @type {number|string} */ (padding.top()), height);
    // if height is not set - use padding
    height = padding.widenHeight(height);
  }

  if (parentBounds && parentHeight < height) {
    // if width becomes bigger than parent height - make it equal to parent height
    height = parentHeight;
  }

  if (hasText) {
    this.textElement.width(width);
    this.textElement.height(height);
  }

  // calcualte position if it is set
  var position = anychart.math.normalizeCoordinate(this.position_);
  position.x = parentWidth ? anychart.utils.normalizeSize(position.x, parentWidth) : 0;
  position.y = parentHeight ? anychart.utils.normalizeSize(position.y, parentHeight) : 0;

  // background display bounds
  this.buttonBounds = new anychart.math.Rect(position.x, position.y, width, height);
};


/**
 * Draws button.
 * @return {anychart.core.ui.Button} Self for chaining.
 */
anychart.core.ui.Button.prototype.draw = function() {
  if (!this.checkDrawingNeeded())
    return this;

  this.suspendSignalsDispatching();
  var settings = acgraph.utils.recursiveClone(this.stateSettings_);
  switch (this.state_) {
    case anychart.core.ui.Button.State.UNDEFINED:
      throw Error('Undefined button state.');
      break;
    case anychart.core.ui.Button.State.HOVER:
      this.drawHover(settings['hover']);
      break;
    case anychart.core.ui.Button.State.PUSHED:
      this.drawPushed(settings['pushed']);
      break;
    case anychart.core.ui.Button.State.CHECKED:
      this.drawChecked(settings['checked']);
      break;
    case anychart.core.ui.Button.State.DISABLED:
      this.drawDisabled(settings['disabled']);
      break;
    case anychart.core.ui.Button.State.NORMAL:
    default:
      this.drawNormal(settings['normal']);
      break;
  }
  this.resumeSignalsDispatching(true);

  if (this.hasInvalidationState(anychart.ConsistencyState.Z_INDEX)) {
    var zIndex = /** @type {number} */ (this.zIndex());
    if (this.backgroundPath) this.backgroundPath.zIndex(zIndex);
    if (this.textElement) this.textElement.zIndex(zIndex);
    this.markConsistent(anychart.ConsistencyState.Z_INDEX);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.CONTAINER)) {
    var container = /** @type {acgraph.vector.ILayer} */ (this.container());
    if (this.backgroundPath) this.backgroundPath.parent(container);
    if (this.textElement) this.textElement.parent(container);
    this.markConsistent(anychart.ConsistencyState.CONTAINER);
  }

  if (!this.eventHandling_ && !this.state(anychart.core.ui.Button.State.DISABLED)) {
    this.enableEventHandling_(true);
  }

  return this;
};


/**
 * @inheritDoc
 */
anychart.core.ui.Button.prototype.remove = function() {
  if (this.textElement) this.textElement.parent(null);
  if (this.backgroundPath) this.backgroundPath.parent(null);
};


/**
 * Enables or disables event handling.
 * @param {boolean} enable Whether to enable event handling or not.
 * @private
 */
anychart.core.ui.Button.prototype.enableEventHandling_ = function(enable) {
  if (!this.backgroundPath) return;
  if (enable) {
    acgraph.events.listen(this.backgroundPath, acgraph.events.EventType.MOUSEOVER, this.handleMouseOver, false, this);
    acgraph.events.listen(this.backgroundPath, acgraph.events.EventType.DBLCLICK, this.handleMouseDblClick, false, this);
  } else {
    acgraph.events.unlisten(this.backgroundPath, acgraph.events.EventType.MOUSEOVER, this.handleMouseOver, false, this);
    acgraph.events.unlisten(this.backgroundPath, acgraph.events.EventType.MOUSEOUT, this.handleMouseOut, false, this);
    acgraph.events.unlisten(this.backgroundPath, acgraph.events.EventType.MOUSEDOWN, this.handleMouseDown, false, this);
    acgraph.events.unlisten(this.backgroundPath, acgraph.events.EventType.MOUSEUP, this.handleMouseUp, false, this);
    acgraph.events.unlisten(this.backgroundPath, acgraph.events.EventType.DBLCLICK, this.handleMouseDblClick, false, this);
  }
  this.eventHandling_ = enable;
};


/**
 * Handler for double click.
 * @param {acgraph.events.Event} event Event.
 */
anychart.core.ui.Button.prototype.handleMouseDblClick = function(event) {
  event.preventDefault();
  event.stopPropagation();
};


/**
 * Handler for mouse over.
 * @param {acgraph.events.Event} event Event..
 */
anychart.core.ui.Button.prototype.handleMouseOver = function(event) {
  var target = event.target;

  acgraph.events.listen(target, acgraph.events.EventType.MOUSEOUT, this.handleMouseOut, false, this);
  acgraph.events.listen(target, acgraph.events.EventType.MOUSEDOWN, this.handleMouseDown, false, this);

  if (this.pushing_ || this.checked()) return;

  this.hover(true);
};


/**
 * Handler for mouse out.
 * @param {acgraph.events.Event} event Event..
 */
anychart.core.ui.Button.prototype.handleMouseOut = function(event) {
  var target = event.target;

  acgraph.events.unlisten(target, acgraph.events.EventType.MOUSEOUT, this.handleMouseOut, false, this);
  acgraph.events.unlisten(target, acgraph.events.EventType.MOUSEDOWN, this.handleMouseDown, false, this);

  if (this.pushing_ || this.checked()) return;

  this.normal(true);
};


/**
 * Handler for mouse down.
 * @param {acgraph.events.Event} event Event..
 */
anychart.core.ui.Button.prototype.handleMouseDown = function(event) {
  this.pushing_ = true;

  acgraph.events.listen(goog.dom.getDocument(), acgraph.events.EventType.MOUSEUP, this.handleMouseUp, false, this);

  this.pushed(true);
};


/**
 * Handler for mouse up.
 * @param {acgraph.events.Event} event Event..
 */
anychart.core.ui.Button.prototype.handleMouseUp = function(event) {
  this.pushing_ = false;

  var onElement = !!event.target && goog.dom.contains(/** @type {Node} */ (this.backgroundPath.domElement()), event.target);
  acgraph.events.unlisten(goog.dom.getDocument(), acgraph.events.EventType.MOUSEUP, this.handleMouseUp, false, this);

  if (this.supportedStates(anychart.core.ui.Button.State.CHECKED)) {
    this.checkedInternal_ = !this.checkedInternal_;
    if (this.checkedInternal_) {
      this.checked(this.checkedInternal_);
    } else {
      if (onElement) {
        this.hover(true);
        if (goog.isFunction(this.onClickListener_)) {
          this.onClickListener_(this);
        }
      }
      else this.normal(true);
    }
  } else {
    if (onElement) {
      this.hover(true);
      if (goog.isFunction(this.onClickListener_)) {
        this.onClickListener_(this);
      }
    }
    else this.normal(true);
  }
};


/**
 * Restores default settings for button.
 * @protected
 */
anychart.core.ui.Button.prototype.restoreDefaults = function() {
  this.textSettings('vAlign', acgraph.vector.Text.VAlign.MIDDLE);
  this.textSettings('hAlign', acgraph.vector.Text.HAlign.CENTER);
  this.padding(3, 8, 3, 8);

  // removing support for checked state
  this.supportedStates(anychart.core.ui.Button.State.CHECKED, false);
};


/**
 * Sets listener fired when button clicked.
 * @param {function(anychart.core.ui.Button)=} opt_value Listener.
 * @return {*|anychart.core.ui.Button} Current listener of self for method chaining.
 */
anychart.core.ui.Button.prototype.setOnClickListener = function(opt_value) {
  if (goog.isDef(opt_value)) {
    this.onClickListener_ = opt_value;
    return this;
  }
};


/**
 * Getter for state settings.
 * @return {Object} Current state settings.
 *//**
 * Setter for state settings.
 * @param {Object=} opt_value Value to set.
 * @return {!anychart.core.ui.Button} An instance of the {@link anychart.core.ui.Button} class for method chaining.
 *//**
 * @ignoreDoc
 * @param {Object=} opt_value State settings.
 * @return {Object|anychart.core.ui.Button} State settings or self for method chaining.
 */
anychart.core.ui.Button.prototype.stateSettings = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.stateSettings_ != opt_value) {
      this.stateSettings_ = opt_value;
      this.invalidate(anychart.ConsistencyState.APPEARANCE |
          anychart.ConsistencyState.BOUNDS |
          anychart.ConsistencyState.BACKGROUND,
          anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  }
  return this.stateSettings_;
};


/**
 * @inheritDoc
 */
anychart.core.ui.Button.prototype.serialize = function() {
  var json = goog.base(this, 'serialize');

  json['width'] = this.width();
  json['height'] = this.height();
  json['position'] = this.position();
  json['stateSettings'] = this.stateSettings();
  json['padding'] = this.padding().serialize();

  return json;
};


/**
 * @inheritDoc
 */
anychart.core.ui.Button.prototype.deserialize = function(config) {
  this.suspendSignalsDispatching();

  goog.base(this, 'deserialize', config);

  this.width(config['width']);
  this.height(config['height']);
  this.position(config['position']);
  this.stateSettings(config['stateSettings']);
  this.padding(config['padding']);

  this.resumeSignalsDispatching(true);

  return this;
};


/**
 * Initializes state settings.
 * Override this method to make own settings.
 * @protected
 */
anychart.core.ui.Button.prototype.initStateSettings = function() {
  this.stateSettings_ = {
    'normal': {
      'stroke': '1 #666 1',
      'fill': {
        'keys': ['0 #ffffff', '0.5 #e7e7e7', '1 #d0d0d0'],
        'angle': '-90'
      },
      'text': {
        'fontColor': '#000'
      }
    },
    'hover': {
      'stroke': '1 #aaa 1',
      'fill': {
        'keys': ['0 #ffffff', '0.5 #e7e7e7', '1 #d0d0d0'],
        'angle': '-90'
      },
      'text': {
        'fontColor': '#000'
      }
    },
    'pushed': {
      'stroke': '1 #888 1',
      'fill': {
        'keys': ['0 #ffffff', '0.5 #e7e7e7', '1 #d0d0d0'],
        'angle': '90'
      },
      'text': {
        'fontColor': '#333'
      }
    },
    'checked': {
      'stroke': '1 #666 1',
      'fill': {
        'keys': ['0 #ffffff', '0.5 #e7e7e7', '1 #d0d0d0'],
        'angle': '90'
      },
      'text': {
        'fontColor': '#000'
      }
    },
    'disabled': {
      'stroke': '1 #666 1',
      'fill': '#aaa',
      'text': {
        'fontColor': '#777'
      }
    }
  };
};


//exports
anychart.core.ui.Button.prototype['text'] = anychart.core.ui.Button.prototype.text;
anychart.core.ui.Button.prototype['padding'] = anychart.core.ui.Button.prototype.padding;
anychart.core.ui.Button.prototype['position'] = anychart.core.ui.Button.prototype.position;
anychart.core.ui.Button.prototype['width'] = anychart.core.ui.Button.prototype.width;
anychart.core.ui.Button.prototype['height'] = anychart.core.ui.Button.prototype.height;
anychart.core.ui.Button.prototype['draw'] = anychart.core.ui.Button.prototype.draw;
anychart.core.ui.Button.prototype['setOnClickListener'] = anychart.core.ui.Button.prototype.setOnClickListener;
anychart.core.ui.Button.prototype['normal'] = anychart.core.ui.Button.prototype.normal;
anychart.core.ui.Button.prototype['hover'] = anychart.core.ui.Button.prototype.hover;
anychart.core.ui.Button.prototype['pushed'] = anychart.core.ui.Button.prototype.pushed;
anychart.core.ui.Button.prototype['checked'] = anychart.core.ui.Button.prototype.checked;
anychart.core.ui.Button.prototype['disabled'] = anychart.core.ui.Button.prototype.disabled;