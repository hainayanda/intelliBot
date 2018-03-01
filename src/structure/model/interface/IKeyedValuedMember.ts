'use strict';

import { INamedMember } from "./INamedMember";

export interface IKeyedValuedMember<TValue> extends INamedMember {
    value : TValue;
}