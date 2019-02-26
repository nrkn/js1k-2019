"use strict";
let s = () => {
    let sprites = '_`t`_~SA]kkA';
    let xor = 65;
    let VIEWSIZE = 9;
    let TILESIZE = 5;
    let floor = 2;
    let up = 0;
    let left = 1;
    let right = 2;
    let down = 3;
    let width = 4;
    let height = 5;
    let key = (x, y) => x + ',' + y;
    let rooms = 40;
    let sizeMin = 4;
    let sizeMax = 12;
    let graphData = {};
    let widthsData = {};
    let heightsData = {};
    let mapData = {};
    let roomCount = 0;
    let current = [rooms, rooms];
    let player;
    let draw = () => {
        a.width = a.height = VIEWSIZE * 7 * TILESIZE;
        c.fillStyle = '#000';
        for (let viewY = 0; viewY < VIEWSIZE; viewY++) {
            for (let viewX = 0; viewX < VIEWSIZE; viewX++) {
                let mapX = viewX - 4 + player[0];
                let mapY = viewY - 4 + player[1];
                let spriteIndex = viewX === 4 && viewY === 4 ? 0 : -1;
                let drawX = viewX * 7 * TILESIZE;
                let drawY = viewY * 7 * TILESIZE;
                for (let spriteY = 0; spriteY < 7; spriteY++) {
                    for (let spriteX = 0; spriteX < 7; spriteX++) {
                        if (spriteIndex >= 0 && (xor ^ sprites.charCodeAt(spriteIndex * 7 + spriteY)) >> spriteX & 1) {
                            c.fillRect(spriteX * TILESIZE + drawX, spriteY * TILESIZE + drawY, TILESIZE, TILESIZE);
                        }
                        else if (!mapData[key(mapX, mapY)]) {
                            c.fillRect(spriteX * TILESIZE + drawX, spriteY * TILESIZE + drawY, TILESIZE, TILESIZE);
                        }
                    }
                }
            }
        }
    };
    while (roomCount < rooms) {
        let dir = ~~(Math.random() * 4);
        if (!widthsData[current[0]]) {
            widthsData[current[0]] = ~~(Math.random() * sizeMax) + sizeMin;
        }
        if (!heightsData[current[1]]) {
            heightsData[current[1]] = ~~(Math.random() * sizeMax) + sizeMin;
        }
        if (!graphData[key(current[0], current[1])]) {
            graphData[key(current[0], current[1])] = [
                0, 0, 0, 0,
                ~~(Math.random() * widthsData[current[0]]) + 1,
                ~~(Math.random() * heightsData[current[1]]) + 1
            ];
            roomCount++;
        }
        graphData[key(current[0], current[1])][dir] = 1;
        current = [
            current[0] + [
                [0, -1],
                [-1, 0],
                [1, 0],
                [0, 1]
            ][dir][0],
            current[1] + [
                [0, -1],
                [-1, 0],
                [1, 0],
                [0, 1]
            ][dir][1]
        ];
        if (!widthsData[current[0]]) {
            widthsData[current[0]] = ~~(Math.random() * sizeMax) + sizeMin;
        }
        if (!heightsData[current[1]]) {
            heightsData[current[1]] = ~~(Math.random() * sizeMax) + sizeMin;
        }
        if (!graphData[key(current[0], current[1])]) {
            graphData[key(current[0], current[1])] = [
                0, 0, 0, 0,
                ~~(Math.random() * widthsData[current[0]]) + 1,
                ~~(Math.random() * heightsData[current[1]]) + 1
            ];
            roomCount++;
        }
        // ( 3 - dir ) is the opposite direction to dir
        graphData[key(current[0], current[1])][3 - dir] = 1;
    }
    let createMap = () => {
        let mapX, mapY;
        // draw corridors
        mapY = 0;
        for (let y = 0; y < rooms * 2; y++) {
            mapX = 0;
            for (let x = 0; x < rooms * 2; x++) {
                if (graphData[key(x, y)]) {
                    let centerX = ~~(widthsData[x] / 2);
                    let centerY = ~~(heightsData[y] / 2);
                    for (let gy = 0; gy < heightsData[y]; gy++) {
                        for (let gx = 0; gx < widthsData[x]; gx++) {
                            // draw if up
                            if (graphData[key(x, y)][up]) {
                                if (gy <= centerY && gx === centerX) {
                                    mapData[key(gx + mapX, gy + mapY)] = floor;
                                }
                            }
                            // draw if left
                            if (graphData[key(x, y)][left]) {
                                if (gx <= centerX && gy === centerY) {
                                    mapData[key(gx + mapX, gy + mapY)] = floor;
                                }
                            }
                            // draw if right
                            if (graphData[key(x, y)][right]) {
                                if (gx >= centerX && gy === centerY) {
                                    mapData[key(gx + mapX, gy + mapY)] = floor;
                                }
                            }
                            // draw if down
                            if (graphData[key(x, y)][down]) {
                                if (gy >= centerY && gx === centerX) {
                                    mapData[key(gx + mapX, gy + mapY)] = floor;
                                }
                            }
                        }
                    }
                }
                if (widthsData[x])
                    mapX += widthsData[x];
            }
            if (heightsData[y])
                mapY += heightsData[y];
        }
        //draw rooms
        mapY = 0;
        for (let y = 0; y < rooms * 2; y++) {
            mapX = 0;
            for (let x = 0; x < rooms * 2; x++) {
                if (graphData[key(x, y)]) {
                    let centerX = ~~(widthsData[x] / 2);
                    let centerY = ~~(heightsData[y] / 2);
                    let xOff = centerX - ~~(graphData[key(x, y)][width] / 2);
                    let yOff = centerY - ~~(graphData[key(x, y)][height] / 2);
                    for (let ry = 0; ry < graphData[key(x, y)][height]; ry++) {
                        for (let rx = 0; rx < graphData[key(x, y)][width]; rx++) {
                            mapData[key(rx + xOff + mapX, ry + yOff + mapY)] = floor;
                        }
                    }
                    if (x === rooms && y === rooms) {
                        player = [centerX + mapX, centerY + mapY];
                    }
                }
                if (widthsData[x])
                    mapX += widthsData[x];
            }
            if (heightsData[y])
                mapY += heightsData[y];
        }
    };
    createMap();
    draw();
};
s();
//# sourceMappingURL=index.js.map