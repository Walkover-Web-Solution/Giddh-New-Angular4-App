import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive({
	selector: '[textCaseChangeDirective]'
})
export class TextCaseChangeDirective implements OnInit {
	@Input() public control: FormControl;

	constructor(private el: ElementRef) {
		//
	}

	public ngOnInit() {
		//
	}

	@HostListener('document:paste', ['$event'])
	public Paste(event) {
		if ('textcasechangedirective' in event.target.attributes) {
			let cl = event.clipboardData.getData('text/plain');
			cl = cl.toLowerCase();
			event.target.value = cl;
			if (this.control) {
				this.control.setValue(cl);
			}
			event.preventDefault();
		}
	}
}
