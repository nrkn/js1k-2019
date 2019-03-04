"use strict";
let s = () => {
    let sprites = '^AUA^R@N_U_U@@@@@@U@^LLRa^OSTUU';
    let xor = 64;
    let VIEWSIZE = 9;
    let TILESIZE = 5;
    let floor = 3;
    let potion = 5;
    let stairs = 6;
    let playerSprite = 0;
    let monsterSprite = 1;
    let floorSprite = 2;
    let potionSprite = 3;
    let stairsSprite = 4;
    let key = (x, y) => x + 'fd9' + y;
    let level = 0;
    //let level = 5
    let mapData;
    let player;
    let monsters;
    let draw = () => {
        a.width = a.height = VIEWSIZE * 7 * TILESIZE;
        for (let viewY = 0; viewY < VIEWSIZE; viewY++) {
            for (let viewX = 0; viewX < VIEWSIZE; viewX++) {
                let mapY = viewY - 4 + player[1];
                let spriteIndex = -1;
                let color = 37 + 'fd9640'[level];
                if (viewX == 4 && viewY == 4) {
                    spriteIndex = 0;
                    color = 'fd9640'[player[2]] + 37;
                }
                else if (mapData[key(viewX - 4 + player[0], mapY)] == floor) {
                    spriteIndex = floorSprite;
                    color = 'fd9';
                }
                else if (mapData[key(viewX - 4 + player[0], mapY)] == potion) {
                    spriteIndex = potionSprite;
                    color = 640;
                }
                else if (mapData[key(viewX - 4 + player[0], mapY)] == stairs) {
                    spriteIndex = level < 5 ? stairsSprite : playerSprite;
                }
                for (let i = 0; i < monsters.length; i++) {
                    if (monsters[i][2]
                        &&
                            monsters[i][0] == viewX - 4 + player[0]
                        &&
                            monsters[i][1] == mapY) {
                        spriteIndex = monsterSprite;
                        color = 'fd9640'[monsters[i][2]] + 37;
                    }
                }
                c.fillStyle = '#' + color;
                for (let spriteY = 0; spriteY < 7; spriteY++) {
                    for (let spriteX = 0; spriteX < 7; spriteX++) {
                        if ((spriteIndex > -1
                            &&
                                (xor ^ sprites.charCodeAt(spriteIndex * 7 + spriteY)) >> spriteX & 1)
                            ||
                                !mapData[key(viewX - 4 + player[0], mapY)]) {
                            c.fillRect(spriteX * TILESIZE + viewX * 7 * TILESIZE, spriteY * TILESIZE + viewY * 7 * TILESIZE, TILESIZE, TILESIZE);
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
        let current = [0, 0];
        let size = 640;
        //let size = 10
        for (let i = 0; i < (size * (level + 1)); i++) {
            mapData[key(current[0], current[1])] = floor + ~~(Math.random() * 2);
            if ((current[0]) !== player[0] &&
                !~~(Math.random() * (size * (level + 1)) / (level + 7))) {
                mapData[key(current[0], current[1])] = potion;
            }
            else if ((current[0]) !== player[0] &&
                !~~(Math.random() * (size * (level + 1)) / (level + 7))) {
                monsters[monsters.length] = [
                    current[0],
                    current[1],
                    ~~(Math.random() * 5) + 1
                ];
            }
            let dir = ~~(Math.random() * 4);
            if (level < 6) {
                current = [
                    current[0] + [0, -1, 1, 0][dir],
                    current[1] + [-1, 0, 0, 1][dir]
                ];
            }
        }
        mapData[key(current[0], current[1])] = stairs;
    };
    createMap();
    draw();
    b.onkeydown = e => {
        let x = (e.which == 37 ? -1 :
            e.which == 39 ? 1 :
                0);
        let y = (e.which == 38 ? -1 :
            e.which == 40 ? 1 :
                0);
        for (let i = 0; i < monsters.length; i++) {
            if (x || y) {
                let action = ~~(Math.random() * 4);
                let dir = ~~(Math.random() * 4);
                if (monsters[i][0] == (player[0] + x) &&
                    monsters[i][1] == (player[1] + y)) {
                    if (monsters[i][2]) {
                        monsters[i][2]--;
                        x = 0;
                        y = 0;
                    }
                }
                if (monsters[i][2]) {
                    let mx, my;
                    if (action < 2) {
                        mx = [0, -1, 1, 0][dir];
                        my = [-1, 0, 0, 1][dir];
                    }
                    else if (action < 3) {
                        mx = player[0] < monsters[i][0] ? -1 : 1;
                        my = 0;
                    }
                    else {
                        mx = 0;
                        my = player[1] < monsters[i][1] ? -1 : 1;
                    }
                    if (monsters[i][0] + mx == player[0]
                        &&
                            monsters[i][1] + my == player[1]) {
                        if (~~(Math.random() * 2)) {
                            player[2]--;
                            if (!player[2]) {
                                level = 0;
                                createMap();
                            }
                        }
                    }
                    else if (
                    // floor is 3 or 4
                    mapData[key(monsters[i][0] + mx, monsters[i][1] + my)] < 5) {
                        monsters[i] = [
                            monsters[i][0] + mx,
                            monsters[i][1] + my,
                            monsters[i][2]
                        ];
                    }
                }
            }
        }
        if (mapData[key(player[0] + x, player[1] + y)] < 5) {
            player = [
                player[0] + x,
                player[1] + y,
                player[2]
            ];
        }
        else if (mapData[key(player[0] + x, player[1] + y)] == potion) {
            mapData[key(player[0] + x, player[1] + y)] = floor + ~~(Math.random() * 2);
            if (player[2] < 5)
                player[2]++;
        }
        else if (mapData[key(player[0] + x, player[1] + y)] == stairs) {
            level++;
            createMap();
        }
        draw();
    };
};
s();
//# sourceMappingURL=index.js.map