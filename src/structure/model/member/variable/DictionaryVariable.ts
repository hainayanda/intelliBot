import { Member } from "../../Member";
import { Variable } from "./Variable";
import { NestedVariable } from "./NestedVariable";

'use strict'

export class DictionaryVariable<T extends NestedVariable<DictionaryVariable<T>, any>> extends Variable<T[]> {
    get size(){return this.value.length}
}