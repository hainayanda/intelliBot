import { VariableValue } from "./VariableValue";
import { NestedVariable } from "./NestedVariable";
import { Member } from "../../Member";

'use strict'

export class NestedDictionaryValue<TRoot extends Member> extends VariableValue<TRoot, NestedVariable<NestedDictionaryValue<TRoot>, any>[]> {
    get size() {return this.value.length}
}