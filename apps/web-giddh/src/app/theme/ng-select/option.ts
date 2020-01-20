import { IOption } from './option.interface';

export class Option {

    public wrappedOption: IOption;

    public disabled: boolean;
    public highlighted: boolean;
    public selected: boolean;
    public shown: boolean;

    constructor(option: IOption) {
        this.wrappedOption = option;

        this.disabled = false;
        this.highlighted = false;
        this.selected = false;
        this.shown = true;
    }

    get value(): string {
        return this.wrappedOption.value;
    }

    get label(): string {
        return this.wrappedOption.label;
    }
}
