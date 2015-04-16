// This object holds the game's gallery (all the possible items,
// monsters, bosses and skills), the current dungeon, saved
// games/state, and serves as the event emitter and registry.

var Game = {
  gallery: {
    heroClasses: [],    // see hero.js
    monsterClasses: [], // see monsters.js
    bossClasses: [],    // see bosses.js
    items: [],          // see items.js
    loot: [],           // see items.js
    skills: []          // see skills.js
  },

  listeners: {}
}

// Possible GameEvents:
// enter-dungeon: triggered once when the dungeon is
// being set up.
//
// dungeon-event-appear: triggered when an event is added to
// the visible events list.
//
// dungeon-event-selected: triggered when the player
// chooses to activate a dungeon event
//
// dungeon-event-end: triggered after a dungeon event
// has finished.
//
// monster-kill: triggered when a monster is killed.
//
// item-acquired: triggered when the hero acquires an item,
// either from a monster, boss, chest, merchant or trap. This
// includes both equipment and gems.
//
// hero-modified: triggered whenever one of the hero's
// attributes changes.
//
// before-combat-calculation: triggered just before combat
// between a hero and a monster is calculated.
//
// after-combat-calculation: triggered after combat has been
// calculated.

// If a listener returns this constant, it signals the game
// engine that the listener should be removed. This can be used
// to create listeners that run only once.
Game._REMOVE = {}

// Registers a listener.
Game.on = function(evt, listener) {
  var l = Game.listeners[evt];
  if ( l == null ) {
    l = [];
    Game.listeners[evt] = l;
  }
  l.push(listener);
  return listener;
}

// De-registers a listener.
Game.off = function(evt, listener) {
  var l = Game.listeners[evt];
  if ( l == null ) return false;
  for ( var i = l.length-1; i >= 0; i-- ) {
    if ( l[i] == listener ) {
      l.splice(i, 1);
      return true;
    }
  }
}

// Notifies listeners of a certain event.
Game.trigger = function(evt, args) {
  // console.log('event triggered', evt, args);
  var l = Game.listeners[evt] || [];
  args = _.isArray(args) ? args : [args];
  for ( var i = l.length-1; i >= 0; i-- ) {
    var result = l[i].apply(null, args);

    if ( result === Game._REMOVE )
      l.splice(i, 1);
  }
}

