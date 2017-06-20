import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Domain } from '../models/domain';

@Injectable()
export class CurrentUserService {
  public appTitle = new Subject<string>();

  constructor(public _storageService: StorageService) {

  }

  public getTitle() {
    let title = this._storageService.getItem('title');
    return title;
  }
  public setTitle(title: string) {
    this._storageService.setItem('title', title);
    this.appTitle.next(title);
  }

  public get token(): string {
    let token = this._storageService.getItem('authorizationData');
    return token;
  }
  public set token(token: string) {
    this._storageService.setItem('authorizationData', token);
  }

  public get Roles(): any {
    let roles = this._storageService.getItem('roles');
    return roles;
  }
  public set Roles(roles: any) {
    this._storageService.setItem('roles', roles);
  }

}
