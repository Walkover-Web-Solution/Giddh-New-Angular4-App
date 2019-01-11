export interface ICurrencynumberSystem {
value: any;
name: string;

}
export const currencyNumberSystems: ICurrencynumberSystem[] = [
    {value: 'IND_COMMA_SEPARATED', name: '1,00,00,000'},
    {value: 'INT_COMMA_SEPARATED', name: '10,000,000'},
    {value: 'INT_SPACE_SEPARATED', name: '10 000 000'},
    {value: 'INT_APOSTROPHE_SEPARATED', name: '10\’000\’000'}
];
export const digitAfterDecimal: ICurrencynumberSystem[] = [
    {value: 0, name: '0 digit'},
    // {value: '1', name: '1 digit'},
    {value: 2, name: '2 digits'}
    // {value: '3', name: '3 digits'}
];
