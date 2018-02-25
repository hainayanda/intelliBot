import { Reference } from "../Reference";

export interface IReferenceable <T extends Reference<any>>{
    references : T[];
}