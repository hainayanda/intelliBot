import { TextDocument } from "vscode";
import { LocalDocument } from "../structure/model/document/LocalDocument";
import { LexicAnalyzer } from "../lexic/analyzer/LexicAnalyzer";
import { Token } from "../lexic/model/Token";
import { TokenType } from "../lexic/model/TokenType";
import { Variable } from "../structure/model/member/variable/Variable";

export class LocalDocumentExtractor {

    private static localDocuments : Map<TextDocument, LocalDocument> = new Map();

    public static refresh(){
        this.localDocuments = new Map();
    }

    public static extract(textDocument : TextDocument) : Thenable<LocalDocument> {
        return LexicAnalyzer.analyze(textDocument).then<LocalDocument>((tokenDoc) => {
            if(this.localDocuments.has(textDocument)) return this.localDocuments.get(textDocument);
            else{
                let analyzingDoc = new LocalDocument(textDocument);
                this.localDocuments.set(textDocument, analyzingDoc);
                let variableTemp : Variable<LocalDocument, any>;
                tokenDoc.globalVariables.tokenLines.forEach((tokenLine) => {
                    let isDeclaration = false;
                    tokenLine.tokens.forEach(token => {
                        switch(token.tokenType){
                            case(TokenType.VariableDeclaration)
                        }
                    });
                })
            }
            return null;
        })
    }
}