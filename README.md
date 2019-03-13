## X-RL

A [Roguelike](https://en.wikipedia.org/wiki/Roguelike) in 1kb of JavaScript,
for [JS1k 2019](https://js1k.com/2019-x)

[Play it here](https://js1k.com/NNNN)

![X-RL](public/current.png)

Mow down your enemies. Find the e**X**it!

Featuring:

- Hand-drawn, 1bit sprites
- Colorful!
- Two different monsters
- Healing potions
- Sword upgrades
- Five dungeon levels
- Randomly generated, a new game every time

Arrow keys to move, bump to use/attack/get

[Commented, unminified source](src/index.ts)

## Minification Strategy

- pack sprites into strings using a hand-written tool
- keep code as simple and samey as possible to ensure good packing
- add one feature at a time and only golf down when we go above 1024 bytes
- iterate, iterate, iterate! At every iteration:
  - use [uglify](https://skalman.github.io/UglifyJS-online/) for minification
    - examine the minified code to find things that didn't minify as well as they
      could have
  - use [regpack](http://siorki.github.io/regPack.html) for packing
    - look at what tokens nearly had a compression gain and try to reuse them
      elsewhere
- use GitHub, check in often
- use [TypeScript](http://typescriptlang.org/) to help catch typos and errors in ugly, complicated code

### Tricky/weird stuff to save bytes:

- Bit level packing and unpacking sprites to and from strings, using a size
  that ensures each sprite row fits into the printable ASCII range 32-127
  so that 1 row never exceeds 1 byte
- Adding properties to arrays so that they can be both iterated over and also
  directly queried for data
- Inlining to a ludicrous degree at the expense of readability

## A Visual Development History

#### [47c5903123f6a9207bfab96ab21c4a62ab7ca7e9](https://github.com/nrkn/js1k-2019/tree/47c5903123f6a9207bfab96ab21c4a62ab7ca7e9)

At this stage I was planning to make a 1k version of my JS13k game,
[Ranger Down](https://js13kgames.com/entries/ranger-down)

![ranger down](public/47c5903123f6a9207bfab96ab21c4a62ab7ca7e9.png)

#### [b8c0284f6a8e91c3b82c8453e08fdb05d6a80b31](https://github.com/nrkn/js1k-2019/tree/b8c0284f6a8e91c3b82c8453e08fdb05d6a80b31)

OK - that was too ambitious - let's fall back on a dungeon crawler, I've done
those before. I generated some rectangular rooms and used a graph to connect
them together with corridors

![dungeon](public/b8c0284f6a8e91c3b82c8453e08fdb05d6a80b31.png)

#### [dd846797e6a0fdb52d0a9729556499e840983ec8](https://github.com/nrkn/js1k-2019/tree/dd846797e6a0fdb52d0a9729556499e840983ec8)

Then I added some monsters

![monsters](public/dd846797e6a0fdb52d0a9729556499e840983ec8.png)

#### [4020b16e396cd7be629499710f49b87182082cbc](https://github.com/nrkn/js1k-2019/tree/4020b16e396cd7be629499710f49b87182082cbc)

At this stage, I was already pretty much out of bytes, with no gameplay

The pretty, clever dungeons had to go. I implemented a much simpler generator
that created acceptable, but much crappier dungeons

![crappy](public/4020b16e396cd7be629499710f49b87182082cbc.png)

#### [ebb60c27ba496baeba8d4fb2c9de4536f92ea7d5](https://github.com/nrkn/js1k-2019/tree/ebb60c27ba496baeba8d4fb2c9de4536f92ea7d5)

You can now walk around and fight monsters - both the player and the monsters'
color move closer to red as their health decreases. Some of the rooms were
larger than the viewport, so I added some random floor tiles because otherwise
if you were in a very large room you couldn't tell that you were moving and it
felt weird

![floors](public/ebb60c27ba496baeba8d4fb2c9de4536f92ea7d5.png)

#### [6bbe12d05fa2cd4854891267fdd6b3d94006d2fb](https://github.com/nrkn/js1k-2019/tree/6bbe12d05fa2cd4854891267fdd6b3d94006d2fb)

I needed to add some more gameplay elements, like healing potions, but those
dungeons with rectangular rooms and corridors were just too greedy.

I ended up resorting to an old favourite technique, just randomly tunnelling
out a cave-like area

This version has potions, and most of the sprites were redrawn

![cave](public/6bbe12d05fa2cd4854891267fdd6b3d94006d2fb.png)


#### [350736edee24bb62e4cb522478296c38871eca75](https://github.com/nrkn/js1k-2019/tree/350736edee24bb62e4cb522478296c38871eca75)

OK, so you can fight monsters and pick up healing potions, but once you'd
cleared the level, what more is there to do? It was time to add stairs to the
next level.

The walls are different colours on different levels, and I simplified the floor
sprites to save a few bytes

![stairs](public/350736edee24bb62e4cb522478296c38871eca75.png)

#### [ddc17cd8b705c285185320d87bd5d2e7f5c7e7fe](https://github.com/nrkn/js1k-2019/tree/ddc17cd8b705c285185320d87bd5d2e7f5c7e7fe)

In a simple game, there should be some way to win.

When you get far enough down the dungeon, there's a statue you can get
(I chose this so I could reuse the player sprite) that allows you to win

![statue](public/ddc17cd8b705c285185320d87bd5d2e7f5c7e7fe.png)

I had to iterate this quite a bit to make a "win screen" that didn't take too
many bytes and came up with this:

![win](public/ddc17cd8b705c285185320d87bd5d2e7f5c7e7fe-win.png)

Some text or something saying "you win!" would have been nice, but wayyy too
many bytes!

## License

MIT License

Copyright (c) 2019 Nik Coughlin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.