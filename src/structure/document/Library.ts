'use strict';

import { Document } from "./Document";
import { isNullOrUndefined } from "util";
import { IReferenceable } from "../model/interface/IReferenceable";
import { LibraryReference } from "../model/member/LibraryReference";
import { LibraryExtractor } from "../extractor/LibraryExtractor";

export class Library extends Document implements IReferenceable<LibraryReference>{
    private _references : LibraryReference[] = [];
    private static libraries : Map<string, Library> = new Map();

    private constructor(libraryName: string){
        super()
        this.name = libraryName;
        Library.libraries.set(libraryName, this);
    }

    public static refresh(){
        this.libraries = new Map();
    }

    public static getInstance(libraryName : string) : Thenable<Library>{
        return new Promise((resolver, rejecter) => {
            if(this.libraries.has(libraryName)) resolver(this.libraries.get(libraryName));
            else{
                let library = LibraryExtractor.extract(libraryName);
                this.libraries.set(libraryName, library);
                resolver(library);
            }
        })
    }

    get references() : LibraryReference[] {return this._references}
    set references(value){
        this._references = value;
    }
}