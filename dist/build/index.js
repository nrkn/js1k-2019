"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsdom_1 = require("jsdom");
const fs_1 = require("fs");
const { readFile, writeFile } = fs_1.promises;
const start = async () => {
    try {
        const shim = await readFile('./public/shim.html', 'utf8');
        const script = await readFile('./dist/index.js', 'utf8');
        const dom = new jsdom_1.JSDOM(shim);
        const { document } = dom.window;
        const scriptEl = document.querySelector('script[type="demo"]');
        if (!scriptEl)
            throw Error('No script[type="demo"]');
        scriptEl.innerHTML = script;
        const serialized = dom.serialize();
        await writeFile('./public/index.html', serialized, 'utf8');
    }
    catch (err) {
        console.error(err);
    }
};
start();
//# sourceMappingURL=index.js.map