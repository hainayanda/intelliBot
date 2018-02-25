'use strict';

import { Reference } from "../Reference";
import { Variable } from "./Variable";
import { IKeyedValuedMember } from "../interface/IKeyedValuedMember";

export class VariablePointer<T> extends Reference<Variable<T>> implements IKeyedValuedMember<T>{
    get name() : string {return this.origin.name}
    get value() : T {return this.origin.value}
}