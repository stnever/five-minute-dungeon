import Game from '../core/Game'

// These are all the game skills, and the listeners that make
// them work. Note that some "monster" skills, particularly
// the Knight's "Mirror" skills, are defined in the bosses
// file instead, because they would make no sense to a playable
// hero to have.

function levelUp(hero, remainingXp) {
  hero.xp = remainingXp;
  hero.level++;
  hero.attributes.stars += 3;
}

function gainXp(hero, monster) {
  // Higher level monsters give more XP.
  var xp = 20 + Math.max(monster.level - hero.level, 0);
  hero.xp += xp;
  Game.trigger('hero-modified');
}

export let NormalExperience = {
  id: 'normal-experience',
  name: 'Normal experience',
  description: 'Earn XP and level up from killing monsters',
  onMonsterKill: function (monster) {
    gainXp(Game.dungeon.hero, monster);
  },

  onHeroModified: function () {
    var hero = Game.dungeon.hero;
    var expToNextLevel = 95 + (5 * hero.level);
    if (hero.xp >= expToNextLevel)
      levelUp(hero, hero.xp - expToNextLevel);
  }
}

export let QuickLearner = {
  id: 'quick-learner',
  name: 'Quick Learner',
  description: 'Requires less experience to level up.',
  onMonsterKill: function (monster) {
    gainXp(Game.dungeon.hero, monster);
  },

  onHeroModified: function () {
    var hero = Game.dungeon.hero;
    var expToNextLevel = 95 + (4 * hero.level);
    if (hero.xp >= expToNextLevel)
      levelUp(hero, hero.xp - expToNextLevel);
  }
}

export let Killer = {
  id: 'killer', name: 'Killer', description: 'Does not level up; uses kill count to obtain upgrades.',
  onMonsterKill: function (monster) {
    Game.dungeon.hero.attributes.kills++;
  }
}

export let GemSeeker = {
  id: 'more-gems', name: 'Gem Seeker', description: 'Find more gems.',
  onEnterDungeon: function () {
    var newFreqs = _.mapValues(Game.dungeon.lootTable.freqs, function (value, key) {
      var isGem = (key.indexOf('coin') != -1);
      return isGem ? value * 2 : value;
    })
    Game.dungeon.lootTable.update(newFreqs);
  }
}

export let Rich = {
  id: 'more-coins', name: 'Rich', description: 'Find more coins.',
  onEnterDungeon: function () {
    var newFreqs = _.mapValues(Game.dungeon.lootTable.freqs, function (value, key) {
      var isCoin = (key.indexOf('coin') != -1);
      return isCoin ? value * 2 : value;
    })
    Game.dungeon.lootTable.update(newFreqs);
  }
}

export let Lucky = {
  id: 'more-chests', name: 'Lucky', description: 'Find more chests.',
  onEnterDungeon: function () {
    var f = Game.dungeon.eventsTable.freqs.chest;
    Game.dungeon.eventsTable.update({ chest: 2 * f });
  }
}

export let Shopping = {
  id: 'more-merchants', name: 'Shopping', description: 'Find more shops.',
  onEnterDungeon: function () {
    var f = Game.dungeon.eventsTable.freqs.merchant;
    Game.dungeon.eventsTable.update({ merchant: 2 * f });
  }
}

export let Bargain = {
  id: 'bargain', name: 'Bargain', description: 'Talk to merchants to reduce equipment price.',
  onDungeonEventAppear: function (event) {
    if (event.type == 'merchant')
      event.cost.coins -= 2;
  }
}

export let DisarmTrap = {
  id: 'disarm-trap',
  name: 'Disarm Trap',
  description: 'Use keys, if available, to disarm traps.',
  onDungeonEventAppear: function (event) {
    if (event.type == 'trap' && Game.dungeon.hero.attributes.keys > 0) {
      event.costPerTurn = 0;
      event.cost.keys = 1;
    }
  },

  onDungeonEventEnd: function () {
    Game.dungeon.events.forEach(function (event) {
      if (event.type != 'trap') return;

      if (Game.dungeon.hero.attributes.keys > 0) {
        event.costPerTurn = 0;
        event.cost.keys = 1;
      } else {
        event.costPerTurn = 4;
        event.cost.keys = null;
        event.cost.hp = event.age * event.costPerTurn;
      }
    })
  }
}

export let Unlock = {
  id: 'unlock', name: 'Unlock', description: 'Open chests without keys.',
  onDungeonEventAppear: function (event) {
    if (event.type == 'chest')
      event.cost = {}
  }
}

export let Evasion = {
  id: 'evasion', name: 'Evasion', description: 'Traps do not hurt the hero',
  onDungeonEventAppear: function (event) {
    if (event.type == 'trap') {
      event.costPerTurn = 0;
      event.cost = {}
    }
  }
}

export let DarkPresence = {
  id: 'dark-presence', name: 'Dark Presence', description: 'Open doors, disarm traps, get shop items without cost.',
  onDungeonEventAppear: function (event) {
    if (event.type == 'merchant' ||
      event.type == 'chest' ||
      event.type == 'trap') {
      event.costPerTurn = 0;
      event.cost = {}
    }
  }
}

export let Purification = {
  id: 'purification', name: 'Purification', description: 'Purify cursed items.',
  onDungeonEventAppear: function (event) {
    var item = event.loot || event.item;

    if (item && item.cursed)
      item.gain.hp = 0;
  }
}

export let Undead = {
  id: 'undead', name: 'Undead', description: 'Cannot recover life.',
  onItemAcquired: function (item) {
    item.gain.hp = 0;
  }
}

export let Steal = {
  id: 'steal', name: 'Steal', description: 'If you can\'t afford an item, spend a key to steal it.',

  onDungeonEventAppear: function (e) {
    // Aumenta o custo normal deste evento
    if (e.type != 'merchant') return;
    e.originalCost = e.cost.coins;
    e.cost.coins += 2;
  },

  onDungeonEventEnd: function () {
    Game.dungeon.events.forEach(function (e) {
      if (e.type != 'merchant') return;

      // If the cost is greater than the amount of coins the hero
      // has, but she still has keys, then change the cost to
      // 1 key.
      var attrs = Game.dungeon.hero.attributes;
      if (e.cost.coins > attrs.coins && attrs.keys > 0) {
        e.cost = { keys: 1 }
      } else {
        e.cost = { coins: e.originalCost }
      }
    })
  }
}

export let LifeLeech = {
  id: 'leech', name: 'Life Leech', description: 'Gain life when monsters deal no damage.',
  onAfterCombatCalculation: function (combat) {
    if (combat.totalDamageToHero < 1)
      combat.totalDamageToHero = -4;
  }
}

export let Block = {
  id: 'block', name: 'Block', description: 'Ignore the 1-point minimum damage for short combats.',
  onAfterCombatCalculation: function (combat, monster, hero) {
    if (combat.totalDamageToHero > 0 && // play well with life-leech
      combat.totalDamageToHero <= 5 &&
      monster.attributes.atk <= hero.attributes.def)
      combat.totalDamageToHero = 0;
  }
}

  // {id: 'apprentice', name: 'Apprentice', description: 'Learn new skills from old heroes.'},
