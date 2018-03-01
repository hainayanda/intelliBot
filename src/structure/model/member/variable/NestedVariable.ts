import { VariableValue } from "./VariableValue";
import { Member } from "../../Member";
import { Location } from "vscode";
import { isNullOrUndefined } from "util";

'use strict'

export class NestedVariable<TRoot extends Member, TValue extends VariableValue<NestedVariable<TRoot, TValue>, TValue>> extends VariableValue<TRoot, TValue>{
    private _name : string;
    
    public constructor(location : Location, root : TRoot, name : string, value : TValue){
        super(location, root, value)
        this.name = name;
    }

    get name() : string {return this._name}
    set name(val){
        if(isNullOrUndefined(val)) throw new ReferenceError("name cannot be null or undefined")
        else this._name = val;
    }
}