import { Component, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { PermissionActions } from '../../../services/actions/permission/permission.action';

export interface InewRole {
  name: string;
  copyoption: string;
  pages: any[];
  scopes: any[];
}

@Component({
  // templateUrl: './permission.details.html'
  template: 'Hey dude'
})

export class PermissionDetailsComponent {
}
