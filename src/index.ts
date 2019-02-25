declare const a: HTMLCanvasElement
declare const b: HTMLBodyElement
declare const c: CanvasRenderingContext2D
declare const d: Document

const init = () => {
  const sprites = 'A~j~A`M___Wu_____Gkc_  $  0 __O__[__Cm}yCW_WWKK}j_Al~vv`_A``hh`_Cauau___QTfv`_C}u}C}__Xbt__'
  const xor = 32

  const VIEWSIZE = 9
  const TILESIZE = 5

  const paper = [
    // SPRITE_PLAYER
    5,

    // SPRITE_GRASS
    5,

    // SPRITE_ROCK
    5,

    // SPRITE_WATER
    10,

    // SPRITE_SAND
    2,

    // SPRITE_TREE
    5,

    // SPRITE_MOUNTAIN
    5,

    // SPRITE_HUT
    5,

    // SPRITE_HUT_LOCKED
    5,

    // SPRITE_GHOST
    5,

    // SPRITE_RUIN
    5,

    // SPRITE_PORTAL
    5,

    // SPRITE_KEY
    5
  ]

  const ink = [
    // SPRITE_PLAYER
    0,

    // SPRITE_GRASS
    1,

    // SPRITE_ROCK
    2,

    // SPRITE_WATER
    3,

    // SPRITE_SAND
    4,

    // SPRITE_TREE
    6,

    // SPRITE_MOUNTAIN
    7,

    // SPRITE_HUT
    8,

    // SPRITE_HUT_LOCKED
    9,

    // SPRITE_GHOST
    10,

    // SPRITE_RUIN
    11,

    // SPRITE_PORTAL
    12,

    // SPRITE_KEY
    13
  ]

  let playerX = 0
  let playerY = 0
  let hour = 17
  let mins = 0
  const map: { [ key: string ]: number } = {}

  const color = ( value: number ) => 'hsl(' + ( value * 23 ) + ',100%,50%)'

  const getKey = ( x: number, y: number ) => x + ',' + y
  const randInt = ( exclMax: number ) => ~~( Math.random() * exclMax )

  const getMap = ( x: number, y: number ) =>
    map[ getKey( x, y ) ] || ( map[ getKey( x, y ) ] = randInt( 6 ) + 1 )

  const draw = () => {
    a.width = a.height = VIEWSIZE * 7 * TILESIZE
    for ( let viewY = 0; viewY < VIEWSIZE; viewY++ ) {
      for ( let viewX = 0; viewX < VIEWSIZE; viewX++ ) {
        const mapX = viewX - 4 + playerX
        const mapY = viewY - 4 + playerY
        const spriteIndex = getMap( mapX, mapY )
        const drawX = viewX * 7 * TILESIZE
        const drawY = viewY * 7 * TILESIZE

        for ( let spriteY = 0; spriteY < 7; spriteY++ ) {
          for ( let spriteX = 0; spriteX < 7; spriteX++ ) {
            if ( ( xor ^ sprites.charCodeAt( spriteIndex * 7 + spriteY ) ) >> spriteX & 1 ) {
              c.fillStyle = color( paper[ spriteIndex ] )
            } else {
              c.fillStyle = color( ink[ spriteIndex ] )
            }
            c.fillRect( spriteX * TILESIZE + drawX, spriteY * TILESIZE + drawY, TILESIZE, TILESIZE )
          }
        }
      }
    }
  }

  draw()
}

init()
