'use strict';

import { Reference } from "../Reference";
import { LocalDocument } from "../document/LocalDocument";
import { isNullOrUndefined } from "util";
import { Location, Uri, workspace, TextDocument } from "vscode";
import { LocalDocumentExtractor } from "../../extractor/LocalDocumentExtractor";

export class Resource extends Reference<Thenable<LocalDocument>>{
    private _path : string;

    public constructor(location : Location, path : string) {
        super(location, null)
        this.path = path;
    }

    get path() : string {return this._path}
    set path(value) {
        if(isNullOrUndefined(value)) throw new ReferenceError("path cannot be null or undefined");
        let thisUri = this.location.uri.fsPath;
        thisUri = thisUri.replace(/[\\\/][^\\\/]$/g, "");
        let upCount = value.match(/\.\.[\/\\]/g).length;
        for(let i = 0; i < upCount; i++){
            thisUri = thisUri.replace(/[\\\/][^\\\/]$/g, "");
        }
        let addedPath = value.replace(/\.\.[\/\\]/g, "");
        let resourcePath = thisUri + "/" + addedPath;
        let futureTextDocument = workspace.openTextDocument(Uri.file(resourcePath))
        super.origin = futureTextDocument.then<LocalDocument>((textDocument) => {
            return LocalDocumentExtractor.extract(textDocument);
        })
    }
}