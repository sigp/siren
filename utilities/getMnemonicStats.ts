import {TypographyColor} from "../src/components/Typography/Typography";

const getMnemonicStats = (wordCount: number): {limit: number, color: TypographyColor, isValid: boolean} => {
  const validMnemonicLengths = [12,15,18,21,24]

  const limit = validMnemonicLengths.find(x => x >= wordCount) || validMnemonicLengths[validMnemonicLengths.length - 1]
  const color = (wordCount === limit ? 'text-success' : wordCount > limit ? 'text-error' : undefined) as TypographyColor
  const isValid = validMnemonicLengths.includes(wordCount)

  return {
    limit,
    color,
    isValid
  }
}

export default getMnemonicStats