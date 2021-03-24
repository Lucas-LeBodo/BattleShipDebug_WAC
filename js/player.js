/*jslint browser this */
/*global _, shipFactory, player, utils */

(function (global) {
    "use strict";

    var sheep = {dom: {parentNode: {removeChild: function () {
    }}}};

    var player = {
        grid: [],
        tries: [],
        fleet: [],
        game: null,
        activeShip: 0,
        init: function () {
            // créé la flotte
            this.fleet.push(shipFactory.build(shipFactory.TYPE_BATTLESHIP));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_DESTROYER));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_SUBMARINE));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_SMALL_SHIP));

            // créé les grilles
            this.grid = utils.createGrid(10, 10);
            this.tries = utils.createGrid(10, 10);
        },
        setGame: function (obj) {
             this.game = obj;
        },
        play: function (col, line) {
            // appel la fonction fire du game, et lui passe une calback pour récupérer le résultat du tir
            if (this.tries[line][col] === true || this.tries[line][col] === false)
                {
                    return 5;
                }
            this.game.fire(this, col, line, _.bind(function (hasSucced) {
                let i = 0;
                console.log(this.tries)
                
                let GridCellDom = document.querySelectorAll('.main-grid .row .cell');
                this.tries[line][col] = hasSucced;
                this.tries.forEach(line => 
                    line.forEach(cell => {
                        if (cell === true)
                            GridCellDom[i].style.backgroundColor = "red";
                        if (cell === false)
                            GridCellDom[i].style.backgroundColor = "grey";
                        i++;
                    }))
            }, this));
            return 0;
        },
        // quand il est attaqué le joueur doit dire si il a un bateaux ou non à l'emplacement choisi par l'adversaire
        receiveAttack: function (col, line, callback) {
            var succeed = false;
            if (this.grid[line][col] != 0) {
                succeed = true;
            }
            callback.call(undefined, succeed);
            this.grid[line][col] = succeed;
        },
        checkOverlap: function (x, y, ship){
            let i = 0;
            if (ship.getId() == 1 || ship.getId() == 2)
            {
                i = -2;
                while (i + 2 < ship.getLife()) {
                    if (this.grid[y][x + i] != 0)
                    return false;
                    else i += 1;
                }
            }
            if (ship.getId() == 3)
            {           
                i = -2;
                while (i + 2 < ship.getLife()) {
                    if (this.grid[y][x + i] != 0)
                    return false;
                    else i += 1;
                }
            }
            if (ship.getId() == 4)
            {
                i = -1;
                while (i + 1 < ship.getLife()) {
                    if (this.grid[y][x + i] != 0)
                        return false;
                    else i++;
                }
            }
            return true;
        },
        setActiveShipPosition: function (x, y) {
            var ship = this.fleet[this.activeShip];
            var i = 0;
            if (ship.getId() == 1 || ship.getId() == 2)
            {
                i = i -2;
                if (x >= 2 && x <= 7)
                {
                    if(this.checkOverlap(x, y, ship))
                    {
                        while (i + 2 < ship.getLife()) {
                            this.grid[y][x + i] = ship.getId();
                            i += 1;
                        }
                    }
                    else
                    {
                        return false
                    }
                }
                else 
                {
                    return false
                }
            }
            if (ship.getId() == 3)
            {
                i = i -2;
                if (x >= 2 && x <= 8)
                {
                    if(this.checkOverlap(x, y, ship))
                    {
                        while (i + 2 < ship.getLife()) {
                            this.grid[y][x + i] = ship.getId();
                            i += 1;
                        }
                    }
                    else return false
                }
                else 
                {
                    return false
                }
            }
            if (ship.getId() == 4)
            {
                i = i -1;
                if (x >= 1  && x <= 8)
                {
                    if(this.checkOverlap(x, y, ship))
                    {
                        while (i + 1 < ship.getLife()) {
                            this.grid[y][x + i] = ship.getId();
                            i += 1;
                        }
                    }
                    else return false
                }
                else
                {
                    return false
                }
            }
            return true;
        },
        clearPreview: function () {
            this.fleet.forEach(function (sheep) {
                if (sheep.dom.parentNode) {
                    sheep.dom.parentNode.removeChild(sheep.dom);
                }
            });
        },
        resetShipPlacement: function () {
            this.clearPreview();

            this.activeShip = 0;
            this.grid = utils.createGrid(10, 10);
        },
        activateNextShip: function () {
            if (this.activeShip < this.fleet.length - 1) {
                this.activeShip += 1;
                return true;
            } else {
                return false;
            }
        },
        renderTries: function (grid) {
            this.tries.forEach(function (row, rid) {
                row.forEach(function (val, col) {
                    var node = grid.querySelector('.row:nth-child(' + (rid + 1) + ') .cell:nth-child(' + (col + 1) + ')');
                    if (val === true) {
                        node.style.backgroundColor = '#e60019';
                    } else if (val === false) {
                        node.style.backgroundColor = '#aeaeae';
                    }
                });
            });
        },
        renderShips: function (grid) {
        }
    };

    global.player = player;

}(this));