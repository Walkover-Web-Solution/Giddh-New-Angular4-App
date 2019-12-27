import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';

import { Option } from './option';
import { OptionList } from './option-list';

@Component({
	selector: 'select-dropdown',
	templateUrl: './select-dropdown.component.html',
	styleUrls: ['./select-dropdown.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SelectDropdownComponent
	implements AfterViewInit, OnChanges, OnInit {

	@Input() public filterEnabled: boolean;
	@Input() public highlightColor: string;
	@Input() public highlightTextColor: string;
	@Input() public left: number;
	@Input() public multiple: boolean;
	@Input() public isTypeAheadMode: boolean;
	@Input() public notFoundMsg: string;
	@Input() public noResultLinkEnabled: boolean;
	@Input() public optionList: OptionList;
	@Input() public top: number;
	@Input() public width: number;
	@Input() public placeholder: string;
	@Input() public optionTemplate: TemplateRef<any>;

	@Output() public optionClicked = new EventEmitter<Option>();
	@Output() public optionsListClick = new EventEmitter<null>();
	@Output() public singleFilterClick = new EventEmitter<null>();
	@Output() public singleFilterFocus = new EventEmitter<null>();
	@Output() public singleFilterInput = new EventEmitter<string>();
	@Output() public singleFilterKeydown = new EventEmitter<any>();
	@Output() public noResultClicked = new EventEmitter<null>();

	@ViewChild('filterInput') public filterInput: any;
	@ViewChild('optionsList') public optionsList: any;

	public disabledColor: string = '#fff';
	public disabledTextColor: string = '9e9e9e';

	/** Event handlers. **/

	public ngOnInit() {
		this.optionsReset();
	}

	public ngOnChanges(changes: any) {
		if (changes.hasOwnProperty('optionList')) {
			this.optionsReset();
		}
	}

	public ngAfterViewInit() {
		this.moveHighlightedIntoView();
		if ((!this.multiple && !this.isTypeAheadMode) && this.filterEnabled) {
			this.filterInput.nativeElement.focus();
		}
	}

	public onOptionsListClick() {
		this.optionsListClick.emit(null);
	}

	public onSingleFilterClick() {
		this.singleFilterClick.emit(null);
	}

	public onSingleFilterInput(event: any) {
		this.singleFilterInput.emit(event.target.value);
	}

	public onSingleFilterKeydown(event: any) {
		this.singleFilterKeydown.emit(event);
	}

	public onSingleFilterFocus() {
		this.singleFilterFocus.emit(null);
	}

	public onOptionsWheel(event: any) {
		this.handleOptionsWheel(event);
	}

	public onOptionMouseover(option: Option) {
		this.optionList.highlightOption(option);
	}

	public onOptionClick(option: Option) {
		this.optionClicked.emit(option);
	}

	public onNoResultClick() {
		this.noResultClicked.emit();
	}

	/** View. **/

	public getOptionStyle(option: Option): any {
		if (option.highlighted) {
			let style: any = {};

			if (typeof this.highlightColor !== 'undefined') {
				style['background-color'] = this.highlightColor;
			}
			if (typeof this.highlightTextColor !== 'undefined') {
				style['color'] = this.highlightTextColor;
			}
			return style;
		} else {
			return {};
		}
	}

	public moveHighlightedIntoView() {

		let list = this.optionsList.nativeElement;
		let listHeight = list.offsetHeight;

		let itemIndex = this.optionList.getHighlightedIndex();

		if (itemIndex > -1) {
			let item = list.children[0].children[itemIndex];
			let itemHeight = item.offsetHeight;

			let itemTop = itemIndex * itemHeight;
			let itemBottom = itemTop + itemHeight;

			let viewTop = list.scrollTop;
			let viewBottom = viewTop + listHeight;

			if (itemBottom > viewBottom) {
				list.scrollTop = itemBottom - listHeight;
			} else if (itemTop < viewTop) {
				list.scrollTop = itemTop;
			}
		}
	}

	/** Initialization. **/

	private optionsReset() {
		this.optionList.filter('');
		this.optionList.highlight();
	}

	private handleOptionsWheel(e: any) {
		let div = this.optionsList.nativeElement;
		let atTop = div.scrollTop === 0;
		let atBottom = div.offsetHeight + div.scrollTop === div.scrollHeight;

		if (atTop && e.deltaY < 0) {
			e.preventDefault();
		} else if (atBottom && e.deltaY > 0) {
			e.preventDefault();
		}
	}
}
