import { Variable } from "./Variable";
import { INestedMember } from "../../interface/INestedMember";
import { Location } from "vscode";
import { Member } from "../../Member";
import { DictionaryVariable } from "./DictionaryVariable";
import { NestedDictionaryVariable } from "./NestedDictionaryVariable";

'use strict';

export class NestedVariable<TRoot extends Member, V> extends Variable<V> implements INestedMember<TRoot>{
    private _root : TRoot;

    constructor(location: Location, root: TRoot, name : string, value: V) {
        if(root instanceof DictionaryVariable) name = root.name + "." + name;
        else if(root instanceof NestedDictionaryVariable) name = root.name + "." + name;
        super(location, name, value);
        this._root = root;
    }

    get root(){return this._root}
}