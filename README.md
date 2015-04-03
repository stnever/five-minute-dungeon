# five-minute-dungeon
A simple web clone of a nifty Android game.

This is a (poor) clone of the Game "Blockee Story - Dungeon 18" by QQ House.
I'm not affiliated with them. Here's the link for the Google Play store:

https://play.google.com/store/apps/details?id=com.qqhouse.dungeon18&hl=en

You play the game by selecting which monster you want to attack. You must
choose your battles and your level-up upgrades carefully, to be able to
progress further until you defeat the Skeleton King at the end of the dungeon.

Along the way you find merchants selling equipment for coins, chests that
need keys to be unlocked, traps that hold valuable relics and old heroes
that can train you and give you new skills.

Each hero has his own level-up skills and feats, different monsters require
different strategies and bosses are real tough to kill.

-----

To play this (beta? alpha?) version, you can clone this repository and
open `index.html` on your browser, or you can access the GitHub Pages-powered
online version.

-----

I redesigned the sprites using LDraw models, but tried to keep a lot of
the original characters. Of course, this project is not affiliated with the
LEGO Group in any way.

The game is written entirely in Javascript. I used <a href="http://angularjs.org">AngularJS</a>
for the user interface, mostly because I already have experience with it, but
the core engine *should* be presentation-agnostic. I'll be working on a phaser.io
version soon.

The code is somewhat documented. The core engine is in files `game.js` and
`dungeon.js`; the other files (`skills.js`, `monsters.js`, `heroes.js`, etc)
just provide the game content.

I encourage you to check out the code, submit bugs and features, and hack
away to create new items, characters, graphics, and Game modes.
