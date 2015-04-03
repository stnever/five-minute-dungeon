// These are the basic loot items, that can drop from any monster.
Game.gallery.loot.push(
  {id: 'gem-yellow'   , name: 'Yellow Gem'   , gain: { hp: +50 } },
  {id: 'gem-red'      , name: 'Red Gem'      , gain: { atk: +2 } },
  {id: 'gem-blue'     , name: 'Blue Gem'     , gain: { def: +2 } },
  {id: 'gem-green'    , name: 'Green Gem'    , gain: { spd: -1 } },
  {id: 'gem-silver'   , name: 'Silver Gem'   , gain: { hp: +50, atk: +2, def: +2, spd: -1 } },
  {id: 'coin-copper'  , name: 'Copper Coin'  , gain: { coins: +1 } },
  {id: 'coin-silver'  , name: 'Silver Coin'  , gain: { coins: +2 } },
  {id: 'coin-gold'    , name: 'Gold Coin'    , gain: { coins: +3 } }
)

// These can be found in merchants, chests, and traps.
Game.gallery.items.push(
  {id: 'wooden-sword'       , name: 'Wooden Sword'     , coins: 6, gain: { hp: +25, atk: +3 } },
  {id: 'wooden-shield'      , name: 'Wooden Shield'    , coins: 6, gain: { hp: +25, def: +3 } },
  {id: 'wooden-ring'        , name: 'Wooden Ring'      , coins: 6, gain: { hp: +25, def: +1, spd: -2 } },

  {id: 'iron-sword'         , name: 'Iron Sword'       , coins: 8, gain: { atk: +6 } },
  {id: 'iron-shield'        , name: 'Iron Shield'      , coins: 8, gain: { def: +6 } },
  {id: 'iron-boots'         , name: 'Iron Boots'       , coins: 8, gain: { spd: -4 } },
  {id: 'iron-ring'          , name: 'Iron Ring'        , coins: 8, gain: { atk: +3, def: +3 } },

  {id: 'great-sword'        , name: 'Great Sword'      , coins: 10, gain: { atk: +9, spd: +3 } },
  {id: 'wind-dagger'        , name: 'Wind Dagger'      , coins: 10, gain: { atk: +6, spd: -2 } },
  {id: 'tower-shield'       , name: 'Tower Shield'     , coins: 10, gain: { def: +9, spd: +3 } },

  {id: 'mithril-sword'      , name: 'Mithril Sword'    , coins: 12, gain: { hp: +99, atk: +7 } },
  {id: 'mithril-shield'     , name: 'Mithril Shield'   , coins: 12, gain: { hp: +99, def: +7 } },
  {id: 'mithril-boots'      , name: 'Mithril Boots'    , coins: 12, gain: { hp: +99, spd: -4 } },

  {id: 'yellow-ring'        , name: 'Yellow Ring'      , coins: 12, gain: { hp: +500 } },
  {id: 'red-ring'           , name: 'Red Ring'         , coins: 12, gain: { atk: +10 } },
  {id: 'blue-ring'          , name: 'Blue Ring'        , coins: 12, gain: { def: +10 } },
  {id: 'green-ring'         , name: 'Green Ring'       , coins: 12, gain: { spd: -5 } },
  {id: 'black-ring'         , name: 'Black Ring'       , coins: 12, cursed: true, gain: { hp: -99, atk: +4, def: +4, spd: -2 } },
  {id: 'white-ring'         , name: 'White Ring'       , coins: 12, gain: { atk: +4, def: +4, spd: -2 } },

  {id: 'dragons-fury'       , name: 'Dragon\'s Fury'   , coins: 16, gain: { atk: +20, def: -5 } },
  {id: 'winters-breath'     , name: 'Winter\'s Breath' , coins: 16, gain: { atk: +10, def: +8, spd: +1 } },
  {id: 'storms-roar'        , name: 'Storm\'s Roar'    , coins: 16, gain: { atk: +8 , spd: -6 } },
  {id: 'shadow-dagger'      , name: 'Shadow Dagger'    , coins: 16, cursed: true, gain: { hp: -99, atk: +16, spd: -2 }, cursed: true },
  {id: 'black-shield'       , name: 'Black Shield'     , coins: 16, gain: { def: +20 , spd: +6 } },
  {id: 'white-shield'       , name: 'White Shield'     , coins: 16, gain: { hp: +40 , def: +14, spd: -1 } },
  {id: 'wind-boots'         , name: 'Wind Boots'       , coins: 16, gain: { def: +5 , spd: -8 } },

  {id: 'holy-sword'         , name: 'Holy Sword'       , description: 'Blessed by the Goddess.', coins: 18, gain: { hp: +99, atk: +20 } },
  {id: 'holy-shield'        , name: 'Holy Shield'      , coins: 18, gain: { hp: +99, def: +20 } },
  {id: 'goddess-ring'       , name: 'Ring of Goddess'  , coins: 18, gain: { hp: +99, atk: +10, def: +10, spd: -2 } },

  {id: 'skull-sword'        , name: 'Skull Sword'      , coins: 18, cursed: true, gain: { hp: -200 , atk: +22 } },
  {id: 'skull-shield'       , name: 'Skull Shield'     , coins: 18, cursed: true, gain: { hp: -200 , def: +22 } },
  {id: 'skull-ring'         , name: 'Skull Ring'       , coins: 18, cursed: true, gain: { hp: -200 , atk: +10, def: +10, spd: -4 } },

  {id: 'ring-of-life'       , name: 'Ring of Life'     , coins: 22, gain: { hp: function() { return 999 - Game.dungeon.hero.attributes.hp} }, limitless: true },
  {id: 'ring-of-attack'     , name: 'Ring of Attack'   , coins: 22, gain: { atk: function() { return 0.1 * Game.dungeon.hero.attributes.atk} }, limitless: true },
  {id: 'ring-of-defense'    , name: 'Ring of Defense'  , coins: 22, gain: { def: function() { return 0.1 * Game.dungeon.hero.attributes.def} }, limitless: true },
  {id: 'ring-of-speed'      , name: 'Ring of Speed'    , coins: 22, gain: { spd: -2 }, limitless: true }
)