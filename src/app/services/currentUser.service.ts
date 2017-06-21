// import { AppState } from '../store/roots';
// import { Injectable } from '@angular/core';
// import { StorageService } from './storage.service';
// import { AuthenticationService } from './authentication.service';
// import { Observable } from 'rxjs/Observable';
// import { Subject } from 'rxjs/Subject';
// import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// import { Domain } from '../models/domain';
// import { Store } from '@ngrx/store';

// @Injectable()
// export class CurrentUserService {
//   public appTitle = new Subject<string>();
//   public authKey: string;
//   constructor(public _storageService: StorageService, private store: Store<AppState>, ) {
//   }

//   public get Roles(): any {
//     let roles = this._storageService.getItem('roles');
//     return roles;
//   }
//   public set Roles(roles: any) {
//     this._storageService.setItem('roles', roles);
//   }

// }
