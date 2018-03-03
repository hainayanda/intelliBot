'use strict';

import { Procedure } from "./Procedure";
import { isNullOrUndefined } from "util";
import { IReferenceable } from "../interface/IReferenceable";
import { KeywordReference } from "../member/KeywordReference";

export class Keyword extends Procedure implements IReferenceable<KeywordReference<any>> {
    private _references : KeywordReference<any>[] = [];
    private _arguments : string[] = [];
    private _returnValue : string;

    get fullName() : string {
        return this.root.name + "." + this.name;
    }

    get arguments() : string[] {return this._arguments}
    set arguments(value){
        if(isNullOrUndefined(value)) value = [];
        this._arguments = value;
    }

    get returnValue() : string {return this._returnValue}
    set returnValue(value){
        this._returnValue = value;
    }

    get references() : KeywordReference<any>[] {return this._references}
    set references(value){
        this._references = value;
    }
}