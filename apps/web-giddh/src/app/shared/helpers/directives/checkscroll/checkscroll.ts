import { Directive, HostListener, OnInit } from '@angular/core';

@Directive({
	selector: '[checkscrollY]'
})
export class CheckscrollDirective implements OnInit {

	constructor() {
		//
	}

	public ngOnInit() {
		//
	}

	@HostListener('scroll', ['$event, ElementRef'])
	public onScroll(event) {
		let ele = event.target;
		let scroll = $(ele).scrollTop();

		// check if target(ul) has scoll
		if ($(ele).hasClass('fix')) {
			return 0;
		} else if (scroll <= 20) {
			$(ele).addClass('fix');
		}
	}
}
