import type { Metadata } from 'next'
import localFont from 'next/font/local'

export const metas = {
  title: 'Siren',
  description: 'User interface built for Lighthouse that connects to a Lighthouse Beacon Node and a Lighthouse Validator Client to monitor performance and display key validator metrics.',
  image: '/siren.png',
}

export const metadata: Metadata = {
  // metadataBase: new URL('http://localhost'),
  ...metas,
  twitter: {
    title: metas.title,
    description: metas.description,
    creator: 'sigmaPrime',
    images: [metas.image],
  },
  openGraph: {
    title: metas.title,
    description: metas.description,
    siteName: metas.title,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: metas.image,
        width: 800,
        height: 600,
      },
      {
        url: metas.image,
        width: 1800,
        height: 1600,
        alt: metas.title,
      },
    ],
  }
} as any

const openSauce = localFont({
  src: [
    {
      path: '../public/Fonts/OpenSauce/OpenSauceOne-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/Fonts/OpenSauce/OpenSauceOne-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/Fonts/OpenSauce/OpenSauceOne-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--openSauce',
})

const roboto = localFont({
  src: [
    {
      path: '../public/Fonts/Roboto/Roboto-Regular.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/Fonts/Roboto/Roboto-Medium.ttf',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--roboto',
})

const archivo = localFont({
  src: [
    {
      path: '../public/Fonts/Archivo/Archivo-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/Fonts/Archivo/Archivo-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--archivo',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
    <head>
      <script
        dangerouslySetInnerHTML={{
          __html: `
              (function() {
                try {
                  const theme = JSON.parse(localStorage.getItem('UI')?.trim() || 'null');
                  if (theme === "DARK") {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {
                  console.error('Failed to parse theme from localStorage:', e);
                }
              })();
            `,
        }}
      />
    </head>
      <body className={`${openSauce.variable} ${roboto.variable} ${archivo.variable}`}>
        <div id='root'>{children}</div>
      </body>
    </html>
  )
}
