import { TextDocument } from "vscode";
import { Settings } from "../model/membercollection/Settings";
import { MemberCollection } from "../model/membercollection/MemberCollection";
import { Variable } from "../model/member/Variable";
import { Procedure } from "../model/membercollection/Procedure";
import { Keyword } from "../model/membercollection/Keyword";
import { Comment } from "../model/member/Comment";

export class LocalDocumentExtractor {

    public static SettingsExtractor(textDocument: TextDocument) : Thenable<Settings>{
        return new Promise<Settings>((resolver, rejecter) => {
            //NEED IMPLEMENTATION
        });
    }

    public static GlobalVariablesExtractor(textDocument: TextDocument) : Thenable<MemberCollection<Variable<any>>>{
        return new Promise<MemberCollection<Variable<any>>>((resolver, rejecter) => {
            //NEED IMPLEMENTATION
        });
    }

    public static TestCasesExtractor(textDocument: TextDocument) : Thenable<Procedure[]>{
        return new Promise<Procedure[]>((resolver, rejecter) => {
            //NEED IMPLEMENTATION
        });
    }

    public static KeywordsExtractor(textDocument: TextDocument) : Thenable<Keyword[]>{
        return new Promise<Keyword[]>((resolver, rejecter) => {
            //NEED IMPLEMENTATION
        });
    }

    public static CommentsExtractor(textDocument: TextDocument) : Thenable<Comment[]>{
        return new Promise<Comment[]>((resolver, rejecter) => {
            //NEED IMPLEMENTATION
        });
    }
}