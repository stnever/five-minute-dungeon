// This function takes the hero and sets up the dungeon,
// plugging all listeners to make the game run.
function enterDungeon(heroClass, dungeonGenerator) {
  var hero = instantiate(heroClass);
  var dungeon = Game.dungeon = {
    hero: hero,
    events: [],

    // Standard loot frequencies.
    frequencies: {
      loot: {
        'nothing': 10,
        'gem-red': 3,
        'gem-blue': 3,
        'gem-green': 3,
        'gem-silver': 1,
        'coin-copper': 5,
        'coin-silver': 3,
        'coin-gold': 1
      },

      // Standard event frequencies.
      events: {
        monster: 130,
        merchant: 20,
        chest: 10,
        trap: 1
      }
    },

    // The current age of the dungeon (number of events added)
    age: 0,
    maxAge: 130,
    generatorFn: dungeonGenerator
  }

  dungeon.eventsSampler = sampler(dungeon.frequencies.events);
  dungeon.lootSampler = sampler(dungeon.frequencies.loot);

  // Whenever a hero enters the dungeon, plug all the listeners
  // from all her skills.
  hero.skills.forEach(function(skill) {
    _.functions(skill).forEach(function(fnName) {
      var gameEventName = _.kebabCase(fnName.replace(/^on/, ''));
      var fn = skill[fnName];
      Game.on(gameEventName, fn);
    });
  });

  // Trigger the enter-dungeon event, so that skills that modify
  // the drop and event frequencies may run.
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

// This is a dungeon generator function that uses the frequency
// data from the dungeon object, and also places bosses in the
// approximate location.
function randomDungeonGenerator() {

  if ( Game.dungeon.monsterSampler == null ) {
    // Sets up the monster sampler the first time this is run. Each
    // dungeon run can use up to 3 different monster classes.
    var allowedMonsterClasses = _.sample(Game.gallery.monsterClasses, 3);
    console.log('monsterClasses: %s, %s, %s',
      allowedMonsterClasses[0].id, allowedMonsterClasses[1].id, allowedMonsterClasses[2].id)
    Game.dungeon.monsterSampler = function() {
      return _.sample(allowedMonsterClasses);
    }
  }

  // Sets up the position and level of each boss. The bosses themselves
  // will be created later.
  if ( Game.dungeon.bossPositions == null ) {
    var bossIds = _.chain(Game.gallery.bossClasses).pluck('id').shuffle().value();
    Game.dungeon.bossPositions = bossIds.map(function(id, i) {
      return {
        id: id,
        level: i,
        position: 40 + (i * 10) + _.random(-5, 5)
      }
    })
    // Game.dungeon.bossPositions = [
    //   {id: 'knight-yellow', level: 1, position: 1},
    //   {id: 'knight-red', level: 2, position: 2},
    //   {id: 'knight-blue', level: 3, position: 3},
    //   {id: 'knight-green', level: 4, position: 4},
    //   {id: 'demon', level: 5, position: 5},
    //   {id: 'cait-sith', level: 6, position: 6},
    //   {id: 'wailing-wall', level: 7, position: 7},
    //   {id: 'skeleton-king', level: 8, position: 8},
    //   {id: 'skuleton', level: 5, position: 9}
    // ]
  }

  var events = [];

  // Uses the event frequency to build the event object.
  var event = {
    type: Game.dungeon.eventsSampler()
  }


  // Checks if a boss should appear now and overrides the type above.
  if ( Game.dungeon.bossPositions.length > 0 &&
       Game.dungeon.bossPositions[0].position == Game.dungeon.age ) {
    var bp = Game.dungeon.bossPositions[0];
    Game.dungeon.bossPositions.splice(0, 1);
    event.type = 'boss';
    var bossClass = _.find(Game.gallery.bossClasses, {id: bp.id});
    console.log(bossClass);
    createBoss(event, bossClass, bp.level, Game.dungeon.lootSampler);
  }


  if ( event.type == 'monster' ) {
    var monsterClass = Game.dungeon.monsterSampler();
    var level = Math.floor(Game.dungeon.age / (130/20)) +1;
    createMonster(event, monsterClass, level, Game.dungeon.lootSampler);
  } else if ( event.type == 'merchant' ) {
    createMerchant(event, Game.dungeon.age);
  } else if ( event.type == 'chest' ) {
    createChest(event, Game.dungeon.age);
  } else if ( event.type == 'trap' ) {
    createTrap(event, Game.dungeon.age);
  }

  events.push(event);
  Game.dungeon.age++;

  // Coloca bosses em posições específicas
  // addBosses(events)

  return events;
}

function createBoss(event, bossClass, level, lootSampler) {

  event.monster = instantiate(bossClass, level);

  // Loot
  var loot = lootSampler();
  if ( loot != 'nothing' ) {
    event.loot = _.clone(_.find(Game.gallery.loot, {id: loot}));
  }

  // Combat
  event.combat = calculateCombat(event.monster, Game.dungeon.hero);

  return event;
}

function createMonster(event, monsterClass, level, lootSampler) {

  event.monster = instantiate(monsterClass, level);

  // Loot
  var loot = lootSampler();
  if ( loot != 'nothing' ) {
    event.loot = _.clone(_.find(Game.gallery.loot, {id: loot}));
  }

  // Combat
  event.combat = calculateCombat(event.monster, Game.dungeon.hero);

  return event;
}

function createMerchant(event, age) {
  event.item = _.clone(_.sample(Game.gallery.items));
  event.cost = { coins: event.item.coins };
  return event;
}

function createChest(event, age) {
  event.item = _.clone(_.sample(Game.gallery.items));
  event.cost = { keys: 1 };
  return event;
}

function createTrap(event, age) {
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
    pay(hero, event.cost);
    gain(hero, event.item.gain);

  } else {

    // Just in case the combat isn't already calculated
    // and stored.
    var combat = event.combat ||
      calculateCombat(event.monster, hero);

    if ( hero.attributes.hp <= combat.totalDamageToHero )
      return;

    // Pays the HP cost of defeating a monster and
    // acquires the loot, if any.
    pay(hero, {hp: combat.totalDamageToHero});
    if ( event.loot )
      gain(hero, event.loot.gain);

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

  pay(hero, cost);
  gain(hero, skill.gain);
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

function gain(hero, gains) {
  _.forOwn(gains, function(value, key) {
    if ( _.isFunction(value)) value = value(hero);
    hero.attributes[key] += value;

    if ( hero.attributes[key] > hero.limits[key] )
      hero.attributes[key] = hero.limits[key];

    if ( key == 'hp' && hero.attributes.hp < 1 )
      hero.attributes.hp = 1;
    else if ( hero.attributes[key] < 0 )
      hero.attributes[key] = 0;
  })

  // TODO gain skills (used by events of type 'old-hero')

  Game.trigger('hero-modified');
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

function pay(hero, cost) {
  _.forOwn(cost, function(value, key) {
    if ( _.isFunction(value) ) value = value(hero);
    hero.attributes[key] -= value;
  })

  Game.trigger('hero-modified');
}

// This function receives a "class object" (hero, monster, or boss) and
// creates a new object of that class. All properties of the class are
// cloned and copies to the object. Methods that begin with "on" (such
// as "onHeroModified") are assumed to be listeners and are registered
// appropriately. Finally, if there is a "create()" method on the class,
// it is called passing the object as the first parameter.
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

  if ( theClass.create )
    theClass.create(object);

  // Rounds down fractional values.
  if ( object.attributes )
    floor(object.attributes);

  return object;
}