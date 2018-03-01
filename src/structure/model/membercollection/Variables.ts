'use strict';

import { Location, WorkspaceEdit, Position, Range } from 'vscode';
import { Member } from '../Member';
import { isNullOrUndefined } from 'util';
import { Variable } from '../member/variable/Variable';

export class Variables extends Member {
    private _variables : Variable<any>[] = [];

    public addVariables(variables : Variable<any>){
        this._variables.push(variables);
    }

    public removeVariable(variable: Variable<any>){
        let index = this._variables.indexOf(variable);
        this._variables = this._variables.splice(index, 1);
    }

    get variables() : Variable<any>[]{ return this._variables}
    set variables(value){
        if(isNullOrUndefined(value)) throw new ReferenceError("members cannot be null");
        else this._variables = value;
    }
}