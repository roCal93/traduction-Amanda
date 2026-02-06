export default () => {
  return async (ctx: any, next: () => Promise<any>) => {
    // Debug endpoint to inspect ALLOWED_ORIGINS and computed client URLs quickly
    if (ctx.path === '/_debug/csp' && ctx.method === 'GET') {
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

      ctx.body = {
        ALLOWED_ORIGINS_env: allowedEnv ?? null,
        computed_origins: Array.from(clientUrlsSet),
      }
      ctx.status = 200
      return
    }

    await next()

    const headerName = 'Content-Security-Policy'
    const csp = ctx.response.get(headerName)

    // If no CSP header exists, set a safe default that includes Cloudinary
    if (!csp) {
      ctx.set(
        headerName,
        "default-src 'self'; img-src 'self' data: https://res.cloudinary.com https://market-assets.strapi.io; script-src 'self'; style-src 'self' 'unsafe-inline'"
      )
      return
    }

    // If CSP exists but doesn't include Cloudinary in img-src, append it
    if (csp.includes('img-src')) {
      // Append res.cloudinary.com to img-src directive if missing
      const newCsp = csp.replace(/img-src([^;]*)/, (match: string, group: string) => {
        if (match.includes('res.cloudinary.com')) return match
        return `img-src${group} https://res.cloudinary.com`
      })
      ctx.set(headerName, newCsp)
    } else {
      // No img-src directive, add it
      ctx.set(headerName, `${csp}; img-src 'self' data: https://res.cloudinary.com https://market-assets.strapi.io`)
    }
  }
}
