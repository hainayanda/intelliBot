'use strict';

import { Keyword } from '../model/membercollection/Keyword';
import { isNullOrUndefined } from 'util';

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