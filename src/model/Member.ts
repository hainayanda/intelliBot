'use strict';

import { Location, WorkspaceEdit, Position, Range } from 'vscode';
import { isNullOrUndefined } from 'util';

export abstract class Member {
    private _location: Location;

    public constructor(location: Location) {
        this._location = location;
    }

    get location() {return this._location;}
    set location(value) {
        this._location = value;
    }

    public isEqual(member: Member): boolean {
        if (this._location.uri.fsPath != member.location.uri.fsPath) return false;
        else if (this._location.range.start.line != member.location.range.start.line) return false;
        else if (this._location.range.start.character == member.location.range.start.character) return false;
        return true;
    }
}