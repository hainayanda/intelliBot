'use strict';

import { Member } from "../Member";
import { isNullOrUndefined } from "util";
import { Location } from "vscode";

export class Documentation extends Member{
    private _text : string

    public constructor(location : Location, text : string) {
        super(location);
        this.text = text;
    }

    get text() : string {return this._text}
    set text(value) {
        if(isNullOrUndefined(value)) throw new ReferenceError("text cannot be null or undefined");
        else this._text = value;
    }
}