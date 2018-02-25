'use strict';

import { Reference } from "../Reference";
import { Keyword } from "../membercollection/Keyword";
import { IKeyword } from "../interface/IKeyword";
import { isNullOrUndefined } from "util";

export class KeywordPointer extends Reference<Keyword> implements IKeyword{
    get name() : string {return this.origin.name}
    get arguments() : string[] {return this.origin.arguments}
    get returnValue() : string {return this.origin.returnValue}
}