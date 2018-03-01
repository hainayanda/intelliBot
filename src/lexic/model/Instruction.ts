import { Range, Location } from "vscode";

'use strict'

export class Instruction {
    private _text : string;
    private _location : Location;

    constructor(text: string, location: Location){
        this._location = location;
        this._text = text;
    }

    get text() {return this._text}
    get location() {return this._location}
}