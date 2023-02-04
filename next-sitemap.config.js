// const dbConnect = require('./lib/mongoose');
// const Post = require('./schemas/post');

// (await Post.findOne({ postURL: path.slice(path.lastIndexOf('/') + 1) }))?.createdAt;
// let posts;

// (async () => {
//   await dbConnect();
//   posts = await Post.find({});
// })();

module.exports = {
  siteUrl: process.env.SITE_URL || 'http://127.0.0.1:3000',
  generateRobotsTxt: true,
  exclude: ['/server-sitemap.xml', '/post/*', '/login', '/manage', '/writer'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: '*',
        disallow: ['/login', '/manage', '/writer']
      }
    ],
    additionalSitemaps: [
      `${process.env.SITE_URL || 'http://127.0.0.1:3000'}/server-sitemap.xml`
    ]
  },
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: 'hourly',
      priority: 1.0,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    }
  }
}