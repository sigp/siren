import { useRef, useState, useLayoutEffect } from 'react'

export function useMaxHeight() {
  const parentRef = useRef<HTMLDivElement>(null)
  const targetChildRef = useRef<HTMLDivElement>(null)
  const [maxHeight, setMaxHeight] = useState(0)

  useLayoutEffect(() => {
    const parentEl = parentRef.current
    const targetEl = targetChildRef.current
    if (!parentEl || !targetEl) return

    const totalWithMargins = (el: HTMLElement) => {
      const h = el.getBoundingClientRect().height
      const style = getComputedStyle(el)
      const mt = parseFloat(style.marginTop)
      const mb = parseFloat(style.marginBottom)
      return h + mt + mb
    }

    const compute = () => {
      // Measure parent
      const parentRect = parentEl.getBoundingClientRect()
      const total = parentRect.height
      const pStyle = getComputedStyle(parentEl)
      const padTop = parseFloat(pStyle.paddingTop)
      const padBottom = parseFloat(pStyle.paddingBottom)
      const contentHeight = total - padTop - padBottom

      // Sum siblings
      const children = Array.from(parentEl.children) as HTMLElement[]
      const siblingsTotal = children
        .filter((c) => c !== targetEl)
        .reduce((sum, c) => sum + totalWithMargins(c), 0)

      // Subtract target margins
      const tStyle = getComputedStyle(targetEl)
      const tMT = parseFloat(tStyle.marginTop)
      const tMB = parseFloat(tStyle.marginBottom)

      // Compute max box height
      const maxBox = Math.max(0, contentHeight - siblingsTotal - tMT - tMB)
      setMaxHeight(maxBox)
    }

    // Initial and reactive measurements
    compute()
    window.addEventListener('resize', compute)
    const mo = new MutationObserver(() => compute())
    mo.observe(parentEl, { childList: true })

    return () => {
      window.removeEventListener('resize', compute)
      mo.disconnect()
    }
  }, [])

  return { parentRef, targetChildRef, maxHeight }
}
