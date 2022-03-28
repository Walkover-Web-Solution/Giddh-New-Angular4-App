export interface ICurrencynumberSystem {
    value: any;
    name: string;
    type?: any;
}
export const currencyNumberSystems: ICurrencynumberSystem[] = [
    { value: 'IND_COMMA_SEPARATED', name: '1,00,00,000', type: '2-2-3' },
    { value: 'INT_COMMA_SEPARATED', name: '10,000,000', type: '3-3-3' },
    { value: 'INT_SPACE_SEPARATED', name: '10 000 000', type: '3-3-3' },
    { value: 'INT_APOSTROPHE_SEPARATED', name: '10\’000\’000', type: '3-3-3' }
];
export const digitAfterDecimal: ICurrencynumberSystem[] = [
    { value: '2', name: '2 digits' },
    { value: '4', name: '4 digits' }
];
