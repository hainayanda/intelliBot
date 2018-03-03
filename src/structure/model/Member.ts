'use strict';

import { Location, WorkspaceEdit, Position, Range } from 'vscode';
import { isNullOrUndefined } from 'util';

export abstract class Member<TRoot> {
    private _location: Location;
    private _root: TRoot;

    public constructor(location: Location) {
        this._location = location;
    }

    get location() {return this._location;}
    set location(value) {
        this._location = value;
    }

    get root() {return this._root;}
    set root(value) {
        if(value == null) throw new ReferenceError("root cannot be null");
        else this._root = value;
    }
    public isEqual(member: Member<any>): boolean {
        if (this._location.uri.fsPath != member.location.uri.fsPath) return false;
        else if (this._location.range.start.line != member.location.range.start.line) return false;
        else if (this._location.range.start.character != member.location.range.start.character) return false;
        else if(this._root != member.root) return false;
        return true;
    }
}