import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { LoaderState } from './loader';

@Injectable()

export class LoaderService {

  public loaderSubject = new Subject<LoaderState>();
  public loaderState = this.loaderSubject.asObservable();

  public show() {
    this.loaderSubject.next({show: true} as LoaderState);
  }

  public hide() {
    this.loaderSubject.next({show: false} as LoaderState);
  }
}
