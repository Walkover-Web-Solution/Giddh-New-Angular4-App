export enum AdjustmentTypesEnum {
    'receipt' = 'receipt',
    'advanceReceipt' = 'advanceReceipt',
    'againstReference' = 'againstReference'
}

export interface AdjustmentTypes {
    value: string;
    label: string;
}

export const adjustmentTypes: AdjustmentTypes[] = [
    { label: "Receipt", value: AdjustmentTypesEnum.receipt },
    { label: "Advance Receipt", value: AdjustmentTypesEnum.advanceReceipt },
    { label: "Against Reference", value: AdjustmentTypesEnum.againstReference }
];
