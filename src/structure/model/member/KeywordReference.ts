'use strict';

import { Reference } from "../Reference";
import { Keyword } from "../membercollection/Keyword";
import { isNullOrUndefined } from "util";
import { Procedure } from "../membercollection/Procedure";
import { Member } from "../Member";

export class KeywordReference<TRoot extends Member<any>> extends Reference<TRoot, Keyword>{
    get name() : string {return this.origin.name}
    get arguments() : string[] {return this.origin.arguments}
    get returnValue() : string {return this.origin.returnValue}
}