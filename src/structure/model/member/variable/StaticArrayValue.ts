import { Member } from "../../Member";
import { Location } from "vscode";
import { INestedMember } from "../../interface/INestedMember";
import { Variable } from "./Variable";
import { ArrayVariable } from "./ArrayVariable";

'use strict';

export class StaticArrayValue extends Member implements INestedMember<ArrayVariable<StaticArrayValue>> {
    
    private _root : ArrayVariable<StaticArrayValue>;
    private _value : string;

    constructor(location : Location, root: ArrayVariable<StaticArrayValue>, value : string){
        super(location);
        this._value = value;
        this._root = root;
    }

    get root() {return this._root}

    get value() {return this._value}
    set value(val){
        this._value = val;
    }
}