export enum TokenType  {
    STRING = "STRING",
    LITERAL = "LITERAL",
    ASSIGNMENT = "ASSIGNMENT",
    VARIABLE_DECLARATION = "VARIABLE_DECLARATION",
    NUMBER = "NUMBER",
}

export type ValuedTokens = TokenType.STRING | TokenType.NUMBER;

export interface Token {
    type: TokenType;
    value?: string;
}
