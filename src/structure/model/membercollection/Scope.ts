import { MemberCollection } from "./MemberCollection";
import { Member } from "../Member";
import { Location } from "vscode";

'use strict';

export class Scope extends MemberCollection<Member>{
    private _deep : Number = 0;

    public constructor(location: Location, deep : Number){
        super(location)
        this._deep = deep;
    }

    get deep() : Number { return this._deep }
    set deep(value) {
        if(value < 0) throw new ReferenceError("deep cannot be minus");
        else this._deep = value;
    }
}