'use strict';

import { Member } from "./Member";
import { isNullOrUndefined } from "util";
import { Location } from "vscode";

export abstract class Reference<TOrigin> extends Member{
    private _origin : TOrigin

    public constructor(location : Location, origin : TOrigin) {
        super(location)
        this.origin = origin;
    }

    get origin() : TOrigin { return this._origin}
    set origin(val) {
        this._origin = val;
    }
}