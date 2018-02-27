import { Member } from "../../Member";
import { Variable } from "./Variable";
import { NestedVariable } from "./NestedVariable";

'use strict'

export class NestedDictionaryVariable<TRoot extends Member, V extends NestedVariable<NestedDictionaryVariable<TRoot, V>, any>> extends NestedVariable<TRoot, V[]> {
    get size(){return this.value.length}
}