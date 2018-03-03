'use strict';

import { Reference } from "../../Reference";
import { Variable } from "./Variable";
import { Member } from "../../Member";

export class VariableReference<TRoot, TReference extends Variable<any, any>> extends Reference<TRoot, TReference>{
    get name() : string {return this.origin.name}
    get value() {return this.origin.value}
}