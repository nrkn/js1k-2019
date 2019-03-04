declare const a: HTMLCanvasElement
declare const b: HTMLBodyElement
declare const c: CanvasRenderingContext2D
declare const d: Document

let s = () => {
  let sprites = '^AUA^R@N_U_U@@@@@@U@^LLRa^OSTUU'
  let xor = 64

  let VIEWSIZE = 9
  let TILESIZE = 5

  let floor = 3
  let potion = 5
  let stairs = 6
  let playerSprite = 0
  let monsterSprite = 1
  let floorSprite = 2
  let potionSprite = 3
  let stairsSprite = 4

  let key = ( x, y ) => x + 'fd9' + y

  let level = 0
  //let level = 5
  let mapData: any
  let mobs: number[][]

  let draw = () => {
    a.width = a.height = VIEWSIZE * 7 * TILESIZE
    for ( let viewY = 0; viewY < VIEWSIZE; viewY++ ) {
      for ( let viewX = 0; viewX < VIEWSIZE; viewX++ ) {
        let mapY = viewY - 4 + mobs[ 0 ][ 1 ]
        let spriteIndex = 7
        let color: string | number = 38 + 'fd9640'[ level ]

        if (
          mapData[ key(
            viewX - 4 + mobs[ 0 ][ 0 ],
            mapY
          ) ] == floor
        ){
          spriteIndex = floorSprite
          color = 'fd9'
        }
        else if (
          mapData[ key(
            viewX - 4 + mobs[ 0 ][ 0 ],
            mapY
          ) ] == potion
        ) {
          spriteIndex = potionSprite
          color = 640
        }
        else if (
          mapData[ key(
            viewX - 4 + mobs[ 0 ][ 0 ],
            mapY
          ) ] == stairs
        ){
          spriteIndex = level < 5 ? stairsSprite : playerSprite
        }

        for ( let i = 0; i < mobs.length; i++ ) {
          if (
            mobs[ i ][ 2 ]
            &&
            mobs[ i ][ 0 ] == viewX - 4 + mobs[ 0 ][ 0 ]
            &&
            mobs[ i ][ 1 ] == mapY
          ) {
            spriteIndex = mobs[ i ][ 3 ]
            color = 'fd9640'[ mobs[ i ][ 2 ] ] + 38
          }
        }

        c.fillStyle = '#' + color

        for ( let spriteY = 0; spriteY < 7; spriteY++ ) {
          for ( let spriteX = 0; spriteX < 7; spriteX++ ) {
            if (
              (
                spriteIndex < 7
                &&
                ( xor ^ sprites.charCodeAt( spriteIndex * 7 + spriteY ) ) >> spriteX & 1
              )
              ||
              !mapData[ key(
                viewX - 4 + mobs[ 0 ][ 0 ],
                mapY
              ) ]
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
  }

  let createMap = () => {
    mapData = {}
    mobs = [ [ 0, 0, 5, 0 ] ]
    mobs[ key( 0, 0 ) ] = mobs[ 0 ]

    let current = [ 0, 0 ]
    let size = 96
    //let size = 10

    for ( let i = 0; i < ( size * ( level + 1 ) ); i++ ){
      mapData[ key(
        current[ 0 ],
        current[ 1 ]
      ) ] = floor + ~~( Math.random() * 2 )

      if (
        current[ 0 ] !== mobs[ 0 ][ 0 ] &&
        !~~( Math.random() * ( size * ( level + 1 ) ) / ( level + 7 ) )
      ) {
        mapData[ key(
          current[ 0 ],
          current[ 1 ]
        ) ] = potion
      }
      else if (
        current[ 0 ] !== mobs[ 0 ][ 0 ]
        &&
        !~~( Math.random() * ( size * ( level + 1 ) ) / ( level + 7 ) )
        &&
        !mobs[ key(
          current[ 0 ],
          current[ 1 ]
        ) ]
      ) {
        mobs[ key(
          current[ 0 ],
          current[ 1 ]
        ) ] = mobs[ mobs.length ] = [
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

    mapData[ key(
      current[ 0 ],
      current[ 1 ]
    ) ] = stairs
  }

  createMap()
  draw()

  const move = ( i: number, which: number ) => {
    let x = which == 37 ? -1 : which == 39 ? 1 : 0
    let y = which == 38 ? -1 : which == 40 ? 1 : 0

    // dest is floor, move
    if (
      // dest is floor
      (
        mapData[ key(
          mobs[ i ][ 0 ] + x,
          mobs[ i ][ 1 ] + y
        ) ] < 5
      )
      &&
      // no other mob
      !mobs[ key(
        mobs[ i ][ 0 ] + x,
        mobs[ i ][ 1 ] + y
      ) ]
    ) {
      mobs[ key(
        mobs[ i ][ 0 ],
        mobs[ i ][ 1 ]
      ) ] = 0

      mobs[ i ][ 0 ] = mobs[ i ][ 0 ] + x
      mobs[ i ][ 1 ] = mobs[ i ][ 1 ] + y

      mobs[ key(
        mobs[ i ][ 0 ],
        mobs[ i ][ 1 ]
      ) ] = mobs[ i ]
    }
    // dest is another mob, attack
    else if(
      // dest is another mob
      mobs[ key(
        mobs[ i ][ 0 ] + x,
        mobs[ i ][ 1 ] + y
      ) ]
    ) {
      // monster attacks player
      if(
        // current mob is not player
        i
        &&
        // target is player
        !mobs[ key(
          mobs[ i ][ 0 ] + x,
          mobs[ i ][ 1 ] + y
        ) ][ 3 ]
        &&
        // 50% chance to hit
        ~~( Math.random() * 2 )
      ){
        // decrement player health
        mobs[ key(
          mobs[ i ][ 0 ] + x,
          mobs[ i ][ 1 ] + y
        ) ][ 2 ]--

        // if player dead, restart
        if (
          !mobs[ key(
            mobs[ i ][ 0 ] + x,
            mobs[ i ][ 1 ] + y
          ) ][ 2 ]
        ) {
          level = 0
          createMap()
        }
      }
      // player attacks mob
      else if (
        // current mob is player
        !i
        &&
        // mob is not already dead
        mobs[ key(
          mobs[ i ][ 0 ] + x,
          mobs[ i ][ 1 ] + y
        ) ]
        &&
        mobs[ key(
          mobs[ i ][ 0 ] + x,
          mobs[ i ][ 1 ] + y
        ) ][ 2 ]
      ){
        //decrement health
        mobs[ key(
          mobs[ i ][ 0 ] + x,
          mobs[ i ][ 1 ] + y
        ) ][ 2 ]--

        // if dead remove
        if (
          !mobs[ key(
            mobs[ i ][ 0 ] + x,
            mobs[ i ][ 1 ] + y
          ) ][ 2 ]
        ){
          mobs[ key(
            mobs[ i ][ 0 ] + x,
            mobs[ i ][ 1 ] + y
          ) ] = 0
        }
      }
    }
    // dest is potion, take
    else if(
      // current mob is player
      !i
      &&
      // is potion
      mapData[ key(
        mobs[ i ][ 0 ] + x,
        mobs[ i ][ 1 ] + y
      ) ] == potion
    ){
      // remove the potion
      mapData[ key(
        mobs[ i ][ 0 ] + x,
        mobs[ i ][ 1 ] + y
      ) ] = floor

      // if player health not already max increment
      if( mobs[ i ][ 2 ] < 5 )
        mobs[ i ][ 2 ]++
    }
    // dest is stairs, go down
    else if (
      // current mob is player
      !i
      &&
      // is stairs
      mapData[ key(
        mobs[ i ][ 0 ] + x,
        mobs[ i ][ 1 ] + y
      ) ] == stairs
    ) {
      level++
      createMap()
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
