import { Member } from "../../Member";
import { Variable } from "./Variable";
import { Location } from "vscode";

'use strict'

export class Dictionary<TRoot> extends Variable<TRoot, Map<string, string>>{

    public constructor(location : Location, nameLocation : Location, name : string, value : Map<string, string>){
        if(value == null) value = new Map();
        super(location, nameLocation, name, value);
    }

    get size() {return this.value.size}
}