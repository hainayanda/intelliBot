import { VariableValue } from "./VariableValue";
import { Member } from "../../Member";

'use strict'

export class NestedArrayValue<TRoot extends Member, TValue extends VariableValue<NestedArrayValue<TRoot, TValue>, TValue>> extends VariableValue<TRoot, TValue[]>{
    get length(){return this.value.length}
}