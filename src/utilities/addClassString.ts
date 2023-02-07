const addClassString = (baseClasses: string, addOns: (string | undefined | boolean)[]) => {
  let classes = baseClasses

  if (addOns.length) {
    classes += ` ${addOns.filter((value) => Boolean(value)).join(' ')}`
  }

  return classes
}

export default addClassString
