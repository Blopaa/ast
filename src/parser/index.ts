import {Symbols, Token, TokenType} from "../types/lexer/tokens";
import {devTokenizer} from "../lexer";
import {FunctionNode, NodeSet, NodeType, ProgramNode, VariableNode} from "../types/parser/nodes";


/*
    * @description - parses the tokens to AST
    * @author - Pablo Sabater
    * @date - 2022-06-19
    * @version - 1.0.0
 */
export function parser(tokens: Token[]) {
    const program: ProgramNode = {
        type: NodeType.MAIN,
        children: [],
    }
    for (let x = 0; x < tokens.length; x++) {
        switch (tokens[x].type) {
            case TokenType.FUNCTION:
                let insideIndex: number = x + 3;
                const newFunction: FunctionNode = {
                    type: NodeType.FUNCTION,
                    name: tokens[x + 1].value,
                    parameters: [],
                    children: [],
                }
                for(let y = insideIndex; y < tokens.length; y++){
                    insideIndex++;
                    if(tokens[y].type === TokenType.PARENTHESIS_CLOSE){
                        break
                    }
                    newFunction.parameters.push(tokens[y].value as string)
                }
                const bodyTokens: Token[] = []
                insideIndex++;
                for(let y = insideIndex; y < tokens.length; y++){
                    if(tokens[y].type === TokenType.BRACE_CLOSE){
                        break
                    }
                    insideIndex++;
                    bodyTokens.push(tokens[y])
                }
                newFunction.children = parser(bodyTokens).children;
                x = insideIndex;
                program.children.push(newFunction)
                break;
            case TokenType.VARIABLE_DECLARATION:
                const variableType = tokens[x].value === Symbols.UNALTERABLE_VARIABLE_DECLARATION ? "unalterable"
                    : tokens[x].value === Symbols.ALTERABLE_VARIABLE_DECLARATION ? "alterable" : "";
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
    return program;
}
