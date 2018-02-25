'use strict';

import { Member } from "../Member";
import { isNullOrUndefined } from "util";
import { Location } from "vscode";
import { INamedMember } from "../interface/INamedMember";
import { IKeyedValuedMember } from "../interface/IKeyedValuedMember";
import { IReferenceable } from "../interface/IReferenceable";
import { VariablePointer } from "./VariablePointer";

export class Variable<T> extends Member implements IKeyedValuedMember<T>, IReferenceable<VariablePointer<any>> {
    private _references : VariablePointer<any>[] = [];
    private _name : string; 
    private _value : T;
    
    public constructor(location : Location, name : string, value : T){
        super(location)
        this.name = name;
        this.value = value;
    }

    get name() : string {return this._name}
    set name(val){
        if(isNullOrUndefined(val)) throw new ReferenceError("name cannot be null or undefined")
        else this._name = val;
    }

    get value() : T {return this._value}
    set value(val){
        if(isNullOrUndefined(val)) throw new ReferenceError("value cannot be null or undefined")
        else this._value = val;
    }

    get references() : VariablePointer<any>[] {return this._references}
    set references(value){
        this._references = value;
    }
}