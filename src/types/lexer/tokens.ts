export enum TokenType {
    STRING = "STRING",
    LITERAL = "LITERAL",
    ASSIGNMENT = "ASSIGNMENT",
    VARIABLE_DECLARATION = "VARIABLE_DECLARATION",
    NUMBER = "NUMBER",
    FUNCTION = "FUNCTION",
    PARENTHESIS_OPEN = "PARENTHESIS_OPEN",
    PARENTHESIS_CLOSE = "PARENTHESIS_CLOSE",
    BRACE_OPEN = "BRACE_OPEN",
    BRACE_CLOSE = "BRACE_CLOSE",
}

export enum Symbols {
    ASSIGNMENT = "=",
    UNALTERABLE_VARIABLE_DECLARATION = "const",
    ALTERABLE_VARIABLE_DECLARATION = "let",
    FUNCTION = "function",
    PARENTHESIS_OPEN = "(",
    PARENTHESIS_CLOSE = ")",
    BRACKET_OPEN = "[",
    BRACKET_CLOSE = "]",
    BRACE_OPEN = "{",
    BRACE_CLOSE = "}",
    COMMA = ",",
}

export type ValuedTokens = TokenType.STRING | TokenType.NUMBER;

export interface Token {
    type: TokenType;
    value?: string;
}
