/**
 * @vitest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TranslationBlock from '../TranslationBlock'

const paragraph = (text: string) => ({ type: 'paragraph', children: [{ type: 'text', text }] })

describe('TranslationBlock identity mapping (N→N)', () => {
  it('highlights counterpart paragraph on source hover and scrolls on click', () => {
    const examples = [
      {
        source: [paragraph('Hello p1'), paragraph('Hello p2')],
        translation: [paragraph('Bonjour p1'), paragraph('Bonjour p2')],
        author: 'Alice',
        sourceLanguage: 'en',
      },
    ]

    render(<TranslationBlock examples={examples} translationLanguage={'fr'} />)

    const sourceP1 = screen.getByText('Hello p1')
    const targetP1 = screen.getByText('Bonjour p1')

    const scrollSpy = vi.spyOn(Element.prototype, 'scrollIntoView')

    fireEvent.mouseEnter(sourceP1)
    expect(targetP1.closest('p')).toHaveClass('bg-yellow-100')

    fireEvent.click(sourceP1)
    expect(scrollSpy).toHaveBeenCalled()

    scrollSpy.mockRestore()
  })

  it('highlights counterpart paragraph on target hover and scrolls back to source on click', () => {
    const examples = [
      {
        source: [paragraph('S1'), paragraph('S2')],
        translation: [paragraph('T1'), paragraph('T2')],
        author: 'Bob',
        sourceLanguage: 'en',
      },
    ]

    render(<TranslationBlock examples={examples} translationLanguage={'fr'} />)

    const s2 = screen.getByText('S2')
    const t2 = screen.getByText('T2')

    const scrollSpy = vi.spyOn(Element.prototype, 'scrollIntoView')

    fireEvent.mouseEnter(t2)
    expect(s2.closest('p')).toHaveClass('bg-yellow-100')

    fireEvent.click(t2)
    expect(scrollSpy).toHaveBeenCalled()

    scrollSpy.mockRestore()
  })
})