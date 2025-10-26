export const truncateMiddle = (text: string, maxLength = 25) => {
  if (text.length <= maxLength) return text
  const half = Math.floor(maxLength / 2)
  return `${text.slice(0, half)}…${text.slice(-half)}`
}