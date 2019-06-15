import { GenericOp } from './operations'
import { DocumentLineIndexGenerator } from './DocumentLineIndexGenerator'
import { getLineType, GenericLine } from './lines'
import Delta from 'quill-delta'
import { GenericRichContent, isGenericDelta } from './generic'
import { Selection } from './Selection'
import { Attributes } from '@delta/attributes'

export interface DocumentLine extends GenericLine {
  delta: Delta
  lineType: Attributes.LineType
  lineTypeIndex: number
}

export class LineWalker {
  public readonly ops: GenericOp[]

  public constructor(arg: GenericOp[] | GenericRichContent) {
    this.ops = isGenericDelta(arg) ? arg.ops : arg
  }

  public eachLine(predicate: (line: DocumentLine) => void) {
    const generator = new DocumentLineIndexGenerator()
    let firstLineCharAt = 0
    new Delta(this.ops).eachLine((delta, attributes, index) => {
      const beginningOfLineIndex = firstLineCharAt
      const endOfLineIndex = beginningOfLineIndex + delta.length()
      firstLineCharAt = endOfLineIndex + 1 // newline
      const lineType = getLineType(attributes)
      const lineTypeIndex = generator.findNextLineTypeIndex(lineType)
      const lineRange = Selection.fromBounds(beginningOfLineIndex, endOfLineIndex)
      predicate({
        lineRange,
        delta,
        lineType,
        lineTypeIndex,
        index,
      })
    })
  }

  public getLines() {
    const lines: DocumentLine[] = []
    this.eachLine(l => lines.push(l))
    return lines
  }
}
