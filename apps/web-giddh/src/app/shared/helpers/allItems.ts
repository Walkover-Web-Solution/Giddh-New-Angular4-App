/**
 * AllItem interface definition
 * Defines the structure and contract for AllItem objects
 */
export interface AllItem {
    label: string;
    link: string;
    icon: string;
    description: string;
    alwaysPresent?: boolean;
    additional?: any;
    hide?: string;
    additionalRoutes?: any;
}

/**
 * AllItems interface definition
 * Defines the structure and contract for AllItems objects
 */
export interface AllItems {
    label: string;
    icon: string;
    items: AllItem[];
    link?: string;
    isActive?: boolean;
    hide?: boolean;
    expandable?: boolean;
    level?: number;
    isExpanded?: boolean;
}
