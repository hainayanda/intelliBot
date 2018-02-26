'use strict';

import { Member } from "./Member";
import { isNullOrUndefined } from "util";
import { Location } from "vscode";

export abstract class Reference<T> extends Member{
    private _origin : T

    public constructor(location : Location, origin : T) {
        super(location)
        this.origin = origin;
    }

    get origin() : T { return this._origin}
    set origin(val) {
        this._origin = val;
    }
}