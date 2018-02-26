'use strict';

import { Document } from "./Document";
import { Procedure } from "../model/membercollection/Procedure";
import { MemberCollection } from "../model/membercollection/MemberCollection";
import { Variable } from "../model/member/Variable";
import { Comment } from "../model/member/Comment";
import { TextDocument } from 'vscode';
import { Settings } from "../model/membercollection/Settings";
import { IReferenceable } from "../model/interface/IReferenceable";
import { Resource } from "../model/member/Resource";
import { Keyword } from "../model/membercollection/Keyword";
import { LocalDocumentExtractor } from "../extractor/LocalDocumentExtractor";

export class LocalDocument extends Document implements IReferenceable<Resource>{
    private _references : Resource[] = [];

    private static localDocuments : Map<TextDocument, LocalDocument> = new Map();

    private _textDocument : TextDocument;
    private _testCases : Procedure[] = []
    private _globalVariables : MemberCollection<Variable<any>>;
    private _comments : Comment[] = [];
    private _settings : Settings;

    private constructor(
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

    public static refresh(){
        this.localDocuments = new Map();
    }

    public static getInstance(textDocument : TextDocument) : Thenable<LocalDocument>{
        return new Promise((resolver, rejecter) => {
            if(this.localDocuments.has(textDocument)) resolver(this.localDocuments.get(textDocument));
            else {
                let localDocuments = LocalDocumentExtractor.extract(textDocument);
                this.localDocuments.set(textDocument, localDocuments);
                resolver(localDocuments);
            }
        })
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
}