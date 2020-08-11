import MiniEE from './MiniEE'

// This object holds the game's gallery (all the possible items,
// monsters, bosses and skills), the current dungeon, saved
// games/state, and serves as the event emitter and registry.

let ee = new MiniEE()

export default Game = {
  gallery: {
    heroClasses: [],    // see hero.js
    monsterClasses: [], // see monsters.js
    bossClasses: [],    // see bosses.js
    items: [],          // see items.js
    loot: [],           // see items.js
    skills: []          // see skills.js
  },

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
  on      : (evt, l) => ee.on(evt, l),
  off     : (evt, l) => ee.off(evt, l),
  trigger : (evt, args) => ee.trigger(evt, args)
}

