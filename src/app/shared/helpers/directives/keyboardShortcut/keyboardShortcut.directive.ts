import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

const keyMaps = {
  backspace: 8,
  tab: 9,
  enter: 13,
  shift: 16,
  ctrl: 17,
  alt: 18,
  esc: 27,
};

@Directive({
  selector: '[keyboardShortcut]'
})
export class KeyboardShortcutDirective {
  @Input() public keyboardShortcut: string | { [key: string]: boolean };
  @Output() public onShortcutPress = new EventEmitter<any>();

  constructor(private _el: ElementRef) {
  }

  @HostListener('window:keydown', ['$event, ElementRef'])
  public handleKeyDown(event: KeyboardEvent) {
    console.log('event', this._el);
    let key;
    if (typeof this.keyboardShortcut === 'string') {
      key = this.keyboardShortcut;
    } else {
      key = Object.keys(this.keyboardShortcut)[0];
      if (!this.keyboardShortcut[key]) {
        return;
      }
    }
    if (event.which === keyMaps[key]) {
      event.preventDefault();
      event.stopImmediatePropagation();
      event.stopPropagation();
      this.onShortcutPress.emit();
    }
  }
}
