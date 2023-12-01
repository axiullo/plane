import { dataoperation } from './dataoperation';
import { user } from '../db/dbstruct';
import { objbase } from './objbase';

class userobj extends objbase implements dataoperation {
    private _data: user | null;

    constructor() {
        super();
        this._data = null;
    }

    init():user {
        var obj:user ={};

        return obj;
    }

}