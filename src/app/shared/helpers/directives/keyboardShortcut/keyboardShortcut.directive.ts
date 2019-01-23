import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

const keyMaps = {
  backspace: 8,
  tab: 9,
  enter: 13,
  esc: 27,
};
const controlKeyMaps = {
  shift: 'shiftKey',
  ctrl: 'ctrlKey',
  alt: 'altKey',
};

@Directive({
  selector: '[keyboardShortcut]'
})
export class KeyboardShortcutDirective {
  @Input() public keyboardShortcut: string | string[] | { [key: string]: boolean };
  @Output() public onShortcutPress = new EventEmitter<string>();

  constructor(private _el: ElementRef) {
  }

  @HostListener('window:keydown', ['$event, ElementRef'])
  public handleKeyDown(event: KeyboardEvent) {
    let key: string;
    if (Array.isArray(this.keyboardShortcut)) {
      this.matchArray(event, this.keyboardShortcut);
      return;
    } else if (typeof this.keyboardShortcut === 'string') {
      key = this.keyboardShortcut;
    } else {
      key = Object.keys(this.keyboardShortcut)[0];
      if (!this.keyboardShortcut[key]) {
        return;
      }
    }
    this.matchSingle(event, key);
  }

  private matchArray(event: KeyboardEvent, shortcuts: string[]) {
    for (let key of shortcuts) {
      if (key.includes('+')) {
        let keys = key.split('+');
        const match = keys.every(k => (controlKeyMaps[k] && event[controlKeyMaps[k]]) || keyMaps[k] === event.which);
        if (match) {
          this.onMatch(key);
          return;
        }
      } else if (this.matchSingle(event, key)) {
        return;
      }
    }
  }

  private matchSingle(event: KeyboardEvent, key: string) {
    if (event.which === keyMaps[key] && !event.shiftKey && !event.ctrlKey && !event.altKey) {
      this.onMatch(key);
      return true;
    }
    return false;
  }

  private onMatch(key: string) {
    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();
    this.onShortcutPress.emit(key);
  }
}
