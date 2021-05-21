import { Lexer } from "../lexer/Lexer";
import { Token } from "../lexer/Token";
import { TokenType } from "../lexer/TokenType";
import { MetaValue, ObjectValue, Tree, ObjectTypes, LightTypes, ObjectClassTypes, VectorValue } from "./Types";

export class Parser {
    private lexer: Lexer;
    private current: Token = { type: TokenType.Start, value: '' } as Token;

    constructor(private input: string) {
        this.lexer = new Lexer(input);
    }

    public parse() {
        const tree: Tree = {
            meta: [],
            objects: [],
            lights: [],
        };
        while (this.current.type !== TokenType.End) {
            this.current = this.lexer.nextToken();
            switch (this.current.type) {

                // Parse Meta Statements
                case TokenType.At: {
                    tree.meta.push(this.parseMetaStatement());
                    break;
                }

                // Parse Object or Light Statments
                case TokenType.Identifier: {
                    const obj = this.parseObjectStatement();
                    if (obj.class === 'light') {
                        tree.lights.push(obj as ObjectValue<'light'>);
                    }
                    if (obj.class === 'object') {
                        tree.objects.push(obj as ObjectValue<'object'>);
                    }
                    break;
                }

                // Default
                default: {
                    // Add to Errors
                    if (this.current.type === TokenType.End) {
                        break;
                    }
                    const [line, col] = this.lexer.getCursor();
                    throw new Error(`Line: ${line}, Column: ${col}. Syntax error - ${JSON.stringify(this.current)}`);
                }
            }
        }
        return tree;
    }

    private nextToken() {
        this.current = this.lexer.nextToken();
    }

    private logError(expected: string, got: string) {
        const [line, col] = this.lexer.getCursor();
        throw new Error(`Line ${line}, Column ${col} -- Expected ${expected}, Got: ${got}`);
    }

    private parseMetaStatement(): MetaValue {
        // Start at '@'

        // Next Token
        this.nextToken();
        let tkn = this.current;

        // Check to see if it is an idenitifier
        if (tkn.type !== TokenType.Identifier) {
            this.logError('Identifier', tkn.value);
        }

        // Get Meta Name value
        const name = tkn.value;

        // Next Token
        this.nextToken();
        tkn = this.current;

        // Check to see if it is a number
        if (tkn.type !== TokenType.Number) {
            this.logError('Identifier', tkn.value);
        }

        // Get Meta Value value
        const value = tkn.value;

        return { name, value };
    }

    private parseObjectStatement(): ObjectValue {
        let tkn = this.current;
        // Start at the class
        const clss = tkn.value as ObjectClassTypes;

        // Next Token
        this.nextToken();
        tkn = this.current;

        // Check to make sure it is a DoubleColon '::'
        if (tkn.type !== TokenType.DoubleColon) {
            const [line, col] = this.lexer.getCursor();
            throw new Error(`No double colon at ${line}, ${col} -- ${this.current} instead`);
        }

        // Next Token
        this.nextToken();
        tkn = this.current;

        // Check to see if it is an identifier of an object type e.g. 'sphere'
        if (tkn.type !== TokenType.Identifier) {
            this.logError('Object Type', tkn.value);
        }

        // Get Type value
        const type = tkn.value as ObjectTypes | LightTypes;

        // Next Token
        this.nextToken();
        tkn = this.current;

        // Check to see if it is an identifier of the name of the object
        if (tkn.type !== TokenType.Identifier) {
            this.logError('Identifier', tkn.value);
        }

        // Get Name value
        const name = tkn.value;

        // Parse specific type to get values
        const values = this.parseBraceStatement();
        return {
            class: clss,
            type,
            name,
            values,
        }
    }

    private parseBraceStatement(): Array<MetaValue> {
        // Next Token to get Curly Brace
        this.nextToken();
        let tkn = this.current;

        // Check the L Curly Brace
        if (tkn.type !== TokenType.LCurlyBrace) {
            this.logError('{', tkn.value);
        }

        // Next Token
        this.nextToken();
        tkn = this.current;

        const attributes: MetaValue[] = [];

        // Parse Attribute line
        while (this.current.type !== TokenType.RCurlyBrace) {
            attributes.push(this.parseObjectAttribute());
        }

        return attributes;
    }

    private parseObjectAttribute(): MetaValue {
        let tkn = this.current;

        // Check to see if we have an identifier
        if (tkn.type !== TokenType.Identifier) {
            this.logError('Identifier', tkn.value);
        }

        // Get Value Name
        const name = tkn.value;

        // Next Token
        this.nextToken();
        tkn = this.current;

        // Check to see if we have a colon
        if (tkn.type !== TokenType.Colon) {
            this.logError(':', tkn.value);
        }

        // Next Tokne
        this.nextToken();
        tkn = this.current;

        // Check if it is a curly brace or a number
        if (tkn.type !== TokenType.LCurlyBrace && tkn.type !== TokenType.Number) {
            this.logError('Vector or Number', tkn.value);
        }

        // Get the Vector or Number value
        let value: string | VectorValue = '';
        if (tkn.type === TokenType.LCurlyBrace) {
            value = this.parseVector();
        } else {
            value = tkn.value;
        }

        // Consume the semicolon
        this.nextToken();
        tkn = this.current;

        if (tkn.type !== TokenType.Semicolon) {
            this.logError(';', tkn.value);
        }

        this.nextToken();

        return { name, value };
    }

    private parseVector(): VectorValue {
        this.nextToken();
        let tkn = this.current;
        let v: VectorValue = ['0', '0', '0'];

        // Number - Comma - Number - Comma - Number
        if (tkn.type !== TokenType.Number) {
            this.logError('Number', tkn.value);
        }
        v[0] = tkn.value;
        this.nextToken();
        tkn = this.current;

        if (tkn.type !== TokenType.Comma) {
            this.logError('Comma', tkn.value);
        }
        this.nextToken();
        tkn = this.current;

        if (tkn.type !== TokenType.Number) {
            this.logError('Number', tkn.value);
        }
        v[1] = tkn.value;
        this.nextToken();
        tkn = this.current;

        if (tkn.type !== TokenType.Comma) {
            this.logError('Comma', tkn.value);
        }
        this.nextToken();
        tkn = this.current;

        if (tkn.type !== TokenType.Number) {
            this.logError('Number', tkn.value);
        }
        v[2] = tkn.value;
        this.nextToken();
        tkn = this.current;

        if (tkn.type !== TokenType.RCurlyBrace) {
            this.logError('}', tkn.value);
        }

        return v;
    }
}