import { Member } from "../../Member";
import { Variable } from "./Variable";

'use strict'

export class ArrayVariable<T extends Member> extends Variable<T[]> {
    get length(){return this.value.length}
}