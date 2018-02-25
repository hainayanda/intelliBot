'use strict';

import { Member } from "../Member";
import { Resource } from "../member/Resource";
import { LibraryReference } from "../member/LibraryReference";
import { Documentation } from "../member/Documentation";
import { isNullOrUndefined } from "util";

export class Settings extends Member{
    private _resources : Resource[] = [];
    private _libraries : LibraryReference[] = [];
    private _documentation : Documentation[] = [];

    get resources() : Resource[] {return this._resources}
    set resources(value) {
        if(isNullOrUndefined(value)) throw new ReferenceError("resources cannot be null or undefined");
        else this._resources = value;
    }

    get libraries() : LibraryReference[] {return this._libraries}
    set libraries(value) {
        if(isNullOrUndefined(value)) throw new ReferenceError("libraries cannot be null or undefined");
        else this._libraries = value;
    }

    get documentation() : Documentation[] {return this._documentation}
    set documentation(value) {
        if(isNullOrUndefined(value)) throw new ReferenceError("documentation cannot be null or undefined");
        else this._documentation = value;
    }

    public addResource(resource : Resource){
        this._resources.push(resource);
    }
    
    public removeResource(resource : Resource){
        let index = this._resources.indexOf(resource);
        this._resources = this._resources.splice(index, 1);
    }

    public addLibrary(library : LibraryReference){
        this._libraries.push(library);
    }
    
    public removeLibrary(library : LibraryReference){
        let index = this._libraries.indexOf(library);
        this._libraries = this._libraries.splice(index, 1);
    }

    public addDocumentation(documentation : Documentation){
        this._documentation.push(documentation);
    }
    
    public removeDocumentation(documentation : Documentation){
        let index = this._documentation.indexOf(documentation);
        this._documentation = this._documentation.splice(index, 1);
    }
}