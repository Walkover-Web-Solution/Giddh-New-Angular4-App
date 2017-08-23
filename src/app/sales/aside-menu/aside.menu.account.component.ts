import { Component, EventEmitter, Output } from '@angular/core';
import { AccountAddComponent } from '../shared/header/components/index';

@Component({
  selector: 'aside-menu-account',
  styles: [`
  :host{
    position: fixed;
    left: auto;
    top: 0;
    right: 0;
    bottom: 0;
    width: 400px;
    z-index: 22;
  }
  `],
  templateUrl: './aside.menu.account.component.html'
})
export class AsideMenuAccountComponent {

  @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);

  constructor() {
    //
  }

  public closeAsidePane(event) {
    this.closeAsideEvent.emit(event);
  }
}
