goog.provide('anychart.data.Tree');

goog.require('anychart.Base');
goog.require('anychart.data.Traverser');
goog.require('anychart.enums');
goog.require('anychart.utils');
goog.require('goog.array');
goog.require('goog.object');



/**
 * Tree data implementation.
 * @param {Array.<Object>=} opt_data - Raw data.
 * @param {anychart.enums.TreeFillingMethod=} opt_fillMethod - Fill method.
 * @constructor
 * @extends {anychart.Base}
 */
anychart.data.Tree = function(opt_data, opt_fillMethod) {
  goog.base(this);


  /**
   * Contains roots.
   * @type {Array.<anychart.data.Tree.DataItem>}
   * @private
   */
  this.roots_ = [];


  /**
   * Index storage.
   * @type {Object.<string, Array>}
   * @private
   */
  this.index_ = {};


  /**
   * Default traverser.
   * @type {anychart.data.Traverser}
   * @private
   */
  this.defaultTraverser_ = this.getTraverser();

  /**
   * Traverser 'toArray' cache.
   * @type {Array.<anychart.data.Tree.DataItem>}
   * @private
   */
  this.traverserToArrayCache_ = null;

  this.createIndexOn(anychart.data.Tree.DataItem.ID); //Silent ID indexing.

  //Filling with data.
  if (opt_data) this.addData(opt_data, opt_fillMethod);

};
goog.inherits(anychart.data.Tree, anychart.Base);


/**
 * @typedef {{
 *    key:*,
 *    value:(anychart.data.Tree.DataItem|Array.<anychart.data.Tree.DataItem>)
 * }}
 */
anychart.data.Tree.IndexKeyValue;


/**
 * Consistency state mask supported by this object.
 * @type {number}
 */
anychart.data.Tree.prototype.SUPPORTED_SIGNALS = anychart.Signal.DATA_CHANGED;


/** @inheritDoc */
anychart.data.Tree.prototype.dispatchSignal = function(value) {
  if (!!(value & anychart.Signal.DATA_CHANGED))
    this.traverserToArrayCache_ = null;
  goog.base(this, 'dispatchSignal', value);
};


/**
 * Creates tree data traverser.
 * @return {anychart.data.Traverser} - New traverser.
 */
anychart.data.Tree.prototype.getTraverser = function() {
  return new anychart.data.Traverser(this);
};


/**
 * Fill data supposing that the source data object has a tree structure.
 * @param {Array.<Object>} data - Tree-structured data.
 * @private
 */
anychart.data.Tree.prototype.fillAsTree_ = function(data) {
  for (var i = 0, l = data.length; i < l; i++) {
    var newRoot = this.createRoot(data[i]);
    this.roots_.push(newRoot);
    this.indexBranch_(newRoot);
  }
};


/**
 * Creates root tree data item of incoming raw object.
 * NOTE: Do not export!
 * @param {Object} rawItem - Raw data object.
 * @return {anychart.data.Tree.DataItem} - Root data item.
 */
anychart.data.Tree.prototype.createRoot = function(rawItem) {
  var treeItem = new anychart.data.Tree.DataItem(this, rawItem);

  var children = rawItem[anychart.data.Tree.DataItem.CHILDREN];

  if (children) {
    for (var i = 0, l = children.length; i < l; i++) {
      treeItem.addChildWithoutIndexing(this.createRoot(children[i]));
    }
  }

  return treeItem;
};


/**
 * Fill data supposing that the raw data is a linear array of objects with parent field set.
 * NOTE: Cycles will not be added as data.
 * @param {Array.<Object>} data - Linear set of raw data items pointing to their parents.
 * @private
 */
anychart.data.Tree.prototype.fillAsParentPointer_ = function(data) {
  var i, l, obj, parentId, index, found, searchResult, tdi;

  var uids = []; //List of unique 'id'-field values of raw data items.
  var uitems = []; //List of tree data items synchronized with uids.
  var tdis = []; //List of tree data items overall.

  //First passage. Going through raw data array.
  for (i = 0, l = data.length; i < l; i++) {
    obj = data[i];

    var dataItem = new anychart.data.Tree.DataItem(this, obj);
    var id = obj[anychart.data.Tree.DataItem.ID];
    tdis.push(dataItem);

    if (goog.isDefAndNotNull(id)) {
      index = goog.array.binarySearch(uids, id);
      if (index < 0) {
        var pos = ~index;
        goog.array.insertAt(uids, id, pos);
        searchResult = this.search(anychart.data.Tree.DataItem.ID, id);

        if (searchResult) {
          found = (searchResult instanceof anychart.data.Tree.DataItem) ? searchResult : searchResult[0];
          goog.array.insertAt(uitems, found, pos);
          found.meta('nc', true);
          anychart.utils.consoleWarn('[Warning while adding new data to tree]: data item with ID=\'' + id + '\' already exists in tree' +
              'and will be used as parent for all related data items.');
        } else {
          goog.array.insertAt(uitems, dataItem, pos);
        }
      } else {
        anychart.utils.consoleWarn('[Warning while adding new data to tree]: data item with ID=\'' + id +
            '\' is not unique. First met object will be used.');
      }
    }
  }


  //Second passage. Building trees.
  for (i = 0; i < tdis.length; i++) {
    tdi = tdis[i]; //Tree data item.
    parentId = data[i][anychart.data.Tree.DataItem.PARENT];
    if (goog.isDefAndNotNull(parentId)) {
      index = goog.array.binarySearch(uids, parentId);
      if (index < 0) {
        searchResult = this.search(anychart.data.Tree.DataItem.ID, parentId);
        if (searchResult) {
          found = (searchResult instanceof anychart.data.Tree.DataItem) ? searchResult : searchResult[0];
          found.addChildWithoutIndexing(tdi);
        } else {
          this.roots_.push(tdi);
          anychart.utils.consoleWarn('[Warning while adding new data to tree]: one of data items was looking for parent ' +
              'with ID=\'' + parentId + '\', but did not find it. Please check the data. \nPLEASE NOTE: this data item will ' +
              'be added as root to avoid loss of information.');
        }
        this.indexBranch_(tdi);
      } else {
        var parent = uitems[index];
        parent.addChildWithoutIndexing(tdi);
        if (parent.meta('nc')) this.indexBranch_(tdi);
      }
    } else {
      this.roots_.push(tdi);
      this.indexBranch_(tdi);
    }
  }


  //Third passage. Looking for cycles.
  if (anychart.DEVELOP) {
    for (i = 0; i < tdis.length; i++) {
      tdi = tdis[i]; //Tree data item.
      if (!tdi.meta('nc')) anychart.utils.consoleWarn('[Warning while adding new data to tree]: data item {ID=\'' +
          tdi.get(anychart.data.Tree.DataItem.ID) + '\', PARENT=\'' +
          tdi.getParent().get(anychart.data.Tree.DataItem.ID) + '\'} belongs to cycle and will not be added to the tree.');
    }
  }


};


/**
 * Adds a data.
 * @param {Array.<Object>} data - Raw data.
 * @param {(anychart.enums.TreeFillingMethod|string)=} opt_fillingMethod - Filling method.
 * @return {anychart.data.Tree} - Itself for method chaining.
 */
anychart.data.Tree.prototype.addData = function(data, opt_fillingMethod) {
  opt_fillingMethod = (String(opt_fillingMethod)).toLowerCase();

  this.suspendSignalsDispatching();

  switch (opt_fillingMethod) {
    case 'astable':
    case 'table':
    case 'parentid':
    case 'linear':
    case 'plain':
    case 'db':
    case 'database':
    case 'id':
    case 'parentpointer':
    case 'pointer':
      this.fillAsParentPointer_(data);
      break;

    case 'astree':
    case 'tree':
    case 'structure':
    case 'structural':
    default:
      this.fillAsTree_(data);
      break;
  }

  this.resumeSignalsDispatching(true);
  return this;
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Tree indexing.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Default index comparison function.
 * @param {anychart.data.Tree.IndexKeyValue} item1 - First item.
 * @param {anychart.data.Tree.IndexKeyValue} item2 - Second item.
 * @return {number} - Comparison result.
 * @private
 */
anychart.data.Tree.prototype.comparisonFunction_ = function(item1, item2) {
  return anychart.utils.compareAsc(item1.key, item2.key);
};


/**
 * Adds an index for a specified field.
 * NOTE: If index is not created or object has not field specified, nothing will happen.
 * @param {anychart.data.Tree.DataItem} item - Tree data item to be indexed.
 * @param {string=} opt_field - Field name. If not set, will be indexed by all available index fields.
 * @param {boolean=} opt_subTree - Flag if we should go through children deeper.
 * @return {anychart.data.Tree} - Itself for method chaining.
 */
anychart.data.Tree.prototype.addToIndex = function(item, opt_field, opt_subTree) {
  if (!opt_field) {
    for (var field in this.index_) {
      this.addToIndex(item, field);
    }
    return this;
  }

  if (opt_subTree) {
    for (var i = item.numChildren(); i--;) {
      this.addToIndex(/** @type {anychart.data.Tree.DataItem} */ (item.getChildAt(i)), opt_field, opt_subTree);
    }
  }

  var indexArr = this.index_[/** @type {string} */ (opt_field)];
  if (indexArr) {

    /**
     * @type {anychart.data.Tree.IndexKeyValue}
     */
    var indexKeyValue = {key: item.get(/** @type {string} */ (opt_field)), value: item};
    var index = goog.array.binarySearch(indexArr, indexKeyValue, this.comparisonFunction_);

    if (index < 0) { //Not found.
      goog.array.insertAt(indexArr, indexKeyValue, ~index);
    } else {
      var keyValuePair = /** {anychart.data.Tree.IndexKeyValue} */ (indexArr[index]);
      if (!goog.isArray(keyValuePair.value)) keyValuePair.value = [keyValuePair.value]; //Turning single value to array.
      keyValuePair.value.push(item);
    }
  }
  return this;
};


/**
 * Removes from index for a specified field.
 * NOTE: If index is not created or object has not field specified, nothing will happen.
 * @param {anychart.data.Tree.DataItem} item - Tree data item to be removed from index.
 * @param {string=} opt_field - Field name. If not set, will be removed by all available index fields.
 * @param {boolean=} opt_subTree - Flag if we should go through children deeper.
 * @return {anychart.data.Tree} - Itself for method chaining.
 */
anychart.data.Tree.prototype.removeFromIndex = function(item, opt_field, opt_subTree) {
  if (!opt_field) {
    for (var field in this.index_) {
      this.removeFromIndex(item, field, opt_subTree);
    }
    return this;
  }

  if (opt_subTree) {
    for (var i = item.numChildren(); i--;) {
      this.removeFromIndex(/** @type {anychart.data.Tree.DataItem} */ (item.getChildAt(i)), opt_field, opt_subTree);
    }
  }

  var indexArr = this.index_[opt_field]; //Array of key-value pairs or undefined.
  if (indexArr) {
    //Looking in index array of key-value pairs for unique key.
    var index = goog.array.binarySearch(indexArr, {key: item.get(opt_field)}, this.comparisonFunction_); //index here really can't be negative (value must exist). If not found - here's a bug.
    var found = indexArr[index]; //found {key:'', value:(TreeDataItem|Array)}-object. Value can be a tree data item or array.
    if (goog.isArray(found.value) && found.value.length > 1) {
      goog.array.remove(found.value, item);
    } else {
      goog.array.removeAt(this.index_[opt_field], index);
    }
  }

  return this;
};


/**
 * Creates an index on a specified field.
 * It can't be indexed by 'parent' or 'children' fields because these fields are not available by treeItem.get(field); (@see createComparisonFunction).
 * @param {string} field - Field name.
 * @return {anychart.data.Tree} - Itself for method chaining.
 */
anychart.data.Tree.prototype.createIndexOn = function(field) {
  if (!this.index_[field]) { //Index can be created.
    this.defaultTraverser_.reset();
    this.index_[field] = [];

    if (!this.traverserToArrayCache_) this.traverserToArrayCache_ = this.defaultTraverser_.toArray();

    for (var i = 0; i < this.traverserToArrayCache_.length; i++) {
      this.addToIndex(this.traverserToArrayCache_[i], field);
    }
  }
  return this;
};


/**
 * Removes index on a specified field.
 * @param {string} field - Field name.
 * @return {anychart.data.Tree} - Itself for method chaining.
 */
anychart.data.Tree.prototype.removeIndexOn = function(field) {
  delete this.index_[field];
  return this;
};


/**
 * Indexes a data item with all it's children.
 * Used if item can't be indexed while creation (example: fillAsParentPointer_ method can't index item because it can
 * be cycled and must not be in index) and if item must be indexed with all it's children.
 * NOTE: Do not export this method.
 * @param {anychart.data.Tree.DataItem} root - Root item.
 * @private
 * @return {anychart.data.Tree} - Itself.
 */
anychart.data.Tree.prototype.indexBranch_ = function(root) {
  this.addToIndex(root);
  root.meta('nc', true);
  for (var i = 0; i < root.numChildren(); i++) {
    this.indexBranch_(/** @type {anychart.data.Tree.DataItem} */ (root.getChildAt(i)));
  }
  return this;
};


/**
 * Performs a data search. Returns null of nothing is found, tree data item if here's a single result and array of
 * tree data items if here are multiple matches.
 *
 * @param {string} soughtField - Field for search. Literally means the name of field of data item.
 * @param {(string|number|boolean|function(anychart.data.Tree.DataItem, anychart.data.Tree.DataItem):number|
 * function(anychart.data.Tree.DataItem, number, Array.<anychart.data.Tree.DataItem>):number)} valueOrEvaluator -
 *  Sought value or evaluator function. Evaluator function that receives 3 arguments (the element, the index and the array).
 *  Should return a negative number, zero, or a positive number depending on whether the desired index is before, at, or
 *  after the element passed to it.
 * @param {(function(anychart.data.Tree.DataItem, anychart.data.Tree.DataItem):number|Object)=} opt_comparisonFnOrEvaluatorContext -
 *  Custom comparison function or evaluator context. Optional comparison function by which the array is ordered. Should
 *  take 2 arguments to compare, and return a negative number, zero, or a positive number depending on whether the
 *  first argument is less than, equal to, or greater than the second.
 * @return {(anychart.data.Tree.DataItem|Array.<anychart.data.Tree.DataItem>|null)} - Found tree data item or null or array of found tree data items.
 */
anychart.data.Tree.prototype.search = function(soughtField, valueOrEvaluator, opt_comparisonFnOrEvaluatorContext) {
  var isEvaluator = goog.isFunction(valueOrEvaluator); //Actually means if binary select must be used.
  var i, result;
  if (this.index_[soughtField]) { //Fast search: index exists.
    var resultIndex = isEvaluator ?
        goog.array.binarySelect(this.index_[soughtField],
            /** @type {Function} */ (valueOrEvaluator),
            /** @type {Object} */ (opt_comparisonFnOrEvaluatorContext)) :
        goog.array.binarySearch(this.index_[soughtField], {key: valueOrEvaluator},
            /** @type {Function} */ (opt_comparisonFnOrEvaluatorContext) || /** @type {Function} */ (this.comparisonFunction_));

    result = resultIndex >= 0 ? this.index_[soughtField][resultIndex].value : null;

    if (goog.isArray(result)) {
      return result.length == 1 ? result[0] : result;
    } else {
      return result;
    }

  } else { //Slow search without indexes: full passage.
    result = [];

    if (!this.traverserToArrayCache_) this.traverserToArrayCache_ = this.defaultTraverser_.toArray();

    if (isEvaluator) {
      for (i = 0; i < this.traverserToArrayCache_.length; i++) {
        var compareResult = valueOrEvaluator.call(opt_comparisonFnOrEvaluatorContext, this.traverserToArrayCache_[i], i, this.traverserToArrayCache_);
        if (!compareResult) result.push(this.traverserToArrayCache_[i]);
      }
    } else {
      var comparator = /** @type {Function} */ (opt_comparisonFnOrEvaluatorContext || anychart.utils.compareAsc);
      for (i = 0; i < this.traverserToArrayCache_.length; i++) {
        if (!comparator(this.traverserToArrayCache_[i].get(soughtField), valueOrEvaluator)) result.push(this.traverserToArrayCache_[i]);
      }
    }

    return result.length ? (result.length == 1 ? result[0] : result) : null;
  }

};


/**
 * Performs a data search. Actually does the same as (@see search) but result is always an array.
 *
 * @param {string} soughtField - Field for search. Literally means the name of field of data item.
 * @param {(string|number|boolean|function(anychart.data.Tree.DataItem, anychart.data.Tree.DataItem):number|
 * function(anychart.data.Tree.DataItem, number, Array.<anychart.data.Tree.DataItem>):number)} valueOrEvaluator -
 *  Sought value or evaluator function. Evaluator function that receives 3 arguments (the element, the index and the array).
 *  Should return a negative number, zero, or a positive number depending on whether the desired index is before, at, or
 *  after the element passed to it.
 * @param {(function(anychart.data.Tree.DataItem, anychart.data.Tree.DataItem):number|Object)=} opt_comparisonFnOrEvaluatorContext -
 *  Custom comparison function or evaluator context. Optional comparison function by which the array is ordered. Should
 *  take 2 arguments to compare, and return a negative number, zero, or a positive number depending on whether the
 *  first argument is less than, equal to, or greater than the second.
 * @return {Array.<anychart.data.Tree.DataItem>} - Array of found tree data items.
 */
anychart.data.Tree.prototype.searchItems = function(soughtField, valueOrEvaluator, opt_comparisonFnOrEvaluatorContext) {
  var result = this.search(soughtField, valueOrEvaluator, opt_comparisonFnOrEvaluatorContext);
  return result ? (goog.isArray(result) ? result : [result]) : [];
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Tree CRUD.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Adds a new root element.
 * @param {Object} child - Child object.
 * @return {anychart.data.Tree} - Itself for method chaining.
 */
anychart.data.Tree.prototype.addChild = function(child) {
  return this.addChildAt(child, this.numChildren());
};


/**
 * Inserts a new root element into a specified position.
 * @param {Object} child - Child object.
 * @param {number} index - Position.
 * @return {anychart.data.Tree} - Itself for method chaining.
 */
anychart.data.Tree.prototype.addChildAt = function(child, index) {
  this.suspendSignalsDispatching();

  var oldTree = null;
  if (child instanceof anychart.data.Tree.DataItem) {
    oldTree = child.tree();
    if (oldTree && oldTree != this) oldTree.suspendSignalsDispatching();
    child.remove();
  } else {
    child = this.createRoot(child);
  }

  index = goog.math.clamp(index, 0, this.numChildren());
  goog.array.insertAt(this.roots_, child, index);
  this.indexBranch_(child);

  child.tree(this); //Sets a new tree for all subtree. All signals are suspended.

  this.dispatchSignal(anychart.Signal.DATA_CHANGED);

  this.resumeSignalsDispatching(true); //Signals must be sent.
  if (oldTree) oldTree.resumeSignalsDispatching(true); //As well as here.

  return this;
};


/**
 * Returns a copy of roots array.
 * @return {Array.<anychart.data.Tree.DataItem>} - Copy of roots array.
 */
anychart.data.Tree.prototype.getChildren = function() {
  return goog.array.clone(this.roots_);
};


/**
 * Returns a children array of the tree.
 * DEVELOPERS NOTE: Do not export this method. For inner usage only because is faster than getChildren().
 * @return {Array.<anychart.data.Tree.DataItem>} - Children array.
 */
anychart.data.Tree.prototype.getChildrenUnsafe = function() {
  return this.roots_;
};


/**
 * Returns a length of roots array.
 * @return {number} - Number of roots.
 */
anychart.data.Tree.prototype.numChildren = function() {
  return this.roots_.length;
};


/**
 * Gets the child by index.
 * @param {number} index - Index of child to find.
 * @return {(anychart.data.Tree.DataItem|undefined)} - Child into a specified position.
 */
anychart.data.Tree.prototype.getChildAt = function(index) {
  return this.roots_[index];
};


/**
 * Removes tree's root data item.
 * @param {anychart.data.Tree.DataItem} child - Child to be removed.
 * @return {anychart.data.Tree.DataItem} - Itself for method chaining.
 */
anychart.data.Tree.prototype.removeChild = function(child) {
  return this.removeChildAt(this.indexOfChild(child));
};


/**
 * Gets index of child in a roots array.
 * @param {anychart.data.Tree.DataItem} child - Sought child.
 * @return {number} - Index of child.
 */
anychart.data.Tree.prototype.indexOfChild = function(child) {
  return goog.array.indexOf(this.roots_, child);
};


/**
 * Removes child at specified position.
 * @param {number} index - Index of item to be removed.
 * @return {?anychart.data.Tree.DataItem} - Removed item or null if item is not found.
 */
anychart.data.Tree.prototype.removeChildAt = function(index) {
  var result = null;
  if (index >= 0 && index <= this.roots_.length) {
    result = goog.array.splice(this.roots_, index, 1)[0];
    this.removeFromIndex(result, undefined, true);
    this.dispatchSignal(anychart.Signal.DATA_CHANGED);
  }
  return result;
};


/**
 * Removes children.
 * @return {anychart.data.Tree} - Itself for method chaining.
 */
anychart.data.Tree.prototype.removeChildren = function() {
  if (this.roots_.length) {
    this.roots_.length = 0;

    for (var field in this.index_) { //Killing an index.
      this.index_[field].length = 0;
    }

    this.dispatchSignal(anychart.Signal.DATA_CHANGED);
  }
  return this;
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Tree data item.
//
//----------------------------------------------------------------------------------------------------------------------



/**
 * Tree data item implementation.
 * @param {anychart.data.Tree} parentTree - Tree that contains a data item. Used as signal dispatcher in this case.
 * @param {Object} rawData - Data object.
 * @constructor
 */
anychart.data.Tree.DataItem = function(parentTree, rawData) {

  /**
   * Reference to the parent tree.
   * @type {anychart.data.Tree}
   * @private
   */
  this.tree_ = parentTree;

  /**
   * Link to the parent.
   * @type {anychart.data.Tree.DataItem}
   * @private
   */
  this.parent_ = null;


  /**
   * Array of links to the children.
   * @type {Array.<anychart.data.Tree.DataItem>}
   * @private
   */
  this.children_ = [];


  /**
   * Meta data.
   * @type {!Object}
   * @private
   */
  this.meta_ = {};


  var copy = goog.object.clone(rawData);
  delete copy[anychart.data.Tree.DataItem.CHILDREN];
  delete copy[anychart.data.Tree.DataItem.PARENT];


  /**
   * Data.
   * @type {!Object}
   * @private
   */
  this.data_ = copy;

};


/**
 * Children field name.
 * @type {string}
 */
anychart.data.Tree.DataItem.CHILDREN = 'children';


/**
 * Parent field name.
 * @type {string}
 */
anychart.data.Tree.DataItem.PARENT = 'parent';


/**
 * ID field name.
 * @type {string}
 */
anychart.data.Tree.DataItem.ID = 'id';


/**
 * Suspends tree signal dispatching.
 * @return {anychart.data.Tree.DataItem} - Itself for method chaining.
 * @private
 */
anychart.data.Tree.DataItem.prototype.suspendSignals_ = function() {
  this.tree_.suspendSignalsDispatching();
  return this;
};


/**
 * Resumes tree signal dispatching.
 * @param {boolean} doDispatchSuspendedSignals - Whether to dispatch all signals that were to be dispatched while the
 *    suspend or not.
 * @return {anychart.data.Tree.DataItem} - Itself for method chaining.
 * @private
 */
anychart.data.Tree.DataItem.prototype.resumeSignals_ = function(doDispatchSuspendedSignals) {
  this.tree_.resumeSignalsDispatching(doDispatchSuspendedSignals);
  return this;
};


/**
 * Dispatches DATA_CHANGED signal by tree.
 * @return {anychart.data.Tree.DataItem} - Itself for method chaining.
 * @private
 */
anychart.data.Tree.DataItem.prototype.dispatchSignal_ = function() {
  this.tree_.dispatchSignal(anychart.Signal.DATA_CHANGED);
  return this;
};


/**
 * Gets a value from data by key.
 * @param {string} key - Key.
 * @return {*} - Value.
 */
anychart.data.Tree.DataItem.prototype.get = function(key) {
  return this.data_[key];
};


/**
 * Sets key-value pair to the data.
 * @param {string} key - Key.
 * @param {*} value - Value.
 * @return {anychart.data.Tree.DataItem} - Itself for method chaining.
 */
anychart.data.Tree.DataItem.prototype.set = function(key, value) {
  if (this.data_[key] != value) {
    this.tree_.removeFromIndex(this, key);
    this.data_[key] = value;
    this.tree_.addToIndex(this, key);
    this.dispatchSignal_();
  }

  return this;
};


/**
 * Gets/sets a meta data.
 * @param {string} key - Key.
 * @param {*=} opt_value - Value.
 * @return {*} - Value or itself for method chaining.
 */
anychart.data.Tree.DataItem.prototype.meta = function(key, opt_value) {
  if (arguments.length > 1) {
    if (this.meta_[key] != opt_value) {
      this.meta_[key] = opt_value;
      this.dispatchSignal_();
    }
    return this;
  }
  return this.meta_[key];
};


/**
 * Gets a data item's parent.
 * @return {anychart.data.Tree.DataItem} - Parent.
 */
anychart.data.Tree.DataItem.prototype.getParent = function() {
  return this.parent_;
};


/**
 * Internal parent setter.
 *
 * NOTE: This method just sets a parent of current tree data item, it doesn't modify a parent's children list.
 * Use parent.addChild() to set the both linkages: parent.addChild(child) sets a parent for child and adds a child into a
 * parent's children list.
 *
 * @param {anychart.data.Tree.DataItem} parent - Parent to be set.
 * @return {anychart.data.Tree.DataItem} - Itself for method chaining.
 * @private
 */
anychart.data.Tree.DataItem.prototype.setParent_ = function(parent) {
  if (this.parent_ != parent) {
    this.parent_ = parent;
    this.dispatchSignal_();
  }
  return this;
};

//----------------------------------------------------------------------------------------------------------------------
//
//  Tree data item CRUD.
//
//----------------------------------------------------------------------------------------------------------------------


/**
 * Adds a child.
 * @param {(Object|anychart.data.Tree.DataItem)} child - Child to be added.
 * @return {anychart.data.Tree.DataItem} - Itself for method chaining.
 */
anychart.data.Tree.DataItem.prototype.addChild = function(child) {
  return this.addChildAt(child, this.numChildren());
};


/**
 * Inserts a child into a specified position.
 * Please make sure that child has not inner cycles to avoid stack overflow exception.
 *
 * @param {(Object|anychart.data.Tree.DataItem)} child - Child to be added.
 * @param {number} index - Position.
 * @return {anychart.data.Tree.DataItem} - Itself for method chaining.
 */
anychart.data.Tree.DataItem.prototype.addChildAt = function(child, index) {
  this.tree_.suspendSignalsDispatching();

  var oldTree = null;
  if (child instanceof anychart.data.Tree.DataItem) {
    oldTree = child.tree();
    if (oldTree && oldTree != this.tree_) oldTree.suspendSignalsDispatching();
    child.remove();
  } else {
    child = this.tree_.createRoot(child);
  }

  index = goog.math.clamp(index, 0, this.numChildren());
  goog.array.insertAt(this.children_, child, index);
  this.tree_.addToIndex(child, undefined, true);

  child.tree(this.tree_); //Sets a new tree for all subtree. All signals are suspended.

  child.parent_ = this;

  this.tree_.dispatchSignal(anychart.Signal.DATA_CHANGED);

  this.tree_.resumeSignalsDispatching(true); //Signals must be sent.
  if (oldTree) oldTree.resumeSignalsDispatching(true); //As well as here.

  return this;
};


/**
 * Adds a child without indexing it. Used for inner data operations to avoid cycles that were not excepted.
 * NOTE: DO NOT EXPORT THIS METHOD!
 *
 * @param {anychart.data.Tree.DataItem} child - Child to be added.
 * @return {anychart.data.Tree.DataItem} - Itself for method chaining.
 */
anychart.data.Tree.DataItem.prototype.addChildWithoutIndexing = function(child) {
  goog.array.insertAt(this.children_, child, this.numChildren());
  child.parent_ = this;
  return this;
};


/**
 * Returns a copy of children array of current data item.
 * @return {Array.<anychart.data.Tree.DataItem>} - Copy of children array.
 */
anychart.data.Tree.DataItem.prototype.getChildren = function() {
  return goog.array.clone(this.children_);
};


/**
 * Returns a children array of current data item.
 * DEVELOPERS NOTE: Do not export this method. For inner usage only because is faster than getChildren().
 * @return {Array.<anychart.data.Tree.DataItem>} - Children array.
 */
anychart.data.Tree.DataItem.prototype.getChildrenUnsafe = function() {
  return this.children_;
};


/**
 * Returns a length of children array.
 * @return {number} - Number of children.
 */
anychart.data.Tree.DataItem.prototype.numChildren = function() {
  return this.children_.length;
};


/**
 * Gets the child by index.
 * @param {number} index - Index of child to find.
 * @return {(anychart.data.Tree.DataItem|undefined)} - Child into a specified position.
 */
anychart.data.Tree.DataItem.prototype.getChildAt = function(index) {
  return this.children_[index];
};


/**
 * Removes data item's child.
 * @param {anychart.data.Tree.DataItem} child - Child to be removed.
 * @return {anychart.data.Tree.DataItem} - Removed element or null.
 */
anychart.data.Tree.DataItem.prototype.removeChild = function(child) {
  return this.removeChildAt(this.indexOfChild(child));
};


/**
 * Removes child at specified position.
 * @param {number} index - Index of item to be removed.
 * @return {?anychart.data.Tree.DataItem} - Removed item or null if item is not found.
 */
anychart.data.Tree.DataItem.prototype.removeChildAt = function(index) {
  var result = null;
  if (index >= 0 && index <= this.children_.length) {
    result = goog.array.splice(this.children_, index, 1)[0];
    this.tree_.removeFromIndex(result, undefined, true);
    result.setParent_(null);
  }
  return result;
};


/**
 * Removes children.
 * @return {anychart.data.Tree.DataItem} - Itself for method chaining.
 */
anychart.data.Tree.DataItem.prototype.removeChildren = function() {
  var l = this.children_.length;
  if (l) {
    this.suspendSignals_();
    for (var i = 0; i < l; i++) {
      var child = this.children_[i];
      child.setParent_(null);
      this.tree_.removeFromIndex(child, undefined, true);
    }
    this.resumeSignals_(false);
    this.children_.length = 0;
    this.dispatchSignal_();
  }
  return this;
};


/**
 * Gets index of child in a children array.
 * @param {anychart.data.Tree.DataItem} child - Sought child.
 * @return {number} - Index of child.
 */
anychart.data.Tree.DataItem.prototype.indexOfChild = function(child) {
  return goog.array.indexOf(this.children_, child);
};


/**
 * Current item will be removed from parent's children and becomes an orphan.
 * @return {anychart.data.Tree.DataItem} - Itself for method chaining.
 */
anychart.data.Tree.DataItem.prototype.remove = function() {
  if (this.parent_) {
    this.parent_.suspendSignals_();
    this.parent_.removeChild(this);
    this.parent_.resumeSignals_(false);
    this.setParent_(null);
  }
  return this;
};


/**
 * Gets/sets a tree that data items belongs to.
 * @param {anychart.data.Tree=} opt_value - New tree to be set.
 * @return {(anychart.data.Tree.DataItem|anychart.data.Tree)} - Current value or itself for method chaining.
 */
anychart.data.Tree.DataItem.prototype.tree = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.tree_ != opt_value) {
      this.treeInternal_(opt_value);
    }
    return this;
  }
  return this.tree_;
};


/**
 * Recursively sets a new tree.
 * @param {anychart.data.Tree} newTree - New tree to be set.
 * @private
 */
anychart.data.Tree.DataItem.prototype.treeInternal_ = function(newTree) {
  this.tree_ = newTree;
  for (var i = 0, l = this.numChildren(); i < l; i++) {
    this.children_[i].treeInternal_(newTree);
  }
};


/**
 * Constructor function
 * @param {Array.<Object>=} opt_data - Raw data.
 * @param {anychart.enums.TreeFillingMethod=} opt_fillMethod - Fill method.
 * @return {!anychart.data.Tree}
 */
anychart.data.tree = function(opt_data, opt_fillMethod) {
  return new anychart.data.Tree(opt_data, opt_fillMethod);
};


//exports
goog.exportSymbol('anychart.data.tree', anychart.data.tree);
anychart.data.Tree.prototype['getTraverser'] = anychart.data.Tree.prototype.getTraverser;
anychart.data.Tree.prototype['addData'] = anychart.data.Tree.prototype.addData;
anychart.data.Tree.prototype['createIndexOn'] = anychart.data.Tree.prototype.createIndexOn;
anychart.data.Tree.prototype['removeIndexOn'] = anychart.data.Tree.prototype.removeIndexOn;
anychart.data.Tree.prototype['search'] = anychart.data.Tree.prototype.search;
anychart.data.Tree.prototype['searchItems'] = anychart.data.Tree.prototype.searchItems;
anychart.data.Tree.prototype['addChild'] = anychart.data.Tree.prototype.addChild;
anychart.data.Tree.prototype['addChildAt'] = anychart.data.Tree.prototype.addChildAt;
anychart.data.Tree.prototype['getChildren'] = anychart.data.Tree.prototype.getChildren;
anychart.data.Tree.prototype['numChildren'] = anychart.data.Tree.prototype.numChildren;
anychart.data.Tree.prototype['getChildAt'] = anychart.data.Tree.prototype.getChildAt;
anychart.data.Tree.prototype['removeChild'] = anychart.data.Tree.prototype.removeChild;
anychart.data.Tree.prototype['removeChildAt'] = anychart.data.Tree.prototype.removeChildAt;
anychart.data.Tree.prototype['removeChildren'] = anychart.data.Tree.prototype.removeChildren;
anychart.data.Tree.prototype['indexOfChild'] = anychart.data.Tree.prototype.indexOfChild;
//----------------------------------------------------------------------------------------------------------------------
//
//  anychart.data.Tree.DataItem
//  NOTE: instance is not exported.
//
//----------------------------------------------------------------------------------------------------------------------
anychart.data.Tree.DataItem.prototype['get'] = anychart.data.Tree.DataItem.prototype.get;
anychart.data.Tree.DataItem.prototype['set'] = anychart.data.Tree.DataItem.prototype.set;
anychart.data.Tree.DataItem.prototype['meta'] = anychart.data.Tree.DataItem.prototype.meta;
anychart.data.Tree.DataItem.prototype['getParent'] = anychart.data.Tree.DataItem.prototype.getParent;
anychart.data.Tree.DataItem.prototype['addChild'] = anychart.data.Tree.DataItem.prototype.addChild;
anychart.data.Tree.DataItem.prototype['addChildAt'] = anychart.data.Tree.DataItem.prototype.addChildAt;
anychart.data.Tree.DataItem.prototype['getChildren'] = anychart.data.Tree.DataItem.prototype.getChildren;
anychart.data.Tree.DataItem.prototype['numChildren'] = anychart.data.Tree.DataItem.prototype.numChildren;
anychart.data.Tree.DataItem.prototype['getChildAt'] = anychart.data.Tree.DataItem.prototype.getChildAt;
anychart.data.Tree.DataItem.prototype['remove'] = anychart.data.Tree.DataItem.prototype.remove;
anychart.data.Tree.DataItem.prototype['removeChild'] = anychart.data.Tree.DataItem.prototype.removeChild;
anychart.data.Tree.DataItem.prototype['removeChildAt'] = anychart.data.Tree.DataItem.prototype.removeChildAt;
anychart.data.Tree.DataItem.prototype['removeChildren'] = anychart.data.Tree.DataItem.prototype.removeChildren;
anychart.data.Tree.DataItem.prototype['indexOfChild'] = anychart.data.Tree.DataItem.prototype.indexOfChild;
