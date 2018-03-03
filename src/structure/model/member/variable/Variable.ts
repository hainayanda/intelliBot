'use strict';

import { Member } from "../../Member";
import { isNullOrUndefined } from "util";
import { Location } from "vscode";
import { IReferenceable } from "../../interface/IReferenceable";
import { VariableReference } from "./VariableReference";

export class Variable<TRoot, TValue> extends Member<TRoot> implements IReferenceable<VariableReference<any, Variable<TRoot, TValue>>> {
    private _nameLocation : Location;
    private _references : VariableReference<any, Variable<TRoot, TValue>>[] = [];
    private _name : string; 
    private _value : TValue;
    
    public constructor(location : Location, nameLocation : Location, name : string, value : TValue){
        super(location)
        this._nameLocation = nameLocation;
        this.name = name;
        this.value = value;
    }

    get nameLocation() {return this._nameLocation}
    set nameLocation(val){
        if(isNullOrUndefined(val)) throw new ReferenceError("name cannot be null or undefined")
        else this._nameLocation = val;
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

    get references() : VariableReference<any, Variable<TRoot, TValue>>[] {return this._references}
    set references(value){
        this._references = value;
    }
}