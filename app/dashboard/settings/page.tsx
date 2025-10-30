'use client'

import '../../../src/global.css'
import Wrapper from './Wrapper'

export default function Page() {
  // No server-side fetching or session check needed!
  // Session was already validated at dashboard level
  // All data is in SWR cache from dashboard load
  return <Wrapper />
}
