'use strict';

import { isNullOrUndefined } from "util";
import { Location } from "vscode";
import { LocalDocument } from "../document/LocalDocument";
import { Member } from "../Member";

export class Procedure extends Member<LocalDocument>{
    private _name : string; 
    private _members : Member<any>[];

    get members() {return this._members}
    set members(val) {
        if(val == null) val = []
        this._members = val;
    }

    get name() : string {return this._name}
    set name(val){
        if(isNullOrUndefined(val)) throw new ReferenceError("name cannot be null or undefined")
        else this._name = val;
    }
}