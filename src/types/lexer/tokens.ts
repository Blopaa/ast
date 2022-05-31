export enum TokenType  {
    STRING = "STRING",
    LITERAL = "LITERAL",
    ASSIGNMENT = "ASSIGNMENT",
    VARIABLE_DECLARATION = "VARIABLE_DECLARATION",
}

export interface Token {
    type: TokenType;
    value?: string;
}
