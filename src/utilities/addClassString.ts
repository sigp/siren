const addClassString = (baseClasses: string, addOn?: string) => {
  let classes = baseClasses

  if (addOn) {
    classes += ` ${addOn}`
  }

  return classes
}

export default addClassString
