import { TokenType } from "./TokenType";
import { Location } from "vscode";

'use strict';

export class Token {

    private _location : Location
    private _tokenType : TokenType

    constructor(location, tokenType){
        this._location = location;
        this._tokenType = tokenType;
    }

    public tokenType() : TokenType {return this._tokenType}
    public location() : Location {return this._location}
}