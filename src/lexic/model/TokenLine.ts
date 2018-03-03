import { TextLine } from "vscode";
import { Token } from "./Token";

'use strict'

export class TokenLine {

    private _line : TextLine;
    private _tokens : Token[];

    constructor(line : TextLine, tokens : Token[]){
        this._line = line;
        if(tokens = null) tokens = [];
        tokens.sort((a, b) => {
            if(a.location.range.start < b.location.range.start) return -1;
            else if(a.location.range.start > b.location.range.start) return 1;
            else return 0;
        })
        this._tokens = tokens;
    }

    get tokens() {return this._tokens}

    get lineNumber() {return this._line.lineNumber}

    get tokenSize() {return this._tokens.length}
}