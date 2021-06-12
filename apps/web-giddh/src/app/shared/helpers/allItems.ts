export interface AllItem {
    label: string;
    link: string;
    icon: string;
    description: string;
    alwaysPresent?: boolean;
    additional?: any;
    hide?: string;
}

export interface AllItems {
    label: string;
    icon: string;
    items: AllItem[];
    link?: string;
    isActive?: boolean;
}