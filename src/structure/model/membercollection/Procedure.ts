'use strict';

import { MemberCollection } from "./MemberCollection";
import { isNullOrUndefined } from "util";
import { INamedMember } from "../interface/INamedMember";
import { Scope } from "./Scope";

export class Procedure extends MemberCollection<Scope> implements INamedMember{
    private _name : string; 

    get name() : string {return this._name}
    set name(val){
        if(isNullOrUndefined(val)) throw new ReferenceError("name cannot be null or undefined")
        else this._name = val;
    }
}