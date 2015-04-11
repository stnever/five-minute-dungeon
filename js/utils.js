// Returns a random number between startInclusive and endInclusive:
// between(100, 120); -> 100, 101, ..., 120
// between(100, 120, 5); -> 100, 105, 110, 115, 120
function between(startInclusive, endInclusive, step) {
  if ( step == null ) step = 1;
  var maxSteps = (endInclusive - startInclusive) / step;

  return startInclusive +
    ((Math.floor(Math.random() * maxSteps)) * step);
}

// Rounds down any fractional numeric values in obj.
function floor(obj) {
  _.forOwn(obj, function(value, key) {
    if ( _.isNumber(value) ) obj[key] = Math.floor(value);
  })
  return obj;
}

// Returns true if every numerical value in obj is 0.
function allZeroes(obj) {
  return _.reduce(obj, function(acc, value) {
    return acc && ( value !== 0 );
  }, true);
}

// A simple loot table. Each item in the table has a certain
// frequency (e.g. {heads: 1, tails: 2}). The `roll()` method
// returns one item at random with that frequency. The table
// can be updated with the `update()` method.
function LootTable(newFreqs) {
  this.freqs = {};
  this.update(newFreqs);
}

// This method can accept an object (e.g. {heads:1, tails:2})
// or an array (e.g. ['heads', 'tails']). If an array is passed,
// each element will have the same chance to appear.
LootTable.prototype.update = function(newFreqs) {
  if ( _.isArray(newFreqs) ) {
    newFreqs = newFreqs.reduce(function(acc, v) {
      acc[v] = 1;
      return acc;
    }, {});
  }

  _.assign(this.freqs, newFreqs);
  var spectrum = this.spectrum = [];
  this.max = 0;

  var me = this;
  _.forOwn(this.freqs, function(freqValue, freqKey) {
    me.max += freqValue;
    me.spectrum.push({key: freqKey, limit: me.max});
  })

  return this;
}

LootTable.prototype.roll = function() {
  var r = _.random(0, this.max);
  for ( var i = 0; i < this.spectrum.length; i++ ) {
    if ( this.spectrum[i].limit >= r )
    return this.spectrum[i].key;
  }
  return this.spectrum[this.spectrum.length -1].key;
}

// http://sroucheray.org/blog/2009/11/array-sort-should-not-be-used-to-shuffle-an-array/
function badShuffle(arr) {
  arr.sort(function(a,b) {
    return Math.round( Math.random() * 2 ) - 1;
  });
}