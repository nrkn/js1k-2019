declare const a: HTMLCanvasElement
declare const b: HTMLBodyElement
declare const c: CanvasRenderingContext2D
declare const d: Document

// closure so that uglify won't treat any variables as local
(() => {
  /*
    6x7 1-bit sprites packed into chars - drawn as 7x7 to have square tiles

    You can use 7x7 but for it to fit into the printable ascii range so you can
    put it in a normal javascript string, the high bit has to be set, so if you
    have a sprite that doesn't use the 7th column you have to find some value
    you can xor the charcodes with so that all the rows still fit in the
    printable ascii range (therefore 1byte per char in utf8).

    It's a clever solution but you can save the bytes you'd use doing this by
    just making them 1 column smaller instead.
  */
  let sprites = 'a~j~a@mq`j`jassm^@a@plkjj@{{{{q{@bTHTbmaua@m'

  // constants will get inlined
  let VIEWSIZE = 9
  let TILESIZE = 5
  let floor = 3
  let potion = 5
  let stairs = 6
  let sword = 7
  let playerSprite = 0
  let monsterSprite = 1
  let potionSprite = 2
  let stairsSprite = 3
  let swordSprite = 4
  let exitSprite = 5
  let monster2Sprite = 6
  let swordAmount = 1

  // global state
  let level = 0
  let mapData: any
  let mobs: number[][]

  let draw = () => {
    // start draw

    // clear the canvas
    a.width = VIEWSIZE * 7 * TILESIZE
    // draw the map tiles within the viewport
    for ( let viewY = 0; viewY < VIEWSIZE; viewY++ ) {
      for ( let viewX = 0; viewX < VIEWSIZE; viewX++ ) {
        let spriteIndex = (
          /*
            note the weird mapData[ x + 'string' + y ] pattern here

            first use of this pattern - basically we join the x and y together
            with an arbitrary string and use it for a key into the mapData
            object

            by making mapData an object instead of an array we don't have to
            worry about out of bounds and etc

            we join the x and y together with the most common string from the
            rest of the code to assist with packing
          */

          // do we have a mob at this location and is it alive, if so use
          // its sprite
          mobs[
            ( viewX - 4 + mobs[ 0 ][ 0 ] )
            + 'fd9640' +
            ( viewY - 4 + mobs[ 0 ][ 1 ] )
          ]
          &&
          mobs[
            ( viewX - 4 + mobs[ 0 ][ 0 ] )
            + 'fd9640' +
            ( viewY - 4 + mobs[ 0 ][ 1 ] )
          ][ 2 ] ?
          mobs[
            ( viewX - 4 + mobs[ 0 ][ 0 ] )
            + 'fd9640' +
            ( viewY - 4 + mobs[ 0 ][ 1 ] )
          ][ 3 ] :

          // or potion on map?
          mapData[
              ( viewX - 4 + mobs[ 0 ][ 0 ] )
              + 'fd9640' +
              ( viewY - 4 + mobs[ 0 ][ 1 ] )
          ] == potion ?
          potionSprite :

          // or sword on map?
          mapData[
              ( viewX - 4 + mobs[ 0 ][ 0 ] )
              + 'fd9640' +
              ( viewY - 4 + mobs[ 0 ][ 1 ] )
          ] == sword ?
          swordSprite :

          // or stairs
          mapData[
              ( viewX - 4 + mobs[ 0 ][ 0 ] )
              + 'fd9640' +
              ( viewY - 4 + mobs[ 0 ][ 1 ] )
          ] == stairs ?
          // on the last level show exit sprite instead of stairs
          level < 5 ? stairsSprite : exitSprite :

          // nothing, use the guard value
          7
        )

        c.fillStyle = (
          // mob (monster or player) here and it's alive?
          mobs[
            ( viewX - 4 + mobs[ 0 ][ 0 ] )
            + 'fd9640' +
            ( viewY - 4 + mobs[ 0 ][ 1 ] )
          ]
          &&
          mobs[
            ( viewX - 4 + mobs[ 0 ][ 0 ] )
            + 'fd9640' +
            ( viewY - 4 + mobs[ 0 ][ 1 ] )
          ][ 2 ] ?
          /*
            this charming piece of code makes the mob's color shift towards
            red when its health is low
          */
          '#' + 'fd9640'[
            mobs[
              ( viewX - 4 + mobs[ 0 ][ 0 ] )
              + 'fd9640' +
              ( viewY - 4 + mobs[ 0 ][ 1 ] )
            ][ 2 ]
          ] + 37 :

          // otherwise, is there a sprite, any sprite?
          mapData[
            ( viewX - 4 + mobs[ 0 ][ 0 ] )
            + 'fd9640' +
            ( viewY - 4 + mobs[ 0 ][ 1 ] )
          ] ?
          '#' + 964 :

          // must be a wall, use different colored walls for each level
          '#' + 37 + 'fd9640'[ level ]
        )

        // iterate over the pixels for the current sprite
        for ( let spriteY = 0; spriteY < 7; spriteY++ ) {
          for ( let spriteX = 0; spriteX < 7; spriteX++ ) {
            if (
              (
                /*
                  if it's the player, draw a sword in the last row. as the
                  player picks up more sword upgrades, the sword gets bigger
                */
                spriteIndex == playerSprite
                &&
                spriteX == 6
                &&
                spriteY < 6
                &&
                spriteY > 4 - swordAmount
              )
              ||
              (
                // if there's a sprite, true if the bit is set at this pixel
                spriteIndex < 7
                &&
                !(
                  (
                    sprites.charCodeAt( spriteIndex * 7 + spriteY )
                  ) >> spriteX & 1
                )
              )
              ||
              // there's no map data, it will draw a wall
              !mapData[
                  ( viewX - 4 + mobs[ 0 ][ 0 ] )
                  + 'fd9640' +
                ( viewY - 4 + mobs[ 0 ][ 1 ] )
              ]
            ) {
              c.fillRect(
                spriteX * TILESIZE + viewX * 7 * TILESIZE,
                spriteY * TILESIZE + viewY * 7 * TILESIZE,
                TILESIZE, TILESIZE
              )
            }
          }
        }
      }
    }

    // end draw
  }

  // generate a new random map
  let createMap = ( health: number ) => {
    // initalise the tile currently being randomly added, first is always 0,0
    let current = [ 0, 0 ]
    // base size of the map
    let size = 96

    // reset state
    mapData = {}
    /*
      add the player as the first mob
      if we went down a level restore the player's health to what it was
    */
    mobs = [ [ 0, 0, health, 0 ] ]
    /*
      mobs is an array AND an object, that way we can iterate over it but
      also get a mob at a specific position without having to iterate over it
    */
    mobs[
        ( 0 )
        + 'fd9640' +
        ( 0 )
    ] = mobs[ 0 ]

    // randomly add tiles to the map, as the level gets higher make it bigger
    for ( let i = 0; i < ( size * ( level + 1 ) ); i++ ){
      // by default it will be a floor tile
      mapData[
          ( current[ 0 ] )
          + 'fd9640' +
          ( current[ 1 ] )
      ] = floor

      // but some chance of it being a potion
      if (
        current[ 0 ] !== mobs[ 0 ][ 0 ] &&
        !~~( Math.random() * ( size * ( level + 1 ) ) / ( level + 7 ) )
      ) {
        mapData[
            ( current[ 0 ] )
            + 'fd9640' +
            ( current[ 1 ] )
        ] = potion
      }
      // or a monster
      else if (
        current[ 0 ] !== mobs[ 0 ][ 0 ]
        &&
        !~~( Math.random() * ( size * ( level + 1 ) ) / ( level + 7 ) )
        &&
        !mobs[
            ( current[ 0 ] )
            + 'fd9640' +
            ( current[ 1 ] )
        ]
      ) {
        /*
          create a new monster, place it at the end of the mobs array, then
          also add it to the array as a property so we can look up mobs by
          position without iterating
        */
        mobs[
            ( current[ 0 ] )
            + 'fd9640' +
            ( current[ 1 ] )
        ] = mobs[ mobs.length ] = [
          current[ 0 ],
          current[ 1 ],
          ~~( Math.random() * 5 ) + 1,
          ~~( Math.random() * 2 ) ? monsterSprite : monster2Sprite
        ]
      }

      // now pick a random direction to add to the map next
      let dir = ~~( Math.random() * 4 )

      /*
        when the player wins we don't generate anything, so the level generated
        after triggering the exit is empty, it causes a graphical glitch
        which makes a nice win screen
      */
      if( level < 6 ){
        // make the current tile the tile in the new direction
        current = [
          current[ 0 ] + [ 0, -1, 1, 0 ][ dir ],
          current[ 1 ] + [ -1, 0, 0, 1 ][ dir ]
        ]
      }
    }

    // make the last tile visited the stairs to the next level
    mapData[
        ( current[ 0 ] )
        + 'fd9640' +
        ( current[ 1 ] )
    ] = stairs
  }

  // key handler, triggers the game loop
  b.onkeydown = e => {
    // iterate over all mobs including player
    for ( let i = 0; i < mobs.length; i++ ) {
      // a random action for monsters to take
      let action = ~~( Math.random() * 4 )
      // will hold a code to determine movement
      let which: number

      /*
        which will get overridden if it's the player, but if it's a monster:
      */
      // move in a random direction 50% of the time
      if ( action < 2 ) {
        which = ~~( Math.random() * 4 ) + 37
      }
      // try to move towards the player on the x axis
      else if ( action < 3 ) {
        which = mobs[ 0 ][ 0 ] < mobs[ i ][ 0 ] ? 37 : 39
      }
      // try to move towards the player on the y axis
      else {
        which = mobs[ 0 ][ 1 ] < mobs[ i ][ 1 ] ? 38 : 40
      }

      // only process mobs which are alive - health is stored in mobs[][2]
      if( mobs[ i ][ 2 ] ){
        // if i is 0 it's the player, use the keycode from the event
        which = i ? which : e.which

        // left and right modifier
        let x = which == 37 ? -1 : which == 39 ? 1 : 0
        // up and down modifier
        let y = which == 38 ? -1 : which == 40 ? 1 : 0

        if (
          // dest is floor
          (
            mapData[
            ( mobs[ i ][ 0 ] + x )
            + 'fd9640' +
            ( mobs[ i ][ 1 ] + y )
            ] == floor
          )
          &&
          // no other mob here
          !mobs[
            ( mobs[ i ][ 0 ] + x )
            + 'fd9640' +
            ( mobs[ i ][ 1 ] + y )
          ]
        ) {
          // delete the mob from the array properties at the old location
          mobs[
            ( mobs[ i ][ 0 ] )
            + 'fd9640' +
            ( mobs[ i ][ 1 ] )
          ] = 0

          // update the mobs position to the new location
          mobs[ i ][ 0 ] = mobs[ i ][ 0 ] + x
          mobs[ i ][ 1 ] = mobs[ i ][ 1 ] + y

          // re-add the mob as a property of the array at the new location
          mobs[
            ( mobs[ i ][ 0 ] )
            + 'fd9640' +
            ( mobs[ i ][ 1 ] )
          ] = mobs[ i ]
        }
        else if (
          // dest is another mob
          mobs[
          ( mobs[ i ][ 0 ] + x )
          + 'fd9640' +
          ( mobs[ i ][ 1 ] + y )
          ]
        ) {
          // monster attacks player
          if (
            // current mob is not player
            i
            &&
            // target is player
            !mobs[
            ( mobs[ i ][ 0 ] + x )
            + 'fd9640' +
            ( mobs[ i ][ 1 ] + y )
            ][ 3 ]
            &&
            // 50% chance to hit
            ~~( Math.random() * 2 )
          ) {
            // decrement player health
            mobs[
              ( mobs[ i ][ 0 ] + x )
              + 'fd9640' +
              ( mobs[ i ][ 1 ] + y )
            ][ 2 ]--

            // if player dead, restart
            if (
              !mobs[
              ( mobs[ i ][ 0 ] + x )
              + 'fd9640' +
              ( mobs[ i ][ 1 ] + y )
              ][ 2 ]
            ) {
              // reset some of the state
              level = 0
              swordAmount = 1
              createMap( 5 )
            }
          }
          // player attacks mob
          else if (
            // current mob is player
            !i
            &&
            // there is a mob here
            mobs[
            ( mobs[ i ][ 0 ] + x )
            + 'fd9640' +
            ( mobs[ i ][ 1 ] + y )
            ]
            &&
            // mob is not already dead
            mobs[
            ( mobs[ i ][ 0 ] + x )
            + 'fd9640' +
            ( mobs[ i ][ 1 ] + y )
            ][ 2 ]
          ) {
            if (
              // monster is still alive
              mobs[
              ( mobs[ i ][ 0 ] + x )
              + 'fd9640' +
              ( mobs[ i ][ 1 ] + y )
              ][ 2 ]
            ) {
              //decrement monster health
              mobs[
                ( mobs[ i ][ 0 ] + x )
                + 'fd9640' +
                ( mobs[ i ][ 1 ] + y )
              ][ 2 ]
              =
              mobs[
                ( mobs[ i ][ 0 ] + x )
                + 'fd9640' +
                ( mobs[ i ][ 1 ] + y )
              ][ 2 ] - ( ~~( Math.random() * swordAmount ) + 1 )
            }

            if (
              // health is 0 or less
              mobs[
                ( mobs[ i ][ 0 ] + x )
                + 'fd9640' +
                ( mobs[ i ][ 1 ] + y )
              ][ 2 ] <= 0
            ) {
              /*
                set health to zero in case it was negative so we can test it for
                falsiness, negatives are truthy
              */
              mobs[
                ( mobs[ i ][ 0 ] + x )
                + 'fd9640' +
                ( mobs[ i ][ 1 ] + y )
              ][ 2 ] = 0

              // delete it from the array properties
              mobs[
                ( mobs[ i ][ 0 ] + x )
                + 'fd9640' +
                ( mobs[ i ][ 1 ] + y )
              ] = 0

              // maybe drop something
              if (
                !~~( Math.random() * 5 )
              ) {
                mapData[
                  ( mobs[ i ][ 0 ] + x )
                  + 'fd9640' +
                  ( mobs[ i ][ 1 ] + y )
                ] =
                // drop a potion if sword is full
                swordAmount < 5 ? sword : potion
              }
            }
          }
        }
        // dest is potion, take
        else if (
          // current mob is player
          !i
          &&
          // is potion
          mapData[
            ( mobs[ i ][ 0 ] + x )
            + 'fd9640' +
            ( mobs[ i ][ 1 ] + y )
          ] == potion
        ) {
          // remove the potion
          mapData[
            ( mobs[ i ][ 0 ] + x )
            + 'fd9640' +
            ( mobs[ i ][ 1 ] + y )
          ] = floor

          // if player health not already max increment
          if ( mobs[ i ][ 2 ] < 5 )
            mobs[ i ][ 2 ]++
        }
        else if (
          // current mob is player
          !i
          &&
          // is sword
          mapData[
            ( mobs[ i ][ 0 ] + x )
            + 'fd9640' +
            ( mobs[ i ][ 1 ] + y )
          ] == sword
        ) {
          // remove the sword from the map
          mapData[
            ( mobs[ i ][ 0 ] + x )
            + 'fd9640' +
            ( mobs[ i ][ 1 ] + y )
          ] = floor

          // if sword amount not max increment
          if ( swordAmount < 5 )
            swordAmount++
        }
        // dest is stairs, go down
        else if (
          // current mob is player
          !i
          &&
          // is stairs
          mapData[
            ( mobs[ i ][ 0 ] + x )
            + 'fd9640' +
            ( mobs[ i ][ 1 ] + y )
          ] == stairs
        ) {
          // generate a new level
          level++
          // have to pass player health through so it doesn't get lost
          createMap( mobs[ i ][ 2 ] )
        }
      }
    }

    draw()
  }

  // first run, set the player's initial health and draw
  createMap( 5 )
  draw()
})()
