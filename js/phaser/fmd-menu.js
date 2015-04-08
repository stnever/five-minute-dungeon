FmdGame.MainMenu = function (game) {

  this.music = null;
  this.playButton = null;

  this.bg = null;
};

FmdGame.MainMenu.prototype = {

  preload: function () {

  },

  create: function () {

    this.bg = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'bg1');

    var menu = new List(this, 10);

    var m1 = new ListItem(this.game, 'li-normal', 'g1-red', 0xFF49A4)
      .addText('Dungeon')
      .onClick(function() {
        this.state.start('Dungeon');
      }, this);
    menu.addItem(m1.sprite);


    var m2 = new ListItem(this.game, 'li-normal', 'g2-white', 0xBA795B)
      .addText('Gallery');
    menu.addItem(m2.sprite);

    var m3 = new ListItem(this.game, 'li-disabled', 'robot', 0x3542FF)
      .addText('About');
    menu.addItem(m3.sprite);

    menu.group.x = (this.game.width - menu.group.width) / 2;
    menu.group.y = (this.game.height - menu.group.height) / 2;
    // this.playButton = this.add.button(400, 600, 'playButton', this.startGame, this, 'buttonOver', 'buttonOut', 'buttonOver');

  },

  update: function () {

    //  Do some nice funky main menu effect here
    this.bg.tilePosition.x -= 0.5;
    this.bg.tilePosition.y -= 0.3;

  },

  startGame: function (pointer) {

    //  Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
    // this.music.stop();

    //  And start the actual game
    this.state.start('Game');

  }

};