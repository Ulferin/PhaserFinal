let editorState = {
  
  create: function () {
    //Crea mappa vuota
    this.map = game.add.tilemap();
    this.map.setTileSize(32,32);
    //Aggiunge tileset
    this.map.addTilesetImage('tileset');

    //Crea nuovo layer e setta dimensioni mappa
    this.layer1 = this.map.create('layer1', 25, 19, 32, 32);
    this.layer1.resizeWorld();

    this.createTileSelector();

    //Crea contorno per selezione tile
    this.marker = game.add.graphics();
    this.marker.lineStyle(2, 0xffffff, 1);
    this.marker.drawRect(0, 0, 32, 32);

    //Aggiunge callback per tracciamento mouse
    game.input.addMoveCallback(this.updateMarker, this);

    //aggiunge listener per nuovo livello
    this.visible = true;
    this.hidePalette = game.input.keyboard.addKey(Phaser.KeyCode.E);
    this.hidePalette.onDown.add(this.hide, this);

    //Evita la comparsa del menu al click destro
    game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
  },

  createTileSelector: function() {
    this.tileSelector = game.add.group();

    this.tileSelectorBackground = game.make.graphics();
    this.tileSelectorBackground.beginFill(0x000000, 0.5);
    this.tileSelectorBackground.drawRect(0, 0,   64, 32);
    this.tileSelectorBackground.endFill();

    this.tileSelector.add(this.tileSelectorBackground);

    this.tileStrip = this.tileSelector.create(0, 0, 'tileset');
    this.tileStrip.inputEnabled = true;
    this.tileStrip.events.onInputDown.add(this.pickTile, this);

    this.tileSelector.fixedToCamera = true;

  },

  pickTile: function (sprite, pointer) {
    //Arrotonda l'input al multiplo più piccolo di 32 e divide per 32 in modo da ottenere la coordinata del tile
    this.currentTile = game.math.snapToFloor(pointer.x, 32) / 32;
  },
  
  updateMarker: function () {
    //getTile restituisce la coordinata del tile, quindi va moltiplicata per la grandezza del tile
    this.marker.x = this.layer1.getTileX(game.input.activePointer.worldX) * 32;
    this.marker.y = this.layer1.getTileX(game.input.activePointer.worldY) * 32;

    //Rimuove tile se tast destro premuto
    if(game.input.mousePointer.rightButton.isDown)
      this.map.removeTile(this.layer1.getTileX(this.marker.x), this.layer1.getTileY(this.marker.y), this.layer1);
    //Inserisce tile se tasto sinistro premuto
    else if (game.input.mousePointer.isDown && !this.tileStrip.input.pointerOver() &&
      !game.input.activePointer.rightButton.isDown && this.currentTile !== undefined) {
      this.map.putTile(this.currentTile, this.layer1.getTileX(this.marker.x), this.layer1.getTileY(this.marker.y), this.layer1);
      // map.fill(currentTile, currentLayer.getTileX(marker.x), currentLayer.getTileY(marker.y), 4, 4, currentLayer);
    }
  },

  hide: function () {
    //Visualizza o copre tileselector
    if(this.visible) {
      game.add.tween(this.tileStrip).to({y: -50}, 500).start();
      this.visible = false;
    }
    else {
      game.add.tween(this.tileStrip).to({y: 0}, 500).start();
      this.visible = true;
    }
  }
  
};