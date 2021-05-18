import { ISPService, ILibsOptions } from "./ISPService";
import { ISPField, ISPLists } from "../common/SPEntities";
export default class SPServiceMock implements ISPService {
    private _includeDelay?;
    private _delayTimeout?;
    constructor(includeDelay?: boolean, delayTimeout?: number);
    getListItems(filterText: string, listId: string, internalColumnName: string, field: ISPField, keyInternalColumnName?: string, webUrl?: string): Promise<any[]>;
    getField: (listId: string, internalColumnName: string, webUrl?: string) => Promise<ISPField>;
    /**
    * The mock lists to present to the local workbench
    */
    private static _lists;
    getLibs(options?: ILibsOptions): Promise<ISPLists>;
    /**
    * Locks the thread for the specified amount of time
    * @param ms Milliseconds to wait
    */
    private sleep;
}
//# sourceMappingURL=SPServiceMock.d.ts.map