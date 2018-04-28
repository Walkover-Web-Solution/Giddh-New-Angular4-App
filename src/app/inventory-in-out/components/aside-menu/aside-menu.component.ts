import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'aside-menu',
  templateUrl: './aside-menu.component.html',
  styles: [`
    .buttons-container {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      height: 100vh;
    }

    .buttons-container > * {
      margin: 20px;
    }

    :host {
      position: fixed;
      left: auto;
      top: 0;
      right: 0;
      bottom: 0;
      width: 480px;
      z-index: 1045;
    }

    #close {
      display: none;
    }

    :host.in #close {
      display: block;
      position: fixed;
      left: -41px;
      top: 0;
      z-index: 5;
      border: 0;
      border-radius: 0;
    }

    :host .container-fluid {
      padding-left: 0;
      padding-right: 0;
    }

    :host .aside-pane {
      width: 480px;
    }
  `],
})

export class AsideMenuComponent implements OnInit, OnChanges {
  @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
  public view = '';

  constructor() {
    //
  }

  public ngOnChanges(changes: SimpleChanges): void {
//
  }

  public ngOnInit() {
    //
  }

  public onCancel() {
    this.view = '';
  }

  public closeAsidePane(event?) {
    this.closeAsideEvent.emit();
    this.view = '';
  }
}
