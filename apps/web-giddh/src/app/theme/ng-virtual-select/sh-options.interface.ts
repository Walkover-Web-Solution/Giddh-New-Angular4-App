export interface IOption {
    value: string;
    label: string;
    disabled?: boolean;
    isHilighted?: boolean;
    additional?: any;
    subVoucher?: string;
}

export interface BorderConfiguration {
    style?: string;
    radius?: string;
}
