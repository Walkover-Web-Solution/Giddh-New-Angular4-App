import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Directive({
  selector: '[checkscrollY]'
})
export class checkscrollY implements OnInit {

  constructor (elem: ElementRef) {}

  ngOnInit() { }

  @HostListener('scroll', ['$event, ElementRef'])
  onScroll(event) {
    let ele = event.target;
    let scroll = $(ele).scrollTop();
    
      // check if target(ul) has scoll
      if ($(ele).hasClass("fix")) {
        return 0
      }
      else if (scroll <= 20) {
        $(ele).addClass("fix");
      }
  }
}