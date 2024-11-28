export function debounce<T extends (...args: any[]) => any>(
  ms: number,
  callback: T,
): (...args: any[]) => void {
  let timer: NodeJS.Timeout | undefined
  let lastCallId: symbol | null = null

  return (...args: any[]) => {
    const callId = Symbol('debounceCall')
    lastCallId = callId

    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      if (callId === lastCallId) {
        callback(...args)
      }
    }, ms)
  }
}
