import { map, switchMap, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CompanyActions } from './company.actions';
import { SignupWithMobile, VerifyMobileModel } from '../models/api-models/loginModels';
import { AppState } from '../store/roots';
import { ToasterService } from '../services/toaster.service';
import { AuthenticationService } from '../services/authentication.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { CustomActions } from '../store/customActions';

@Injectable()

export class VerifyMobileActions {
    public static VERIFY_MOBILE_REQUEST = 'VERIFY_MOBILE_REQUEST';
    public static SHOW_VERIFICATION_BOX = 'SHOW_VERIFICATION_BOX';
    public static SET_VERIFIACATION_MOBILENO = 'SER_VARIFICATION_MOBILENO';
    public static VERIFY_MOBILE_CODE_REQUEST = 'VERIFY_MOBILE_CODE_REQUEST';
    public static VERIFY_MOBILE_CODE_RESPONSE = 'VERIFY_MOBILE_CODE_RESPONSE';
    public static HIDE_VERIFICATION_BOX = 'HIDE_VERIFICATION_BOX';

    public verifyNumber$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(VerifyMobileActions.VERIFY_MOBILE_REQUEST),
            switchMap((action: CustomActions) => this._authService.VerifyNumber(action.payload)),
            map(response => {
                if (response?.status === 'success') {
                    this.store.dispatch(this.action(VerifyMobileActions.SET_VERIFIACATION_MOBILENO, response.request.mobileNumber));
                    this.store.dispatch(this.action(VerifyMobileActions.SHOW_VERIFICATION_BOX, true));
                } else {
                    this.store.dispatch(this.action(VerifyMobileActions.SHOW_VERIFICATION_BOX, false));
                    this._toasty.errorToast(response.message, response.code);
                }
                return { type: 'EmptyAction' };
            })));

    public verifyNumberCode$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(VerifyMobileActions.VERIFY_MOBILE_CODE_REQUEST),
            switchMap((action: CustomActions) => this._authService.VerifyNumberOTP(action?.payload)),
            map(response => {
                if (response?.status === 'success') {
                    this._toasty.successToast(response?.body);
                    let no: string = null;
                    this.store.pipe(
                        take(1))
                        .subscribe(p => {
                            no = p.verifyMobile.phoneNumber;
                        });
                    this.store.dispatch(this.companyActions.SetContactNumber(no));
                    this.store.dispatch(this.action(VerifyMobileActions.VERIFY_MOBILE_CODE_RESPONSE, response));
                } else {
                    this._toasty.errorToast(response.message, response.code);
                }
                return { type: 'EmptyAction' };
            })));

    constructor(private action$: Actions,
        private _authService: AuthenticationService,
        private _toasty: ToasterService,
        private store: Store<AppState>,
        private companyActions: CompanyActions
    ) { }
    public verifyNumberRequest = (model: SignupWithMobile): Action => this.action(VerifyMobileActions.VERIFY_MOBILE_REQUEST, model);
    public verifyNumberCodeRequest = (verifyMobileModel: VerifyMobileModel): Action => this.action(VerifyMobileActions.VERIFY_MOBILE_CODE_REQUEST, verifyMobileModel);
    public hideVerifyBox() {
        return {
            type: VerifyMobileActions.HIDE_VERIFICATION_BOX,
            payload: false
        };
    }

    private action = (type, payload) => ({ type, payload });

}
