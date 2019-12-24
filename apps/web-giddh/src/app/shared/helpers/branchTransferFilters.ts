export interface BranchTransferVoucherTypes {
    value: string;
    label: string;
}

export interface BranchTransferAmountOperators {
    value: string;
    label: string;
}

export const branchTransferVoucherTypes: BranchTransferVoucherTypes[] = [
    { label: 'Receipt Note', value: 'receiptnote' },
    { label: 'Delivery Challan', value: 'deliverynote' }
];

export const branchTransferAmountOperators: BranchTransferAmountOperators[] = [
    { label: "Equals", value: "equal" },
    { label: "Greater Than", value: "greater" },
    { label: "Less Than", value: "less" },
    { label: "Exclude", value: "exclude" }
];
