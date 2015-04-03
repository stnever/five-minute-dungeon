// Returns a random number between startInclusive and endInclusive:
// between(100, 120); -> 100, 101, ..., 120
// between(100, 120, 5); -> 100, 105, 110, 115, 120
function between(startInclusive, endInclusive, step) {
  if ( step == null ) step = 1;
  var maxSteps = endInclusive - startInclusive / step;

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

// Given an object with values and their frequencies (for example,
// {heads: 1, tails: 2}), returns a function -- the sampler -- that,
// when called, produces one of the values.
function sampler(frequencies) {
  var spectrum = [], max = 0;
  _.forOwn(frequencies, function(freqValue, freqKey) {
    max += freqValue;
    spectrum.push({key: freqKey, limit: max});
  })

  var result = function() {
    var r = _.random(0, max);
    for ( var i = 0; i < spectrum.length; i++ ) {
      if ( spectrum[i].limit >= r )
      return spectrum[i].key;
    }
  }

  result.max = max;
  return result;
}

// http://sroucheray.org/blog/2009/11/array-sort-should-not-be-used-to-shuffle-an-array/
function badShuffle(arr) {
  arr.sort(function(a,b) {
    return Math.round( Math.random() * 2 ) - 1;
  });
}