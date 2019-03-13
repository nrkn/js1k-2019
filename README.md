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

## A Visual History



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