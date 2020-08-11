import _ from 'lodash'

// A simple loot table. Each item in the table has a certain
// frequency (e.g. {heads: 1, tails: 2}). The `roll()` method
// returns one item at random with that frequency. The table
// can be updated with the `update()` method.
export default class LootTable {
  constructor(newFreqs) {
    this.freqs = {}
    this.update(newFreqs)
  }

  clear() {
    this.freqs = {}
    this.spectrum = []
    this.max = 0
    return this
  }

  // This method can accept an object (e.g. {heads:1, tails:2})
  // or an array (e.g. ['heads', 'tails']). If an array is passed,
  // each element will have the same chance to appear.
  update(newFreqs) {
    if (_.isArray(newFreqs)) {
      newFreqs = newFreqs.reduce((acc, v) => {
        acc[v] = 1;
        return acc;
      }, {})
    }

    Object.assign(this.freqs, newFreqs)
    let spectrum = this.spectrum = []
    this.max = 0

    _.forOwn(this.freqs, (freqValue, freqKey) => {
      if (freqValue < 1) return

      this.max += freqValue
      this.spectrum.push({ key: freqKey, limit: this.max })
    })

    return this
  }

  roll() {
    let r = _.random(0, this.max)
    for (var i = 0; i < this.spectrum.length; i++) {
      if (this.spectrum[i].limit >= r)
        return this.spectrum[i].key
    }
    return this.spectrum[this.spectrum.length - 1].key
  }
}