import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('agent resource discovery manifests', () => {
  it('publishes the same valid, empty catalog at both discovery paths', () => {
    const manifests = ['ard.json', 'ai-catalog.json'].map((name) =>
      JSON.parse(
        readFileSync(join(process.cwd(), 'public', '.well-known', name), 'utf8')
      )
    )

    const emptyCatalog = { specVersion: '1.0', entries: [] }
    expect(manifests).toEqual([emptyCatalog, emptyCatalog])
  })
})
