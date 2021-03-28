/*jslint browser this */
/*global _, player, computer, utils */

(function () {
    "use strict";

    var game = {
        PHASE_INIT_PLAYER: "PHASE_INIT_PLAYER",
        PHASE_INIT_OPPONENT: "PHASE_INIT_OPPONENT",
        PHASE_PLAY_PLAYER: "PHASE_PLAY_PLAYER",
        PHASE_PLAY_OPPONENT: "PHASE_PLAY_OPPONENT",
        PHASE_GAME_OVER: "PHASE_GAME_OVER",
        PHASE_WAITING: "waiting",

        currentPhase: "",
        phaseOrder: [],
        // garde une référence vers l'indice du tableau phaseOrder qui correspond à la phase de jeu pour le joueur humain
        playerTurnPhaseIndex: 2,

        // l'interface utilisateur doit-elle être bloquée ?
        waiting: false,

        // garde une référence vers les noeuds correspondant du dom
        grid: null,
        miniGrid: null,

        // liste des joueurs
        players: [],

        // lancement du jeu
        init: function () {

            // initialisation
            this.grid = document.querySelector('.board .main-grid');
            this.miniGrid = document.querySelector('.board .mini-grid');
            this.computerButton = document.querySelector('.computer');
            this.playerButton = document.querySelector('.player');
            this.randomizedButton = document.querySelector('.randomized');
            this.selectDom = document.querySelector('.selectOrder');
            let self = this;

            this.phaseOrder = [
                this.PHASE_INIT_PLAYER,
                this.PHASE_INIT_OPPONENT,
                this.PHASE_PLAY_PLAYER,
                this.PHASE_PLAY_OPPONENT,
                this.PHASE_GAME_OVER
            ];

            // défini l'ordre des phase de jeu

            this.playerTurnPhaseIndex = 2;

            this.selectDom.innerHTML = "Joueur";

            this.computerButton.addEventListener('click', function (event) {
                self.selectDom.innerHTML = "Ordinateur";
                self.phaseOrder = [
                    self.PHASE_INIT_PLAYER,
                    self.PHASE_INIT_OPPONENT,
                    self.PHASE_PLAY_OPPONENT,
                    self.PHASE_PLAY_PLAYER,
                    self.PHASE_GAME_OVER
                ];
                self.playerTurnPhaseIndex = 2;
            });

            this.playerButton.addEventListener('click', function (event) {
                self.selectDom.innerHTML = "Joueur";
                self.phaseOrder = [
                    self.PHASE_INIT_PLAYER,
                    self.PHASE_INIT_OPPONENT,
                    self.PHASE_PLAY_PLAYER,
                    self.PHASE_PLAY_OPPONENT,
                    self.PHASE_GAME_OVER
                ];
            })

            this.randomizedButton.addEventListener('click', function(event){
                let i = Math.round(Math.random() * 10);
                if(i <= 5)
                {
                    self.selectDom.innerHTML = "Joueur";
                    self.phaseOrder = [
                        self.PHASE_INIT_PLAYER,
                        self.PHASE_INIT_OPPONENT,
                        self.PHASE_PLAY_PLAYER,
                        self.PHASE_PLAY_OPPONENT,
                        self.PHASE_GAME_OVER
                    ];
                }
                if (i >= 5)
                {
                    self.selectDom.innerHTML = "Ordinateur";
                    self.phaseOrder = [
                        self.PHASE_INIT_PLAYER,
                        self.PHASE_INIT_OPPONENT,
                        self.PHASE_PLAY_OPPONENT,
                        self.PHASE_PLAY_PLAYER,
                        self.PHASE_GAME_OVER
                    ];
                    self.playerTurnPhaseIndex = 2;
                }
            })

            // initialise les joueurs
            this.setupPlayers();

            // ajoute les écouteur d'événement sur la grille
            this.addListeners();

            // c'est parti !
            this.goNextPhase();
        },
        setOrder: function (tab) {
            this.phaseOrder = tab;
        },
        setupPlayers: function () {
            // donne aux objets player et computer une réference vers l'objet game
            player.setGame(this); // this = obj game
            computer.setGame(this);

            // todo : implémenter le jeu en réseaux
            this.players = [player, computer];

            this.players[0].init();
            this.players[1].init();
            let self = this;
            let hardButton = document.querySelector('.hard');
            let easyButton = document.querySelector('.easy');
            hardButton.addEventListener('click', function(event){
                self.players[1].setDifficulty(1);
            })
            easyButton.addEventListener('click', function(event){
                self.players[1].setDifficulty(0);
            })
        },
        goNextPhase: function () {
            // récupération du numéro d'index de la phase courante
                var ci = this.phaseOrder.indexOf(this.currentPhase);
            var self = this;
            if (ci !== this.phaseOrder.length - 1) {
                this.currentPhase = this.phaseOrder[ci + 1];

            } else {
                this.currentPhase = this.phaseOrder[0];
            }

            switch (this.currentPhase) {
            case this.PHASE_INIT_PLAYER:
                console.log('init grid player')
                utils.info("Placez vos bateaux");
                break;
            case this.PHASE_INIT_OPPONENT:
                console.log('init grid computer')
                this.wait();
                utils.info("En attente de votre adversaire");
                this.players[1].areShipsOk(function () {
                    self.stopWaiting();
                    self.goNextPhase();
                });
                break;
            case this.PHASE_PLAY_PLAYER:
                console.log('play player')
                utils.info("A vous de jouer, choisissez une case !");
                break;
            case this.PHASE_PLAY_OPPONENT:
                console.log('play computer')
                utils.info("A votre adversaire de jouer...");
                this.players[1].play();
                break;
            case this.PHASE_GAME_OVER:
                console.log('end game check')
                // detection de la fin de partie
                if (!this.gameIsOver(this.miniGrid)) {
                    // le jeu n'est pas terminé on recommence un tour de jeu
                    this.currentPhase = this.phaseOrder[this.playerTurnPhaseIndex -1];
                    self.goNextPhase();
                }
            }
        },
        gameIsOver: function (playerGrid) 
        {
            let computerGrid = this.players[1].getGrid();
            let checkComputer = 0;
            let checkPlayer = 0
            computerGrid.forEach(line => 
                line.forEach(cell => {
                    if (cell === 5 || cell === 6 || cell === 7 || cell === 8)
                    {
                        checkComputer++;
                    }
                })
            )
            playerGrid.forEach(line => 
                line.forEach(cell => {
                    if (cell === 1 || cell === 2 || cell === 3 || cell === 4)
                    {
                        checkPlayer++;
                    }
                })
            )
            if (checkPlayer === 0)
            {
                alert('Vous avez perdu...');
                return true;
            }
            if (checkComputer === 0)
            {
                alert('Vous avez gagnez!');
                return true;
            }
            else return false;
        },
        getPhase: function () {
            if (this.waiting) {
                return this.PHASE_WAITING;
            }
            return this.currentPhase;
        },
        // met le jeu en mode "attente" (les actions joueurs ne doivent pas être pris en compte si le jeu est dans ce mode)
        wait: function () {
            this.waiting = true;
        },
        // met fin au mode mode "attente"
        stopWaiting: function () {
            this.waiting = false;
        },
        addListeners: function () {
            // on ajoute des acouteur uniquement sur la grid (délégation d'événement)
            this.grid.addEventListener('mousemove', _.bind(this.handleMouseMove, this));
            this.grid.addEventListener('click', _.bind(this.handleClick, this));
        },
        handleMouseMove: function (e) {
            // on est dans la phase de placement des bateau
            if (this.getPhase() === this.PHASE_INIT_PLAYER && e.target.classList.contains('cell')) {
                var ship = this.players[0].fleet[this.players[0].activeShip];

                // si on a pas encore affiché (ajouté aux DOM) ce bateau
                if (!ship.dom.parentNode) {
                    this.grid.appendChild(ship.dom);
                    // passage en arrière plan pour ne pas empêcher la capture des événements sur les cellules de la grille
                    ship.dom.style.zIndex = -1;
                }

                // décalage visuelle, le point d'ancrage du curseur est au milieu du bateau
                ship.dom.style.top = "" + (utils.eq(e.target.parentNode)) * utils.CELL_SIZE - (600 + this.players[0].activeShip * 60) + "px";
                ship.dom.style.left = "" + utils.eq(e.target) * utils.CELL_SIZE - Math.floor(ship.getLife() / 2) * utils.CELL_SIZE + "px";
            }
        },
        handleClick: function (e) {
            // self garde une référence vers "this" en cas de changement de scope
            var self = this;

            // si on a cliqué sur une cellule (délégation d'événement)
            if (e.target.classList.contains('cell')) {
                // si on est dans la phase de placement des bateau
                if (this.getPhase() === this.PHASE_INIT_PLAYER) {
                    // on enregistre la position du bateau, si cela se passe bien (la fonction renvoie true) on continue
                    if (this.players[0].setActiveShipPosition(utils.eq(e.target), utils.eq(e.target.parentNode))) {
                        // et on passe au bateau suivant (si il n'y en plus la fonction retournera false)
                        if (!this.players[0].activateNextShip()) {
                            this.wait();
                            utils.confirm("Confirmez le placement ?", function () {
                                // si le placement est confirmé
                                self.stopWaiting();
                                self.renderMiniMap();
                                self.players[0].clearPreview();
                                self.goNextPhase();
                            }, function () {
                                self.stopWaiting();
                                // sinon, on efface les bateaux (les positions enregistrées), et on recommence
                                self.players[0].resetShipPlacement();
                            });
                        }
                    }
                // si on est dans la phase de jeu (du joueur humain)
                } else if (this.getPhase() === this.PHASE_PLAY_PLAYER) {
                    let check = this.players[0].play(utils.eq(e.target), utils.eq(e.target.parentNode));
                    if (check == 5)
                    {
                        utils.info("Vous avez déja essayer de tirer ici");
                    }
                }
            }
        },
        // fonction utlisée par les objets représentant les joueurs (ordinateur ou non)
        // pour placer un tir et obtenir de l'adversaire l'information de réusssite ou non du tir
        fire: function (from, col, line, callback) {
            this.wait();
            var self = this;
            var msg = "";

            // determine qui est l'attaquant et qui est attaqué
            var target = this.players.indexOf(from) === 0 ? this.players[1] : this.players[0];
            if (this.currentPhase === this.PHASE_PLAY_OPPONENT) {
                this.players[0].checkSunkShip(target.grid);
                msg += "Votre adversaire vous a... ";
            }

            // on demande à l'attaqué si il a un bateaux à la position visée
            // le résultat devra être passé en paramètre à la fonction de callback (3e paramètre)
            target.receiveAttack(col, line, function (hasSucceed) {
                if (hasSucceed === true) 
                {
                    msg += "Touché !";
                } 
                else if (hasSucceed === false) 
                {
                    msg += "Manqué...";
                }

                utils.info(msg);

                // on invoque la fonction callback (4e paramètre passé à la méthode fire)
                // pour transmettre à l'attaquant le résultat de l'attaque
                callback(hasSucceed);

                // on fait une petite pause avant de continuer...
                // histoire de laisser le temps au joueur de lire les message affiché
                setTimeout(function () {
                    self.stopWaiting();
                    self.goNextPhase();
                }, 500);
            });

        },
        renderMap: function () {
            this.players[0].renderTries(this.grid);
        },
        renderMiniMap: function () {
            this.miniGrid = player.grid;
            let i = 0;
            let miniGridCellDom = document.querySelectorAll('.cell');
            this.miniGrid.forEach(line => 
                line.forEach(cell => {
                    if (cell == 1)
                        miniGridCellDom[i].style.backgroundColor = "#e60019";
                    if (cell == 2)
                        miniGridCellDom[i].style.backgroundColor = "#577cc2";
                    if (cell == 3)
                        miniGridCellDom[i].style.backgroundColor = "#56988c";
                    if (cell == 4)
                        miniGridCellDom[i].style.backgroundColor = "#203140";
                    i++;
                })
            )
        }
    };

    // point d'entrée
    document.addEventListener('DOMContentLoaded', function () {
        game.init();
    });

}());