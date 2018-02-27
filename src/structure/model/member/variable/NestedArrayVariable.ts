import { Member } from "../../Member";
import { Variable } from "./Variable";
import { NestedVariable } from "./NestedVariable";

'use strict'

export class NestedArrayVariable<TRoot extends Member, V> extends NestedVariable<TRoot, V[]> {
    get size(){return this.value.length}
}