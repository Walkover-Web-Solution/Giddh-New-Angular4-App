/**
 * TributeConfig interface definition
 * Defines the structure and contract for TributeConfig objects
 */
export interface TributeConfig<T = any> {
    /** Character that triggers mention dropdown (default '@') */
    trigger?: string;
    
    /** Fixed text shown before the matched result in the text */
    suggestionPrefix?: string;
    
    /** Fixed text shown after the matched result in the text */
    suggestionSuffix?: string;
    
    /** Whether a space is required before the trigger (default true) */
    requireLeadingSpace?: boolean;
    
    /** Whether to allow spaces in mentions (default false) */
    allowSpaces?: boolean;
    
    /** List of mentionable items */
    values?: T[] | ((text: string, cb: (result: T[]) => void) => void);
    
    /** Function to get display value from object */
    lookup?: (item: T, mentionText: string) => string;
    
    /** Function to get insert value from object */
    fillAttr?: string | ((item: T) => string);
    
    /** Custom template for dropdown items */
    menuItemTemplate?: (item: T) => string;
    
    /** Custom template for inserted mention */
    selectTemplate?: (item: T) => string;
    
    /** Template when no matches found */
    noMatchTemplate?: () => string;
    
    /** Custom regex to find triggers */
    lookupRegex?: RegExp;
    
    /** Callback when mention is selected */
    onSelection?: (item: T, originalEvent: Event) => void;
    
    /** Class added to menu container */
    menuContainerClass?: string;
    
    /** Whether to position menu above/below text */
    positionMenu?: boolean;
    
    /** Debounce time for async search (ms) */
    searchOpts?: {
      debounce?: number;
    };
}