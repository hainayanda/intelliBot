import { TokenLine } from "./TokenLine";
import { TextDocument } from "vscode";

'use strict';

export class TokenDocument {
    private _tokenLines : TokenLine[];
    private _textDocument : TextDocument;

    constructor(textDocument : TextDocument, tokenLines : TokenLine[]){
        this._tokenLines = tokenLines;
    }

    get tokenLines() {return this._tokenLines}
    get textDocument() {return this._textDocument}
    
}