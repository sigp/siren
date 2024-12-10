const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}

export default copyToClipboard
