export interface TransporterModes {
    value: string;
    label: string;
}

export const transporterModes: TransporterModes[] = [
    { value: 'Road', label: 'Road' },
    { value: 'Rail', label: 'Rail' },
    { value: 'Air', label: 'Air' },
    { value: 'Ship', label: 'Ship' }
];
