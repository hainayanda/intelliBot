'use strict';

import { Procedure } from "./Procedure";
import { IKeyword } from "../interface/IKeyword";
import { isNullOrUndefined } from "util";
import { IReferenceable } from "../interface/IReferenceable";
import { KeywordPointer } from "../member/KeywordPointer";

export class Keyword extends Procedure implements IKeyword, IReferenceable<KeywordPointer> {
    private _references : KeywordPointer[] = [];
    private _arguments : string[] = [];
    private _returnValue : string;

    get fullName() : string {
        let matches = this.location.uri.fsPath.match(/[^\/\\]+$/g)
        let fileName = matches[0].replace(/(\.txt|\.robot)$/g, "");
        return fileName + "." + this.name;
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

    get references() : KeywordPointer[] {return this._references}
    set references(value){
        this._references = value;
    }
}