import { MemberCollection } from "./MemberCollection";
import { Member } from "../Member";
import { Location } from "vscode";
import { INestedMember } from "../interface/INestedMember";
import { Procedure } from "./Procedure";

'use strict';

export class Scope<TRoot extends Procedure> extends MemberCollection implements INestedMember<TRoot>{
    private _root : TRoot;

    public constructor(location: Location, root : TRoot){
        super(location)
        this._root = root;
    }

    get root() : TRoot { return this._root }
}