export function debounce<T extends (...args: unknown[]) => unknown>(
  ms: number,
  callback: T,
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timer: NodeJS.Timeout | undefined

  return (...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer)
    }
    return new Promise<ReturnType<T>>((resolve) => {
      timer = setTimeout(() => {
        const returnValue = callback(...args) as ReturnType<T>
        resolve(returnValue)
      }, ms)
    })
  }
}
