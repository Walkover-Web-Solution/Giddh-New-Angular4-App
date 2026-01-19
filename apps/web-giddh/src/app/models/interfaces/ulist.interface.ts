import { INameUniqueName } from '../api-models/Inventory';

/**
 * IHelpersForSearch interface definition
 * Defines the structure and contract for IHelpersForSearch objects
 */
export interface IHelpersForSearch {
    nameStr?: string;
    uNameStr?: string;
}

/**
 * IUlist interface definition
 * Defines the structure and contract for IUlist objects
 */
export interface IUlist extends INameUniqueName, IHelpersForSearch {
    additional?: any;
    type?: 'GROUP' | 'MENU' | 'ACCOUNT';
    time?: number;
    parentGroups?: INameUniqueName[];
    route?: string;
    pIndex?: number;
    isRemoved?: boolean;
    isInvalidState?: boolean;
    hasTabs?: boolean;
}

/**
 * ICompAidata interface definition
 * Defines the structure and contract for ICompAidata objects
 */
export interface ICompAidata extends INameUniqueName {
    aidata: Igtbl;
}

/**
 * Igtbl interface definition
 * Defines the structure and contract for Igtbl objects
 */
export interface Igtbl {
    menus: IUlist[];
    groups: IUlist[];
    accounts: IUlist[];
}

/**
 * IUpdateDbRequest interface definition
 * Defines the structure and contract for IUpdateDbRequest objects
 */
export interface IUpdateDbRequest extends INameUniqueName {
    oldUniqueName?: string;
    newUniqueName?: string;
    latestName?: string;
    deleteUniqueName?: string;
    type: 'menus' | 'groups' | 'accounts'
}

