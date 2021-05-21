import { Token } from "./Token";
import { TokenType } from "./TokenType";

const newToken = (type: TokenType, value: string) => ({ type, value })

const newErrorToken = (value: string, line: number, column: number) => {
    const message = `[Error] Line: ${line} | Column: ${column} | Value: ${value}`
    return {
        type: TokenType.Error,
        value: message,
    };
}

const isFloat = (f: string) => {
    if (!f) return false;
    const re = new RegExp(/((\d+)\.(\d+)|(\d+))/g);
    return !!f.match(re)
}

const isNumber = (c: string): boolean => {
    if (!c) return false;
    const re = new RegExp(/([0-9]|\.)/);
    return !!c.match(re);
}

const isAlpha = (c: string) => {
    if (!c) return false;
    const re = new RegExp(/[a-zA-Z]/);
    return !!c.match(re);
}

const isAlphaNumeric = (c: string) => {
    if (!c) return false;
    return isAlpha(c) || isNumber(c);
};

const isIdentifier = (c: string) => {
    if (!c) return false;
    const re = new RegExp(/(\_|\$)/)
    return isAlphaNumeric(c) || c.match(re);
}

const isWhitespace = (c: string) => {
    if (!c) return false;
    const re = new RegExp(/(\n|\t)/);
    return !!c.match(re) || c === ' ';
}

const isNewLine = (c: string) => {
    if (!c) return false;
    const re = new RegExp(/\n/);
    return !!c.match(re);
}

export class Lexer {

    private tokens: Token[] = [];

    private pos = 0;
    private current: string = '';

    private cursor = {
        line: 1,
        column: 0,
    };

    constructor(
        private readonly input: string,
    ) {
        this.current = input[0];
    }

    public createTokens(): Token[] {
        if (this.input.length < 1) {
            return [newToken(TokenType.End, '\0')];
        }

        while (this.pos < this.input.length) {
            this.whitespace();
            this.tokens.push(this.parse());
        }

        return this.tokens;
    }

    public nextToken(): Token {
        this.whitespace();
        return this.parse();
    }

    public getCursor(): [number, number] {
        return [this.cursor.line, this.cursor.column];
    }

    private parse(): Token {
        if (this.pos >= this.input.length) {
            return newToken(TokenType.End, '\0');
        }
        const cur = this.read();
        switch (cur) {
            case '@': {
                return newToken(TokenType.At, cur);
            }

            case ',': {
                return newToken(TokenType.Comma, cur);
            }

            case ';': {
                return newToken(TokenType.Semicolon, cur);
            }

            case ':': {
                if (this.current == ':') {
                    const tkn = newToken(TokenType.DoubleColon, cur + this.current);
                    this.read();
                    return tkn;
                }
                return newToken(TokenType.Colon, cur);
            }

            case '{': {
                return newToken(TokenType.LCurlyBrace, cur);
            }

            case '}': {
                return newToken(TokenType.RCurlyBrace, cur);
            }

            case '-': {
                if (isNumber(this.current)) {
                    const num = isNumber(this.current) ? this.readNumber() : '';
                    return newToken(TokenType.Number, cur + num);
                }
                return newErrorToken(cur, this.cursor.line, this.cursor.column);
            }

            default: {
                if (isNumber(cur)) {
                    const num = isNumber(this.current) ? this.readNumber() : '';
                    const fullNum = cur + num;
                    if (isFloat(fullNum)) {
                        return newToken(TokenType.Number, cur + num);
                    }
                    return newErrorToken(fullNum, this.cursor.line, this.cursor.column);
                } else if (isAlpha(cur)) {
                    const ident = isIdentifier(this.current) ? this.readIdentifier() : '';
                    return newToken(TokenType.Identifier, cur + ident);
                }
                return newErrorToken(cur, this.cursor.line, this.cursor.column);
            }
        }
    }

    private read(): string {
        const cur = this.current;
        this.pos++;
        this.current = this.input[this.pos];
        this.cursor.column++;
        return cur;
    }

    private peak(): string {
        const index = this.pos + 2 < this.input.length ? this.pos + 1 : this.pos;
        return this.input[index];
    }

    private whitespace() {
        while (isWhitespace(this.current)) {
            if (isNewLine(this.current)) {
                this.cursor.line++;
                this.cursor.column = 0;
            }
            this.read();
        }
    }

    private readNumber(): string {
        let num = this.read();
        if (!isNumber(this.current)) return num;
        while (isNumber(this.current)) {
            num += this.read();
        }
        return num;
    }

    private readIdentifier(): string {
        let ident = this.read();
        if (!isIdentifier(this.peak())) return ident;
        while (isIdentifier(this.current)) {
            ident += this.read();
        }
        return ident;
    }
}