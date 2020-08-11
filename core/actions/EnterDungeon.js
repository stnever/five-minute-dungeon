// This function takes the hero and sets up the dungeon,
// plugging all listeners to make the game run.
export default function EnterDungeon(heroClass, dungeonGenerator) {

  let dungeon = Game.dungeon = {
    events: [],

    // Standard loot frequencies.
    lootTable: new LootTable({
      'nothing': 10,
      'gem-red': 3,
      'gem-blue': 3,
      'gem-green': 3,
      'gem-silver': 2,
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
      hp: { min: 1, max: 1600 },
      atk: { min: 0, max: 255 },
      def: { min: 0, max: 255 },
      spd: { min: 6, max: 255 }
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
  newEvents.forEach(function (e) {
    Game.trigger('dungeon-event-appear', e);
  })

  // ...and call it once every time an event is discarded, up
  // until we exhaust the number of events.
  Game.on('dungeon-event-end', function () {
    var newEvents = dungeon.generatorFn();
    Array.prototype.push.apply(Game.dungeon.events, newEvents);
    newEvents.forEach(function (e) {
      Game.trigger('dungeon-event-appear', e);
    })
  })

  // This listener will recalculate combat data whenever the
  // hero is modified.
  Game.on('hero-modified', function () {
    Game.dungeon.events.forEach(function (e) {
      if (e.type == 'monster' || e.type == 'boss')
        e.combat = calculateCombat(e.monster, Game.dungeon.hero);
    })
  })

  // For the time being the hero cannot gain any keys, so
  // if his keys are depleted we can remove all Chest events
  // and set their frequency to zero.
  Game.on('hero-modified', function () {
    if (Game.dungeon.hero.attributes.keys > 0) return;

    // HACK: If the hero has the 'unlock' or 'dark presence' traits,
    // chests are free, so we shouldn't do anything. To avoid testing
    // for the traits themselves, we'll instead test for "chests
    // that do not cost keys".

    _.remove(Game.dungeon.events, function (e) {
      return e.type == 'chest' &&
        (e.cost.keys == null || e.cost.keys < 1)
    });

    Game.dungeon.eventsTable.update({ chest: 0 });
  })

}