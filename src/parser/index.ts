import {Token, TokenType} from "../types/lexer/tokens";
import {devTokenizer} from "../lexer";
import {NodeType, ProgramNode, VariableNode} from "../types/parser/nodes";


/*
    * @description - parses the tokens to AST
    * @author - Pablo Sabater
    * @date - 2022-06-19
    * @version - 1.0.0
 */
function parser() {
    const tokens: Token[] = devTokenizer(); // removing in future
    const program: ProgramNode = {
        type: NodeType.MAIN,
        children: [],
    }
    for (let x = 0; x < tokens.length; x++) {
        switch (tokens[x].type) {
            case TokenType.VARIABLE_DECLARATION:
                const variableType = tokens[x].value === "const" ? "const" : tokens[x].value === "let" ? "let" : "";
                if (variableType === "") throw new Error("Invalid variable type");
                const newVariable: VariableNode = {
                    variableType,
                    type: NodeType.VARIABLE,
                }
                if (tokens[x + 1].type !== TokenType.LITERAL) throw new Error("Invalid variable declaration");

                newVariable.name = tokens[x + 1].value;
                if (tokens[x + 2].type !== TokenType.ASSIGNMENT) throw new Error("Invalid variable declaration assignment");

                switch (tokens[x + 3].type) {
                    case TokenType.STRING:
                        newVariable.children = [{
                            type: NodeType.STRING,
                            value: tokens[x + 3].value,
                        }];
                        break;
                    case TokenType.NUMBER:
                        newVariable.children = [{
                            type: NodeType.NUMBER,
                            value: tokens[x + 3].value,
                        }]
                        break;
                    default:
                        throw new Error("Invalid variable declaration value");
                }
                program.children.push(newVariable);
                x += 3;
                break;
            default:
                throw new Error("Invalid token");
        }
    }
    console.log(JSON.stringify(program, null, 2));
    return program;
}

parser();
