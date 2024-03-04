import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Siren',
  description: 'User interface built for Lighthouse that connects to a Lighthouse Beacon Node and a Lighthouse Validator Client to monitor performance and display key validator metrics.',
}


export default function RootLayout({
 children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}