// This file has all the hero classes available for the player to
// choose. The skills for each hero class are defined in skills.js

Game.gallery.heroClasses.push({
  id: 'novice',
  name: 'Novice',
  description: '',

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
    stars: 33
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
  name: 'Barbarian'
})

Game.gallery.heroClasses.push({
  id: 'berserker',
  name: 'Berserker'
})

Game.gallery.heroClasses.push({
  id: 'assassin',
  name: 'Assassin'
})

Game.gallery.heroClasses.push({
  id: 'thief',
  name: 'Thief'
})

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