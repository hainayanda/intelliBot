import { Reference } from "../Reference";

export interface IReferenceable <TReferences extends Reference<any>>{
    references : TReferences[];
}