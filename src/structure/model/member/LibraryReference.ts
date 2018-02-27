'use strict';

import { Reference } from "../Reference";
import { isNullOrUndefined } from "util";
import { Location, Uri, workspace, TextDocument } from "vscode";
import { Document } from "../document/Document";
import { Library } from "../document/Library";
import { LibraryExtractor } from "../../extractor/LibraryExtractor";

export class LibraryReference extends Reference<Thenable<Library>>{

    public constructor(location : Location, libraryName : string) {
        super(location, LibraryExtractor.extract(libraryName))
    }
}