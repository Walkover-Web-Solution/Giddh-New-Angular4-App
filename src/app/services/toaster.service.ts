import { Injectable } from '@angular/core';
import { ToastyService } from 'ng2-toasty';

import { APP_DEFAULT_TITLE, DEFAULT_TOASTER_OPTIONS } from '../app.constant';

@Injectable()
export class ToasterService {

  constructor(public _toaster: ToastyService) {

  }

  public successToast(msg: string, title: string = APP_DEFAULT_TITLE): void {
    this._toaster.success(Object.assign({}, DEFAULT_TOASTER_OPTIONS, { title, msg }));
  }

  public errorToast(msg: string, title: string = APP_DEFAULT_TITLE): void {
    this._toaster.error(Object.assign({}, DEFAULT_TOASTER_OPTIONS, { title, msg }));
  }

  public warningToast(msg: string, title: string = APP_DEFAULT_TITLE): void {
    this._toaster.warning(Object.assign({}, DEFAULT_TOASTER_OPTIONS, { title, msg }));
  }

  public infoToast(msg: string, title: string = APP_DEFAULT_TITLE): void {
    this._toaster.info(Object.assign({}, DEFAULT_TOASTER_OPTIONS, { title, msg }));
  }

  public clearAllToaster(): void {
    this._toaster.clearAll();
  }
}
