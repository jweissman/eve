export enum ASTNodeKind {
  Nothing = 'emptyProgram',

  Atom = 'atom',
  Compound = 'compound',
  Organism = 'organism',


  // atoms
  IntLit = 'integerLiteral',

  // compounds
  AddExp = 'additionExpression',
  Funcall = 'functionCall',
}
