/**
 * INameUniqueName interface definition
 * Defines the structure and contract for INameUniqueName objects
 */
export interface INameUniqueName {
    uniqueName: string;
    name: string;
    isActive?: boolean;
    alias?: string;
    taxNumber?: string;
    currency?: { symbol: string, code: string };
    isArchived?: any;
}
