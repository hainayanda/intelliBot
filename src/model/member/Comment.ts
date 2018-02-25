'use strict';

import { Member } from "../Member";
import { isNullOrUndefined } from "util";

export class Comment extends Member{
    private _text : string;

    get text() : string {return this._text}
    set text(val){
        if(isNullOrUndefined(val)) throw new ReferenceError("text cannot be null or undefined")
        else this._text = val;
    }
}