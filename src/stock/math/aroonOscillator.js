goog.provide('anychart.stockModule.math.aroonOscillator');
goog.require('anychart.stockModule.math.aroon');
goog.require('anychart.utils');


/**
 * @namespace {anychart.stockModule.math.aroonOscillator}
 */


/**
 * @typedef {{
 *    period: number,
 *    aroonContext: anychart.stockModule.math.aroon.Context,
 *    aroonCalculate: Function,
 *    aroonStartFunction: Function,
 *    dispose: Function
 * }}
 */
anychart.stockModule.math.aroonOscillator.Context;


/**
 * Creates context for Aroon Oscillator indicator calculation.
 * @param {number=} opt_period Defaults to 25.
 * @return {anychart.stockModule.math.aroonOscillator.Context}
 */
anychart.stockModule.math.aroonOscillator.initContext = function(opt_period) {
  var period = anychart.utils.normalizeToNaturalNumber(opt_period, 25, false);
  return {
    period: period,
    aroonContext: anychart.stockModule.math.aroon.initContext(period),
    aroonCalculate: anychart.stockModule.math.aroon.calculate,
    aroonStartFunction: anychart.stockModule.math.aroon.startFunction,
    /**
     * @this {anychart.stockModule.math.aroonOscillator.Context}
     */
    'dispose': function() {
      this.aroonContext['dispose']();
    }
  };
};


/**
 * Start calculation function for Aroon Oscillator indicator calculation.
 * @param {anychart.stockModule.math.aroonOscillator.Context} context
 * @this {anychart.stockModule.math.aroonOscillator.Context}
 */
anychart.stockModule.math.aroonOscillator.startFunction = function(context) {
  context.aroonStartFunction(/** @type {anychart.stockModule.math.aroon.Context} */ (context.aroonContext));
};


/**
 * Calculates Aroon Oscillator.
 * @param {anychart.stockModule.data.TableComputer.RowProxy} row
 * @param {anychart.stockModule.math.aroonOscillator.Context} context
 * @this {anychart.stockModule.math.aroonOscillator.Context}
 */
anychart.stockModule.math.aroonOscillator.calculationFunction = function(row, context) {
  var high = anychart.utils.toNumber(row.get('high'));
  var low = anychart.utils.toNumber(row.get('low'));
  var aroonValues = context.aroonCalculate(context.aroonContext, high, low);
  var aroonUp = aroonValues[0];
  var aroonDown = aroonValues[1];
  if (isNaN(aroonUp) || isNaN(aroonDown)) {
    row.set('result', NaN);
  } else {
    var result = aroonUp - aroonDown;
    row.set('result', result);
  }
};


/**
 * Creates Aroon Oscillator computer for the given table mapping.
 * @param {anychart.stockModule.data.TableMapping} mapping
 * @param {number=} opt_period
 * @return {anychart.stockModule.data.TableComputer}
 */
anychart.stockModule.math.aroonOscillator.createComputer = function(mapping, opt_period) {
  var result = mapping.getTable().createComputer(mapping);
  result.setContext(anychart.stockModule.math.aroonOscillator.initContext(opt_period));
  result.setStartFunction(anychart.stockModule.math.aroonOscillator.startFunction);
  result.setCalculationFunction(anychart.stockModule.math.aroonOscillator.calculationFunction);
  result.addOutputField('result');
  return result;
};


//exports
goog.exportSymbol('anychart.math.aroonOscillator.initContext', anychart.stockModule.math.aroonOscillator.initContext);
goog.exportSymbol('anychart.math.aroonOscillator.startFunction', anychart.stockModule.math.aroonOscillator.startFunction);
goog.exportSymbol('anychart.math.aroonOscillator.calculationFunction', anychart.stockModule.math.aroonOscillator.calculationFunction);
goog.exportSymbol('anychart.math.aroonOscillator.createComputer', anychart.stockModule.math.aroonOscillator.createComputer);
