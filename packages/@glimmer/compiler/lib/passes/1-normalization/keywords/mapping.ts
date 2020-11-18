import { KeywordType } from './impl';

export function isKeywordOrReserved(word: string): boolean {
  return word in KEYWORDS_TYPES || word in RESERVED_WORDS;
}

/**
 * This includes the full list of reserved words in the template language. Some
 * of these words may be implemented as keywords, others may be reserved for
 * potential future use.
 */
export const KEYWORDS_TYPES: { [key: string]: KeywordType[] } = {
  action: ['Expr', 'Modifier', 'Append'],
  component: ['Expr', 'Append', 'Block'],
  debugger: ['Append'],
  'each-in': ['Block'],
  each: ['Block'],
  eachIn: ['Block'],
  'has-block-params': ['Expr', 'Append'],
  'has-block': ['Expr', 'Append'],
  hasBlock: ['Expr', 'Append'],
  hasBlockParams: ['Expr', 'Append'],
  helper: ['Expr', 'Append'],
  if: ['Expr', 'Append', 'Block'],
  'in-element': ['Block'],
  inElement: ['Block'],
  let: ['Block'],
  'link-to': ['Append', 'Block'],
  log: ['Expr', 'Append'],
  modifier: ['Expr'],
  mount: ['Append'],
  mut: ['Expr', 'Append'],
  outlet: ['Append'],
  'query-params': ['Expr'],
  readonly: ['Expr', 'Append'],
  unbound: ['Expr', 'Append'],
  unless: ['Expr', 'Append', 'Block'],
  with: ['Block'],
  yield: ['Append'],
};

export const RESERVED_WORDS: { [key: string]: string } = {
  hasBlock: 'has-block',
  hasBlockParams: 'has-block-params',
  inElement: 'in-element',
};
