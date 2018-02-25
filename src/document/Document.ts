'use strict';

import { Keyword } from '../model/membercollection/Keyword';
import { isNullOrUndefined } from 'util';

export class Document {
    
    private _keywords : Keyword[] = []

    get keywords() : Keyword[] {return this._keywords}
    set keywords(value){
        if(isNullOrUndefined(value)) value = [];
        this._keywords = value;
    }
}