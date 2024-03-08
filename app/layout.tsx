import type { Metadata } from 'next'
import localFont from 'next/font/local'

export const metadata: Metadata = {
  title: 'Siren',
  description: 'User interface built for Lighthouse that connects to a Lighthouse Beacon Node and a Lighthouse Validator Client to monitor performance and display key validator metrics.',
}

const openSauce = localFont({
  src: [
    {
      path: '../public/Fonts/OpenSauce/OpenSauceOne-Light.ttf',
      weight: '300',
      style: 'normal'
    },
    {
      path: '../public/Fonts/OpenSauce/OpenSauceOne-Regular.ttf',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../public/Fonts/OpenSauce/OpenSauceOne-Bold.ttf',
      weight: '700',
      style: 'normal'
    },
  ],
  variable: '--openSauce'
})

const roboto = localFont({
  src: [
    {
      path: '../public/Fonts/Roboto/Roboto-Regular.ttf',
      weight: '300',
      style: 'normal'
    },
    {
      path: '../public/Fonts/Roboto/Roboto-Medium.ttf',
      weight: '600',
      style: 'normal'
    },
  ],
  variable: '--roboto'
})

const archivo = localFont({
  src: [
    {
      path: '../public/Fonts/Archivo/Archivo-Regular.ttf',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../public/Fonts/Archivo/Archivo-Bold.ttf',
      weight: '700',
      style: 'normal'
    },
  ],
  variable: '--archivo'
})


export default function RootLayout({
 children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${openSauce.variable} ${roboto.variable} ${archivo.variable}`}>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}