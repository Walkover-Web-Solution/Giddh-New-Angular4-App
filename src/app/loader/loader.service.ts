import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { LoaderState } from './loader';

@Injectable()

export class LoaderService {

  public loaderSubject = new BehaviorSubject<LoaderState>({show: false} as LoaderState);
  public loaderState = this.loaderSubject;

  public show() {
    this.loaderSubject.next({show: true} as LoaderState);
  }

  public hide() {
    this.loaderSubject.next({show: false} as LoaderState);
  }
}
