import { Directive, HostListener, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { WindowRef } from "../window.object";


@Directive({
  selector: '[PageHeight]'
})
export class FullPageHeight implements OnInit {

  constructor(el: ElementRef, winRef: WindowRef) {
    el.nativeElement.style.maxHeight = winRef.nativeWindow.innerHeight+"px";
    el.nativeElement.style.minHeight = winRef.nativeWindow.innerHeight+"px";
    console.log(el.nativeElement.style);
  }

  public ngOnInit() {
       
  }

}
