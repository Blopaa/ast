import { Symbols, Token, TokenType } from "../types/lexer/tokens";
import { parser } from "../parser";

/*
 * @param {string} messageToTokenize - The message to tokenize
 * @returns {Token[]} - The tokenized message
 * @description - This function tokenizes a message
 * @author - Pablo Sabater
 * @date - 2022-05-31
 * @version - 1.0.0
 *
 * @example - tokensSplitter("const a = 'hello world'") -> ["const", "a", "=", "'hello world'"]
 */
export function tokensSplitter(tokens: string): string[] {
    const splintedTokens = new Array<string>();
    let currentWord = ""; // The current word being built, strings will maintain whitespaces
    const firstSplit: string[] = tokens.split(" "); // Splits the message into words and extra whitespaces

    /*
     * @description - joins the whitespaces and letter for strings
     */
    for (let x = 0; x < firstSplit.length; x++) {
        if (
            (firstSplit[x].charAt(0) === "'" ||
                firstSplit[x].charAt(0) === '"') &&
            (firstSplit[x].charAt(firstSplit.length) !== "'" ||
                firstSplit[x].charAt(firstSplit.length) !== '"' ||
                firstSplit[x].length === 1)
        ) {
            let quotes = true;
            let fakeIndex: number = x;
            // this code down here is to maintain the string whitespaces
            if (
                (firstSplit[x].charAt(0) === ("'" || '"') &&
                    firstSplit[x].charAt(firstSplit[x].length - 1) !==
                        ("'" || '"')) ||
                firstSplit[x] === ("'" || '"')
            ) {
                currentWord += firstSplit[x] + " ";
            } else {
                currentWord += firstSplit[x];
            }
            while (quotes && firstSplit[fakeIndex + 1] !== undefined) {
                if (
                    !firstSplit[fakeIndex + 1].includes("'") &&
                    !firstSplit[fakeIndex + 1].includes('"')
                ) {
                    if (firstSplit[fakeIndex + 1] === "") {
                        currentWord += " ";
                    } else {
                        currentWord += `${firstSplit[fakeIndex + 1]} `;
                    }
                    fakeIndex++;
                } else if (
                    firstSplit[fakeIndex + 1].includes("'") ||
                    firstSplit[fakeIndex + 1].includes('"')
                ) {
                    quotes = false;
                    currentWord += firstSplit[fakeIndex + 1];
                }
            }
            x = ++fakeIndex;
            splintedTokens.push(currentWord);
        } else {
            if (firstSplit[x] === Symbols.FUNCTION) {
                const functionTokensAndNewIndex: [string[], number] =
                    tokenizeFunctions(firstSplit, x);
                functionTokensAndNewIndex[0].map((n) => splintedTokens.push(n));
                x = functionTokensAndNewIndex[1];
            } else {
                splintedTokens.push(firstSplit[x]);
            }
        }
        currentWord = "";
    }
    return splintedTokens.filter((n) => n !== "");
}

function tokenizeFunctions(
    tokens: string[],
    index: number
): [string[], number] {
    const functionTokens = new Array<string>();
    functionTokens.push(tokens[index]);
    if (tokens[index] === Symbols.FUNCTION) {
        if (tokens[index + 1].includes(Symbols.PARENTHESIS_OPEN)) {
            tokens[index + 1].split(Symbols.PARENTHESIS_OPEN).map((t, i) => {
                functionTokens.push(t.replaceAll(Symbols.COMMA, ""));
                if (i === 0) {
                    functionTokens.push(Symbols.PARENTHESIS_OPEN);
                }
            });
            index++;
        }
        index++;
        while (index < tokens.length) {
            if (tokens[index].includes(Symbols.PARENTHESIS_CLOSE)) {
                functionTokens.push(
                    tokens[index]
                        .split("")
                        .slice(0, -1)
                        .join("")
                        .replaceAll(Symbols.COMMA, "")
                );
                functionTokens.push(Symbols.PARENTHESIS_CLOSE);
                break;
            } else if (tokens[index].includes(Symbols.PARENTHESIS_OPEN)) {
                functionTokens.push(Symbols.PARENTHESIS_OPEN);
                const parameter = tokens[index].split("");
                parameter.shift();
                tokens[index] = parameter
                    .join("")
                    .replaceAll(Symbols.COMMA, "");
            }
            functionTokens.push(tokens[index]);
            index++;
        }

        if (tokens[index + 1].includes(Symbols.BRACE_OPEN)) {
            tokens[index + 1].split(Symbols.BRACE_OPEN).map((t, i) => {
                functionTokens.push(t);
                if (i === 0) {
                    functionTokens.push(Symbols.BRACE_OPEN);
                }
            });
            index++;
        }
        index++;
        while (index < tokens.length) {
            // check if there is a function inside the function (recursion)
            if (tokens[index].includes(Symbols.FUNCTION)) {
                const recursiveFunctionTokens = tokenizeFunctions(
                    tokens,
                    index
                );
                recursiveFunctionTokens[0].map((n) => functionTokens.push(n));
                index = ++recursiveFunctionTokens[1];
            }
            if (tokens[index].includes(Symbols.BRACE_CLOSE)) {
                functionTokens.push(
                    tokens[index].split("").slice(0, -1).join("")
                );
                functionTokens.push(Symbols.BRACE_CLOSE);
                break;
            } else if (tokens[index].includes(Symbols.BRACE_OPEN)) {
                functionTokens.push(Symbols.BRACE_OPEN);
                const parameter = tokens[index].split("");
                parameter.shift();
                tokens[index] = parameter.join("");
            }
            functionTokens.push(tokens[index]);
            index++;
        }
    }
    return [functionTokens, index];
}

// in a future version, this will be eliminated and it will use a cli
export function devTokenizer(messageToTokenize: string) {
    const tokenizedMessage: Token[] = tokensSplitter(messageToTokenize).map(
        (n) => {
            if (
                n.charAt(0) === ("'" || '"') &&
                n.charAt(n.length - 1) === ("'" || '"')
            ) {
                return { type: TokenType.STRING, value: n };
            } else if (!isNaN(Number(n))) {
                return { type: TokenType.NUMBER, value: n };
            }
            switch (n) {
                case Symbols.ASSIGNMENT:
                    return { type: TokenType.ASSIGNMENT };
                case Symbols.UNALTERABLE_VARIABLE_DECLARATION:
                case Symbols.ALTERABLE_VARIABLE_DECLARATION:
                    return { type: TokenType.VARIABLE_DECLARATION, value: n };
                case Symbols.FUNCTION:
                    return { type: TokenType.FUNCTION };
                case Symbols.PARENTHESIS_OPEN:
                    return { type: TokenType.PARENTHESIS_OPEN };
                case Symbols.PARENTHESIS_CLOSE:
                    return { type: TokenType.PARENTHESIS_CLOSE };
                case Symbols.BRACE_OPEN:
                    return { type: TokenType.BRACE_OPEN };
                case Symbols.BRACE_CLOSE:
                    return { type: TokenType.BRACE_CLOSE };
                default:
                    return { type: TokenType.LITERAL, value: n };
            }
        }
    );
    console.log(tokenizedMessage);
    const parserResults = parser(tokenizedMessage);
    console.log(JSON.stringify(parserResults, null, 2));
    return tokenizedMessage;
}

devTokenizer(" let a = ' hello '");

