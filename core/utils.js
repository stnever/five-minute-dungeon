import _ from 'lodash'

// Returns a random number between startInclusive and endInclusive:
// between(100, 120); -> 100, 101, ..., 120
// between(100, 120, 5); -> 100, 105, 110, 115, 120
export function roll(startInclusive, endInclusive, { step = 1 } = {}) {
  let maxSteps = (endInclusive - startInclusive) / step
  return startInclusive + ((Math.floor(Math.random() * maxSteps)) * step)
}

// Rounds down any fractional numeric values in obj.
export function floorValues(obj) {
  _.forOwn(obj, function (value, key) {
    if (_.isNumber(value)) obj[key] = Math.floor(value)
  })
  return obj
}

// Returns a number constrained by an upper and lower limit.
export function clamp(x, min, max) {
  if (!_.isNumber(min)) {
    max = min.max;
    min = min.min;
  }

  if (x < min) return min;
  if (x > max) return max;
  return x;
}

// http://sroucheray.org/blog/2009/11/array-sort-should-not-be-used-to-shuffle-an-array/
export function badShuffle(arr) {
  arr.sort(function (a, b) {
    return Math.round(Math.random() * 2) - 1;
  });
}





export function canPay(hero, cost) {
  return _.reduce(cost, (acc, value, attr) => {
    if (!acc) return false

    if (attr == 'hp') // for hp, there must be at least one point left
      return hero.attributes.hp > value;
    else
      return hero.attributes[attr] >= value;
  }, true)
}

export function modifyAttributes(hero, deltas) {
  _.forOwn(deltas, (value, key) => {
    if (_.isFunction(value)) value = value(hero)
    hero.attributes[key] += value
  })

  clampAttributes(hero)

  // TODO gain skills (used by events of type 'old-hero')

  Game.trigger('hero-modified')
}

export function clampAttributes(character) {
  let attrs = character.attributes,
      limits = character.limits || Game.dungeon.defaultLimits

  _.forOwn(attrs, (value, key) => {
    if (limits[key] == null) return
    attrs[key] = clamp(attrs[key], limits[key])
  })
}


export function invert(deltas) {
  return _.mapValues(deltas, v => -v)
}

export function calculateCombat(monster, hero) {

  Game.trigger('before-combat-calculation', monster, hero)

  let result = {}

  // always does at least 1 damage
  result.damageToMonsterPerTurn =
    Math.max(hero.attributes.atk - monster.attributes.def, 1)

  result.numberOfHeroTurns =
    Math.ceil(monster.attributes.hp / result.damageToMonsterPerTurn)

  result.totalTime =
    result.numberOfHeroTurns * hero.attributes.spd

  result.numberOfMonsterTurns =
    Math.floor(result.totalTime / Math.max(monster.attributes.spd, 1))

  result.damageToHeroPerTurn =
    Math.max(monster.attributes.atk - hero.attributes.def, 1)

  result.totalDamageToHero =
    result.numberOfMonsterTurns * result.damageToHeroPerTurn

  result.attackable =
    (hero.attributes.hp > result.totalDamageToHero)

  Game.trigger('after-combat-calculation', [result, monster, hero])
  return result
}