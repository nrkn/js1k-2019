declare const a: HTMLCanvasElement
declare const b: HTMLBodyElement
declare const c: CanvasRenderingContext2D
declare const d: Document

let s = () => {
  let sprites = '_`t`_~SA]kkA'
  let xor = 65

  let VIEWSIZE = 9
  let TILESIZE = 5

  let floor = 2

  let key = ( x, y ) => x + ',' + y

  let mapData = {}
  let player = [ 0, 0 ]

  let draw = () => {
    a.width = a.height = VIEWSIZE * 7 * TILESIZE
    c.fillStyle = '#000'
    for ( let viewY = 0; viewY < VIEWSIZE; viewY++ ) {
      for ( let viewX = 0; viewX < VIEWSIZE; viewX++ ) {
        let mapX = viewX - 4 + player[ 0 ]
        let mapY = viewY - 4 + player[ 1 ]
        let spriteIndex = (
          viewX === 4 && viewY === 4 ? 0 : -1
        )
        let drawX = viewX * 7 * TILESIZE
        let drawY = viewY * 7 * TILESIZE

        for ( let spriteY = 0; spriteY < 7; spriteY++ ) {
          for ( let spriteX = 0; spriteX < 7; spriteX++ ) {
            if ( spriteIndex >= 0 && ( xor ^ sprites.charCodeAt( spriteIndex * 7 + spriteY ) ) >> spriteX & 1 ){
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

      mapData[ key( current[ 0 ], current[ 1 ] ) ] = floor

      for ( let c = 0; c < length; c++ ) {
        current = [
          current[ 0 ] + [ 0, -1, 1, 0 ][ dir ],
          current[ 1 ] + [ -1, 0, 0, 1 ][ dir ]
        ]

        mapData[ key( current[ 0 ], current[ 1 ] ) ] = floor
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
          ) ] = floor
        }
      }
    }
  }

  createMap()
  draw()

  b.onkeydown = e => {
    let y = (
      e.which === 38 ? -1 :
      e.which === 40 ? 1 :
      0
    )
    let x = (
      e.which === 37 ? -1 :
      e.which === 39 ? 1 :
      0
    )

    if( mapData[ key( player[ 0 ] + x, player[ 1 ] + y ) ] === floor ){
      player = [ player[ 0 ] + x, player[ 1 ] + y ]
    }

    draw()
  }
}

s()
