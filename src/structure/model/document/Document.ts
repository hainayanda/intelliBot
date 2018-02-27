'use strict';

import { isNullOrUndefined } from 'util';
import { Keyword } from '../membercollection/Keyword';

export class Document {

    private _name : string;
    protected _keywords : Keyword[] = []

    get keywords() : Keyword[] {return this._keywords}
    set keywords(value){
        if(isNullOrUndefined(value)) value = [];
        this._keywords = value;
    }

    get name() : string {return this._name}
    set name(value){
        if(isNullOrUndefined(value)) throw new ReferenceError("document's name cannot be null or undefined");
        this._name = value;
    }
}