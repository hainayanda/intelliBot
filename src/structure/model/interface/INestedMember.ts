import { Member } from "../Member";

export interface INestedMember<TRoot extends Member>{
    root : TRoot
}