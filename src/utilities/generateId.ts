const generateId = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from(Array(length).keys())
    .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
    .join('')
}

export default generateId
