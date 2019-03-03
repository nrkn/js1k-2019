declare const a: HTMLCanvasElement
declare const b: HTMLBodyElement
declare const c: CanvasRenderingContext2D
declare const d: Document

let s = () => {
  let sprites = '_@T@_~SA]kkA@@@@@A_MMS`~_~NRUTT~'
  let xor = 65

  let VIEWSIZE = 9
  let TILESIZE = 5

  let floor = 2
  let floor2 = 3
  let potion = 4
  let stairs = 5
  let monsterSprite = 1
  let floorSprite = 2
  let potionSprite = 3
  let stairsSprite = 4

  let key = ( x, y ) => x + ',' + y

  let level = 0
  let mapData: any
  let player: number[]
  let monsters: number[][]

  let draw = () => {
    a.width = a.height = VIEWSIZE * 7 * TILESIZE
    for ( let viewY = 0; viewY < VIEWSIZE; viewY++ ) {
      for ( let viewX = 0; viewX < VIEWSIZE; viewX++ ) {
        let mapX = viewX - 4 + player[ 0 ]
        let mapY = viewY - 4 + player[ 1 ]
        let spriteIndex = -1
        let color: string | number = 37 + '0fb730'[ level ]

        if( viewX === 4 && viewY === 4 ){
          spriteIndex = 0
          color = '0fb730'[ player[ 2 ] ] + 37
        }
        else if (
          mapData[ key(
            mapX,
            mapY
          ) ] === floor
        ){
          spriteIndex = floorSprite
          color = 'eee'
        }
        else if (
          mapData[ key(
            mapX,
            mapY
          ) ] === potion
        ) {
          spriteIndex = potionSprite
          color = 909
        }
        else if (
          mapData[ key(
            mapX,
            mapY
          ) ] === stairs
        ){
          spriteIndex = stairsSprite
        }

        for ( let i = 0; i < monsters.length; i++ ) {
          if (
            monsters[ i ][ 2 ]
            &&
            monsters[ i ][ 0 ] === mapX
            &&
            monsters[ i ][ 1 ] === mapY
          ) {
            spriteIndex = monsterSprite
            color = '0fb730'[ monsters[ i ][ 2 ] ] + 37
          }
        }

        let drawX = viewX * 7 * TILESIZE
        let drawY = viewY * 7 * TILESIZE

        c.fillStyle = '#' + color

        for ( let spriteY = 0; spriteY < 7; spriteY++ ) {
          for ( let spriteX = 0; spriteX < 7; spriteX++ ) {
            if (
              (
                spriteIndex > -1
                &&
                ( xor ^ sprites.charCodeAt( spriteIndex * 7 + spriteY ) ) >> spriteX & 1
              )
              ||
              !mapData[ key(
                mapX,
                mapY
              ) ]
            ) {
              c.fillRect(
                spriteX * TILESIZE + drawX, spriteY * TILESIZE + drawY,
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
    player = [ 0, 0, 5 ]
    monsters = []

    let movement = 1000 * ( level + 1 )
    let monsterChance = movement / 4
    let current = [ 0, 0 ]

    for( let i = 0; i < movement; i++ ){
      mapData[ key(
        current[ 0 ],
        current[ 1 ]
      ) ] = floor + ~~( Math.random() * 2 )

      if (
        ( current[ 0 ] ) !== player[ 0 ] &&
        !~~( Math.random() * monsterChance )
      ) {
        mapData[ key(
          current[ 0 ],
          current[ 1 ]
        ) ] = potion
      }
      else if (
        ( current[ 0 ] ) !== player[ 0 ] &&
        !~~( Math.random() * monsterChance )
      ) {
        monsters[ monsters.length ] = [
          current[ 0 ],
          current[ 1 ],
          ~~( Math.random() * 5 ) + 1
        ]
      }

      let dir = ~~( Math.random() * 4 )

      current = [
        current[ 0 ] + [ 0, -1, 1, 0 ][ dir ],
        current[ 1 ] + [ -1, 0, 0, 1 ][ dir ]
      ]
    }

    mapData[ key(
      current[ 0 ],
      current[ 1 ]
    ) ] = stairs
  }

  createMap()
  draw()

  b.onkeydown = e => {
    let x = (
      e.which === 37 ? -1 :
        e.which === 39 ? 1 :
          0
    )
    let y = (
      e.which === 38 ? -1 :
      e.which === 40 ? 1 :
      0
    )

    for ( let i = 0; i < monsters.length; i++ ) {
      if ( x || y ) {
        let action = ~~( Math.random() * 4 )
        let dir = ~~( Math.random() * 4 )

        if (
          monsters[ i ][ 0 ] === ( player[ 0 ] + x ) &&
          monsters[ i ][ 1 ] === ( player[ 1 ] + y )
        ) {
          if ( monsters[ i ][ 2 ] ) {
            monsters[ i ][ 2 ]--
            x = 0
            y = 0
          }
        }

        if ( monsters[ i ][ 2 ] ){
          let mx, my

          if ( action < 2 ) {
            mx = [ 0, -1, 1, 0 ][ dir ]
            my = [ -1, 0, 0, 1 ][ dir ]
          } else if ( action < 3 ) {
            mx = player[ 0 ] < monsters[ i ][ 0 ] ? -1 : 1
            my = 0
          } else {
            mx = 0
            my = player[ 1 ] < monsters[ i ][ 1 ] ? -1 : 1
          }

          if (
            monsters[ i ][ 0 ] + mx === player[ 0 ]
            &&
            monsters[ i ][ 1 ] + my === player[ 1 ]
          ) {
            if ( ~~( Math.random() * 2 ) ) {
              player[ 2 ]--

              if ( !player[ 2 ] ) {
                level = 0
                createMap()
              }
            }
          } else if (
            mapData[ key(
              monsters[ i ][ 0 ] + mx,
              monsters[ i ][ 1 ] + my
            ) ] === floor
            ||
            mapData[ key(
              monsters[ i ][ 0 ] + mx,
              monsters[ i ][ 1 ] + my
            ) ] === floor2
          ) {
            monsters[ i ] = [
              monsters[ i ][ 0 ] + mx,
              monsters[ i ][ 1 ] + my,
              monsters[ i ][ 2 ]
            ]
          }
        }
      }
    }

    if(
      mapData[ key(
        player[ 0 ] + x,
        player[ 1 ] + y
      ) ] === floor
      ||
      mapData[ key(
        player[ 0 ] + x,
        player[ 1 ] + y )
      ] === floor2
    ){
      player = [
        player[ 0 ] + x,
        player[ 1 ] + y,
        player[ 2 ]
      ]
    }
    else if (
      mapData[ key(
        player[ 0 ] + x,
        player[ 1 ] + y
      ) ] === potion
    ) {
      mapData[ key(
        player[ 0 ] + x,
        player[ 1 ] + y
      ) ] = floor + ~~( Math.random() * 2 )

      if( player[ 2 ] < 5 )
        player[ 2 ]++
    }
    else if (
      mapData[ key(
        player[ 0 ] + x,
        player[ 1 ] + y
      ) ] === stairs
    ){
      level++
      createMap()
    }


    draw()
  }
}

s()
