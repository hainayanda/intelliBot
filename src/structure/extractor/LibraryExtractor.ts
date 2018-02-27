import { Keyword } from "../model/membercollection/Keyword";
import { Library } from "../model/document/Library";

export class LibraryExtractor {

    private static libraries : Map<string, Library> = new Map();

    public static extract(libraryName : string) : Thenable<Library> {
        return new Promise<Library>((resolve, reject) => {
            //NEED IMPLEMENTATION
        })
    }
}