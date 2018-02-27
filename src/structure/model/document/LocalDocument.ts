'use strict';

import { Document } from "./Document";
import { TextDocument } from 'vscode';
import { Key } from "readline";
import { Library } from "./Library";
import { Resource } from "../member/Resource";
import { IReferenceable } from "../interface/IReferenceable";
import { Procedure } from "../membercollection/Procedure";
import { MemberCollection } from "../membercollection/MemberCollection";
import { Variable } from "../member/variable/Variable";
import { Comment } from "../member/Comment";
import { Keyword } from "../membercollection/Keyword";
import { Settings } from "../membercollection/Settings";

export class LocalDocument extends Document implements IReferenceable<Resource>{
    private _references : Resource[] = [];

    private _textDocument : TextDocument;
    private _testCases : Procedure[] = []
    private _globalVariables : MemberCollection<Variable<any>>;
    private _comments : Comment[] = [];
    private _settings : Settings;

    public constructor(
        textDocument : TextDocument, testCases : Procedure[], 
        globalVariables : MemberCollection<Variable<any>>, keywords: Keyword[], 
        comments : Comment[], settings : Settings){
        super();
        this._textDocument = textDocument;
        this.name = textDocument.fileName.replace(/\.(robot|txt)$/g, "");
        this._testCases = testCases;
        this._globalVariables = globalVariables;
        this._keywords = keywords;
        this._comments = comments;
        this._settings = settings;
    }

    get textDocument() : TextDocument {return this._textDocument}
    
    get testCases() : Procedure[] {return this._testCases}

    get globalVariables() : MemberCollection<Variable<any>> {return this._globalVariables}

    get comments() : Comment[] {return this._comments}

    get settings() : Settings {return this._settings}
    set settings(value){
        this._settings = value;
    }
    get references() : Resource[] {return this._references}
    set references(value){
        this._references = value;
    }

    get allAvailableGlobalVariables() : Thenable<Variable<any>[]>{
        let container : Variable<any>[] = [];
        let scannedDocuments : LocalDocument[] = [];
        return this.allAvailableGlobalVariableScanner(container, scannedDocuments);
    }

    get allAvailableKeywords() : Thenable<Keyword[]>{
        let container : Keyword[] = [];
        let scannedDocuments : LocalDocument[] = [];
        let scannedLibrary : Library[] = [];
        return this.allAvailableKeywordScanner(container, scannedDocuments, scannedLibrary);
    }

    private allAvailableGlobalVariableScanner(container : Variable<any>[], scannedDocuments : LocalDocument[]) : Thenable<Variable<any>[]>{
        container = container.concat(this._globalVariables.members)
        let resources = this.settings.resources
        let futureVariable : Thenable<Variable<any>[]>;
        resources.forEach(resource => {
            let resCallBack = (document : LocalDocument) => {
                if(scannedDocuments.indexOf(document) < 0) return container;
                scannedDocuments.push(document);
                container = container.concat(this.globalVariables.members);
                return document.allAvailableGlobalVariableScanner(container, scannedDocuments);
            }
            if(futureVariable == null){
                futureVariable = resource.origin.then<Variable<any>[]>(resCallBack)
            }
            else{
                futureVariable = futureVariable.then<Variable<any>[]>((container) => {
                    return resource.origin.then<Variable<any>[]>(resCallBack)
                })
            }
        });
        return futureVariable;
    }

    private allAvailableKeywordScanner(container : Keyword[], scannedDocuments : LocalDocument[], scannedLibrary : Library[]) : Thenable<Keyword[]>{
        container = container.concat(this._keywords)
        let resources = this.settings.resources
        let futureKeywords : Thenable<Keyword[]>;
        resources.forEach(resource => {
            let resCallBack = (document: LocalDocument) => {
                if(scannedDocuments.indexOf(document) >= 0) return container;
                scannedDocuments.push(document);
                container = container.concat(this._keywords);
                let libraries = document._settings.libraries;
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