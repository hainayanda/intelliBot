'use strict';

import { Reference } from "../../Reference";
import { Variable } from "./Variable";
import { IKeyedValuedMember } from "../../interface/IKeyedValuedMember";

export class VariablePointer<TValue> extends Reference<Variable<TValue>> implements IKeyedValuedMember<TValue>{
    get name() : string {return this.origin.name}
    get value() : TValue {return this.origin.value}
}