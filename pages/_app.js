import '@/styles/globals.css'

import localFont from '@next/font/local'

const spoqa = localFont({
  src: [
    {
      path: '../fonts/SpoqaHanSansNeo-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/SpoqaHanSansNeo-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
})

export default function App({ Component, pageProps }) {
  return (
    <main className={spoqa.className}>
      <Component {...pageProps} />
    </main>
  )
}
