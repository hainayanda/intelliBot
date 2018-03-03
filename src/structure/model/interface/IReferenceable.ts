import { Reference } from "../Reference";

export interface IReferenceable <TReferences extends Reference<any, any>>{
    references : TReferences[];
}