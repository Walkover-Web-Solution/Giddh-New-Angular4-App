import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'wizard-step',
  template:
  `
    <div [hidden]="!isActive">
      <ng-content></ng-content>
    </div>
  `
})
export class WizardStepComponent {
  @Input() public title: string;
  @Input() public hidden: boolean = false;
  @Input() public isValid: boolean = true;
  @Input() public showNext: boolean = true;
  @Input() public showPrev: boolean = true;

  @Output() public onNext: EventEmitter<any> = new EventEmitter<any>();
  @Output() public onPrev: EventEmitter<any> = new EventEmitter<any>();
  @Output() public onComplete: EventEmitter<any> = new EventEmitter<any>();

  public isDisabled: boolean = true;
  private _isActive: boolean = false;

  // tslint:disable-next-line:no-empty
  constructor() { }

  @Input('isActive')
  set isActive(isActive: boolean) {
    this._isActive = isActive;
    this.isDisabled = false;
  }

  get isActive(): boolean {
    return this._isActive;
  }

}
