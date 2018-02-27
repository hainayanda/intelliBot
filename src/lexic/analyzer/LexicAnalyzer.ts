import { TextDocument } from "vscode";
import { TokenDocument } from "../model/TokenDocument";

'use strict'

export class LexicAnalyzer {

    public static analyze(textDocument : TextDocument) : Thenable<TokenDocument>{
        return new Promise<TokenDocument>((resolve, reject) => {
            //NEED IMPLEMENTATION
        });
    }
}