## X-RL

This was originally a JS1K entry, but is in the process of being un-1k-ified.

A [Roguelike](https://en.wikipedia.org/wiki/Roguelike) in ~~1kb of~~ JavaScript,
previously made in 1kb for [JS1k 2019](https://js1k.com/2019-x)

[Play the 1K version here](https://js1k.com/2019-x/demo/4134)

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

[Source](src/index.ts)

## ideas going forward

- monsters drop coins and there is occasionally a shop where you can spend them
  to buy better weapons
- armour - the monsters would be more powerful so that it was actually needed
- a ranged weapon, like a bow
- wall and floor sprites rather than solid blocks
- revert to a proper dungeon generator, ideally the graph-based one
- more different monsters
- monsters have different behaviour and power
- more use of color
- more levels - hindered by the use throughout the codebase of the string with
  five different hex values for colors

## License

MIT License

Copyright (c) 2019-2025 Nik Coughlin

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