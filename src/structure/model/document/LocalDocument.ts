'use strict';

import { Document } from "./Document";
import { TextDocument } from 'vscode';
import { Key } from "readline";
import { Library } from "./Library";
import { Resource } from "../member/Resource";
import { IReferenceable } from "../interface/IReferenceable";
import { Procedure } from "../membercollection/Procedure";
import { Variable } from "../member/variable/Variable";
import { LibraryReference } from "../member/LibraryReference";
import { Keyword } from "../membercollection/Keyword";

export class LocalDocument extends Document implements IReferenceable<Resource>{

    private _references : Resource[] = [];
    private _textDocument : TextDocument;
    private _testCases : Procedure[] = []
    private _globalVariables : Variable<LocalDocument, any>[];
    private _resources : Resource[];
    private _libraries : LibraryReference[];

    public constructor(textDocument : TextDocument){
        super();
        this._textDocument = textDocument;
        this.name = textDocument.fileName.replace(/\.(robot|txt)$/g, "");
    }

    get textDocument() : TextDocument {return this._textDocument}
    
    get testCases() : Procedure[] {return this._testCases}
    set testCases(value){
        if(value == null) value = [];
        this._testCases = value;
    }

    get keywords() : Keyword[] {return this._keywords}
    set keywords(value){
        if(value == null) value = [];
        this._keywords = value;
    }

    get globalVariables() : Variable<LocalDocument, any>[] {return this._globalVariables}
    set globalVariables(value){
        if(value == null) value = [];
        this._globalVariables = value;
    }

    get resources() : Resource[] {return this._resources}
    set resources(value){
        if(value == null) value = [];
        this._resources = value;
    }

    get libraries() : LibraryReference[] {return this._libraries}
    set libraries(value){
        if(value == null) value = [];
        this._libraries = value;
    }

    get references() : Resource[] {return this._references}
    set references(value){
        if(value == null) value = [];
        this._references = value;
    }

    get allAvailableGlobalVariables() : Thenable<Variable<LocalDocument, any>[]>{
        let container : Variable<LocalDocument, any>[] = [];
        let scannedDocuments : LocalDocument[] = [];
        return this.allAvailableGlobalVariableScanner(container, scannedDocuments);
    }

    get allAvailableKeywords() : Thenable<Keyword[]>{
        let container : Keyword[] = [];
        let scannedDocuments : LocalDocument[] = [];
        let scannedLibrary : Library[] = [];
        return this.allAvailableKeywordScanner(container, scannedDocuments, scannedLibrary);
    }

    private allAvailableGlobalVariableScanner(container : Variable<LocalDocument, any>[], scannedDocuments : LocalDocument[]) : Thenable<Variable<LocalDocument,any>[]>{
        container = container.concat(this._globalVariables)
        let resources = this.resources
        let futureVariable : Thenable<Variable<LocalDocument, any>[]>;
        resources.forEach(resource => {
            let resCallBack = (document : LocalDocument) => {
                if(scannedDocuments.indexOf(document) < 0) return container;
                scannedDocuments.push(document);
                container = container.concat(this.globalVariables);
                return document.allAvailableGlobalVariableScanner(container, scannedDocuments);
            }
            if(futureVariable == null){
                futureVariable = resource.origin.then<Variable<LocalDocument, any>[]>(resCallBack)
            }
            else{
                futureVariable = futureVariable.then<Variable<LocalDocument, any>[]>((container) => {
                    return resource.origin.then<Variable<LocalDocument, any>[]>(resCallBack)
                })
            }
        });
        return futureVariable;
    }

    private allAvailableKeywordScanner(container : Keyword[], scannedDocuments : LocalDocument[], scannedLibrary : Library[]) : Thenable<Keyword[]>{
        container = container.concat(this._keywords)
        let resources = this.resources
        let futureKeywords : Thenable<Keyword[]>;
        resources.forEach(resource => {
            let resCallBack = (document: LocalDocument) => {
                if(scannedDocuments.indexOf(document) >= 0) return container;
                scannedDocuments.push(document);
                container = container.concat(this._keywords);
                let libraries = document.libraries;
                let libScanner : Thenable<Keyword[]>;
                libraries.forEach(library => {
                    let libCallBack = (lib) => {
                        if(scannedLibrary.indexOf(lib) < 0){
                            scannedLibrary.push(lib)
                            container = container.concat(lib.keywords);
                        }
                        return container;
                    }
                    if(libScanner == null){
                        libScanner = library.origin.then<Keyword[]>(libCallBack)
                    }
                    else{
                        libScanner = libScanner.then<Keyword[]>((container) => {
                            return library.origin.then<Keyword[]>(libCallBack);
                        })
                    }
                });
                return document.allAvailableKeywordScanner(container, scannedDocuments, scannedLibrary);
            }
            if(futureKeywords == null){
                futureKeywords = resource.origin.then<Keyword[]>(resCallBack)
            }
            else{
                futureKeywords = futureKeywords.then<Keyword[]>((container) => {
                    return resource.origin.then<Keyword[]>(resCallBack)
                })
            }
        });
        return futureKeywords;
    }
}