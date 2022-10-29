import {devTokenizer, tokensSplitter} from "../../lexer";

describe("tokensSplitter function tests", () => {
    it("should return strings respecting the whitespaces", () => {
        expect(tokensSplitter("' hello world' ' 1st test here '")).toEqual([
            "' hello world'",
            "' 1st test here '",
        ]);
    });
    it("should remove whitespaces except for strings", () => {
        expect(tokensSplitter("const example = ' hello world '")).toEqual([
            "const",
            "example",
            "=",
            "' hello world '",
        ]);
    });
    it("should should remove empty tokens caused by extra whitespaces", () => {
        expect(tokensSplitter("hello   world")).toEqual(["hello", "world"]);
    });
    test("2 words string without whitespaces at the beginning or at the end", () => {
        expect(tokensSplitter("'hello world'")).toEqual(["'hello world'"]);
    });
    test("2 words string with whitespaces at the beginning and at the end", () => {
        expect(tokensSplitter("' hello world '")).toEqual(["' hello world '"]);
    });
    test("1 word string without whitespaces at the beginning or at the end", () => {
        expect(tokensSplitter("'hello'")).toEqual(["'hello'"]);
    });
    test("1 word string with whitespaces at the beginning and at the end", () => {
        expect(tokensSplitter("' hello '")).toEqual(["' hello '"]);
    });
    test("function inside of a function correct tokenizedMessage", () => {
        expect(devTokenizer("function b (a, c) { function x(a, c) { } }")).toEqual([
            { type: 'FUNCTION' },
            { type: 'LITERAL', value: 'b' },
            { type: 'PARENTHESIS_OPEN' },
            { type: 'LITERAL', value: 'a' },
            { type: 'LITERAL', value: 'c' },
            { type: 'PARENTHESIS_CLOSE' },
            { type: 'BRACE_OPEN' },
            { type: 'FUNCTION' },
            { type: 'LITERAL', value: 'x' },
            { type: 'PARENTHESIS_OPEN' },
            { type: 'LITERAL', value: 'a' },
            { type: 'LITERAL', value: 'c' },
            { type: 'PARENTHESIS_CLOSE' },
            { type: 'BRACE_OPEN' },
            { type: 'BRACE_CLOSE' },
            { type: 'BRACE_CLOSE' }
        ])
    });
});
