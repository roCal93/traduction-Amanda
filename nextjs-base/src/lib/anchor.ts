export function scrollToAnchor(id?: string) {
  if (!id || typeof window === 'undefined') return

  const el = document.getElementById(id)
  if (el) {
    // compute offset from sticky header if present
    const header = document.getElementById('site-header')
    const offset = header ? Math.ceil(header.getBoundingClientRect().height) : 0
    const TOP_PADDING = 8 // small extra spacing
    const top = Math.round(el.getBoundingClientRect().top + window.scrollY - offset - TOP_PADDING)
    window.scrollTo({ top, behavior: 'smooth' })
    // update the hash without jumping
    history.replaceState(null, '', `#${id}`)
  } else {
    // fallback: set hash so navigation can later find it
    location.hash = id
  }
}

export async function scrollToAnchorWithRetry(id?: string, attempts = 10, interval = 100) {
  if (!id || typeof window === 'undefined') return

  // debug log to help troubleshooting in dev
  if (process.env.NODE_ENV !== 'production') console.debug(`[anchor] scrollToAnchorWithRetry: trying to scroll to '#${id}'`)

  for (let i = 0; i < attempts; i++) {
    const el = document.getElementById(id)
    if (el) {
      if (process.env.NODE_ENV !== 'production') console.debug(`[anchor] element found for '#${id}', scrolling (attempt ${i + 1})`)
      const header = document.getElementById('site-header')
      const offset = header ? Math.ceil(header.getBoundingClientRect().height) : 0
      const TOP_PADDING = 8
      const top = Math.round(el.getBoundingClientRect().top + window.scrollY - offset - TOP_PADDING)
      window.scrollTo({ top, behavior: 'smooth' })
      history.replaceState(null, '', `#${id}`)
      return
    }
    await new Promise(res => setTimeout(res, interval))
  }
  // last attempt: set hash as fallback
  if (process.env.NODE_ENV !== 'production') console.debug(`[anchor] element not found for '#${id}', setting location.hash as fallback`)
  location.hash = id
}

export function isSameBasePath(currentPath: string, targetHref: string) {
  return currentPath.split('#')[0] === targetHref.split('#')[0]
}
