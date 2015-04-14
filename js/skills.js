// These are all the game skills, and the listeners that make
// them work. Note that some "monster" skills, particularly
// the Knight's "Mirror" skills, are defined in the bosses
// file instead, because they would make no sense to a playable
// hero to have.
(function(Game) {

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

  Game.gallery.skills.push({
    id: 'normal-experience',
    name: 'Normal experience',
    description: 'Earn XP and level up from killing monsters',
    onMonsterKill: function(monster) {
      gainXp(Game.dungeon.hero, monster);
    },

    onHeroModified: function() {
      var hero = Game.dungeon.hero;
      var expToNextLevel = 95 + (5 * hero.level);
      if ( hero.xp >= expToNextLevel )
        levelUp(hero, hero.xp - expToNextLevel);
    }
  });

  Game.gallery.skills.push({
    id: 'quick-learner',
    name: 'Quick Learner',
    description: 'Requires less experience to level up.',
    onMonsterKill: function(monster) {
      gainXp(Game.dungeon.hero, monster);
    },

    onHeroModified: function() {
      var hero = Game.dungeon.hero;
      var expToNextLevel = 95 + (4 * hero.level);
      if ( hero.xp >= expToNextLevel )
        levelUp(hero, hero.xp - expToNextLevel);
    }
  });

  Game.gallery.skills.push({
    id: 'killer', name: 'Killer', description: 'Does not level up; uses kill count to obtain upgrades.',
    onMonsterKill: function(monster) {
      Game.dungeon.hero.attributes.kills++;
    }
  });

  Game.gallery.skills.push({
    id: 'more-gems', name: 'Gem Seeker', description: 'Find more gems.',
    onEnterDungeon: function() {
      var newFreqs = _.mapValues(Game.dungeon.lootTable.freqs, function(value, key) {
        var isGem = ( key.indexOf('coin') != -1 );
        return isGem ? value * 2 : value;
      })
      Game.dungeon.lootTable.update(newFreqs);
    }
  });

  Game.gallery.skills.push({
    id: 'more-coins', name: 'Rich', description: 'Find more coins.',
    onEnterDungeon: function() {
      var newFreqs = _.mapValues(Game.dungeon.lootTable.freqs, function(value, key) {
        var isCoin = ( key.indexOf('coin') != -1 );
        return isCoin ? value * 2 : value;
      })
      Game.dungeon.lootTable.update(newFreqs);
    }
  });

  Game.gallery.skills.push({
    id: 'more-chests', name: 'Lucky', description: 'Find more chests.',
    onEnterDungeon: function() {
      var freqs = Game.dungeon.frequencies.events;
      freqs.chest += freqs.chest;
    }
  });

  Game.gallery.skills.push({
    id: 'more-merchants', name: 'Shopping', description: 'Find more shops.',
    onEnterDungeon: function() {
      var freqs = Game.dungeon.frequencies.events;
      freqs.merchant += freqs.merchant;
    }
  });

  Game.gallery.skills.push({
    id: 'bargain', name: 'Bargain', description: 'Talk to merchants to reduce equipment price.',
    onDungeonEventAppear: function(event) {
      if ( event.type == 'merchant' )
        event.cost.coins -= 2;
    }
  });

  Game.gallery.skills.push({
    id: 'disarm-trap',
    name: 'Disarm Trap',
    description: 'Use keys, if available, to disarm traps.',
    onDungeonEventAppear: function(event) {
      if ( event.type == 'trap' && Game.dungeon.hero.attributes.keys > 0 ) {
        event.costPerTurn = 0;
        event.cost.keys = 1;
      }
    },

    onDungeonEventEnd: function() {
      Game.dungeon.events.forEach(function(event) {
        if ( event.type != 'trap' ) return;

        if ( Game.dungeon.hero.attributes.keys > 0 ) {
          event.costPerTurn = 0;
          event.cost.keys = 1;
        } else {
          event.costPerTurn = 4;
          event.cost.keys = null;
          event.cost.hp = event.age * event.costPerTurn;
        }
      })
    }
  });

  Game.gallery.skills.push({
    id: 'unlock', name: 'Unlock', description: 'Open chests without keys.',
    onDungeonEventAppear: function(event) {
      if ( event.type == 'chest' )
        event.cost = {}
    }
  });

  Game.gallery.skills.push({
    id: 'evasion', name: 'Evasion', description: 'Traps do not hurt the hero',
    onDungeonEventAppear: function(event) {
      if ( event.type == 'trap' ) {
        event.costPerTurn = 0;
        event.cost = {}
      }
    }
  });

  Game.gallery.skills.push({
    id: 'dark-presence', name: 'Dark Presence', description: 'Open doors, disarm traps, get shop items without cost.',
    onDungeonEventAppear: function(event) {
      if ( event.type == 'merchant' ||
           event.type == 'chest' ||
           event.type == 'trap' ) {
        event.costPerTurn = 0;
        event.cost = {}
      }
    }
  });

  Game.gallery.skills.push({
    id: 'purification', name: 'Purification', description: 'Purify cursed items.',
    onDungeonEventAppear: function(event) {
      var item = event.loot || event.item;

      if ( item && item.cursed )
        item.gain.hp = 0;
    }
  });

  Game.gallery.skills.push({
    id: 'undead', name: 'Undead', description: 'Cannot recover life.',
    onItemAcquired: function(item) {
      item.gain.hp = 0;
    }
  });

  Game.gallery.skills.push({
    id: 'steal', name: 'Steal', description: 'If you can\'t afford an item, spend a key to steal it.',

    onDungeonEventAppear: function(event) {
      // Aumenta o custo normal deste evento
      if ( event.type != 'merchant' ) return;
      event.originalCost = event.cost.coins;
      event.cost.coins += 2;
    },

    onDungeonEventEnd: function() {
      Game.dungeon.events.forEach(function(e) {
        if ( e.type != 'merchant' ) return;

        // Se o custo é maior que as moedas atuais mas temos chaves,
        // troca o custo por 1 chave
        var attrs = Game.dungeon.hero.attributes;
        if ( event.cost.coins > attrs.coins && attrs.keys > 0 ) {
          event.cost = { keys: 1 }
        } else {
          event.cost = { coins: event.originalCost }
        }
      })
    }
  });

  Game.gallery.skills.push({
    id: 'leech', name: 'Life Leech', description: 'Gain life when monsters deal no damage.',
    onAfterCombatCalculation: function(combat) {
      if ( combat.totalDamageToHero < 1 )
        combat.totalDamageToHero = -4;
    }
  });

  // {id: 'block', name: 'Block', description: 'Block some damage.'},

  // {id: 'apprentice', name: 'Apprentice', description: 'Learn new skills from old heroes.'},

}(Game));
