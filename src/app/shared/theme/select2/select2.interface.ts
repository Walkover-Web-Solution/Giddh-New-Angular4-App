export interface Select2OptionData {
    id: string;
    text: string;
    disabled?: boolean;
    children?: Select2OptionData[];
    additional?: any;
}

export type Select2TemplateFunction = (state: Select2OptionData) => JQuery | string;
