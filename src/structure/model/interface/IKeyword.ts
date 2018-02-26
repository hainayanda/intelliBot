'use strict';

import { INamedMember } from "./INamedMember";

export interface IKeyword extends INamedMember{
    arguments : string[];
    returnValue : string;
}