"use strict";
//This function closure prevents a Chrome eval bug when using a packer
let G = () => {
    //Constants make it a lot more readable, get inlined by the minifier
    //Indices into tile structures - cheaper & packs better if structure is an array
    let X = 0;
    let Y = 1;
    let TILE_TYPE = 2;
    let HP = 3;
    let CHAR = 4;
    let COLOR = 5;
    let SEEN = 6;
    //Tile types
    let TILE_TYPE_PLAYER = 0;
    let TILE_TYPE_MONSTER = 1;
    let TILE_TYPE_STAIRS_DOWN = 2;
    let TILE_TYPE_FLOOR = 3;
    let TILE_TYPE_POTION = 4;
    let TILE_TYPE_WALL = 5;
    // Indices into level structure
    let FLOORS = 0;
    let MOBS = 1;
    let CHAR_PLAYER = '@';
    let CHAR_WALL = '#';
    let CHAR_FLOOR = '.';
    let CHAR_MONSTER = 'm';
    let CHAR_STAIRS_DOWN = '>';
    let CHAR_POTION = '¢';
    let CHAR_WIN = '$';
    let COLOR_PLAYER = '#39f';
    let COLOR_WALL = '#aaa';
    let COLOR_FLOOR = '#aaa';
    let COLOR_MONSTER = '#f00';
    let COLOR_STAIRS_DOWN = '#000';
    let COLOR_POTION = '#f90';
    let COLOR_WIN = '#39f';
    //Base level generator settings
    let width = 10;
    let height = 10;
    let roomCount = 2;
    let monsterCount = 2;
    let playerStartHP = 10;
    //View settings
    let viewSize = 25;
    let viewOff = 12; // ( viewSize - 1 ) / 2
    let fov = 8;
    let randInt = exclusiveMax => (Math.random() * exclusiveMax) | 0;
    //Game state
    let currentLevel = 0;
    let level;
    let player = [
        0, 0, TILE_TYPE_PLAYER, playerStartHP, CHAR_PLAYER, COLOR_PLAYER
    ];
    /*
      Does point collide with a tile?
      Checks hit points and doesn't consider "dead" tiles
      Lets us kill monsters, pick up potions without deleting them from array, which
      is expensive
      Means floors etc need HP in order to be drawn haha
    */
    let collides = (tiles, point) => {
        for (let i = 0; i < tiles.length; i++) {
            if (tiles[i][HP] &&
                point[X] == tiles[i][X] &&
                point[Y] == tiles[i][Y])
                return tiles[i];
        }
    };
    /*
      Mutates p2
      If towards is truthy it moves towards p1, otherwise moves according to
      direction passed
    */
    let towardsOrDirection = (p1, p2, direction, towards) => {
        if (towards) {
            if (p1[X] < p2[X]) {
                p2[X]--;
            }
            else if (p1[X] > p2[X]) {
                p2[X]++;
            }
            else if (p1[Y] < p2[Y]) {
                p2[Y]--;
            }
            else if (p1[Y] > p2[Y]) {
                p2[Y]++;
            }
        }
        else {
            if (direction == 1) {
                p2[Y]--;
            }
            else if (direction == 2) {
                p2[X]++;
            }
            else if (direction == 3) {
                p2[Y]++;
            }
            else {
                p2[X]--;
            }
        }
    };
    //Level generator
    let NewLevel = () => {
        level = [
            //floor tiles
            [
                [player[X], player[Y], TILE_TYPE_FLOOR, 1, CHAR_FLOOR, COLOR_FLOOR]
            ],
            //mobs
            [player]
        ];
        //Larger, more monsters etc as you progress
        let levelWidth = randInt(currentLevel * width) + width;
        let levelHeight = randInt(currentLevel * height) + height;
        let levelRooms = randInt(currentLevel * roomCount) + roomCount;
        let levelMonsters = randInt(currentLevel * monsterCount) + monsterCount;
        let levelPotions = randInt(currentLevel * monsterCount) + monsterCount;
        // randomly place new mob
        let addMob = (tileType, hp, ch, color) => {
            let mob = [
                randInt(levelWidth), randInt(levelHeight),
                tileType, hp, ch, color
            ];
            /*
              Has to collide with floor to be on map, also has to be only mob at this
              point on map
            */
            if (collides(level[FLOORS], mob) &&
                !collides(level[MOBS], mob)) {
                level[MOBS].push(mob);
                return mob;
            }
            //Couldn't place, try again
            return addMob(tileType, hp, ch, color);
        };
        //Tunnel out a cave between p1 and p2
        let connect = (p1, p2) => {
            //Place floor at p2 if doesn't exist
            if (!collides(level[FLOORS], p2)) {
                level[FLOORS].push([p2[X], p2[Y], TILE_TYPE_FLOOR, 1, CHAR_FLOOR, COLOR_FLOOR]);
            }
            //Reached goal, stop
            if (p1[X] == p2[X] && p1[Y] == p2[Y])
                return;
            //Pick a direction
            let direction = randInt(4);
            /*
              1 in 4 chance moves to goal, otherwise random direction above
              Best to move randomly most of time, or ends up series of L shaped
              corridors
            */
            towardsOrDirection(p1, p2, direction, !randInt(3));
            //Next step towards p1
            connect(p1, p2);
        };
        for (let i = 0; i < levelRooms; i++) {
            //Tunnel from a random point to a randomly selected existing point
            connect(level[FLOORS][randInt(level[FLOORS].length)], [randInt(levelWidth), randInt(levelHeight)]);
        }
        //Would be nice to modify so stairs can't block corridors
        addMob(TILE_TYPE_STAIRS_DOWN, 1, currentLevel > 8 ? CHAR_WIN : CHAR_STAIRS_DOWN, currentLevel > 8 ? COLOR_WIN : COLOR_STAIRS_DOWN);
        //Place some monsters
        for (let i = 0; i < levelMonsters; i++) {
            addMob(TILE_TYPE_MONSTER, 1, CHAR_MONSTER, COLOR_MONSTER);
        }
        //Healing potions (coins)
        for (let i = 0; i < levelPotions; i++) {
            addMob(TILE_TYPE_POTION, 1, CHAR_POTION, COLOR_POTION);
        }
    };
    /*
      Bit like a raycaster, create viewport centered on player and use collision
      algorithm to see what tile we hit, no tedious bounds checking etc - good for
      byte count inefficient for CPU. With large viewport and large level very slow,
      even on modern machines, runs OK with settings we're using
    */
    let draw = () => {
        //canvas defaults to 10pt
        let textSize = 10;
        //clear canvas
        a.width = a.width;
        //end conditions
        let dead = player[HP] < 1;
        let won = currentLevel > 9;
        for (let vY = 0; vY < viewSize; vY++) {
            for (let vX = 0; vX < viewSize; vX++) {
                //Normalize viewport coordinates to map coordinates, centered on player
                let x = player[X] - viewOff + vX;
                let y = player[Y] - viewOff + vY;
                //Check first for a mob, if not, a floor
                let current = collides(level[MOBS], [x, y]) ||
                    collides(level[FLOORS], [x, y]);
                //If nothing found, add wall, then assign it to current
                if (!current) {
                    level[MOBS].push([x, y, TILE_TYPE_WALL, 1, CHAR_WALL, COLOR_WALL]);
                    current = collides(level[MOBS], [x, y]);
                }
                //Flag everything in fov distance as seen
                if (vX >= fov && vY >= fov &&
                    vX < (viewSize - fov) && vY < (viewSize - fov)) {
                    current[SEEN] = 1;
                }
                /*
                  If player dead or won, use WIN color to draw, otherwise use current
                  tile's color
                */
                c.fillStyle = dead || won ? COLOR_WIN : current[COLOR];
                /*
                  If won, draw $ regardless of tile so screen fills with $
                  For dead, same but fill with 0
                  Otherwise, check if seen and draw tile's character, if unseen a space
                */
                c.fillText(won ?
                    CHAR_WIN :
                    dead ?
                        0 :
                        current[SEEN] ?
                            current[CHAR] :
                            ' ', vX * textSize, vY * textSize);
            }
        }
        //Show current level and HP (coins) if not won or dead
        if (!dead && !won) {
            c.fillStyle = '#000';
            c.fillText(1 + currentLevel + ' ¢' + player[HP], 0, viewSize * textSize);
        }
    };
    //Movement for both payers and monsters
    let move = (mob, direction) => {
        //set initial position to current position
        let currentPosition = [mob[X], mob[Y]];
        /*
          If monster, one in five chance doesn't move towards player, otherwise try to
          move closer - the move algorithm creates very predictable movement but is
          also very cheap - the chance not to move towards player helps to stop
          monsters getting permanently stuck and makes it feel less mechanical
        */
        towardsOrDirection(player, currentPosition, direction, mob[TILE_TYPE] == TILE_TYPE_MONSTER && randInt(5));
        /*
          See if anything is at the point we tried to move to
        */
        let currentTile = collides(level[MOBS], currentPosition);
        /*
          If we're a monster and the tile we tried to move to has a player on it,
          try to hit them instead of moving there (50% chance)
        */
        if (currentTile && mob[TILE_TYPE] == TILE_TYPE_MONSTER &&
            currentTile[TILE_TYPE] == TILE_TYPE_PLAYER && randInt(2)) {
            currentTile[HP]--;
        }
        /*
          Ditto for player moving onto monster
        */
        else if (currentTile && mob[TILE_TYPE] == TILE_TYPE_PLAYER &&
            currentTile[TILE_TYPE] == TILE_TYPE_MONSTER && randInt(2)) {
            currentTile[HP]--;
        }
        /*
          Player moved on to stairs, create a new level
        */
        else if (currentTile && mob[TILE_TYPE] == TILE_TYPE_PLAYER &&
            currentTile[TILE_TYPE] == TILE_TYPE_STAIRS_DOWN) {
            currentLevel++;
            NewLevel();
        }
        /*
          Potion - note that monsters can also pick up potions - to change, check
          if mob is player, but this is more fun for game play as it creates some
          monsters that are stronger as the monsters traverse the level and get
          potions, also situations where the player is trying not to let the monster
          get it etc
        */
        else if (currentTile && currentTile[TILE_TYPE] == TILE_TYPE_POTION) {
            mob[HP]++;
            currentTile[HP]--;
        }
        /*
          Finally, if nothing else happened and this is a floor tile, we can move the
          mob onto it
        */
        else if (collides(level[FLOORS], currentPosition) && !currentTile) {
            mob[X] = currentPosition[X];
            mob[Y] = currentPosition[Y];
        }
    };
    b.onkeydown = e => {
        /*
          Player moves first, slight advantage
        */
        move(player, e.which - 37);
        /*
          Search the mobs for monsters, try to randomly move any that aren't dead
          Monsters prefer to move towards player but there's a chance they'll use
          this passed in random direction instead
        */
        for (let i = 0; i < level[MOBS].length; i++) {
            if (level[MOBS][i][HP] &&
                level[MOBS][i][TILE_TYPE] == TILE_TYPE_MONSTER)
                move(level[MOBS][i], randInt(4));
        }
        /*
          Redraw on movement
        */
        draw();
    };
    /*
      Generate first level, draw initial view
    */
    NewLevel();
    draw();
};
G();
//# sourceMappingURL=index.js.map