import { TextDocument } from "vscode";
import { Settings } from "../model/membercollection/Settings";
import { MemberCollection } from "../model/membercollection/MemberCollection";
import { Variable } from "../model/member/variable/Variable";
import { Procedure } from "../model/membercollection/Procedure";
import { Keyword } from "../model/membercollection/Keyword";
import { Comment } from "../model/member/Comment";
import { LocalDocument } from "../model/document/LocalDocument";
import { LexicAnalyzer } from "../../lexic/analyzer/LexicAnalyzer";

export class LocalDocumentExtractor {

    private static localDocuments : Map<TextDocument, LocalDocument> = new Map();

    public static extract(textDocument : TextDocument) : Thenable<LocalDocument> {
        return LexicAnalyzer.analyze(textDocument).then<LocalDocument>((tokenDoc) => {
            //NEED IMPLEMENTATION
            return null;
        })
    }
}