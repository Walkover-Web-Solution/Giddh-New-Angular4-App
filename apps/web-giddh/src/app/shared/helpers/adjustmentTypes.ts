export interface AdjustmentTypes {
    value: string;
    label: string;
}

export const adjustmentTypes: AdjustmentTypes[] = [
    { label: "Receipt", value: "receipt" },
    { label: "Advance Receipt", value: "advanceReceipt" },
    { label: "Against  Reference", value: "againstReference" }
];