import { Member } from "../../Member";
import { Variable } from "./Variable";
import { VariableValue } from "./VariableValue";

'use strict'

export class ArrayVariable<TValue extends VariableValue<ArrayVariable<TValue>, TValue>> extends Variable<TValue[]> {
    get length(){return this.value.length}
}