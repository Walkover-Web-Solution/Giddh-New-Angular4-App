import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Input, OnChanges, OnDestroy, OnInit, Output, Renderer, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Select2OptionData } from './select2.interface';

export const SELECT2_VALUE_ACCESSOR: any = {
	provide: NG_VALUE_ACCESSOR,
	// tslint:disable-next-line:no-forward-ref
	useExisting: forwardRef(() => Select2Component),
	multi: true
};

@Component({
	selector: 'select2',
	template: '<select #selector></select>',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [SELECT2_VALUE_ACCESSOR]
})
export class Select2Component implements AfterViewInit, OnChanges, OnDestroy, OnInit, ControlValueAccessor {
	@ViewChild('selector') public selector: ElementRef;

	// data for select2 drop down
	@Input() public data: Select2OptionData[];

	// value for select2
	@Input() public value: string | string[];

	// enable / disable default style for select2
	@Input() public cssImport: boolean = true;

	// width of select2 input
	@Input() public width: string;

	// enable / disable select2
	@Input() public disabled: boolean = false;

	// all additional options
	@Input() public options: Select2Options;

	// use as typeahead
	@Input() public isTypeahedMode: boolean = false;

	// emitter when value is changed
	@Output() public valueChanged = new EventEmitter();

	public element: JQuery = undefined;
	public check: boolean = false;
	public style: string = `CSS`;
	// tslint:disable-next-line:no-empty
	public onChangeCb: (_: any) => void = (e) => {
	}
	// tslint:disable-next-line:no-empty
	public onTouchedCb: () => void = () => {
	}

	constructor(public renderer: Renderer, public cd: ChangeDetectorRef) {
	}

	public writeValue(value: any): void {
		if (value !== undefined && value !== '' && this.element !== undefined) {
			this.setElementValue(value);
		}
	}

	public registerOnChange(fn: any): void {
		this.onChangeCb = fn;
	}

	public registerOnTouched(fn: any): void {
		this.onTouchedCb = fn;
	}

	public ngOnInit() {
		if (this.cssImport) {
			const head = document.getElementsByTagName('head')[0];
			const link: any = head.children[head.children.length - 1];

			if (!link.version) {
				const newLink = this.renderer.createElement(head, 'style');
				this.renderer.setElementProperty(newLink, 'type', 'text/css');
				this.renderer.setElementProperty(newLink, 'version', 'select2');
				this.renderer.setElementProperty(newLink, 'innerHTML', this.style);
			}
		}
	}

	public ngOnChanges(changes: SimpleChanges) {
		if (!this.element) {
			return;
		}
		if (changes['data'] && JSON.stringify(changes['data'].previousValue) !== JSON.stringify(changes['data'].currentValue)) {
			this.initPlugin();

			const newValue: string | string[] = this.element.val() as string | string[];
			this.valueChanged.emit({
				value: newValue
			});
		}

		if (changes['value'] && changes['value'].previousValue !== changes['value'].currentValue) {
			const newValue: string = changes['value'].currentValue;
			this.setElementValue(newValue);
			this.valueChanged.emit({
				value: newValue
			});
		}

		if (changes['disabled'] && changes['disabled'].previousValue !== changes['disabled'].currentValue) {
			this.renderer.setElementProperty(this.selector.nativeElement, 'disabled', this.disabled);
		}
	}

	public ngAfterViewInit() {
		let that = this;

		this.element = jQuery(this.selector.nativeElement);
		this.initPlugin();
		if (typeof this.value !== 'undefined') {
			this.setElementValue(this.value);
		}

		this.element.on('select2:select select2:unselect ', (event: any) => {
			if (event.type === 'select2:unselect') {
				if (this.options.multiple !== true) {
					this.onChangeCb(null);
					this.onTouchedCb();
					this.valueChanged.emit({
						value: null,
						// data: []
					});
					return;
				}
				this.onChangeCb(this.element.val());
				this.onTouchedCb();
				this.valueChanged.emit({
					value: this.element.val(),
					// data: this.element.select2('data')
				});
			} else {
				this.onChangeCb(that.element.val());
				this.value = that.element.val() as string | string[];
				that.valueChanged.emit({
					value: that.element.val()
				});
			}
		});
	}

	public ngOnDestroy() {
		if (this.element) {
			this.element.off('select2:select');
		}
	}

	public initPlugin() {
		if (!this.element.select2) {
			if (!this.check) {
				this.check = true;
			}

			return;
		}

		// If select2 already initialized remove him and remove all tags inside
		if (this.element.hasClass('select2-hidden-accessible') === true) {
			this.element.select2('destroy');
			this.renderer.setElementProperty(this.selector.nativeElement, 'innerHTML', '');
		}
		//
		let parentElement = this.element.parent().parent();
		let options: Select2Options = {
			data: this.data,
			width: (this.width) ? this.width : 'resolve',
			dropdownParent: parentElement
		};

		Object.assign(options, this.options);

		if (options.matcher) {
			(jQuery.fn.select2 as any).amd.require(['select2/compat/matcher'], (oldMatcher: any) => {
				options.matcher = oldMatcher(options.matcher);
				this.element.select2(options);
				if (typeof this.value !== 'undefined') {
					this.setElementValue(this.value);
				}
			});
		} else {
			this.element.select2(options);
			this.setElementValue(this.value);
		}

		if (this.disabled) {
			this.renderer.setElementProperty(this.selector.nativeElement, 'disabled', this.disabled);
		}
	}

	public setElementValue(newValue: string | string[]) {
		if (Array.isArray(newValue)) {
			for (let option of (this.element[0] as any).options) {
				if (newValue.indexOf(option.value) > -1) {
					this.renderer.setElementProperty(option, 'selected', 'true');
				}
			}
		} else {
			this.renderer.setElementProperty(this.selector.nativeElement, 'value', newValue);
		}

		this.element.trigger('change.select2');
	}

}
