'use strict';

import { Member } from "../../Member";
import { isNullOrUndefined } from "util";
import { Location } from "vscode";
import { INamedMember } from "../../interface/INamedMember";
import { IKeyedValuedMember } from "../../interface/IKeyedValuedMember";
import { IReferenceable } from "../../interface/IReferenceable";
import { VariablePointer } from "./VariablePointer";

export class Variable<TValue> extends Member implements IKeyedValuedMember<TValue>, IReferenceable<VariablePointer<TValue>> {
    private _references : VariablePointer<TValue>[] = [];
    private _name : string; 
    private _value : TValue;
    
    public constructor(location : Location, name : string, value : TValue){
        super(location)
        this.name = name;
        this.value = value;
    }

    get name() : string {return this._name}
    set name(val){
        if(isNullOrUndefined(val)) throw new ReferenceError("name cannot be null or undefined")
        else this._name = val;
    }

    get value() : TValue {return this._value}
    set value(val){
        if(isNullOrUndefined(val)) throw new ReferenceError("value cannot be null or undefined")
        else this._value = val;
    }

    get references() : VariablePointer<TValue>[] {return this._references}
    set references(value){
        this._references = value;
    }
}