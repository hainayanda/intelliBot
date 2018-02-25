import { Keyword } from "../model/membercollection/Keyword";

export class LibraryExtractor {
    public static KeywordsExtractor(libraryName: string) : Thenable<Keyword[]>{
        return new Promise<Keyword[]>((resolver, rejecter) => {
            //NEED IMPLEMENTATION
        });
    }
}