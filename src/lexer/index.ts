import {Token, TokenType} from "../types/lexer/tokens";

/*
    * @param {string} messageToTokenize - The message to tokenize
    * @returns {Token[]} - The tokenized message
    * @description - This function tokenizes a message
    * @author - Pablo Sabater
    * @date - 2020-04-24
    * @version - 1.0.0
    *
    * @example - tokensSplitter("const a = 'hello world'") -> ["const", "a", "=", "'hello world'"]
 */
function tokensSplitter(tokens: string) {
    const splintedTokens = new Array<string>();
    let currentWord: string = ""; // The current word being built, strings will maintain whitespaces
    const firstSplit: string[] = tokens.split(" "); // Splits the message into words and extra whitespaces

    /*
    * @description - joins the whitespaces and letter for strings
     */
    for (let x = 0; x < firstSplit.length; x++) {
        if (firstSplit[x].charAt(0) === "'" || firstSplit[x].charAt(0) === "\"") {
            let quotes: boolean = true;
            let fakeIndex: number = x;
            currentWord += `${firstSplit[x]} `;
            while (quotes && firstSplit[fakeIndex + 1] !== undefined) {
                if (!firstSplit[fakeIndex + 1].includes("'") && !firstSplit[fakeIndex + 1].includes("\"")) {
                    if (firstSplit[fakeIndex + 1] === "") {
                        currentWord += " ";
                    } else {
                        currentWord += firstSplit[fakeIndex + 1];
                    }
                    fakeIndex++;
                } else if (firstSplit[fakeIndex + 1] === "'" || firstSplit[fakeIndex + 1] === "\"") {
                    quotes = false;
                    currentWord += ` ${firstSplit[fakeIndex + 1]}`;
                } else if (firstSplit[fakeIndex + 1].includes("'") || firstSplit[fakeIndex + 1].includes("\"")) {
                    quotes = false;
                    currentWord += firstSplit[fakeIndex + 1];
                }
            }
            x = ++fakeIndex;
            splintedTokens.push(currentWord);

        } else {
            splintedTokens.push(firstSplit[x]);
        }
        currentWord = "";
    }
    return splintedTokens;
}

function devTokenizer() {
    const messageToTokenize: string = "const a = 'hello world'";
    const tokenizedMessage: Token[] = tokensSplitter(messageToTokenize).map(n => {
        if ((n.charAt(0)) === ("'" || "\"") && (n.charAt(n.length - 1)) === ("'" || "\"")) {
            return {type: TokenType.STRING, value: n};
        }
        switch (n) {
            case "=":
                return {type: TokenType.ASSIGNMENT};
            case "const":
                return {type: TokenType.VARIABLE_DECLARATION, value: n};
            default:
                return {type: TokenType.LITERAL, value: n};
        }
    })
    return tokenizedMessage;
}

devTokenizer();
