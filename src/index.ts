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

  let mapData: any = {}
  let player = [ 0, 0 ]
  let monsters: number[][] = []
  let monsterChance = 10

  let draw = () => {
    a.width = a.height = VIEWSIZE * 7 * TILESIZE
    c.fillStyle = '#000'
    for ( let viewY = 0; viewY < VIEWSIZE; viewY++ ) {
      for ( let viewX = 0; viewX < VIEWSIZE; viewX++ ) {
        let mapX = viewX - 4 + player[ 0 ]
        let mapY = viewY - 4 + player[ 1 ]
        let spriteIndex = (
          viewX === 4 && viewY === 4 ? 0 :
          mapData[ key( mapX, mapY ) ] === floor ? floor :
          mapData[ key( mapX, mapY ) ] === monster ? monster :
          -1
        )
        let drawX = viewX * 7 * TILESIZE
        let drawY = viewY * 7 * TILESIZE

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
              y + current[ 1 ] - ~~( height / 2 )
            ]
            mapData[ key(
              x + current[ 0 ] - ~~( width / 2 ),
              y + current[ 1 ] - ~~( height / 2 )
            ) ] = monster
          }
        }
      }
    }
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
      player = [ player[ 0 ] + x, player[ 1 ] + y ]
    }

    for( let i = 0; i < monsters.length; i++ ){
      if( x || y ){
        let dir = ~~( Math.random() * 4 )

        let x = [ 0, -1, 1, 0 ][ dir ]
        let y = [ -1, 0, 0, 1 ][ dir ]

        if ( x === player[ 0 ] && y === player[ 1 ] ) {
          // bumped player
        } else if (
          mapData[ key( monsters[ i ][ 0 ] + x, monsters[ i ][ 1 ] + y ) ] === floor ||
          mapData[ key( monsters[ i ][ 0 ] + x, monsters[ i ][ 1 ] + y ) ] === floor + 1
        ) {
          mapData[ key( monsters[ i ][ 0 ], monsters[ i ][ 1 ] ) ] = floor + ~~( Math.random() * 2 )
          monsters[ i ] = [ monsters[ i ][ 0 ] + x, monsters[ i ][ 1 ] + y ]
          mapData[ key( monsters[ i ][ 0 ], monsters[ i ][ 1 ] ) ] = monster
        }
      }
    }

    draw()
  }
}

s()
