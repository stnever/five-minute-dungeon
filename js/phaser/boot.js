var FmdGame = {};

FmdGame.Boot = function (game) {

};

FmdGame.Boot.prototype = {

    preload: function() {
        this.load.image('li-pink', 'img/ui/li-pink.png');
        this.load.image('li-brown', 'img/ui/li-brown.png');
        this.load.image('li-blue', 'img/ui/li-blue.png');
        this.load.image('li-orange', 'img/ui/li-orange.png');
        this.load.image('li-cyan', 'img/ui/li-cyan.png');
        this.load.image('li-normal', 'img/ui/li-normal.png');
        this.load.image('li-disabled', 'img/ui/li-disabled.png');
        this.load.image('li-blue-disabled', 'img/ui/li-blue-disabled.png');
        this.load.image('skeleton-king', 'img/characters/skeleton-king.png');
        this.load.image('skuleton', 'img/characters/skuleton.png');
        this.load.image('robot', 'img/characters/robot.png');

        var me = this;
        ['yellow', 'red', 'blue', 'green', 'white', 'black' ].forEach(function(c) {
            me.load.image('g1-' + c, 'img/items/g1-' + c + '.png');
            me.load.image('g2-' + c, 'img/items/g2-' + c + '.png');
        })

        this.load.image('frost-troll', 'img/characters/frost-troll.png');
        this.load.image('mummy', 'img/characters/mummy.png');
        this.load.image('reptant', 'img/characters/reptant.png');
        this.load.image('sand-golem', 'img/characters/sand-golem.png');
        this.load.image('skeleton', 'img/characters/skeleton.png');
        this.load.image('werewolf', 'img/characters/werewolf.png');
        this.load.image('zombie', 'img/characters/zombie.png');

        this.load.image('merchant', 'img/characters/merchant.png');
        this.load.image('chest', 'img/characters/chest.png');

        this.load.image('bg1', 'img/ui/dungeon-bg1.png');
        this.load.image('bg2', 'img/ui/brick4_s.jpg');
        this.load.image('bg3', 'img/ui/stone4_s.jpg');
    },

    init: function () {

        //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
        this.input.maxPointers = 1;

        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        // this.stage.disableVisibilityChange = true;

        if (this.game.device.desktop)
        {
            //  If you have any desktop specific settings, they can go in here
            this.scale.pageAlignHorizontally = true;
        }
        else
        {
            //  Same goes for mobile settings.
            //  In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setMinMax(480, 260, 1024, 768);
            this.scale.forceLandscape = true;
            this.scale.pageAlignHorizontally = true;
        }

    },

    create: function () {

        //  By this point the preloader assets have loaded to the cache, we've set the game settings
        //  So now let's start the real preloader going
        this.state.start('MainMenu');

    }

};