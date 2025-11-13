// Un-1k-ified, readable version with behavior parity

// --- Types ---
type PointSlug = `${number},${number}`

type Entity = {
  x: number
  y: number
  hp: number // 0..5, 0 = dead
  sprite: number // sprite index; 0 = player
}

const SPRITES = [
  [
    0b0111100,
    0b1000000,
    0b1010100,
    0b1000000,
    0b0111100,
    0b1111110,
    0b0100100
  ],
  [
    0b0000000,
    0b0111000,
    0b1111100,
    0b1010100,
    0b1111100,
    0b1010100,
    0b0000000
  ],
  [
    0b0111100,
    0b0011000,
    0b0011000,
    0b0100100,
    0b1000010,
    0b1111110,
    0b0111100
  ],
  [
    0b1111110,
    0b1111000,
    0b1100100,
    0b0010100,
    0b1010100,
    0b1010100,
    0b1111110
  ],
  [
    0b0010000,
    0b0010000,
    0b0010000,
    0b0010000,
    0b0111000,
    0b0010000,
    0b0000000
  ],
  [
    0b0000000,
    0b1111110,
    0b1011100,
    0b1101010,
    0b1110110,
    0b1101010,
    0b1011100
  ],
  [
    0b0000000,
    0b0100100,
    0b0111100,
    0b0101000,
    0b0111100,
    0b1111110,
    0b0100100
  ],
] as const

// --- Constants ---
const VIEWSIZE = 9
const TILESIZE = 7

// Tiles
const TILE_FLOOR = 3
const TILE_POTION = 5
const TILE_STAIRS = 6
const TILE_SWORD = 7

// Sprites
const SPRITE_PLAYER = 0
const SPRITE_MONSTER = 1
const SPRITE_POTION = 2
const SPRITE_STAIRS = 3
const SPRITE_SWORD = 4
const SPRITE_EXIT = 5
const SPRITE_MONSTER2 = 6

// Palette source for hex construction
const PALETTE = 'fd9640'

// Key codes
const KEY_LEFT = 37
const KEY_UP = 38
const KEY_RIGHT = 39
const KEY_DOWN = 40

// DOM

const canvas = document.querySelector<HTMLCanvasElement>('#viewport')!
const ctx = canvas.getContext('2d')!

// --- Global state ---
let level = 0
let swordAmount = 1 // 1..5, affects damage and player sword rendering

// Sparse map where missing => wall; present => floor/potion/sword/stairs
let mapData: Record<PointSlug, number> = {}

// Entities + position index for O(1) lookup by tile
let mobs: Entity[] = []
let mobIndex: Record<PointSlug, number> = {}

// --- Small helpers ---
const pointSlug = (x: number, y: number): PointSlug => `${x},${y}`

const getMobIndexAt = (x: number, y: number): number => {
  const idx = mobIndex[pointSlug(x, y)]

  return typeof idx === 'number' ? idx : -1
}

const indexMob = (idx: number) => {
  const m = mobs[idx]

  mobIndex[pointSlug(m.x, m.y)] = idx
}

const removeMobIndex = (x: number, y: number) => {
  delete mobIndex[pointSlug(x, y)]
}

const moveMob = (idx: number, nx: number, ny: number) => {
  const m = mobs[idx]

  removeMobIndex(m.x, m.y)

  m.x = nx
  m.y = ny

  indexMob(idx)
}

const deltaFromKey = (code: number): { dx: number; dy: number } => ({
  dx: code === KEY_LEFT ? -1 : code === KEY_RIGHT ? 1 : 0,
  dy: code === KEY_UP ? -1 : code === KEY_DOWN ? 1 : 0,
})

const randInt = (exclMax: number) => Math.floor(Math.random() * exclMax)

// --- Rendering ---
const draw = () => {
  canvas.width = canvas.height = VIEWSIZE * TILESIZE // clears canvas

  const player = mobs[0]

  for (let viewY = 0; viewY < VIEWSIZE; viewY++) {
    for (let viewX = 0; viewX < VIEWSIZE; viewX++) {
      const wx = viewX - 4 + player.x
      const wy = viewY - 4 + player.y
      const k = pointSlug(wx, wy)

      const mobIdx = getMobIndexAt(wx, wy)
      const mobHere = mobIdx >= 0 ? mobs[mobIdx] : undefined

      // Determine sprite index to render (clear, non-nested)
      let spriteIndex = 7 // guard => wall fill
      if (mobHere && mobHere.hp > 0) {
        spriteIndex = mobHere.sprite
      } else if (mapData[k] === TILE_POTION) {
        spriteIndex = SPRITE_POTION
      } else if (mapData[k] === TILE_SWORD) {
        spriteIndex = SPRITE_SWORD
      } else if (mapData[k] === TILE_STAIRS) {
        spriteIndex = level < 5 ? SPRITE_STAIRS : SPRITE_EXIT
      }

      // Determine cell color
      ctx.fillStyle = mobHere && mobHere.hp > 0
        ? '#' + PALETTE[mobHere.hp] + 37
        : mapData[k]
          ? '#964'
          : '#' + 37 + PALETTE[level]

      // Draw 7x7 tile
      for (let sy = 0; sy < TILESIZE; sy++) {
        for (let sx = 0; sx < TILESIZE; sx++) {
          const isPlayerSword = (
            spriteIndex === SPRITE_PLAYER &&
            sx === 6 &&
            sy < 6 &&
            sy > 4 - swordAmount
          )

          const isSpritePixel = (
            spriteIndex < 7 &&
            ((SPRITES[spriteIndex][sy] >> (6 - sx)) & 1) === 1
          )

          const isWall = !mapData[k]

          if (isPlayerSword || isSpritePixel || isWall) {
            ctx.fillRect(
              sx + viewX * TILESIZE,
              sy + viewY * TILESIZE,
              1,
              1,
            )
          }
        }
      }
    }
  }
}

// --- Map generation ---
const createMap = (playerHealth: number) => {
  const baseSize = 96
  let cx = 0
  let cy = 0

  // Reset state
  mapData = {}
  mobs = [{ x: 0, y: 0, hp: playerHealth, sprite: SPRITE_PLAYER }]
  mobIndex = {}
  indexMob(0)

  const steps = baseSize * (level + 1)

  for (let i = 0; i < steps; i++) {
    // carve floor
    mapData[pointSlug(cx, cy)] = TILE_FLOOR

    // maybe potion (avoid starting tile)
    if (cx !== mobs[0].x && !randInt(Math.floor(steps / (level + 7)) || 1)) {
      mapData[pointSlug(cx, cy)] = TILE_POTION
    }
    // maybe monster
    else if (
      cx !== mobs[0].x &&
      !randInt(Math.floor(steps / (level + 7)) || 1) &&
      getMobIndexAt(cx, cy) < 0
    ) {
      const idx = mobs.length

      mobs.push({
        x: cx,
        y: cy,
        hp: randInt(5) + 1,
        sprite: randInt(2) ? SPRITE_MONSTER : SPRITE_MONSTER2,
      })

      indexMob(idx)
    }

    // random walk (skip on win+1 level for glitchy win screen)
    if (level < 6) {
      const dir = randInt(4)

      cx += [0, -1, 1, 0][dir]
      cy += [-1, 0, 0, 1][dir]
    }
  }

  // last carved becomes stairs
  mapData[pointSlug(cx, cy)] = TILE_STAIRS
}

// --- Turn handling ---
const processTurn = (keyCode: number) => {
  for (let i = 0; i < mobs.length; i++) {
    // choose action for monsters
    let which: number
    if (i === 0) {
      which = keyCode
    } else {
      const action = randInt(4)
      if (action < 2) {
        which = KEY_LEFT + randInt(4) // 37..40
      } else if (action < 3) {
        which = mobs[0].x < mobs[i].x ? KEY_LEFT : KEY_RIGHT
      } else {
        which = mobs[0].y < mobs[i].y ? KEY_UP : KEY_DOWN
      }
    }

    const m = mobs[i]

    if (m.hp <= 0) continue

    const { dx, dy } = deltaFromKey(which)

    if (dx === 0 && dy === 0) continue

    const nx = m.x + dx
    const ny = m.y + dy
    const nk = pointSlug(nx, ny)

    // move to empty floor
    if (mapData[nk] === TILE_FLOOR && getMobIndexAt(nx, ny) < 0) {
      moveMob(i, nx, ny)

      continue
    }

    const targetIdx = getMobIndexAt(nx, ny)

    if (targetIdx >= 0) {
      // Monster attacks player
      if (i !== 0 && mobs[targetIdx].sprite === SPRITE_PLAYER && randInt(2)) {
        const p = mobs[targetIdx]

        p.hp--

        if (p.hp <= 0) {
          level = 0
          swordAmount = 1

          createMap(5)
        }

        continue
      }

      // Player attacks monster
      if (i === 0) {
        const t = mobs[targetIdx]

        if (t.hp > 0) {
          t.hp = t.hp - (randInt(swordAmount) + 1)
        }

        if (t.hp <= 0) {
          t.hp = 0

          removeMobIndex(t.x, t.y)

          if (!randInt(5)) {
            mapData[nk] = swordAmount < 5 ? TILE_SWORD : TILE_POTION
          }
        }
        continue
      }
    }

    // Player-only interactions
    if (i === 0) {
      // Potion
      if (mapData[nk] === TILE_POTION) {
        mapData[nk] = TILE_FLOOR

        if (m.hp < 5) m.hp++

        continue
      }
      // Sword
      if (mapData[nk] === TILE_SWORD) {
        mapData[nk] = TILE_FLOOR

        if (swordAmount < 5) swordAmount++

        continue
      }
      // Stairs
      if (mapData[nk] === TILE_STAIRS) {
        level++

        createMap(m.hp)

        continue
      }
    }
  }

  draw()
}

// --- Init ---
createMap(5)
draw()

// key handler (modern)
document.body.onkeydown = (e: KeyboardEvent) => {
  // Prefer e.key; fallback to no-op if non-arrow

  let which = 0

  switch (e.key) {
    case 'ArrowLeft':
      which = KEY_LEFT
      break
    case 'ArrowRight':
      which = KEY_RIGHT
      break
    case 'ArrowUp':
      which = KEY_UP
      break
    case 'ArrowDown':
      which = KEY_DOWN
      break
  }

  if (which) processTurn(which)
}
