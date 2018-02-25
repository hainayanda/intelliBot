'use strict';

import { INamedMember } from "./INamedMember";

export interface IKeyedValuedMember<T> extends INamedMember {
    value : T;
}