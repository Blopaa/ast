import { TokenType, ValuedTokens } from "../lexer/tokens";

export enum NodeType {
    MAIN = "MAIN",
    VARIABLE = "VARIABLE",
    STRING = "STRING",
    NUMBER = "NUMBER",
    FUNCTION = "FUNCTION",
}

export interface BaseNode<T extends NodeType> {
    type: T;
    name?: string;
    children?: NodeSet[];
}

export interface VariableNode extends BaseNode<NodeType.VARIABLE> {
    variableType: "alterable" | "unalterable";
}

export interface FunctionNode extends BaseNode<NodeType.FUNCTION> {
    parameters: string[];
}

export interface ProgramNode extends BaseNode<NodeType.MAIN> {
    children: NodeSet[];
}

export interface ValuedNode<K extends NodeType, T extends number | string> {
    type: K;
    value: T;
}

export type StringNode = ValuedNode<NodeType.STRING, string>;
export type NumberNode = ValuedNode<NodeType.NUMBER, number>;

export type ValuedNodes = StringNode | NumberNode;

export type NodeSet =
    | ValuedNodes
    | VariableNode
    | BaseNode<NodeType>
    | undefined;
