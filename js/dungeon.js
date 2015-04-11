// This function takes the hero and sets up the dungeon,
// plugging all listeners to make the game run.
function enterDungeon(heroClass, dungeonGenerator) {

  var dungeon = Game.dungeon = {
    events: [],

    // Standard loot frequencies.
    lootTable: new LootTable({
      'nothing': 10,
      'gem-red': 3,
      'gem-blue': 3,
      'gem-green': 3,
      'gem-silver': 1,
      'coin-copper': 5,
      'coin-silver': 3,
      'coin-gold': 1
    }),

    // Standard event frequencies.
    eventsTable: new LootTable({
      monster: 130,
      merchant: 15,
      chest: 10,
      trap: 1
    }),

    // Default attribute limits. These are only applied if a
    // monster/boss/hero does not provide its own.
    defaultLimits: {
      hp: 1600,
      atk: 255,
      def: 255,
      spd: 6
    },

    // The current age of the dungeon (number of events added)
    age: 0,
    maxAge: 130,
    generatorFn: dungeonGenerator
  }

  // Creates the hero after the dungeon so that skills that modify
  // loot frequencies (e.g. "Lucky") may run.
  dungeon.hero = instantiate(heroClass);

  Game.trigger('enter-dungeon');

  // Each call to the dungeon-generator function produces zero
  // or more events, to be added to the visible events list. We'll
  // call it 20 times now...
  var newEvents = _.flatten(_.times(20, dungeon.generatorFn));
  Array.prototype.push.apply(Game.dungeon.events, newEvents);
  newEvents.forEach(function(e) {
    Game.trigger('dungeon-event-appear', e);
  })

  // ...and call it once every time an event is discarded, up
  // until we exhaust the number of events.
  Game.on('dungeon-event-end', function() {
    var newEvents = dungeon.generatorFn();
    Array.prototype.push.apply(Game.dungeon.events, newEvents);
    newEvents.forEach(function(e) {
      Game.trigger('dungeon-event-appear', e);
    })
  })

  // This listener will recalculate combat data whenever the
  // hero is modified.
  Game.on('hero-modified', function() {
    Game.dungeon.events.forEach(function(e) {
      if (e.type == 'monster' || e.type == 'boss')
        e.combat = calculateCombat(e.monster, Game.dungeon.hero);
    })
  })

}

// This is a dungeon generator function that uses event-type and
// loot tables from the dungeon object, and also places bosses
// in the appropriate location.
function randomDungeonGenerator() {

  if ( Game.dungeon.monsterLevelVariance == null ) {
    // Sets up a loot table to add a little variation to the monsters' level.
    Game.dungeon.monsterLevelVariance = new LootTable({
      '+1': 1,
      '0': 2,
      '-1': 1
    })
  }

  if ( Game.dungeon.monsterTable == null ) {
    // Sets up the monster table the first time this is run. Each
    // dungeon run can use up to 3 different monster classes.
    var allowedMonsterClasses =
      _.chain(Game.gallery.monsterClasses).sample(3).pluck('id').value();
    Game.dungeon.monsterTable = new LootTable(allowedMonsterClasses);
  }

  // Sets up the position and level of each boss. The bosses themselves
  // will be created later. Note that this DungeonGenerator always places
  // the SkeletonKing and Skuleton at the end.
  if ( Game.dungeon.bossPositions == null ) {
    var bossIds = _.chain(Game.gallery.bossClasses)
      .pluck('id').without('skeleton-king', 'skuleton').shuffle().value();
    Game.dungeon.bossPositions = bossIds.map(function(id, i) {
      return {
        id: id,
        level: i+1,
        position: 40 + (i * 10) + _.random(-5, 5)
      }
    })

    Game.dungeon.bossPositions.push({
      id: 'skeleton-king', level: 22,
      position: _.last(Game.dungeon.bossPositions).position + 10
    })

    Game.dungeon.bossPositions.push({
      id: 'skuleton', level: _.random(1, 20),
      position: _.last(Game.dungeon.bossPositions).position + 1
    })

  }

  var events = [];

  // Uses the event frequency to build the event object.
  var type = Game.dungeon.eventsTable.roll()

  // Checks if a boss should appear now and overrides the type above.
  if ( Game.dungeon.bossPositions.length > 0 &&
       Game.dungeon.bossPositions[0].position <= Game.dungeon.age ) {
    var bp = Game.dungeon.bossPositions[0];
    Game.dungeon.bossPositions.splice(0, 1);
    var bossClass = _.find(Game.gallery.bossClasses, {id: bp.id});
    var event = createBoss(bossClass, bp.level);
  }

  if ( type == 'monster' ) {
    events.push(createMonster());
  } else if ( type == 'merchant' ) {
    events.push(createMerchant());
    Game.dungeon.age++;
    events.push(createMonster());
  } else if ( type == 'chest' ) {
    events.push(createChest());
  } else if ( type == 'trap' ) {
    events.push(createTrap());
  }

  Game.dungeon.age++;

  return events;
}

function createBoss(bossClass, level) {
  var event = {
    type: 'monster',
    monster: instantiate(bossClass, level)
  }

  // If the boss has a loot table of his own, use it; if not,
  // use the standard dungeon loot table.
  var table = event.monster.lootTable || Game.dungeon.lootTable;
  var loot = table.roll();
  if ( loot != 'nothing' ) {
    event.loot = _.clone(_.find(Game.gallery.loot, {id: loot}));
  }

  // Combat
  event.combat = calculateCombat(event.monster, Game.dungeon.hero);

  return event;
}

function createMonster() {

  var monsterClassId = Game.dungeon.monsterTable.roll();
  var monsterClass = _.find(Game.gallery.monsterClasses, {id: monsterClassId});
  var level = Math.floor(Game.dungeon.age / (130/20)) +1;
  var variance = parseInt(Game.dungeon.monsterLevelVariance.roll());
  level = constrain( level + variance, 1, 20);

  var event = {
    type: 'monster',
    monster: instantiate(monsterClass, level)
  }

  checkLimits(event.monster);

  // Loot
  var loot = Game.dungeon.lootTable.roll();
  if ( loot != 'nothing' ) {
    event.loot = _.clone(_.find(Game.gallery.loot, {id: loot}));
  }

  // Combat
  event.combat = calculateCombat(event.monster, Game.dungeon.hero);

  return event;
}

function createMerchant() {
  var event = {
    type: 'merchant',
    item: _.clone(_.sample(Game.gallery.items))
  }
  event.cost = { coins: event.item.coins };
  return event;
}

function createChest() {
  var event = { type: 'chest' };
  event.item = _.clone(_.sample(Game.gallery.items));
  event.cost = { keys: 1 };
  return event;
}

function createTrap() {
  var event = { type: 'trap' }
  // Traps only contain high level items.
  event.item = _.chain(Game.gallery.items)
    .filter(function(i) { return i.coins >= 22 })
    .sample()
    .clone().value();

  event.age = 1;
  event.costPerTurn = 4;
  event.cost = { hp: 4 };

  // Traps become stronger with each passing turn.
  Game.on('dungeon-event-end', function() {
    event.age++;
    event.cost.hp = event.age * event.costPerTurn;
  });

  return event;
}

// This function activates a dungeon event in response
// to a player's choice.
Game.activateDungeonEvent = function(event) {
  var hero = Game.dungeon.hero;

  // Prevents activation of events whose cost can't be paid.
  if ( !canPay(hero, event.cost) )
    return;

  Game.trigger('dungeon-event-selected', event);

  if (event.type == 'chest' ||
      event.type == 'merchant' ||
      event.type == 'trap') {
    Game.trigger('item-acquired', event.item, event);

    // Pays the cost and acquires the item.
    modifyAttributes(hero, invert(event.cost));
    modifyAttributes(hero, event.item.gain);

  } else {

    // Just in case the combat isn't already calculated
    // and stored.
    var combat = event.combat ||
      calculateCombat(event.monster, hero);

    if ( hero.attributes.hp <= combat.totalDamageToHero )
      return;

    // Pays the HP cost of defeating a monster and
    // acquires the loot, if any.
    modifyAttributes(hero, {hp: -combat.totalDamageToHero});
    if ( event.loot )
      modifyAttributes(hero, event.loot.gain);

    // Broadcasts that a monster has been killed.
    Game.trigger('monster-kill', event.monster);
  }

  // Broadcasts the end of the event and discards it.
  Game.trigger('dungeon-event-end', event);
  _.pull(Game.dungeon.events, event);
}

// This function runs an active skill in response to a
// player's selection.
Game.activateSkill = function(skill) {
  var hero = Game.dungeon.hero;
  var cost = {stars: skill.stars}
  if ( !canPay(hero, cost) )
    return;

  modifyAttributes(hero, invert(cost));
  modifyAttributes(hero, skill.gain);
}

function calculateCombat( monster, hero ) {

  Game.trigger('before-combat-calculation', monster, hero);

  var result = {};

  // always does at least 1 damage
  result.damageToMonsterPerTurn =
    Math.max( hero.attributes.atk - monster.attributes.def, 1 );

  result.numberOfHeroTurns =
    Math.ceil( monster.attributes.hp / result.damageToMonsterPerTurn );

  result.totalTime =
    result.numberOfHeroTurns * hero.attributes.spd;

  result.numberOfMonsterTurns =
    Math.floor( result.totalTime / Math.max( monster.attributes.spd, 1 ) );

  result.damageToHeroPerTurn =
    Math.max( monster.attributes.atk - hero.attributes.def, 1 );

  result.totalDamageToHero =
    result.numberOfMonsterTurns *  result.damageToHeroPerTurn;

  result.attackable =
    ( hero.attributes.hp > result.totalDamageToHero );

  Game.trigger('after-combat-calculation', result, monster, hero);
  return result;
}

function modifyAttributes(hero, deltas) {
  _.forOwn(deltas, function(value, key) {
    if ( _.isFunction(value)) value = value(hero);
    hero.attributes[key] += value;
  })

  checkLimits(hero);

  // TODO gain skills (used by events of type 'old-hero')

  Game.trigger('hero-modified');
}

function checkLimits(character) {
  var att = character.attributes;
  var lim = character.limits || Game.dungeon.defaultLimits;
  _.forOwn(character.attributes, function(value, key) {
    if ( lim[key] == null) return;
    att[key] = constrain(att[key], lim);
  });
}

function canPay(hero, cost) {
  return _.reduce(cost, function(acc, value, attr) {
    if ( !acc ) return false;

    if ( attr == 'hp' ) // for hp, there must be at least one point left
      return hero.attributes.hp > value;
    else
      return hero.attributes[attr] >= value;
  }, true)
}

function invert(deltas) {
  return _.mapValues(deltas, function(value) {
    return -value;
  })
}


// This function receives a "class object" (hero, monster, or boss) and
// creates a new object of that class following these steps:
// 1. All properties of the class are cloned and copied to the object.
// 2. Methods that begin with `on` (such as `onHeroModified`) are
// assumed to be listeners and are registered appropriately.
// 3. If the class has a `skills` list, run step 2 above for every skill.
// 4. Finally, if the class has a `create()` method, it will called
// passing the object-being-built as the first parameter.
var instantiate = function(theClass, level) {
  var object = {level: level};

  _.assign(object, _.clone(theClass));

  _.functions(theClass).forEach(function(fname) {
    if ( fname.indexOf('on') != 0 ) return;
    var gameEventName = _.kebabCase(fname.replace(/^on/, ''));

    // "this" inside the listener becomes the object being instantiated.
    var fn = _.bind(theClass[fname], object);

    Game.on(gameEventName, fn);
  })

  if ( theClass.skills ) {
    theClass.skills.forEach(function(skill) {
      _.functions(skill).forEach(function(fnName) {
        var gameEventName = _.kebabCase(fnName.replace(/^on/, ''));

        // "this" inside the listener becomes the skill object.
        var fn = _.bind(skill[fnName], skill);
        Game.on(gameEventName, fn);
      });
    });
  }

  if ( theClass.create )
    theClass.create(object);

  // Rounds down fractional values.
  if ( object.attributes )
    floor(object.attributes);

  return object;
}