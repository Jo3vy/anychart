goog.provide('anychart.stockModule.math.coppockCurve');
goog.require('anychart.stockModule.math.roc');
goog.require('anychart.stockModule.math.wma');
goog.require('anychart.utils');


/**
 * @namespace {anychart.stockModule.math.coppockCurve}
 */


/**
 * @typedef {{
 *    wmaPeriod: number,
 *    wmaContext: anychart.stockModule.math.wma.Context,
 *    wmaCalculate: Function,
 *    wmaStartFunction: Function,
 *    firstRocContext: anychart.stockModule.math.roc.Context,
 *    secondRocContext: anychart.stockModule.math.roc.Context,
 *    rocCalculate: Function,
 *    rocStartFunction: Function,
 *    dispose: Function
 * }}
 */
anychart.stockModule.math.coppockCurve.Context;


/**
 * Creates context for Coppock Curve indicator calculation.
 * @param {number=} opt_wmaPeriod Defaults to 10.
 * @param {number=} opt_firstRocPeriod Defaults to 11.
 * @param {number=} opt_secondRocPeriod Defaults to 14.
 * @return {anychart.stockModule.math.coppockCurve.Context}
 */
anychart.stockModule.math.coppockCurve.initContext = function(opt_wmaPeriod, opt_firstRocPeriod, opt_secondRocPeriod) {
  var wmaPeriod = anychart.utils.normalizeToNaturalNumber(opt_wmaPeriod, 10, false);
  var firstRocPeriod = anychart.utils.normalizeToNaturalNumber(opt_firstRocPeriod, 11, false);
  var secondRocPeriod = anychart.utils.normalizeToNaturalNumber(opt_secondRocPeriod, 14, false);
  return {
    wmaPeriod: wmaPeriod,
    wmaContext: anychart.stockModule.math.wma.initContext(wmaPeriod),
    wmaCalculate: anychart.stockModule.math.wma.calculate,
    wmaStartFunction: anychart.stockModule.math.wma.startFunction,
    firstRocContext: anychart.stockModule.math.roc.initContext(firstRocPeriod),
    secondRocContext: anychart.stockModule.math.roc.initContext(secondRocPeriod),
    rocCalculate: anychart.stockModule.math.roc.calculate,
    rocStartFunction: anychart.stockModule.math.roc.startFunction,
    /**
     * @this {anychart.stockModule.math.coppockCurve.Context}
     */
    'dispose': function() {
      this.wmaContext['dispose']();
      this.firstRocContext['dispose']();
      this.secondRocContext['dispose']();
    }
  };
};


/**
 * Start calculation function for Coppock Curve indicator calculation.
 * @param {anychart.stockModule.math.coppockCurve.Context} context
 * @this {anychart.stockModule.math.coppockCurve.Context}
 */
anychart.stockModule.math.coppockCurve.startFunction = function(context) {
  context.wmaStartFunction(/** @type {anychart.stockModule.math.wma.Context} */ (context.wmaContext));
  context.rocStartFunction(/** @type {anychart.stockModule.math.roc.Context} */ (context.firstRocContext));
  context.rocStartFunction(/** @type {anychart.stockModule.math.roc.Context} */ (context.secondRocContext));
};


/**
 * Calculates Coppock Curve.
 * @param {anychart.stockModule.data.TableComputer.RowProxy} row
 * @param {anychart.stockModule.math.coppockCurve.Context} context
 * @this {anychart.stockModule.math.coppockCurve.Context}
 */
anychart.stockModule.math.coppockCurve.calculationFunction = function(row, context) {
  var value = row.get('value');
  value = goog.isDef(value) ? value : row.get('close');
  value = anychart.utils.toNumber(value);
  var firstRocValue = context.rocCalculate(context.firstRocContext, value);
  var secondRocValue = context.rocCalculate(context.secondRocContext, value);

  if (isNaN(firstRocValue) || isNaN(secondRocValue)) {
    row.set('result', NaN);
  } else {
    var rocSum = firstRocValue + secondRocValue;
    var wmaValue = context.wmaCalculate(context.wmaContext, rocSum);
    if (isNaN(wmaValue)) {
      row.set('result', NaN);
    } else {
      row.set('result', wmaValue);
    }
  }
};


/**
 * Creates Coppock Curve computer for the given table mapping.
 * @param {anychart.stockModule.data.TableMapping} mapping
 * @param {number=} opt_wmaPeriod
 * @param {number=} opt_firstRocPeriod
 * @param {number=} opt_secondRocPeriod
 * @return {anychart.stockModule.data.TableComputer}
 */
anychart.stockModule.math.coppockCurve.createComputer = function(mapping, opt_wmaPeriod, opt_firstRocPeriod, opt_secondRocPeriod) {
  var result = mapping.getTable().createComputer(mapping);
  result.setContext(anychart.stockModule.math.coppockCurve.initContext(opt_wmaPeriod, opt_firstRocPeriod, opt_secondRocPeriod));
  result.setStartFunction(anychart.stockModule.math.coppockCurve.startFunction);
  result.setCalculationFunction(anychart.stockModule.math.coppockCurve.calculationFunction);
  result.addOutputField('result');
  return result;
};


//exports
goog.exportSymbol('anychart.math.coppockCurve.initContext', anychart.stockModule.math.coppockCurve.initContext);
goog.exportSymbol('anychart.math.coppockCurve.startFunction', anychart.stockModule.math.coppockCurve.startFunction);
goog.exportSymbol('anychart.math.coppockCurve.calculationFunction', anychart.stockModule.math.coppockCurve.calculationFunction);
goog.exportSymbol('anychart.math.coppockCurve.createComputer', anychart.stockModule.math.coppockCurve.createComputer);
