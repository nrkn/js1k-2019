"use strict";
let s = () => {
    let sprites = '_@T@_~SA]kkA@@@@@A_MMS`~_~NRUTT~';
    let xor = 65;
    let VIEWSIZE = 9;
    let TILESIZE = 5;
    let monster = 1;
    let floor = 2;
    let floor2 = 3;
    let potion = 4;
    let monsterSprite = 1;
    let floorSprite = 2;
    let potionSprite = 3;
    let key = (x, y) => x + ',' + y;
    let mapData;
    let player;
    let monsters;
    let draw = () => {
        a.width = a.height = VIEWSIZE * 7 * TILESIZE;
        for (let viewY = 0; viewY < VIEWSIZE; viewY++) {
            for (let viewX = 0; viewX < VIEWSIZE; viewX++) {
                let mapX = viewX - 4 + player[0];
                let mapY = viewY - 4 + player[1];
                let spriteIndex = -1;
                let color = 333;
                if (viewX === 4 && viewY === 4) {
                    spriteIndex = 0;
                    color = '0fb730'[player[2]] + '31';
                }
                else if (mapData[key(mapX, mapY)] === floor) {
                    spriteIndex = floorSprite;
                    color = 'ddd';
                }
                else if (mapData[key(mapX, mapY)] === floor2) {
                    spriteIndex = floorSprite;
                    color = 'eee';
                }
                else if (mapData[key(mapX, mapY)] === potion) {
                    spriteIndex = potionSprite;
                    color = 909;
                }
                else if (mapData[key(mapX, mapY)] === monster) {
                    spriteIndex = monsterSprite;
                    for (let i = 0; i < monsters.length; i++) {
                        if (monsters[i][0] === mapX
                            &&
                                monsters[i][1] === mapY) {
                            color = '0fb730'[monsters[i][2]] + 13;
                        }
                    }
                }
                let drawX = viewX * 7 * TILESIZE;
                let drawY = viewY * 7 * TILESIZE;
                c.fillStyle = '#' + color;
                for (let spriteY = 0; spriteY < 7; spriteY++) {
                    for (let spriteX = 0; spriteX < 7; spriteX++) {
                        // if (
                        //   spriteIndex > -1
                        //   &&
                        //   ( xor ^ sprites.charCodeAt( spriteIndex * 7 + spriteY ) ) >> spriteX & 1
                        // ){
                        //   c.fillRect(
                        //     spriteX * TILESIZE + drawX, spriteY * TILESIZE + drawY,
                        //     TILESIZE, TILESIZE
                        //   )
                        // } else if (
                        //   !mapData[ key(
                        //     mapX,
                        //     mapY
                        //   ) ]
                        // ) {
                        //   c.fillRect(
                        //     spriteX * TILESIZE + drawX, spriteY * TILESIZE + drawY,
                        //     TILESIZE, TILESIZE
                        //   )
                        // }
                        if ((spriteIndex > -1
                            &&
                                (xor ^ sprites.charCodeAt(spriteIndex * 7 + spriteY)) >> spriteX & 1)
                            ||
                                !mapData[key(mapX, mapY)]) {
                            c.fillRect(spriteX * TILESIZE + drawX, spriteY * TILESIZE + drawY, TILESIZE, TILESIZE);
                        }
                    }
                }
            }
        }
    };
    let createMap = () => {
        mapData = {};
        player = [0, 0, 5];
        monsters = [];
        let movement = 1000;
        let monsterChance = movement / 4;
        let current = [0, 0];
        for (let i = 0; i < movement; i++) {
            mapData[key(current[0], current[1])] = floor + ~~(Math.random() * 2);
            if ((current[0]) !== player[0] &&
                !~~(Math.random() * monsterChance)) {
                mapData[key(current[0], current[1])] = potion;
            }
            else if ((current[0]) !== player[0] &&
                !~~(Math.random() * monsterChance)) {
                monsters[monsters.length] = [
                    current[0],
                    current[1],
                    ~~(Math.random() * 5) + 1
                ];
                mapData[key(current[0], current[1])] = monster;
            }
            let dir = ~~(Math.random() * 4);
            current = [
                current[0] + [0, -1, 1, 0][dir],
                current[1] + [-1, 0, 0, 1][dir]
            ];
        }
    };
    createMap();
    draw();
    b.onkeydown = e => {
        let x = (e.which === 37 ? -1 :
            e.which === 39 ? 1 :
                0);
        let y = (e.which === 38 ? -1 :
            e.which === 40 ? 1 :
                0);
        if (mapData[key(player[0] + x, player[1] + y)] === floor
            ||
                mapData[key(player[0] + x, player[1] + y)] === floor2) {
            player = [
                player[0] + x,
                player[1] + y,
                player[2]
            ];
        }
        else if (mapData[key(player[0] + x, player[1] + y)] === monster) {
            for (let i = 0; i < monsters.length; i++) {
                if (monsters[i][0] === (player[0] + x) &&
                    monsters[i][1] === (player[1] + y)) {
                    if (monsters[i][2]) {
                        monsters[i][2]--;
                        if (!monsters[i][2]) {
                            mapData[key(player[0] + x, player[1] + y)] = floor + ~~(Math.random() * 2);
                        }
                    }
                }
            }
        }
        else if (mapData[key(player[0] + x, player[1] + y)] === potion) {
            mapData[key(player[0] + x, player[1] + y)] = floor + ~~(Math.random() * 2);
            if (player[2] < 5)
                player[2]++;
        }
        for (let i = 0; i < monsters.length; i++) {
            if ((x || y)
                &&
                    monsters[i][2]) {
                let action = ~~(Math.random() * 4);
                let dir = ~~(Math.random() * 4);
                if (action < 2) {
                    x = [0, -1, 1, 0][dir];
                    y = [-1, 0, 0, 1][dir];
                }
                else if (action < 3) {
                    x = player[0] < monsters[i][0] ? -1 : 1;
                    y = 0;
                }
                else {
                    x = 0;
                    y = player[1] < monsters[i][1] ? -1 : 1;
                }
                if (monsters[i][0] + x === player[0]
                    &&
                        monsters[i][1] + y === player[1]) {
                    if (~~(Math.random() * 2)) {
                        player[2]--;
                        if (!player[2]) {
                            createMap();
                        }
                    }
                }
                else if (mapData[key(monsters[i][0] + x, monsters[i][1] + y)] === floor
                    ||
                        mapData[key(monsters[i][0] + x, monsters[i][1] + y)] === floor2) {
                    mapData[key(monsters[i][0], monsters[i][1])] = floor + ~~(Math.random() * 2);
                    monsters[i] = [
                        monsters[i][0] + x,
                        monsters[i][1] + y,
                        monsters[i][2]
                    ];
                    mapData[key(monsters[i][0], monsters[i][1])] = monster;
                }
            }
        }
        draw();
    };
};
s();
//# sourceMappingURL=index.js.map