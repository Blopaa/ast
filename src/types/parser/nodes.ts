import {TokenType, ValuedTokens} from "../lexer/tokens";

export enum NodeType {
    MAIN = "MAIN",
    VARIABLE = "VARIABLE",
    STRING = "STRING",
    NUMBER = "NUMBER",
}

export interface BaseNode<T extends NodeType> {
    type: T;
    name?: string;
    children?: NodeSet[];
}

export interface VariableNode extends BaseNode<NodeType.VARIABLE> {
    variableType: "const" | "let";
}

export interface ProgramNode extends BaseNode<NodeType.MAIN> {
    children: NodeSet[];
}

export interface ValueNode <K extends NodeType, T extends number | string> {
    type: K
    value: T;
}

export interface StringNode extends ValueNode<NodeType.STRING, string> {}
export interface NumberNode extends ValueNode<NodeType.NUMBER, number> {}

export type ValuedNodes = StringNode | NumberNode;

type NodeSet = ValuedNodes | VariableNode | BaseNode<NodeType> | undefined;
