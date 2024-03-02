export function debounce<T extends (...args: any[]) => any>(
  ms: number,
  callback: T,
): (...args: any[]) => Promise<ReturnType<T>> {
  let timer: NodeJS.Timeout | undefined

  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer)
    }

    return new Promise<ReturnType<T>>((resolve, reject) => {
      timer = setTimeout(() => {
        try {
          const returnValue = callback(...args) as ReturnType<T>
          resolve(returnValue)
        } catch (error) {
          reject(error)
        }
      }, ms)
    })
  }
}
