import { TextDocument } from "vscode";
import { Settings } from "../model/membercollection/Settings";
import { MemberCollection } from "../model/membercollection/MemberCollection";
import { Variable } from "../model/member/Variable";
import { Procedure } from "../model/membercollection/Procedure";
import { Keyword } from "../model/membercollection/Keyword";
import { Comment } from "../model/member/Comment";
import { LocalDocument } from "../document/LocalDocument";

export class LocalDocumentExtractor {

    public static extract(textDocument : TextDocument) : LocalDocument{
        //NEED IMPLEMENTATION
        return null;
    }
}