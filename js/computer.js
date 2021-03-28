/*jslint browser this */
/*global _, player */

(function (global) {
    "use strict";

    var computer = _.assign({}, player, {
        grid: [],
        tries: [],
        fleet: [],
        difficulty: null,
        game: null,
        setGame: function (obj) {
            this.game = obj;
        },
        setDifficulty: function (difficulty) {
            this.difficulty = difficulty;
        },
        getGrid: function ()
        {
            return this.grid;
        },
        playHard: function(){
            let col = Math.floor(Math.random() * (10 - 0) + 0);
            let line = Math.floor(Math.random() * (10 - 0) + 0);
            let GridCellDom = document.querySelectorAll('.cell');
            let i = 0;
            let self = this;
            while (self.tries[col][line] === false || self.tries[col][line] === true)
            {
                if (self.tries[col][line] === true && self.tries[col][line - 1]  === 0)
                    line--;
                else if (self.tries[col][line] === true && self.tries[col][line + 1 ] === 0)
                    line++;
                else
                {
                    col = Math.floor(Math.random() * (10 - 0) + 0);
                    line = Math.floor(Math.random() * (10 - 0) + 0);
                }
            }
            console.log(this.tries);
            self.game.fire(self, line, col, function (hasSucced) {
                self.tries[col][line] = hasSucced;
                self.tries.forEach(line => 
                    line.forEach(cell => {
                        if (cell === true)
                            GridCellDom[i].style.backgroundColor = "black";
                           i++;
                       }))
                });
        },
        play: function () {
            var self = this;
            setTimeout(function () {
                if (self.difficulty == 1)
                {
                    setTimeout(self.playHard(), 500)
                    return 0;
                }
                let col = Math.floor(Math.random() * (10 - 0) + 0);
                let line = Math.floor(Math.random() * (10 - 0) + 0);
                let GridCellDom = document.querySelectorAll('.cell');
                let i = 0;
                while (self.tries[col][line] === false || self.tries[col][line] === true)
                {
                    col = Math.floor(Math.random() * (10 - 0) + 0);
                    line = Math.floor(Math.random() * (10 - 0) + 0);
                }
                self.game.fire(self, line, col, function (hasSucced) {
                    self.tries[col][line] = hasSucced;
                    self.tries.forEach(line => 
                        line.forEach(cell => {
                            if (cell === true)
                                GridCellDom[i].style.backgroundColor = "black";
                            i++;
                        }))
                });
            }, 500);
        },
        checkOverlap: function (x, y, ship){
            let i = 0;
            if (ship.getId() == 5 || ship.getId() == 6)
            {
                i = -2;
                while (i + 2 < ship.getLife()) {
                    if (this.grid[y][x + i] != 0)
                    return false;
                    else i += 1;
                }
            }
            if (ship.getId() == 7)
            {           
                i = -2;
                while (i + 2 < ship.getLife()) {
                    if (this.grid[y][x + i] != 0)
                    return false;
                    else i += 1;
                }
            }
            if (ship.getId() == 8)
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
        areShipsOk: function (callback) {
            var y = 0;
            var x;
            let i = 0;
            this.fleet.forEach(function (ship, i) {
                if (ship.getId() == 5 || ship.getId() == 6)
                {
                    x = Math.floor(Math.random() * (7 - 2) + 2);
                    y = Math.floor(Math.random() * (9 - 0) + 0);
                    while(this.checkOverlap(x, y, ship) == false)
                    {
                        x = Math.floor(Math.random() * (7 - 2) + 2);
                        y = Math.floor(Math.random() * (9 - 0) + 0); 
                    }
                    i = -2;
                    while (i + 2 < ship.life) {
                        this.grid[y][x + i] = ship.getId();
                        i += 1;
                    }
                }
                if (ship.getId() == 7)
                {
                    x = Math.floor(Math.random() * (8 - 2) + 2);
                    y = Math.floor(Math.random() * (9 - 0) + 0);
                    while(this.checkOverlap(x, y, ship) == false)
                    {
                        x = Math.floor(Math.random() * (8 - 2) + 2);
                        y = Math.floor(Math.random() * (9 - 0) + 0); 
                    }
                    i = -2;
                    while (i + 2 < ship.life) {
                        this.grid[y][x + i] = ship.getId();
                        i += 1;
                    }
                }
                if (ship.getId() == 8)
                {
                    x = Math.floor(Math.random() * (8 - 2) + 2);
                    y = Math.floor(Math.random() * (9 - 0) + 0); 
                    while(this.checkOverlap(x, y, ship) == false)
                    {
                        x = Math.floor(Math.random() * (8 - 2) + 2);
                        y = Math.floor(Math.random() * (9 - 0) + 0); 
                    }
                    i = -1;
                    while (i + 1 < ship.life) {
                        this.grid[y][x + i] = ship.getId();
                        i += 1;
                    }
                }
             }, this);
            setTimeout(function () {
                callback();
            }, 500);
        }
    });

    global.computer = computer;

}(this));