import { take } from 'rxjs/operators';
import { VerifyEmailResponseModel } from '../models/api-models/loginModels';
import { AppState } from '../store';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable()
export class NewUserAuthGuard  {
    private user: VerifyEmailResponseModel;

    constructor(public _router: Router, private store: Store<AppState>) {
    }

    public canActivate() {
        this.store.pipe(take(1)).subscribe(s => {
            if (s.session.user) {
                this.user = s.session.user;
            }
        });
        if (this.user && this.user.session && this.user.session.id) {
            return true;
        } else {
            return false;
        }
    }
}
