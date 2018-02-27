'use strict';

import { Document } from "./Document";
import { isNullOrUndefined } from "util";
import { IReferenceable } from "../interface/IReferenceable";
import { LibraryReference } from "../member/LibraryReference";

export class Library extends Document implements IReferenceable<LibraryReference>{
    private _references : LibraryReference[] = [];

    public constructor(libraryName: string){
        super()
        this.name = libraryName;
    }

    get references() : LibraryReference[] {return this._references}
    set references(value){
        this._references = value;
    }
}