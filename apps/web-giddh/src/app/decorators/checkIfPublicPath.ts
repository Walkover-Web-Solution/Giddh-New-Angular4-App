import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class CheckIfPublicPath implements CanActivate {
  constructor(public _router: Router) {
    const url = this._router;
    console.log('Hello this is the URL in constructor:', url);
  }

  public canActivate() {
    const url = this._router;
    console.log('Hello this is the URL :', url);
    return true;
  }
}
