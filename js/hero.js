// This file has all the hero classes available for the player to
// choose. The skills for each hero class are defined in skills.js

Game.gallery.heroClasses.push({
  id: 'novice',
  name: 'Novice',
  description: 'A young hero who enters the dungeon to prove himself worthy.',

  nextLevelXp: 100,
  level: 1,
  xp: 0,
  attributes: {
    hp: 500,
    atk: 25,
    def: 10,
    spd: 40,

    coins: 37,
    keys: 3,
    stars: 3
  },

  limits: {
    hp : { min: 1, max: between(1000, 2000, 100) },
    atk: { min: 0, max: between(200, 255, 5) },
    def: { min: 0, max: between(200, 255, 5) },
    spd: { min: between(7,9), max: 255 }
  },

  skills: [
  	{name: 'upgrade1', type: 'level-up', stars: 1, gain: { hp: +100 }},
  	{name: 'upgrade2', type: 'level-up', stars: 1, gain: { atk: +4 }},
  	{name: 'upgrade3', type: 'level-up', stars: 1, gain: { def: +4 }},
  	{name: 'upgrade4', type: 'level-up', stars: 1, gain: { spd: -2 }},

    _.find(Game.gallery.skills, {id: 'quick-learner'})
  ]
})

Game.gallery.heroClasses.push({
  id: 'barbarian',
  name: 'Barbarian',
  description: 'A tall, strong hero with high health.',

  nextLevelXp: 100,
  level: 1,
  xp: 0,
  attributes: {
    hp: 600,
    atk: 25,
    def: 10,
    spd: 40,

    coins: 36,
    keys: 2,
    stars: 2
  },

  limits: {
    hp : { min: 1, max: between(1700, 2000, 100) },
    atk: { min: 0, max: between(215, 235, 5) },
    def: { min: 0, max: between(200, 220, 5) },
    spd: { min: between(8,9), max: 255 }
  },

  skills: [
    {name: 'upgrade1', type: 'level-up', stars: 1, gain: { hp: +20, atk: +4 }},
    {name: 'upgrade2', type: 'level-up', stars: 1, gain: { hp: +20, def: +4 }},
    {name: 'upgrade3', type: 'level-up', stars: 1, gain: { hp: +20, spd: -2 }},

    _.find(Game.gallery.skills, {id: 'normal-experience'}),
    _.find(Game.gallery.skills, {id: 'more-gems'}),
    _.find(Game.gallery.skills, {id: 'more-coins'})
  ]

})

Game.gallery.heroClasses.push({
  id: 'berserker',
  name: 'Berserker',
  description: 'A vicious fighter that ignores small wounds in the heat of the battle.',

  nextLevelXp: 100,
  level: 1,
  xp: 0,
  attributes: {
    hp: 500,
    atk: 27,
    def: 12,
    spd: 38,

    coins: 36,
    keys: 2,
    stars: 2
  },

  limits: {
    hp : { min: 1, max: between(1400, 1600, 100) },
    atk: { min: 0, max: 255 },
    def: { min: 0, max: between(190, 210, 5) },
    spd: { min: 8, max: 255 }
  },

  skills: [
    {name: 'upgrade1', type: 'level-up', stars: 1, gain: { hp: +100 }},
    {name: 'upgrade3', type: 'level-up', stars: 2, gain: { atk: +10, def: -1 }},
    {name: 'upgrade3', type: 'level-up', stars: 2, gain: { def: +7 }},
    {name: 'upgrade3', type: 'level-up', stars: 1, gain: { spd: -2 }},

    _.find(Game.gallery.skills, {id: 'normal-experience'}),
    _.find(Game.gallery.skills, {id: 'block'}),
    _.find(Game.gallery.skills, {id: 'more-chests'})
  ]
})

Game.gallery.heroClasses.push({
  id: 'assassin',
  name: 'Assassin',
  description: 'A shadowy figure that thrives on the demise of his targets.',

  nextLevelXp: 100,
  level: 1,
  xp: 0,
  attributes: {
    hp: 400,
    atk: 27,
    def: 12,
    spd: 38,

    coins: 36,
    keys: 2,
    stars: 2
  },

  limits: {
    hp : { min: 1, max: between(1000, 1300, 100) },
    atk: { min: 0, max: between(210, 245, 5) },
    def: { min: 0, max: between(210, 235, 5) },
    spd: { min: between(7,8), max: 255 }
  },

  skills: [
    {name: 'upgrade1', type: 'level-up', stars: 2, gain: { atk: +9 }},
    {name: 'upgrade3', type: 'level-up', stars: 2, gain: { def: +9 }},
    {name: 'upgrade3', type: 'level-up', stars: 2, gain: { spd: -5 }},

    _.find(Game.gallery.skills, {id: 'normal-experience'}),
    _.find(Game.gallery.skills, {id: 'purification'}),
    _.find(Game.gallery.skills, {id: 'evasion'}),
    _.find(Game.gallery.skills, {id: 'leech'})
  ]
})

Game.gallery.heroClasses.push({
  id: 'thief',
  name: 'Thief',
  description: 'Very agile but not very strong. Specializes in lockpicking and stealth.',

  nextLevelXp: 100,
  level: 1,
  xp: 0,
  attributes: {
    hp: 500,
    atk: 25,
    def: 12,
    spd: 36,

    coins: 36,
    keys: 2,
    stars: 2
  },

  limits: {
    hp : { min: 1, max: between(1350, 1500, 100) },
    atk: { min: 0, max: between(190, 210, 5) },
    def: { min: 0, max: between(220, 255, 5) },
    spd: { min: 6, max: 255 }
  },

  skills: [
    {name: 'upgrade1', type: 'level-up', stars: 1, gain: { hp: +60 }},
    {name: 'upgrade2', type: 'level-up', stars: 2, gain: { atk: +7 }},
    {name: 'upgrade3', type: 'level-up', stars: 1, gain: { def: +4 }},
    {name: 'upgrade3', type: 'level-up', stars: 1, gain: { atk: -1, spd: -4 }},

    _.find(Game.gallery.skills, {id: 'normal-experience'}),
    _.find(Game.gallery.skills, {id: 'unlock'}),
    _.find(Game.gallery.skills, {id: 'disarm-trap'}),
    _.find(Game.gallery.skills, {id: 'steal'})
  ]
})

/*
Game.gallery.heroClasses.push({
  id: 'dancer',
  name: 'Dancer'
})

Game.gallery.heroClasses.push({
  id: 'dwarf',
  name: 'Dwarf'
})

Game.gallery.heroClasses.push({
  id: 'ninja',
  name: 'Ninja'
})

Game.gallery.heroClasses.push({
  id: 'master',
  name: 'Master'
})

Game.gallery.heroClasses.push({
  id: 'indiana',
  name: 'Indy'
})
*/

Game.gallery.heroClasses.push({
  id: 'robot',
  name: 'RK9',
  description: 'RK9 DEBUGGING AUTOMATON',

  level: 100,
  attributes: {
    hp: 500,
    atk: 25,
    def: 10,
    spd: 40,

    coins: 37,
    keys: 3,
    stars: 3
  },

  limits: {
    hp : { min: 1, max: between(1000, 2000, 100) },
    atk: { min: 0, max: between(200, 255, 5) },
    def: { min: 0, max: between(200, 255, 5) },
    spd: { min: between(7,9), max: 255 }
  },

  skills: [
    {name: 'upgrade1', type: 'level-up', stars: 1, gain: { hp: +1000 }},
    {name: 'upgrade2', type: 'level-up', stars: 1, gain: { atk: +40 }},
    {name: 'upgrade3', type: 'level-up', stars: 1, gain: { def: +40 }},
    {name: 'upgrade4', type: 'level-up', stars: 1, gain: { spd: -20 }},
    {name: 'upgrade5', type: 'level-up', stars: 1, gain: { coins: +10 }},
    {name: 'upgrade6', type: 'level-up', stars: 1, gain: { stars: +10 }}
  ]
})