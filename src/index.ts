declare const a: HTMLCanvasElement
declare const b: HTMLBodyElement
declare const c: CanvasRenderingContext2D
declare const d: Document

let s = () => {
  let sprites = 'a~j~a@mq`j`jassm^@a@plkjj@{{{{q{'

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
  let swordAmount = 1

  let level = 0
  //let level = 5
  let mapData: any
  let mobs: number[][]

  let draw = () => {
    // start draw

    a.width = VIEWSIZE * 7 * TILESIZE
    for ( let viewY = 0; viewY < VIEWSIZE; viewY++ ) {
      for ( let viewX = 0; viewX < VIEWSIZE; viewX++ ) {
        let spriteIndex = 7
        let color: string | number = 37 + 'fd9640'[ level ]

        if (
          mapData[

              ( viewX - 4 + mobs[ 0 ][ 0 ] )
              + 'fd9640' +
              ( viewY - 4 + mobs[ 0 ][ 1 ] )

          ] == potion
        ) {
          spriteIndex = potionSprite
        }
        else if (
          mapData[

              ( viewX - 4 + mobs[ 0 ][ 0 ] )
              + 'fd9640' +
              ( viewY - 4 + mobs[ 0 ][ 1 ] )

          ] == sword
        ) {
          spriteIndex = swordSprite
        }
        else if (
          mapData[

              ( viewX - 4 + mobs[ 0 ][ 0 ] )
              + 'fd9640' +
              ( viewY - 4 + mobs[ 0 ][ 1 ] )

          ] == stairs
        ){
          spriteIndex = level < 5 ? stairsSprite : playerSprite
        }

        for ( let i = 0; i < mobs.length; i++ ) {
          if (
            mobs[ i ][ 2 ]
            &&
            mobs[ i ][ 0 ] == viewX - 4 + mobs[ 0 ][ 0 ]
            &&
            mobs[ i ][ 1 ] == viewY - 4 + mobs[ 0 ][ 1 ]
          ) {
            spriteIndex = mobs[ i ][ 3 ]
            color = 'fd9640'[ mobs[ i ][ 2 ] ] + 37
          }
        }

        c.fillStyle = '#' + color

        for ( let spriteY = 0; spriteY < 7; spriteY++ ) {
          for ( let spriteX = 0; spriteX < 7; spriteX++ ) {
            if (
              (
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
                spriteIndex < 7
                &&
                !(
                  (
                    sprites.charCodeAt( spriteIndex * 7 + spriteY )
                  ) >> spriteX & 1
                )
              )
              ||
              !mapData[

                  ( viewX - 4 + mobs[ 0 ][ 0 ] )
                  + 'fd9640' +
                  ( viewY - 4 + mobs[ 0 ][ 1 ] )

              ]
            ) {
              c.fillRect(
                spriteX * TILESIZE + viewX * 7 * TILESIZE, spriteY * TILESIZE + viewY * 7 * TILESIZE,
                TILESIZE, TILESIZE
              )
            }
          }
        }
      }
    }

    // end draw
  }

  let createMap = ( health: number ) => {
    mapData = {}
    mobs = [ [ 0, 0, health, 0 ] ]
    mobs[

        ( 0 )
        + 'fd9640' +
        ( 0 )

    ] = mobs[ 0 ]

    let current = [ 0, 0 ]
    let size = 96
    //let size = 10

    for ( let i = 0; i < ( size * ( level + 1 ) ); i++ ){
      mapData[

          ( current[ 0 ] )
          + 'fd9640' +
          ( current[ 1 ] )

      ] = floor

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
        mobs[

            ( current[ 0 ] )
            + 'fd9640' +
            ( current[ 1 ] )

        ] = mobs[ mobs.length ] = [
          current[ 0 ],
          current[ 1 ],
          ~~( Math.random() * 5 ) + 1,
          monsterSprite
        ]
      }

      let dir = ~~( Math.random() * 4 )

      if( level < 6 ){
        current = [
          current[ 0 ] + [ 0, -1, 1, 0 ][ dir ],
          current[ 1 ] + [ -1, 0, 0, 1 ][ dir ]
        ]
      }
    }

    mapData[

        ( current[ 0 ] )
        + 'fd9640' +
        ( current[ 1 ] )

    ] = stairs
  }

  createMap( 5 )
  draw()

  let move = ( i: number, which: number ) => {
    let x = which == 37 ? -1 : which == 39 ? 1 : 0
    let y = which == 38 ? -1 : which == 40 ? 1 : 0

    // dest is floor, move
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
      // no other mob
      !mobs[

          ( mobs[ i ][ 0 ] + x )
          + 'fd9640' +
          ( mobs[ i ][ 1 ] + y )

      ]
    ) {
      mobs[

          ( mobs[ i ][ 0 ] )
          + 'fd9640' +
          ( mobs[ i ][ 1 ] )

      ] = 0

      mobs[ i ][ 0 ] = mobs[ i ][ 0 ] + x
      mobs[ i ][ 1 ] = mobs[ i ][ 1 ] + y

      mobs[

          ( mobs[ i ][ 0 ] )
          + 'fd9640' +
          ( mobs[ i ][ 1 ] )

      ] = mobs[ i ]
    }
    // dest is another mob, attack
    else if(
      // dest is another mob
      mobs[

          ( mobs[ i ][ 0 ] + x )
          + 'fd9640' +
          ( mobs[ i ][ 1 ] + y )

      ]
    ) {
      // monster attacks player
      if(
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
      ){
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
        // mob is not already dead
        mobs[

            ( mobs[ i ][ 0 ] + x )
            + 'fd9640' +
            ( mobs[ i ][ 1 ] + y )

        ]
        &&
        mobs[

            ( mobs[ i ][ 0 ] + x )
            + 'fd9640' +
            ( mobs[ i ][ 1 ] + y )

        ][ 2 ]
      ){
        //decrement health
        let damage = ~~( Math.random() * swordAmount ) + 1

        for( let j = 0; j < damage; j++ ){
          if (
            mobs[

                ( mobs[ i ][ 0 ] + x )
                + 'fd9640' +
                ( mobs[ i ][ 1 ] + y )

            ][ 2 ]
          ){
            mobs[

                ( mobs[ i ][ 0 ] + x )
                + 'fd9640' +
                ( mobs[ i ][ 1 ] + y )

            ][ 2 ]--
          }
        }

        // if dead remove
        if (
          !mobs[

              ( mobs[ i ][ 0 ] + x )
              + 'fd9640' +
              ( mobs[ i ][ 1 ] + y )

          ][ 2 ]
        ){
          mobs[

              ( mobs[ i ][ 0 ] + x )
              + 'fd9640' +
              ( mobs[ i ][ 1 ] + y )

          ] = 0

          if (
            !~~( Math.random() * 5 )
          ) {
            mapData[

                ( mobs[ i ][ 0 ] + x )
                + 'fd9640' +
                ( mobs[ i ][ 1 ] + y )

            ] = sword
          }
        }
      }
    }
    // dest is potion, take
    else if(
      // current mob is player
      !i
      &&
      // is potion
      mapData[

          ( mobs[ i ][ 0 ] + x )
          + 'fd9640' +
          ( mobs[ i ][ 1 ] + y )

      ] == potion
    ){
      // remove the potion
      mapData[

          ( mobs[ i ][ 0 ] + x )
          + 'fd9640' +
          ( mobs[ i ][ 1 ] + y )

      ] = floor

      // if player health not already max increment
      if( mobs[ i ][ 2 ] < 5 )
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
      // remove the sword
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
      level++
      createMap( mobs[ i ][ 2 ] )
    }
  }

  b.onkeydown = e => {
    for ( let i = 0; i < mobs.length; i++ ) {
      let action = ~~( Math.random() * 4 )
      let which: number

      if ( action < 2 ) {
        which = ~~( Math.random() * 4 ) + 37
      } else if ( action < 3 ) {
        which = mobs[ 0 ][ 0 ] < mobs[ i ][ 0 ] ? 37 : 39
      } else {
        which = mobs[ 0 ][ 1 ] < mobs[ i ][ 1 ] ? 38 : 40
      }

      if( mobs[ i ][ 2 ] )
        move( i, !i ? e.which : which )
    }

    draw()
  }
}

s()
