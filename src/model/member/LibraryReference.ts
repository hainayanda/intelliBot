'use strict';

import { Reference } from "../Reference";
import { isNullOrUndefined } from "util";
import { Location, Uri, workspace, TextDocument } from "vscode";
import { Document } from "../../document/Document";
import { Library } from "../../document/Library";

export class LibraryReference extends Reference<Library>{

    public constructor(location : Location, libraryName : string) {
        super(location, Library.getInstance(libraryName))
    }
}