import { Selection } from './Selection'
import { Attributes } from './attributes'

/**
 * Line types which will modify the length of a line when activated or disactivated.
 *
 * @public
 */
export type TextLengthModifierLineType = 'ol' | 'ul'

/**
 * An interface representing a line of text.
 *
 * @remarks
 *
 * Given `documentText` the string representing all characters of a document and `line`
 * any instance complying with this interface extracted from `documentText`, the following must
 * be true:
 *
 * ```ts
 * documentText.substring(line.lineRange.start, line.lineRange.end) === extractTextFromDelta(line.delta)
 * ```
 * @internal
 */
export interface GenericLine {
  index: number
  lineRange: Selection
}

export function isLineTypeTextLengthModifier(lineType: Attributes.LineType): lineType is TextLengthModifierLineType {
  return lineType === 'ol' || lineType === 'ul'
}

export function shouldLineTypePropagateToNextLine(lineType: Attributes.LineType) {
  return lineType === 'ol' || lineType === 'ul'
}

export function isLineInSelection(selection: Selection, { lineRange }: GenericLine) {
  const { start: beginningOfLineIndex, end: endOfLineIndex } = lineRange
  return (
    (selection.start >= beginningOfLineIndex && selection.start <= endOfLineIndex) ||
    (selection.start <= endOfLineIndex && selection.end >= beginningOfLineIndex)
  )
}

export function getLineType(lineAttributes?: Attributes.Map): Attributes.LineType {
  return lineAttributes && lineAttributes.$type ? (lineAttributes.$type as Attributes.LineType) : 'normal'
}

export function getHeadingCharactersFromType(lineType: Attributes.LineType, index: number): string {
  switch (lineType) {
    case 'ol':
      return `${index + 1}.  `
    case 'ul':
      return '•  '
    case 'quoted':
      return '  '
    default:
      return ''
  }
}

export function getHeadingRegexFromType(lineType: TextLengthModifierLineType): RegExp {
  if (lineType === 'ol') {
    return /^(\d+\.\s\s)/
  }
  return /^(•\s\s)/
}
