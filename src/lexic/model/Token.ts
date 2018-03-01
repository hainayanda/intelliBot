import { TokenType } from "./TokenType";
import { Location } from "vscode";
import { Instruction } from "./Instruction";

'use strict';

export class Token {

    private _location : Location
    private _tokenType : TokenType
    private _text : string

    constructor(location, text, tokenType){
        this._location = location;
        this._tokenType = tokenType;
        this._text = text
    }

    public static getInstance(instruction : Instruction, tokenType) : Token{
        return new Token(instruction.location, instruction.text, tokenType)
    }

    get tokenType() : TokenType {return this._tokenType}
    get location() : Location {return this._location}
    get text() : string {return this._text}
}