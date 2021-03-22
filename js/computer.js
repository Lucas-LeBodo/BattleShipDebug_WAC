/*jslint browser this */
/*global _, player */

(function (global) {
    "use strict";

    var computer = _.assign({}, player, {
        grid: [],
        tries: [],
        fleet: [],
        game: null,
        play: function () {
            var self = this;
            setTimeout(function () {
                self.game.fire(this, 0, 0, function (hasSucced) {
                    self.tries[0][0] = hasSucced;
                });
            }, 2000);
        },
        setGame: function (obj) {
            this.obj = obj;
           return this.obj;
        },
        areShipsOk: function (callback) {
            var i = 0;
            var j;

            this.fleet[i].forEach(function (ship, i) {
                j = 0;
                while (j < ship.life) {
                    this.grid[i][j] = ship.getId();
                    j += 1;
                }
            }, this);

            setTimeout(function () {
                callback();
            }, 500);
        }
    });

    global.computer = computer;

}(this));