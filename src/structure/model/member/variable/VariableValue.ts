import { Member } from "../../Member";
import { Location } from "vscode";
import { INestedMember } from "../../interface/INestedMember";
import { Variable } from "./Variable";

'use strict'

export class VariableValue<TRoot extends Member, TValue> extends Member implements INestedMember<TRoot> {
    private _value : TValue
    private _root : TRoot

    constructor(location: Location, root: TRoot, value : TValue){
        super(location);
        this._value = value;
        this._root = root;
    }

    get root() {return this._root}
    get value() {return this._value}
}