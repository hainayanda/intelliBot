'use strict';

import { Document } from "./Document";
import { isNullOrUndefined } from "util";
import { IReferenceable } from "../model/interface/IReferenceable";
import { LibraryReference } from "../model/member/LibraryReference";

export class Library extends Document implements IReferenceable<LibraryReference>{
    private _references : LibraryReference[] = [];
    private static libraries : Map<string, Library> = new Map();

    private _libraryName : string;

    private constructor(libraryName: string){
        super()
        this.libraryName = libraryName;
        Library.libraries.set(libraryName, this);
    }

    get libraryName(){return this._libraryName}
    set libraryName(value){
        if(isNullOrUndefined(value)) throw new ReferenceError("value cannot be null or undefined");
        else{
            //NEED IMPLEMENTATION
            this._libraryName = value;
        }
    }

    public static refresh(){
        this.libraries = new Map();
    }

    public static getInstance(libraryName : string){
        if(this.libraries.has(libraryName)) return this.libraries.get(libraryName);
        else return new Library(libraryName);
    }

    get references() : LibraryReference[] {return this._references}
    set references(value){
        this._references = value;
    }
}