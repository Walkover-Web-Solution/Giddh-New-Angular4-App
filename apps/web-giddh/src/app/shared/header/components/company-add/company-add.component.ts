import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AuthService } from 'apps/web-giddh/src/app/theme/ng-social-login-module/auth.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, take, takeUntil } from 'rxjs/operators';

import { CompanyActions } from '../../../../actions/company.actions';
import { GeneralActions } from '../../../../actions/general/general.actions';
import { LoginActions } from '../../../../actions/login.action';
import { VerifyMobileActions } from '../../../../actions/verifyMobile.actions';
import { CompanyCreateRequest, CompanyResponse } from '../../../../models/api-models/Company';
import { UserDetails } from '../../../../models/api-models/loginModels';
import { GeneralService } from '../../../../services/general.service';
import { LocationService } from '../../../../services/location.service';
import { AppState } from '../../../../store';
import { IOption } from '../../../../theme/ng-virtual-select/sh-options.interface';
import { WizardComponent } from '../../../../theme/ng2-wizard';
import { contriesWithCodes } from '../../../helpers/countryWithCodes';


// const GOOGLE_CLIENT_ID = '641015054140-3cl9c3kh18vctdjlrt9c8v0vs85dorv2.apps.googleusercontent.com';
@Component({
    selector: 'company-add',
    templateUrl: './company-add.component.html',
    styleUrls: ['./company-add.component.scss']
})
export class CompanyAddComponent implements OnInit, OnDestroy {
    @ViewChild('wizard', { static: true }) public wizard: WizardComponent;
    @ViewChild('logoutModal', { static: true }) public logoutModal: ModalDirective;
    @Output() public closeCompanyModal: EventEmitter<any> = new EventEmitter();
    @Output() public closeCompanyModalAndShowAddManege: EventEmitter<string> = new EventEmitter();
    @Input() public createBranch: boolean = false;
    public imgPath: string = '';
    public company: CompanyCreateRequest = new CompanyCreateRequest();
    public phoneNumber: string;
    public countrySource: IOption[] = [];

    public verificationCode: string;
    public showVerificationBox: Observable<boolean>;
    public isMobileVerified: Observable<boolean>;
    public isCompanyCreationInProcess$: Observable<boolean>;
    public isCompanyCreated$: Observable<boolean>;
    public companies$: Observable<CompanyResponse[]>;
    public showMobileVarifyMsg: boolean = false;
    public isLoggedInWithSocialAccount$: Observable<boolean>;
    public dataSource: any;
    public dataSourceBackup: any;
    public country: string;
    public currencies: IOption[] = [];
    public currencySource$: Observable<IOption[]> = observableOf([]);
    public countryPhoneCode: IOption[] = [];
    public isMobileNumberValid: boolean = false;
    public selectedCountry: string;
    public isCitySelectedByDropdown: boolean = false;
    public logedInusers: UserDetails;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private socialAuthService: AuthService,
        private store: Store<AppState>,
        private verifyActions: VerifyMobileActions,
        private companyActions: CompanyActions,
        private _location: LocationService,
        private _route: Router,
        private _loginAction: LoginActions,
        private _generalActions: GeneralActions,
        private _generalService: GeneralService
    ) {
        this.isLoggedInWithSocialAccount$ = this.store.pipe(select(p => p.login.isLoggedInWithSocialAccount), takeUntil(this.destroyed$));

        contriesWithCodes.map(c => {
            this.countrySource.push({ value: c.countryName, label: `${c.countryflag} - ${c.countryName}` });
            this.isLoggedInWithSocialAccount$ = this.store.pipe(select(p => p.login.isLoggedInWithSocialAccount), takeUntil(this.destroyed$));
        });
        // Country phone Code
        contriesWithCodes.map(c => {
            this.countryPhoneCode.push({ value: c.value, label: c.value });
        });
        _.uniqBy(this.countryPhoneCode, 'value');
        const ss = Array.from(new Set(this.countryPhoneCode.map(s => s.value))).map(value => {
            return {
                value: value,
                label: this.countryPhoneCode.find(s => s.value === value).label
            };
        });
        this.countryPhoneCode = ss;
        this.store.pipe(select(s => s.session.currencies), takeUntil(this.destroyed$)).subscribe((data) => {
            this.currencies = [];
            if (data) {
                data.map(d => {
                    this.currencies.push({ label: d.code, value: d.code });
                });
            }
            this.currencySource$ = observableOf(this.currencies);
        });
    }

    // tslint:disable-next-line:no-empty
    public ngOnInit() {
        this.imgPath = (isElectron || isCordova) ? '' : AppUrl + APP_FOLDER + '';
        this.companies$ = this.store.pipe(select(s => s.session.companies), takeUntil(this.destroyed$));
        this.showVerificationBox = this.store.pipe(select(s => s.verifyMobile.showVerificationBox), takeUntil(this.destroyed$));
        this.isCompanyCreationInProcess$ = this.store.pipe(select(s => s.session.isCompanyCreationInProcess), takeUntil(this.destroyed$));

        this.store.pipe(select(s => s.session.createBranchUserStoreRequestObj), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                if (res.isBranch) {
                    this.company = res;
                }
            }
        });

        this.logedInusers = this._generalService.user;
        this.isCompanyCreated$ = this.store.pipe(select(s => s.session.isCompanyCreated), takeUntil(this.destroyed$));
        this.dataSource = (text$: Observable<any>): Observable<any> => {
            return text$.pipe(
                debounceTime(300),
                distinctUntilChanged(),
                switchMap((term: string) => {
                    if (term.startsWith(' ', 0)) {
                        return [];
                    }
                    return this._location.GetCity({
                        QueryString: this.company.city,
                        AdministratorLevel: undefined,
                        Country: undefined,
                        OnlyCity: true
                    }).pipe(catchError(e => {
                        return [];
                    }));
                }),
                map((res) => {
                    let data = res.map(item => item.city);
                    this.dataSourceBackup = res;
                    return data;
                }),
                takeUntil(this.destroyed$));
        };
    }

    public typeaheadOnSelect(e: TypeaheadMatch): void {
        setTimeout(() => {
            this.company.city = e.item;
            this.isCitySelectedByDropdown = true;
            this.dataSourceBackup.forEach(item => {
                if (item.city === e.item) {
                    this.company.country = item.country;
                }
            });
        }, 400);
    }

    public onChangeCityName() {
        this.isCitySelectedByDropdown = false;
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public createCompany() {

        this.company.uniqueName = this.getRandomString(this.company.name, this.company.country);
        this.company.isBranch = this.createBranch;
        this._generalService.createNewCompany = this.company;
        this.store.dispatch(this.companyActions.userStoreCreateBranch(this.company));
        this.closeModal();
        this._route.navigate(['welcome']);
    }

    public closeModal() {
        let companies = null;
        this.companies$.pipe(take(1)).subscribe(c => companies = c);
        if (companies) {
            if (companies.length > 0) {
                this.store.dispatch(this._generalActions.getGroupWithAccounts());
                this.store.dispatch(this._generalActions.getFlattenAccount());
                this.closeCompanyModal.emit();
            } else {
                this.showLogoutModal();
            }
        } else {
            this.showLogoutModal();
        }
    }

    public showLogoutModal() {
        this.logoutModal.show();
    }

    public hideLogoutModal() {
        this.logoutModal.hide();
    }

    public logoutUser() {
        this.store.dispatch(this.verifyActions.hideVerifyBox());
        this.hideLogoutModal();
        this.closeCompanyModal.emit();
        if (isElectron) {
            // this._aunthenticationServer.GoogleProvider.signOut();
            this.store.dispatch(this._loginAction.ClearSession());
        } else if (isCordova) {
            (window as any).plugins.googleplus.logout(
                (msg) => {
                    this.store.dispatch(this._loginAction.ClearSession());
                }
            );
        } else {
            this.isLoggedInWithSocialAccount$.subscribe((val) => {
                if (val) {
                    this.socialAuthService.signOut().then().catch((err) => {
                    });
                    this.store.dispatch(this._loginAction.ClearSession());
                    this.store.dispatch(this._loginAction.socialLogoutAttempt());
                } else {
                    this.store.dispatch(this._loginAction.ClearSession());
                }
            });
        }
    }

    /**
     * setCountryCode
     */
    // public setCountryCode(model: Partial<IOption>) {
    //   if (model.value) {
    //     let country = this.countryCodeList.filter((obj) => obj.value === model.value);
    //     this.country = country[0].value;
    //     this.selectedCountry = country[0].label;
    //   }
    // }

    private getRandomString(comnanyName, city) {
        // tslint:disable-next-line:one-variable-per-declaration
        let d, dateString, randomGenerate, strings;
        comnanyName = this.removeSpecialCharacters(comnanyName);
        city = this.removeSpecialCharacters(city);
        d = new Date();
        dateString = d.getTime().toString();
        randomGenerate = this.getSixCharRandom();
        strings = [comnanyName, city, dateString, randomGenerate];
        return strings.join('');
    }

    private removeSpecialCharacters(str) {
        let finalString;
        finalString = str.replace(/[^a-zA-Z0-9]/g, '');
        return finalString.substr(0, 6).toLowerCase();
    }

    private getSixCharRandom() {
        return Math.random().toString(36).replace(/[^a-zA-Z0-9]+/g, '').substr(0, 6);
    }

}
