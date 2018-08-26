/*
* editorState rappresenta lo stato di editor mappe, la mappa creata
* in questo stato sarà passata allo stato di gioco e utilizzata
* come mappa corrente
* */
let editorState = {
  
  create: function () {
    //Crea mappa vuota
    this.map = game.add.tilemap();
    this.map.setTileSize(32,32);
    //Aggiunge tileset
    this.map.addTilesetImage('tileset');

    //Crea nuovo layer e setta dimensioni mappa
    this.layer1 = this.map.create('layer1', 25, 19, 32, 32);

    //Crea tile selector e griglia di disegno
    this.createTileSelector();
    this.drawGrid();

    //Crea contorno per selezione tile
    this.marker = game.add.graphics();
    this.marker.lineStyle(2, 0xffffff, 1);
    this.marker.drawRect(0, 0, 32, 32);

    //Aggiunge callback per tracciamento mouse
    game.input.addMoveCallback(this.updateMarker, this);

    //aggiunge listener nascondere tileselector
    this.hidePalette = game.input.keyboard.addKey(Phaser.KeyCode.E);
    this.hidePalette.onDown.add(this.hide, this);
    //Variabile binaria per controllo visibilità tileselector
    this.visible = true;

    //Evita la comparsa del menu al click destro
    game.canvas.oncontextmenu = function (e) { e.preventDefault(); };

    //Crea oggetti trascinabili
    this.createDraggable();

    //Aggiunge listener per passare allo stato di gioco
    game.input.keyboard.addKey(Phaser.KeyCode.S).onDown.add(this.playMap, this);
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
  },

  drawGrid: function() {
    //Crea griglia per facilitare disegno e posizionamento draggable
    this.grid = game.add.graphics();
    this.grid.lineStyle(2, 0xffffff, 1);
    this.grid.alpha = 0.2;
    for(let i=0; i<25; i++) {
      this.grid.drawRect(i*32, 0, 1, 19*32);
    }
    for(let i=0; i<19; i++) {
      this.grid.drawRect(0, i*32, 25*32, 1);
    }
  },

  pickTile: function (sprite, pointer) {
    //Arrotonda l'input al multiplo più piccolo di 32 e divide per 32 in modo da ottenere la coordinata del tile
    this.currentTile = game.math.snapToFloor(pointer.x, 32) / 32;
  },
  
  updateMarker: function () {
    //Calcola posizione marker in base a coordinata tile
    this.marker.x = this.layer1.getTileX(game.input.activePointer.worldX) * 32;
    this.marker.y = this.layer1.getTileX(game.input.activePointer.worldY) * 32;

    //Se il puntatore è sopra ad un draggable, nasconde il marker
    if(this.pointerOverDraggable()) {
      this.marker.alpha = 0;
      return;
    }
    else
      this.marker.alpha = 1;

    //Rimuove tile se tasto destro premuto
    if(game.input.mousePointer.rightButton.isDown)
      this.map.removeTile(this.layer1.getTileX(this.marker.x), this.layer1.getTileY(this.marker.y), this.layer1);
    //Inserisce tile se tasto sinistro premuto
    else if (game.input.mousePointer.isDown && !this.tileStrip.input.pointerOver() &&
      !game.input.activePointer.rightButton.isDown && this.currentTile !== undefined) {
      this.map.putTile(this.currentTile, this.layer1.getTileX(this.marker.x), this.layer1.getTileY(this.marker.y), this.layer1);
    }
  },

  hide: function () {
    //Visualizza o nasconde tileselector
    if(this.visible) {
      game.add.tween(this.tileStrip).to({y: -50}, 500).start();
      game.add.tween(this.tileSelector).to({alpha: 0}, 500).start();
      this.visible = false;
    }
    else {
      game.add.tween(this.tileStrip).to({y: 0}, 500).start();
      game.add.tween(this.tileSelector).to({alpha: 1}, 500).start();
      this.visible = true;
    }
  },

  createDraggable: function () {
    //Crea tutti gli oggetti che possono essere trascinati
    this.player = game.add.sprite(64, game.height/2, 'player');
    this.player.inputEnabled = true;
    this.player.input.enableDrag();
    this.player.events.onDragStop.add(this.draggablePosition, this);

    this.enemy = game.add.sprite(game.width - 64, game.height/2, 'enemy');
    this.enemy.inputEnabled = true;
    this.enemy.input.enableDrag();
    this.enemy.events.onDragStop.add(this.draggablePosition, this);

    this.ball = game.add.sprite(game.width/2, game.height/2, 'ball');
    this.ball.inputEnabled = true;
    this.ball.input.enableDrag();
    this.ball.events.onDragStop.add(this.draggablePosition, this);
  },

  draggablePosition: function (dragged) {
    //Riposiziona barretta seguendo la griglia di tile solo se si preme control al rilascio del drag
    if(game.input.keyboard.isDown(Phaser.KeyCode.CONTROL)) {
      dragged.x = game.math.snapToFloor(dragged.x, 32);
      dragged.y = game.math.snapToFloor(dragged.y, 32);
    }
  },

  pointerOverDraggable: function () {
    return this.player.input.pointerOver() || this.enemy.input.pointerOver() || this.ball.input.pointerOver();
  },

  playMap: function () {
    //Pulisce elementi editor e passa allo stato di gioco mantenendo la mappa
    this.map.setCollision([0,1,2]);
    this.grid.destroy();
    this.marker.destroy();
    this.tileStrip.destroy();
    this.tileSelectorBackground.destroy();
    game.state.start('main', false, false, {"map":this.map, "layer":this.layer1, "player":this.player, "enemy":this.enemy, "ball":this.ball});
  }
  
};