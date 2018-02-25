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
import { LocalDocumentExtractor } from "../extractor/LocalDocumentExtractor";
import { Keyword } from "../model/membercollection/Keyword";

export class LocalDocument extends Document implements IReferenceable<Resource>{
    private _references : Resource[] = [];

    private static localDocuments : Map<TextDocument, LocalDocument> = new Map();

    private _textDocument : TextDocument;
    private _testCases : Procedure[] = []
    private _globalVariables : MemberCollection<Variable<any>>;
    private _comments : Comment[] = [];
    private _settings : Settings;

    private constructor(textDocument : TextDocument){
        super();
        LocalDocumentExtractor.SettingsExtractor(textDocument)
        .then((settings) => {
            this._settings = settings;
        });
        LocalDocumentExtractor.GlobalVariablesExtractor(textDocument)
        .then((globalVariables) => {
            this._globalVariables = globalVariables;
        });
        LocalDocumentExtractor.KeywordsExtractor(textDocument)
        .then((keywords) => {
            this.keywords = keywords;
        });
        LocalDocumentExtractor.TestCasesExtractor(textDocument)
        .then((testCases) => {
            this._testCases = testCases;
        });
        LocalDocumentExtractor.CommentsExtractor(textDocument)
        .then((comments) => {
            this._comments = comments;
        });
        LocalDocument.localDocuments.set(textDocument, this)
    }

    public static refresh(){
        this.localDocuments = new Map();
    }

    public static getInstance(textDocument : TextDocument) : LocalDocument{
        if(this.localDocuments.has(textDocument)) return this.localDocuments.get(textDocument);
        else return this.localDocuments.get(textDocument)
    }

    get textDocument() : TextDocument {return this._textDocument}
    
    get testCases() : Procedure[] {return this._testCases}

    get globalVariables() : MemberCollection<Variable<any>> {return this._globalVariables}

    get comments() : Comment[] {return this._comments}

    get settings() : Settings {return this._settings}

    get references() : Resource[] {return this._references}
    set references(value){
        this._references = value;
    }

}