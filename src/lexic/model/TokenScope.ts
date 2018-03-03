import { TokenLine } from "./TokenLine";
import { Location, Range } from "vscode";

'use strict';

export class TokenScope {
    private _tokenLines : TokenLine[] = [];
    private _scopeLocation : Location;

    constructor(tokenLines : TokenLine[]){
        if(tokenLines == null) tokenLines = [];
        let removed : TokenLine[];
        tokenLines.forEach(tokenLine => {
            if(tokenLine.tokenSize == 0) removed.push(tokenLine);
        });
        removed.forEach(remove => {
            tokenLines = tokenLines.splice(tokenLines.indexOf(remove), 1)
        });
        tokenLines.sort((a, b) => {
            if(a.tokens[0].location.range.start < b.tokens[0].location.range.start) return -1;
            else if(a.tokens[0].location.range.start > b.tokens[0].location.range.start) return 1;
            else return 0;
        })
        this._tokenLines = tokenLines;
        let start = tokenLines[0].tokens[0].location.range.start
        let end = tokenLines[tokenLines.length-1].tokens[tokenLines[tokenLines.length-1].tokens.length-1].location.range.end
        let range = new Range(start, end);
        this._scopeLocation = new Location(tokenLines[0].tokens[0].location.uri, range);
    }

    get tokenLines() {return this._tokenLines}

    get size() {return this.tokenLines.length }
}