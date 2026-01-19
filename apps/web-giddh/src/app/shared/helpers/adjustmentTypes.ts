/**
 * AdjustmentTypesEnum enumeration
 * Defines constant values for AdjustmentTypesEnum
 */
export enum AdjustmentTypesEnum {
    'receipt' = 'receipt',
    'advanceReceipt' = 'advanceReceipt',
    'againstReference' = 'againstReference'
}

/**
 * AdjustmentTypes interface definition
 * Defines the structure and contract for AdjustmentTypes objects
 */
export interface AdjustmentTypes {
    value: string;
    label: string;
}

export const adjustmentTypes: AdjustmentTypes[] = [
    { label: "Receipt", value: AdjustmentTypesEnum.receipt },
    { label: "Advance Receipt", value: AdjustmentTypesEnum.advanceReceipt },
    { label: "Against Reference", value: AdjustmentTypesEnum.againstReference }
];
