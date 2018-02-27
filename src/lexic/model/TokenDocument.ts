import { TokenLine } from "./TokenLine";

'use strict';

export class TokenDocument {
    private _tokenLines : TokenLine[];

    constructor(tokenLines : TokenLine[]){
        this._tokenLines = tokenLines;
    }

    
}