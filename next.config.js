/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns:
      process.env.REMOTE_PATTERNS_URLS.split('/').map(eachURL => (
        {
          protocol: 'https',
          hostname: eachURL,
          port: '',
          pathname: '/**'
        }
      ))
  }
}

module.exports = nextConfig
