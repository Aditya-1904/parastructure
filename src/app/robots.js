export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/', '/checkout/'],
    },
    sitemap: 'https://parastructure.in/sitemap.xml',
  };
}
