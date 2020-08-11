// import Game from '../core/Game'

// These are all the monster classes that can be found in
// the dungeon.
export let Skeleton = {
  id: 'skeleton',
  name: 'Skeleton',
  description: 'Old victims of the dungeon, reanimated to serve the Skeleton King.',
  create: function (monster) {
    var level = monster.level;
    monster.attributes = {
      hp: 40,
      atk: 18 + level * 7,
      def: 4 + 6.5 * level,
      spd: 42 - 2.5 * level
    }
  }
}

export let Reptant = {
  id: 'reptant',
  name: 'Reptant',
  description: 'Lizard-people recruited by the Skeleton King.',
  create: function (monster) {
    var level = monster.level;
    monster.attributes = {
      hp: 40,
      atk: 18 + level * 7,
      def: 10 + 5.5 * level,
      spd: 42 - 3.5 * level
    }
  }
}

export let SandGolem = {
  id: 'sand-golem',
  name: 'Sand Golem',
  description: 'Dark magic constructs that are hard to kill.',
  create: function (monster) {
    var level = monster.level;
    monster.attributes = {
      hp: 40,
      atk: 20 + level * 7,
      def: 4 + 6 * level,
      spd: 40 - 2 * level
    }
  }
}

export let FrostTroll = {
  id: 'frost-troll',
  name: 'Frost Troll',
  description: 'Inhabitants of cold, remote burrows, moves slowly.',
  create: function (monster) {
    var level = monster.level;
    monster.attributes = {
      hp: 100 * level,
      atk: 13 + level * 3.5,
      def: 8 + level * 7,
      spd: 42 - 2.5 * level
    }
  }
}

export let Werewolf = {
  id: 'werewolf',
  name: 'Werewolf',
  description: 'Cursed men, kept in chains and enraged by the Skeleton King\' liutenants.',
  create: function (monster) {
    var level = monster.level;
    monster.attributes = {
      hp: 30,
      atk: 24 + level * 6.5,
      def: 8 + level * 7,
      spd: 43 - 2.5 * level
    }
  }
}

export let Zombie = {
  id: 'zombie',
  name: 'Zombie',
  description: 'Lesser forms of undead minions, they attack intruders mindlessly.',
  create: function (monster) {
    var level = monster.level;
    monster.attributes = {
      hp: 52 + level,
      atk: 4 + level * 5.5,
      def: 23 + level * 6.5,
      spd: 54 - 2.5 * level
    }
  }
}

export let Mummy = {
  id: 'mummy',
  name: 'Mummy',
  description: 'Ancient, elite warriors that wield rusted blades.',
  create: function (monster) {
    var level = monster.level;
    monster.attributes = {
      hp: 4,
      atk: 44 + level * 6.5,
      def: 4 + level * 7,
      spd: 40 - 2.5 * level
    }
  }
}
