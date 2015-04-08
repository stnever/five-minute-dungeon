function getCostSymbol(attr) {
  if ( attr == 'hp' )     return ['\ue602', '#FF00BF'];
  if ( attr == 'coins' )  return ['\ue61a', '#F1C40F'];
  if ( attr == 'keys' )   return ['\ue61b', '#F1C40F'];
  if ( attr == 'stars' )  return ['\ue620', '#F1C40F'];
  return ['?', '#ffffff'];
}

function getEventBg(event) {
  // if ( ! event.selectable ) return 'li-disabled';
  if ( event.type == 'monster' ) return 'li-brown';
  if ( event.type == 'chest' ) return 'li-cyan';
  if ( event.type == 'merchant' ) return 'li-orange';
  if ( event.type == 'boss' ) return 'li-pink';
  if ( event.type == 'trap' ) return 'li-cyan';
}

function getEventPortrait(event) {
  if ( event.type == 'monster' ) return event.monster.id;
  if ( event.type == 'boss' ) return event.monster.id;
  if ( event.type == 'trap' ) return 'trap';
  if ( event.type == 'merchant' ) return 'merchant';
  if ( event.type == 'chest' ) return 'chest';
}

function ListItem(game, bgKey, portraitKey, bgTint) {
  this.game = game;
  this.sprite = new Phaser.Sprite(game, 0, 0, bgKey);
  if ( bgTint != null )
    this.sprite.tint = bgTint;

  this.portrait = new Phaser.Sprite(game, 8, 8, portraitKey);
  this.portrait.height = 48;
  this.portrait.width = 48;

  this.sprite.addChild(this.portrait);

  return this;
}

ListItem.prototype.addText = function(str, strColor) {
  var style = { font: "normal 32px Chicago", fill: strColor || "#ffffff" };
  var x = ( this.symbolText == null ) ? 64 :
    this.symbolText.x + this.symbolText.width + 5;

  this.text = new Phaser.Text(this.game, x, 35, str, style);
  this.text.anchor.y =
    Math.round(this.text.height * 0.5) / this.text.height;
  this.sprite.addChild(this.text);
  return this;
}

ListItem.prototype.onClick = function(fn, thisArg) {
  this.sprite.inputEnabled = true;
  this.sprite.input.useHandCursor = true;
  this.sprite.events.onInputDown.add(fn, thisArg);
  return this;
}

ListItem.prototype.addLevelText = function(level) {
  if ( level == null || level == '' ) return this;

  var style = { font: "normal 9pt Arial", fill: "#000000" };
  this.levelText = new Phaser.Text(this.game, 0, 0, level, style);
  this.levelText.alpha = 0.7;
  this.sprite.addChild(this.levelText);
  return this;
}

ListItem.prototype.addSymbol = function(symbol, symbolColor) {
  var style = { font: "normal 24px FmdIcons", fill: symbolColor };
  this.symbolText = new Phaser.Text(this.game, 64, 35, symbol, style);
  this.symbolText.anchor.y =
    Math.round(this.symbolText.height * 0.5) / this.symbolText.height;
  this.sprite.addChild(this.symbolText);
  return this;
}

ListItem.prototype.addCost = function(cost) {
  var pairs = _.chain(cost)
    .omit(function(v) { return v == 0 || v == null })
    .pairs().value();

  if ( pairs.length < 1 ) {
    return this.addSymbol('\ue628', '#2ecc71');
  } else {
    // assumes there's only one cost to display
    var symbol = getCostSymbol(pairs[0][0]);
    var value = pairs[0][1];
    return this
      .addSymbol(symbol[0], symbol[1])
      .addText(value, symbol[1]);
  }
}

ListItem.prototype.addAttributes = function(attrs) {
  return this;
}

ListItem.prototype.addLoot = function(item) {
  return this;
}

function List(parent, padding) {
  this.game = parent.game;
  this.group = parent.add.group();
  this.padding = padding;
}

List.prototype.addItem = function(sprite) {
  var l = this.group.children;
  if ( l.length < 1 ) {
    sprite.y = 0;
  } else {
    var last = l[l.length - 1];
    sprite.y = last.y + last.height + this.padding;
  }

  this.group.add(sprite);
}
