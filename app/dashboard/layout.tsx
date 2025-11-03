'use client'

import Providers from '../Providers'
import '../../src/i18n'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>
}
