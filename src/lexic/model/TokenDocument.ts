import { TokenLine } from "./TokenLine";
import { TextDocument } from "vscode";
import { TokenScope } from "./TokenScope";

'use strict';

export class TokenDocument {
    private _textDocument : TextDocument;
    private _keywords : TokenScope[];
    private _testCases : TokenScope[];
    private _settings : TokenScope;
    private _globalVariables : TokenScope;
    private _others : TokenLine[];

    constructor(textDocument : TextDocument, keywords : TokenScope[], testCases : TokenScope[], 
        settings : TokenScope, globalVariables : TokenScope, others : TokenLine[]){
        this._textDocument = textDocument;
        if(keywords == null) keywords = [];
        this._keywords = keywords;
        if(testCases == null) testCases = [];
        this._testCases = testCases;
        this._settings = settings;
        this._globalVariables = globalVariables;
        if(others == null) others = [];
        this._others = others;
    }

    get textDocument() {return this._textDocument}
    get keywords() : TokenScope[] {return this._keywords}
    get testCases() : TokenScope[] {return this._testCases}
    get settings() : TokenScope {return this._settings}
    get globalVariables() : TokenScope {return this._settings}
    get others() : TokenLine[] {return this._others}
    
}