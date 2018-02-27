import { TextLine } from "vscode";
import { Token } from "./Token";

'use strict'

export class TokenLine {

    private _line : TextLine;
    private _tokens : Token[] = [];

    constructor(line : TextLine, tokens : Token[]){
        this._line = line;
        this._tokens = tokens;
    }

    get tokens() {return this._tokens}

    get lineNumber() {return this._line.lineNumber}

    get tokenSize() {return this._tokens.length}
}