declare const a: HTMLCanvasElement
declare const b: HTMLBodyElement
declare const c: CanvasRenderingContext2D
declare const d: Document

let s = () => {
  let sprites = '_`t`_~SA]kkAAGAAqAA'
  let xor = 65

  let VIEWSIZE = 9
  let TILESIZE = 5

  let monster = 1
  let floor = 2

  let key = ( x, y ) => x + ',' + y

  let monsterChance = 1000

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
        let color: string | number = 0

        if( viewX === 4 && viewY === 4 ){
          spriteIndex = 0
          color = '0fb730'[ player[ 2 ] ]
        } else if ( mapData[ key( mapX, mapY ) ] === floor ){
          spriteIndex = floor
        } else if ( mapData[ key( mapX, mapY ) ] === monster ){
          spriteIndex = monster
          for ( let i = 0; i < monsters.length; i++ ) {
            if ( monsters[ i ][ 0 ] === mapX && monsters[ i ][ 1 ] === mapY ) {
              color = '0fb730'[ monsters[ i ][ 2 ] ]
            }
          }
        }

        let drawX = viewX * 7 * TILESIZE
        let drawY = viewY * 7 * TILESIZE

        c.fillStyle = '#' + color + '00'

        for ( let spriteY = 0; spriteY < 7; spriteY++ ) {
          for ( let spriteX = 0; spriteX < 7; spriteX++ ) {
            if ( spriteIndex > -1 && ( xor ^ sprites.charCodeAt( spriteIndex * 7 + spriteY ) ) >> spriteX & 1 ){
              c.fillRect( spriteX * TILESIZE + drawX, spriteY * TILESIZE + drawY, TILESIZE, TILESIZE )
            } else if ( !mapData[ key( mapX, mapY ) ] ) {
              c.fillRect( spriteX * TILESIZE + drawX, spriteY * TILESIZE + drawY, TILESIZE, TILESIZE )
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

    let movement = 1000
    let current = [ 0, 0 ]

    for( let i = 0; i < movement; i++ ){
      for( let wy = -1; wy < 2; wy++ ){
        for( let wx = -1; wx < 2; wx++ ){
          mapData[ key( current[ 0 ] + wx, current[ 1 ] + wy ) ] = floor + ~~( Math.random() * 2 )

          if (
            ( current[ 0 ] + wx ) !== player[ 0 ] &&
            !~~( Math.random() * monsterChance )
          ) {
            monsters[ monsters.length ] = [
              current[ 0 ] + wx,
              current[ 1 ] + wy,
              ~~( Math.random() * 5 ) + 1
            ]
            mapData[ key(
              current[ 0 ] + wx,
              current[ 1 ] + wy
            ) ] = monster
          }
        }
      }

      let dir = ~~( Math.random() * 4 )

      current = [
        current[ 0 ] + [ 0, -1, 1, 0 ][ dir ],
        current[ 1 ] + [ -1, 0, 0, 1 ][ dir ]
      ]
    }

    /*
    let roomCount = 20
    let junctionCount = 40
    let roomMin = 4
    let roomMax = 12
    let junctions = [ [ 0, 0 ] ]

    while ( junctionCount-- ) {
      let dir = ~~( Math.random() * 4 )
      let length = ~~( Math.random() * roomMax * 2 ) + roomMin * 2
      let current = junctions[ ~~( Math.random() * junctions.length ) ]

      mapData[ key( current[ 0 ], current[ 1 ] ) ] = floor + ~~( Math.random() * 2 )

      for ( let c = 0; c < length; c++ ) {
        current = [
          current[ 0 ] + [ 0, -1, 1, 0 ][ dir ],
          current[ 1 ] + [ -1, 0, 0, 1 ][ dir ]
        ]

        mapData[ key( current[ 0 ], current[ 1 ] ) ] = floor + ~~( Math.random() * 2 )
      }

      junctions[ junctions.length ] = current
    }

    while ( roomCount-- ) {
      let width = ~~( Math.random() * roomMax ) + roomMin
      let height = ~~( Math.random() * roomMax ) + roomMin
      let current = junctions[ junctions.length - 1 ]

      junctions.length--

      for ( let y = 0; y < height; y++ ) {
        for ( let x = 0; x < width; x++ ) {
          mapData[ key(
            x + current[ 0 ] - ~~( width / 2 ),
            y + current[ 1 ] - ~~( height / 2 )
          ) ] = floor + ~~( Math.random() * 2 )

          if (
            ( x + current[ 0 ] - ~~( width / 2 ) ) !== player[ 0 ] &&
            !~~( Math.random() * monsterChance )
          ){
            monsters[ monsters.length ] = [
              x + current[ 0 ] - ~~( width / 2 ),
              y + current[ 1 ] - ~~( height / 2 ),
              5
            ]
            mapData[ key(
              x + current[ 0 ] - ~~( width / 2 ),
              y + current[ 1 ] - ~~( height / 2 )
            ) ] = monster
          }
        }
      }
    }
    */
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

    if(
      mapData[ key( player[ 0 ] + x, player[ 1 ] + y ) ] === floor ||
      mapData[ key( player[ 0 ] + x, player[ 1 ] + y ) ] === floor + 1
    ){
      player = [ player[ 0 ] + x, player[ 1 ] + y, player[ 2 ] ]
    } else if(
      mapData[ key( player[ 0 ] + x, player[ 1 ] + y ) ] === monster
    ){
      for ( let i = 0; i < monsters.length; i++ ) {
        if (
          monsters[ i ][ 0 ] === ( player[ 0 ] + x ) &&
          monsters[ i ][ 1 ] === ( player[ 1 ] + y )
        ){
          if( monsters[ i ][ 2 ] ){
            monsters[ i ][ 2 ]--

            if ( !monsters[ i ][ 2 ] ) {
              mapData[ key( player[ 0 ] + x, player[ 1 ] + y ) ] = floor + ~~( Math.random() * 2 )
            }
          }
        }
      }
    }

    for( let i = 0; i < monsters.length; i++ ){
      if ( ( x || y ) && monsters[ i ][ 2 ] ){
        let action = ~~( Math.random() * 4 )
        let dir = ~~( Math.random() * 4 )

        if( action < 2 ){
          x = [ 0, -1, 1, 0 ][ dir ]
          y = [ -1, 0, 0, 1 ][ dir ]
        } else if( action < 3 ){
          x = player[ 0 ] < monsters[ i ][ 0 ] ? -1 : 1
          y = 0
        } else {
          x = 0
          y = player[ 1 ] < monsters[ i ][ 1 ] ? -1 : 1
        }

        if ( monsters[ i ][ 0 ] + x === player[ 0 ] && monsters[ i ][ 1 ] + y === player[ 1 ] ) {
          if( ~~( Math.random() * 2 ) ){
            player[ 2 ]--

            if ( !player[ 2 ] ) {
              createMap()
            }
          }
        } else if (
          mapData[ key( monsters[ i ][ 0 ] + x, monsters[ i ][ 1 ] + y ) ] === floor ||
          mapData[ key( monsters[ i ][ 0 ] + x, monsters[ i ][ 1 ] + y ) ] === floor + 1
        ) {
          mapData[ key( monsters[ i ][ 0 ], monsters[ i ][ 1 ] ) ] = floor + ~~( Math.random() * 2 )
          monsters[ i ] = [ monsters[ i ][ 0 ] + x, monsters[ i ][ 1 ] + y, monsters[ i ][ 2 ] ]
          mapData[ key( monsters[ i ][ 0 ], monsters[ i ][ 1 ] ) ] = monster
        }
      }
    }

    draw()
  }
}

s()
