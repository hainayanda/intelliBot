'use strict';

import { Member } from "../Member";
import { isNullOrUndefined } from "util";

export class Syntax extends Member {

    private _text : string;

    get text() : string {return this._text}
    set text(value){
        if(isNullOrUndefined(value)) throw new ReferenceError("text cannot be null or undefined");
        else this._text = value;
    }

}