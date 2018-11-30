import { loadWASM } from 'onigasm' // peer dependency of 'monaco-textmate'
import { LanguageRegistry } from 'monaco-textmate-languages'
import { wireTmGrammars } from './set-grammars'

import grammars from './grammars'

let wasmLoaded = false

export async function liftOff (monaco) {
  if (!wasmLoaded) {
    // eslint-disable-next-line global-require
    await loadWASM(require('onigasm/lib/onigasm.wasm')) // See https://www.npmjs.com/package/onigasm#light-it-up
    wasmLoaded = true
  } else {
    return
  }
  const registry = new LanguageRegistry({
    basePath: 'monaco-textmate-languages',
    jsonFetcher: async (uri) => {
      return (await fetch(`${window.location.origin}/${uri}`)).text()
    },
    // `jsonFetcher` also works (you must provide either of those)
    // jsonFetcher: (uri) => (await fetch(uri)).json(),
  })
  await wireTmGrammars(monaco, registry, grammars)
}
