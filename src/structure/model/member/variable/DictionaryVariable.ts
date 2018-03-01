import { Member } from "../../Member";
import { Variable } from "./Variable";
import { VariableValue } from "./VariableValue";
import { NestedVariable } from "./NestedVariable";

'use strict'

export class DictionaryVariable extends Variable<NestedVariable<DictionaryVariable, any>[]>{
    get size() {return this.value.length}
}