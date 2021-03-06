import { Attributes } from './attributes'
import Op from 'quill-delta/dist/Op'
import reduce from 'ramda/es/reduce'
import { Images } from '@core/Images'

/**
 * An atomic operation representing changes to a document.
 *
 * @remarks
 *
 * This interface is a redefinition of {@link quilljs-delta#Op}.
 *
 * @public
 */
export interface GenericOp {
  /**
   * A representation of inserted content.
   */
  readonly insert?: string | object
  /**
   * A delete operation.
   *
   * @internal
   */
  readonly delete?: number
  /**
   * A retain operation
   *
   * @internal
   */
  readonly retain?: number
  /**
   * A set of attributes describing properties of the content.
   */
  readonly attributes?: Attributes.Map
}

/**
 * An operation referring to text.
 *
 * @public
 */
export interface TextOp extends GenericOp {
  /**
   * {@inheritdoc GenericOp.insert}
   */
  readonly insert?: string
  /**
   * {@inheritdoc GenericOp.attributes}
   */
  readonly attributes?: Attributes.Map
}

/**
 * A description of an image to be persisted in the document.
 *
 * @public
 */
export interface ImageKind<Source> extends Images.Description<Source> {
  kind: 'image'
}

/**
 * An operation referring to an image.
 *
 * @public
 */
export type ImageOp<Source> = BlockOp<ImageKind<Source>>

/**
 * An operation referring to a block.
 *
 * @public
 */
export interface BlockOp<T extends object> extends GenericOp {
  /**
   * {@inheritdoc GenericOp.insert}
   */
  readonly insert: T
  /**
   * {@inheritdoc GenericOp.attributes}
   */
  readonly attributes?: Attributes.Map
}

export function isTextOp(op: GenericOp): op is TextOp {
  return typeof op.insert === 'string'
}

export const computeOpsLength = reduce((curr: number, prev: GenericOp) => Op.length(prev) + curr, 0 as number)

export function buildTextOp(text: string, attributes?: Attributes.Map) {
  return attributes
    ? {
        insert: text,
        attributes,
      }
    : { insert: text }
}

export function buildImageOp<Source>(description: Images.Description<Source>): ImageOp<Source> {
  return {
    insert: {
      kind: 'image',
      ...description,
    },
  }
}
