import { JSDOM } from 'jsdom'
import { promises } from 'fs'

const { readFile, writeFile } = promises

const start = async () => {
  try {
    const shim = await readFile( './public/shim.html', 'utf8' )
    const script = await readFile( './dist/index.js', 'utf8' )
    const dom = new JSDOM( shim )
    const { document } = dom.window

    const scriptEl = document.querySelector( 'script[type="demo"]' )

    if ( !scriptEl ) throw Error( 'No script[type="demo"]' )

    scriptEl.innerHTML = script

    const serialized = dom.serialize()

    await writeFile( './public/index.html', serialized, 'utf8' )
  } catch( err ){
    console.error( err )
  }
}

start()
