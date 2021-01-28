// enum {}
export enum ASTNodeKind {
  // ...Blah,
  Nothing = 'emptyProgram',

  // Atom = 'atom',
  // Compound = 'compound',
  // Organism = 'organism',
  // atoms
  IntLit = 'integerLiteral',

  // compounds
  // AddExp = 'additionExpression',
  // Funcall = 'functionCall',
  BinaryExpression = 'binaryExpression',

  Identifier = 'identifier',
  Assignment = 'assignment'
}
