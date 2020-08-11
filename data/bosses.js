import Game from '../core/Game'

export let YellowKnight = {
  id: 'knight-yellow',
  name: 'Yellow Knight',
  description: '',
  create: function(boss) {
    var level = boss.level;
    boss.attributes = {
      minHp: 50 * level,
      atk: 74 + 12 * level,
      def: 76 + 8 * level,
      spd: 23 - level
    }

    // Adjusts now
    boss.onHeroModified();
  },

  onHeroModified: function() {
    this.attributes.hp =
      Math.max(this.attributes.minHp, Game.dungeon.hero.attributes.hp * 2);
  }
}

export let RedKnight = {
  id: 'knight-red', name: 'Red Knight',
  description: '',
  create: function(boss) {
    var level = boss.level;
    boss.attributes = {
      hp: 50 * level,
      minAtk: 62 + 12 * level,
      def: 76 + 8 * level,
      spd: 23 - level
    }

    // Adjusts now
    boss.onHeroModified();
  },

  onHeroModified: function() {
    this.attributes.atk =
      Math.max(this.attributes.minAtk, Game.dungeon.hero.attributes.atk);
  }
}

export let BlueKnight = {
  id: 'knight-blue', name: 'Blue Knight',
  description: '',
  create: function(boss) {
    var level = boss.level;
    boss.attributes = {
      hp: 50 * level,
      atk: 76 + 8 * level,
      minDef: 62 + 12 * level,
      spd: 23 - level
    }

    // Adjusts now
    boss.onHeroModified();
  },

  onHeroModified: function() {
    this.attributes.def =
      Math.max(this.attributes.minDef, Game.dungeon.hero.attributes.def);
  }
}

export let GreenKnight = {
  id: 'knight-green',
  name: 'Green Knight',
  description: '',
  create: function(boss) {
    var level = boss.level;
    boss.attributes = {
      hp: 50 * level,
      atk: 62 + 12 * level,
      def: 76 + 8 * level,
      minSpd: 23 - level
    }

    // Adjusts now
    boss.onHeroModified();
  },

  onHeroModified: function() {
    this.attributes.spd =
      Math.min(this.attributes.minSpd, Game.dungeon.hero.attributes.spd);
  }
}

export let WailingWall = {
  id: 'wailing-wall',
  name: 'Wailing Wall',
  description: '',
  create: function(boss) {
    var level = boss.level;
    boss.attributes = {
      hp: 9999,
      def: 80 + (10 * level),
      atk: 1,
      spd: 159
    }
  }
}

export let CaitSith = {
  id: 'cait-sith',
  name: 'Cait Sith',
  description: '',
  create: function(boss) {
    var level = boss.level;
    boss.attributes = {
      hp: 1,
      def: 0,
      atk: 80 + (10 * level),
      spd: 1
    }
  }
}

export let Demon = {
  id: 'demon',
  name: 'Demon',
  description: '',
  create: function(boss) {
    var level = boss.level;
    boss.attributes = {
      hp: 240,
      def: 24 + (10 * level),
      atk: 999,
      spd: 159 - (10 * level)
    }
  }
}

export let SkeletonKing = {
  id: 'skeleton-king',
  name: 'Skeleton King',
  description: '',
  create: function(boss) {
    var level = boss.level;
    boss.attributes = {
      hp: 999,
      minAtk: 62 + 12 * level,
      minDef: 76 + 8 * level,
      minSpd: 6
    }

    // Adjusts now
    boss.onHeroModified();
  },

  onHeroModified: function() {
    this.attributes.atk =
      Math.max(this.attributes.minAtk, Game.dungeon.hero.attributes.atk);

    this.attributes.def =
      Math.max(this.attributes.minDef, Game.dungeon.hero.attributes.def);

    this.attributes.spd =
      Math.min(this.attributes.minSpd, Game.dungeon.hero.attributes.spd);
  }
}

export let Skuleton = {
  id: 'skuleton',
  name: 'Skuleton',
  description: '',
  create: function(boss) {
    var level = boss.level;
    boss.attributes = {
      hp: 50 * level,
      minAtk: 62 + 12 * level,
      minDef: 76 + 8 * level,
      minSpd: 6
    }

    // Adjusts now
    boss.onHeroModified();
  },

  onHeroModified: function() {
    this.attributes.atk =
      Math.max(this.attributes.minAtk, Game.dungeon.hero.attributes.atk);

    this.attributes.def =
      Math.max(this.attributes.minDef, Game.dungeon.hero.attributes.def);

    this.attributes.spd =
      Math.min(this.attributes.minSpd, Game.dungeon.hero.attributes.spd);
  }
}

/* For the future
Game.gallery.bossClasses.push({id: 'amon-ra', name: 'Amon Ra'}});
Game.gallery.bossClasses.push({id: 'anubis', name: 'Anubis'}});
Game.gallery.bossClasses.push({id: 'centurion', name: 'Centurion'}});
Game.gallery.bossClasses.push({id: 'corsair', name: 'Corsair'}});
Game.gallery.bossClasses.push({id: 'dark-knight', name: 'Dark Knight'}});
Game.gallery.bossClasses.push({id: 'hunter', name: 'Hunter'}});
Game.gallery.bossClasses.push({id: 'nefertiti', name: 'Nefertiti'}});
Game.gallery.bossClasses.push({id: 'pirate', name: 'Pirate'}});
Game.gallery.bossClasses.push({id: 'robot', name: 'Robot'}});
Game.gallery.bossClasses.push({id: 'turban', name: 'Warlock'}});
Game.gallery.bossClasses.push({id: 'valkyrie', name: 'Valkyrie'}});

Game.gallery.bossClasses.push({id: 'zealot-yellow', name: 'Yellow Zealot'}});
Game.gallery.bossClasses.push({id: 'zealot-red', name: 'Red Zealot'}});
Game.gallery.bossClasses.push({id: 'zealot-blue', name: 'Blue Zealot'}});
Game.gallery.bossClasses.push({id: 'zealot-green', name: 'Green Zealot'});
*/