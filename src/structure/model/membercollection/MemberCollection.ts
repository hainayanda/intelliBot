'use strict';

import { Location, WorkspaceEdit, Position, Range } from 'vscode';
import { Member } from '../Member';
import { isNullOrUndefined } from 'util';

export class MemberCollection<T extends Member> extends Member {
    private _members : T[] = [];

    public addMember(member : T){
        this._members.push(member);
    }

    public removeMember(member: T){
        let index = this._members.indexOf(member);
        this._members = this._members.splice(index, 1);
    }

    get members() : T[]{ return this._members}
    set members(value){
        if(isNullOrUndefined(value)) throw new ReferenceError("members cannot be null");
        else this._members = value;
    }
}