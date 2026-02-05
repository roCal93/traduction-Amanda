export default () => {
  return async (ctx: any, next: () => Promise<any>) => {
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
