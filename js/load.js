/*
* loadState è utilizzato per il caricamento degli assets utilizzati
* nel gioco. Riduce il carico di lavoro agli stati che hanno bisogno
* di essere reattivi.
* */
var loadState = {

  preload: function () {
    //TODO caricare assets, mappe e barra caricamento
  },

  create: function () {

    //Avvio stato di menu
    game.state.start('menu');
  }

};