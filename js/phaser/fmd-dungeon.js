FmdGame.Dungeon = function (game) {

  //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

  this.game;      //  a reference to the currently running game (Phaser.Game)
  this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
  this.camera;    //  a reference to the game camera (Phaser.Camera)
  this.cache;     //  the game cache (Phaser.Cache)
  this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
  this.load;      //  for preloading assets (Phaser.Loader)
  this.math;      //  lots of useful common math operations (Phaser.Math)
  this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
  this.stage;     //  the game stage (Phaser.Stage)
  this.time;      //  the clock (Phaser.Time)
  this.tweens;    //  the tween manager (Phaser.TweenManager)
  this.state;     //  the state manager (Phaser.StateManager)
  this.world;     //  the game world (Phaser.World)
  this.particles; //  the particle manager (Phaser.Particles)
  this.physics;   //  the physics manager (Phaser.Physics)
  this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

  //  You can use any of these from any function within this State.
  //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

FmdGame.Dungeon.prototype = {

  create: function () {

    this.bg = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'bg3');
    this.bg.fixedToCamera = true;

    var game = this.game;
    var me = this;

    // Instantiate a hero.
    var heroClass = Game.gallery.heroClasses[0];

    var list = new List(this, 2);
    list.group.x = (this.game.width / 2 ) - 300;
    list.group.y = 74;

    // Hook up a function to draw each event as it
    // appears in the dungeon.
    Game.on('dungeon-event-appear', function(event) {
      var bg = getEventBg(event);
      var portrait = getEventPortrait(event);
      var item = new ListItem(game, bg, portrait);

      if ( event.combat ) {
        item.addCost({hp: event.combat.totalDamageToHero});
      } else if ( event.cost ) {
        item.addCost(event.cost);
      }

      list.addItem(item.sprite);
    })

    // Add the hero and several events to the dungeon.
    enterDungeon(heroClass, randomDungeonGenerator);

    // Draw the hero bar.
    // this.addHeroBar();

    game.world.resize(game.width, list.group.height + 100);

    // This is the "focus" -- it holds the Y-coordinate that should
    // be visible. The camera always slides smoothly to this height.
    // This is used in the mouse-wheel and touch-gesture handlers to
    // scroll through the dungeon events list.
    this.targetY = 0;

    game.input.mouse.mouseWheelCallback = function(event) {
      me.targetY += game.input.mouse.wheelDelta * -100;
      var h = game.camera.height;
      if ( me.targetY < 0 ) me.targetY = 0;
      if ( me.targetY > game.world.height - h) me.targetY = game.world.height - h;
    };

  },

  update: function () {
    this.game.camera.y += (this.targetY - this.game.camera.y) * .25;
  },

  quitGame: function (pointer) {

      //  Here you should destroy anything you no longer need.
      //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

      //  Then let's go back to the main menu.
      this.state.start('MainMenu');

  }

};