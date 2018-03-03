import { Member } from "../../Member";
import { Variable } from "./Variable";
import { Location } from "vscode";

'use strict'

export class List<TRoot> extends Variable<TRoot, string[]> {
    
    public constructor(location : Location, nameLocation : Location, name : string, value : string[]){
        if(value == null) value = [];
        super(location, nameLocation, name, value);
    }

    get length(){return this.value.length}
}