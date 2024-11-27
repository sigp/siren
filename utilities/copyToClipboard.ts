const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}

export default copyToClipboard