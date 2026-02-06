export default () => {
  return async (ctx: any, next: () => Promise<any>) => {
    await next()

    const headerName = 'Content-Security-Policy'
    let csp = ctx.response.get(headerName)

    // Build allowed origins list from ALLOWED_ORIGINS or CLIENT_URL fallback
    const allowedEnv = process.env.ALLOWED_ORIGINS || undefined
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000'
    const clientUrlsSet = new Set<string>()

    if (allowedEnv) {
      allowedEnv
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((u) => clientUrlsSet.add(u))
    } else {
      clientUrlsSet.add(clientUrl)
      if (!clientUrl.includes('localhost')) {
        const host = clientUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
        const base = host.replace(/^www\./, '')
        clientUrlsSet.add(`https://${base}`)
        clientUrlsSet.add(`https://www.${base}`)
        clientUrlsSet.add(`https://*.${base}`)
      }
    }

    const origins = Array.from(clientUrlsSet)

    // If no CSP header exists, set a safe default that includes Cloudinary and frame directives
    if (!csp) {
      ctx.set(
        headerName,
        `default-src 'self'; img-src 'self' data: https://res.cloudinary.com https://market-assets.strapi.io; frame-src 'self' ${origins.join(' ')}; frame-ancestors 'self' ${origins.join(' ')}; script-src 'self'; style-src 'self' 'unsafe-inline'`
      )
      return
    }

    // Ensure img-src contains Cloudinary
    let newCsp = csp
    if (newCsp.includes('img-src')) {
      newCsp = newCsp.replace(/img-src([^;]*)/, (match: string, group: string) => {
        if (match.includes('res.cloudinary.com')) return match
        return `img-src${group} https://res.cloudinary.com`
      })
    } else {
      newCsp = `${newCsp}; img-src 'self' data: https://res.cloudinary.com https://market-assets.strapi.io`
    }

    // Helper to add origins to a directive (adds 'self' where appropriate)
    const addOriginsToDirective = (cspStr: string, directive: string, addSelf = false) => {
      if (cspStr.includes(directive)) {
        return cspStr.replace(new RegExp(`${directive}([^;]*)`), (match: string, group: string) => {
          let directiveText = match
          if (addSelf && !directiveText.includes("'self'")) {
            // insert 'self' after directive name
            directiveText = `${directive} 'self'${group}`
          }
          origins.forEach((o) => {
            if (!directiveText.includes(o)) directiveText = `${directiveText} ${o}`
          })
          return directiveText
        })
      }
      const prefix = addSelf ? "'self' " : ''
      return `${cspStr}; ${directive} ${prefix}${origins.join(' ')}`
    }

    // Ensure frame-src and frame-ancestors include allowed origins
    newCsp = addOriginsToDirective(newCsp, 'frame-src', true)
    newCsp = addOriginsToDirective(newCsp, 'frame-ancestors', true)

    ctx.set(headerName, newCsp)
  }
}

