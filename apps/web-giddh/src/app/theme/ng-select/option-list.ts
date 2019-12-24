import { Option } from './option';
import { IOption } from './option.interface';
import { Diacritics } from './diacritics';

export class OptionList {

	/* Consider using these for performance improvement. */
	// private _selection: Array<Option>;
	// private _filtered: Array<Option>;
	// private _value: Array<string>;

	constructor(options: IOption[]) {

		if (typeof options === 'undefined' || options === null) {
			options = [];
		}

		this._options = options.map((option) => {
			let o: Option = new Option(option);
			if (option.disabled) {
				o.disabled = true;
			}
			return o;
		});

		this._hasShown = this._options.length > 0;
		this.highlight();
	}

	private _options: Option[];

	/** Options. **/

	get options(): Option[] {
		return this._options;
	}

	private _highlightedOption: Option = null;

	/** Highlight. **/

	get highlightedOption(): Option {
		return this._highlightedOption;
	}

	private _hasShown: boolean;

	get hasShown(): boolean {
		return this._hasShown;
	}

	private _hasSelected: boolean;

	get hasSelected(): boolean {
		return this._hasSelected;
	}

	/** Value. **/

	get value(): string[] {
		return this.selection.map(option => option.value);
	}

	set value(v: string[]) {
		v = typeof v === 'undefined' || v === null ? [] : v;

		this.options.forEach((option) => {
			option.selected = v.indexOf(option.value) > -1;
		});
		this.updateHasSelected();
	}

	/** Selection. **/

	get selection(): Option[] {
		return this.options.filter(option => option.selected);
	}

	/** Filter. **/

	get filtered(): Option[] {
		return this.options.filter(option => option.shown);
	}

	get filteredEnabled(): Option[] {
		return this.options.filter(option => option.shown && !option.disabled);
	}

	// v0 and v1 are assumed not to be undefined or null.
	public static equalValues(v0: string[], v1: string[]): boolean {

		if (v0.length !== v1.length) {
			return false;
		}

		let a: string[] = v0.slice().sort();
		let b: string[] = v1.slice().sort();

		return a.every((v, i) => {
			return v === b[i];
		});
	}

	public getOptionsByValue(value: string): Option[] {
		return this.options.filter((option) => {
			return option.value === value;
		});
	}

	public select(option: Option, multiple: boolean, isTypeheadMode: boolean) {
		if (!multiple) {
			this.clearSelection();
		}
		option.selected = true;
		this.updateHasSelected();
	}

	public deselect(option: Option) {
		option.selected = false;
		this.updateHasSelected();
	}

	public clearSelection() {
		this.options.forEach((option) => {
			option.selected = false;
		});
		this._hasSelected = false;
	}

	public filter(term: string): boolean {
		let anyShown: boolean = false;

		if (term.trim() === '') {
			this.resetFilter();
			anyShown = this.options.length > 0;
		} else {
			this.options.forEach((option) => {
				let l: string = Diacritics.strip(option.label).toUpperCase();
				let t: string = Diacritics.strip(term).toUpperCase();
				option.shown = l.indexOf(t) > -1;

				if (option.shown) {
					anyShown = true;
				}
			});

		}

		this.highlight();
		this._hasShown = anyShown;

		return anyShown;
	}

	public highlight() {
		let option: Option = this.hasShownSelected() ?
			this.getFirstShownSelected() : this.getFirstShown();
		this.highlightOption(option);
	}

	public highlightOption(option: Option) {
		this.clearHighlightedOption();

		if (option !== null) {
			option.highlighted = true;
			this._highlightedOption = option;
		}
	}

	public highlightNextOption() {
		let shownEnabledOptions = this.filteredEnabled;
		let index = this.getHighlightedIndexFromList(shownEnabledOptions);

		if (index > -1 && index < shownEnabledOptions.length - 1) {
			this.highlightOption(shownEnabledOptions[index + 1]);
		}
	}

	public highlightPreviousOption() {
		let shownEnabledOptions = this.filteredEnabled;
		let index = this.getHighlightedIndexFromList(shownEnabledOptions);

		if (index > 0) {
			this.highlightOption(shownEnabledOptions[index - 1]);
		}
	}

	public getHighlightedIndex() {
		return this.getHighlightedIndexFromList(this.filtered);
	}

	/** Util. **/

	public hasShownSelected() {
		return this.options.some((option) => {
			return option.shown && option.selected;
		});
	}

	private updateHasSelected() {
		this._hasSelected = this.options.some(option => option.selected);
	}

	private resetFilter() {
		this.options.forEach((option) => {
			option.shown = true;
		});
	}

	private clearHighlightedOption() {
		if (this.highlightedOption !== null) {
			this.highlightedOption.highlighted = false;
			this._highlightedOption = null;
		}
	}

	private getHighlightedIndexFromList(options: Option[]) {
		for (let i = 0; i < options.length; i++) {
			if (options[i].highlighted) {
				return i;
			}
		}
		return -1;
	}

	private getFirstShown(): Option {
		for (let option of this.options) {
			if (option.shown) {
				return option;
			}
		}
		return null;
	}

	private getFirstShownSelected(): Option {
		for (let option of this.options) {
			if (option.shown && option.selected) {
				return option;
			}
		}
		return null;
	}
}
