import { Observable, of } from 'rxjs';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginActions } from '../actions/login.action';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { RouterModule } from '@angular/router';
import { LaddaModule } from 'angular2-ladda/module/module';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToasterService } from '../services/toaster.service';
import { AuthenticationService } from '../services/authentication.service';
import { AuthService, SocialUser } from '../theme/ng-social-login-module/index';
import { AuthenticationState, SessionState } from '../store/authentication/authentication.reducer';
import { LoginComponent } from './login.component';
import { AppState } from '../store';
import { MockStore, provideMockStore, TestingModule } from '../../testing/utils';
import { CreatedBy, UserDetails, VerifyEmailResponseModel } from '../models/api-models/loginModels';
import { IOption } from '../theme/ng-virtual-select/sh-options.interface';

class MockAuthenticationService {
    public GetElectronAppVersion(): Observable<string> {
        return of('1');
    }
}

class MockAuthService {
    get authState(): Observable<SocialUser> {
        const authState = {
            provider: 'google',
            id: '12345',
            email: 'test@test.com',
            name: 'test',
            photoUrl: 'http://test.test.com/test.png'
        } as SocialUser;

        return of(authState);
    }

    public signIn() {
        return new Promise(resolve => setTimeout(resolve, 500));
    }
}

class MockLoginActions {
    /**
     * VerifyEmailRequest
     */
    public VerifyEmailRequest(value) {
        return {
            type: LoginActions.VerifyEmailRequest,
            payload: value
        };
    }

    public VerifyMobileRequest(value) {
        return {
            type: LoginActions.VerifyMobileRequest,
            payload: value
        };
    }

    public SignupWithEmailRequest(value) {
        return {
            type: LoginActions.SignupWithEmailRequest,
            payload: value
        };
    }

    public ResetSignupWithMobileState() {
        return {
            type: LoginActions.ResetSignupWithMobileState
        };
    }

    public SetLoginStatus(value) {
        return {
            type: LoginActions.SetLoginStatus,
            payload: value
        };
    }

    public resetSocialLogoutAttempt() {
        return {
            type: LoginActions.RESET_SOCIAL_LOGOUT_ATTEMPT
        };
    }

    public VerifyTwoWayAuthRequest(value) {
        return {
            type: LoginActions.VerifyTwoWayAuthRequest,
            payload: value
        };
    }

    public LoginWithPasswdRequest(value) {
        return {
            type: LoginActions.LoginWithPasswdRequest,
            payload: value
        };
    }

    public forgotPasswordRequest(userId) {
        return {
            type: LoginActions.forgotPasswordRequest,
            payload: userId
        };
    }

    public resetPasswordRequest(model) {
        return {
            type: LoginActions.resetPasswordRequest,
            payload: model
        };
    }
}

describe('Login Component', () => {
    let fixture: ComponentFixture<LoginComponent>;
    let component: LoginComponent;
    let htmlEl: HTMLElement;
    let store: MockStore<AppState>;
    let authService: AuthService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LoginComponent],
            imports: [
                BrowserModule,
                FormsModule,
                ReactiveFormsModule,
                RouterTestingModule,
                LaddaModule.forRoot({
                    style: 'slide-left',
                    spinnerSize: 30
                }),
                ShSelectModule.forRoot(),
                BsDropdownModule.forRoot(),
                ModalModule.forRoot(),
                RouterModule.forChild([
                    {
                        path: '',
                        component: LoginComponent
                    }
                ]),
                TestingModule
            ],
            providers: [
                provideMockStore,
                { provide: LoginActions, useClass: MockLoginActions },
                { provide: AuthService, useClass: MockAuthService },
                { provide: ToasterService },
                { provide: AuthenticationService, useClass: MockAuthenticationService }
            ]
        });
    }));

    beforeEach(inject(
        [Store, AuthService],
        (testStore: MockStore<AppState>, mockService) => {
            store = testStore;
            authService = mockService;

            const initialState: AuthenticationState = {
                isVerifyMobileSuccess: false,
                isLoginWithMobileInProcess: false,
                isVerifyMobileInProcess: false,
                isLoginWithEmailInProcess: false,
                isVerifyEmailInProcess: false,
                isLoginWithGoogleInProcess: false,
                isLoginWithLinkedInInProcess: false,
                isLoginWithTwitterInProcess: false,
                isLoginWithEmailSubmited: false,
                isLoginWithMobileSubmited: false,
                isVerifyEmailSuccess: false,
                user: null,
                isSocialLogoutAttempted: false,
                isLoggedInWithSocialAccount: false,
                isTwoWayAuthInProcess: false,
                isTwoWayAuthSuccess: false,
                isAddNewMobileNoInProcess: false,
                isAddNewMobileNoSuccess: false,
                isVerifyAddNewMobileNoInProcess: false,
                isVerifyAddNewMobileNoSuccess: false,
                needsToRedirectToLedger: false,
                isLoginWithPasswordInProcess: false,
                isSignupWithPasswordInProcess: false,
                isSignupWithPasswordSuccess: false,
                signupVerifyEmail: null,
                isForgotPasswordInProcess: false,
                isResetPasswordInSuccess: false
            };
            const createdBy: CreatedBy = {
                email: 'string',
                mobileNo: 'string',
                name: 'string',
                uniqueName: 'string'
            };

            const userDetails: UserDetails = {
                name: 'string',
                email: 'string',
                mobileNo: 'string',
                contactNo: 'string',
                uniqueName: 'string',
                anAdmin: false,
                authenticateTwoWay: false,
                availableCredit: false,
                isNewUser: false,
                subUser: false,
                subUsers: [],
                createdAt: 'string',
                updatedAt: 'string',
                createdBy,
                updatedBy: createdBy
            };

            const userState: VerifyEmailResponseModel = {
                user: userDetails,
                authKey: '',
                isNewUser: false,
                contactNumber: '',
                countryCode: '',
                statusCode: '',
                text: ''
            };

            const sessionState: SessionState = {
                user: userState,
                lastState: '',
                applicationDate: '',
                companyUniqueName: '',
                companies: [],
                isRefreshing: false,
                isCompanyCreationInProcess: false,
                isCompanyCreationSuccess: false,
                isCompanyCreated: false,
                userLoginState: 0,
                currencies: []
            };

            store.setState(createState(initialState, sessionState));

            fixture = TestBed.createComponent(LoginComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        }
    ));

    describe('Unit test cases for ', () => {
        describe('basic component behavior and existence', () => {
            it('should component exists', () => {
                expect(component).toBeTruthy();
            });
        });

        describe('verifyCode method', () => {
            let spyDispatch;

            beforeEach(() => {
                spyDispatch = spyOn(store, 'dispatch');
            });

            it('should dispatch "loginAction.SignupWithEmailRequest"', () => {
                component.VerifyCode('9874563210', '91');

                expect(spyDispatch).toHaveBeenCalled();
            });
        });

        describe('verifyTwoWayCode method', () => {
            let spyDispatch;

            beforeEach(() => {
                spyDispatch = spyOn(store, 'dispatch');
            });

            it('should dispatch "loginAction.SignupWithEmailRequest"', () => {
                component.verifyTwoWayCode();

                expect(spyDispatch).toHaveBeenCalled();
            });
        });

        describe('setCountryCode method', () => {
            it('should set value of selectedCountry if setCountryCode method is invoked', () => {
                const event: IOption = { value: 'India', label: 'India' };

                component.countryCodeList = [event];

                component.setCountryCode(event);

                expect(component.selectedCountry).toEqual(event.label);
            });
        });

        describe('generateRandomBanner method', () => {
            it('should set value of selectedBanner if generateRandomBanner method is invoked', () => {
                component.generateRandomBanner();

                expect(component.selectedBanner).toBeDefined();
            });
        });

        describe('loginWithPasswd method', () => {
            it('should dispatch LoginWithPasswdRequest of login action if loginWithPasswd method is invoked', () => {
                component.loginWithPasswd(component.loginWithPasswdForm);

                expect(component.selectedBanner).toBeDefined();
            });
        });

        describe('forgotPassword method', () => {
            let spyDispatch;

            beforeEach(() => {
                spyDispatch = spyOn(store, 'dispatch');
            });

            it('should dispatch forgotPasswordRequest of login action if forgotPassword method is invoked', () => {
                component.forgotPassword('CustomUser123');

                expect(spyDispatch).toHaveBeenCalled();
            });
        });

        describe('resetPassword method', () => {
            let spyDispatch;

            beforeEach(() => {
                spyDispatch = spyOn(store, 'dispatch');
            });

            it('should dispatch resetPasswordRequest of login action if forgotPassword method is invoked', () => {
                component.resetPassword({ value: {} });

                expect(spyDispatch).toHaveBeenCalled();
            });
        });

        describe('resetForgotPasswordProcess method', () => {
            it('should set forgotStep to 1 if resetForgotPasswordProcess method is invoked', () => {
                component.resetForgotPasswordProcess();

                expect(component.forgotStep).toEqual(1);
            });
        });
    });

    describe('UI test cases for', () => {
        describe('basic component behavior and existence', () => {
            beforeEach(() => {
                htmlEl = fixture.debugElement.query(By.css('.login_option a'))
                    .nativeElement;
                spyOn(component, 'resetForgotPasswordProcess');

                htmlEl.click();
            });

            it('should display login heading text in h1', async(() => {
                expect(
                    fixture.debugElement.query(By.css('h1.mrB3')).nativeElement.innerText
                ).toContain('Login to your secure accounting space');
            }));

            it('should not have the login form in the DOM', () => {
                expect(fixture.debugElement.query(By.css('#loginWithPwd'))).toBeNull();
            });

            it('should change `loginUsing` variable value to `userName`', () => {
                expect(component.loginUsing).toEqual('userName');
            });

            it('should call function `resetForgotPasswordProcess`', () => {
                expect(component.resetForgotPasswordProcess).toHaveBeenCalled();
            });

            it('should display the login form', () => {
                fixture.detectChanges();

                expect(
                    fixture.debugElement.query(By.css('#loginWithPwd'))
                ).toBeDefined();
            });
        });

        describe('showEmailModal box', () => {
            let modelBox;

            beforeEach(() => {
                modelBox = spyOn(component.emailVerifyModal, 'show');
            });

            it('should visible if showEmailModal fn is invoked', () => {
                component.showEmailModal();

                expect(modelBox).toHaveBeenCalled();
            });

            it('should return true when showEmailModal fn is not invoked', () => {
                expect(component.isSubmited).toBeFalsy();
            });

            it('should return false when showEmailModal fn is not invoked', () => {
                component.showEmailModal();

                expect(component.isSubmited).toBeFalsy();
            });
        });

        describe('loginWithEmail method', () => {
            let spyFn;

            beforeEach(() => {
                spyFn = spyOn(store, 'dispatch');
            });

            it('should dispatch "SignupWithEmailRequest" when loginWithEmail method is called', () => {
                component.LoginWithEmail('test@test.com');

                expect(spyFn).toHaveBeenCalled();
            });
        });

        describe('showMobileModal method', () => {
            let spyFn;

            beforeEach(() => {
                spyFn = spyOn(component.mobileVerifyModal, 'show');
            });

            it('should invoke this.mobileVerifyModal.show method if showMobileModal method is called', () => {
                component.showMobileModal();

                expect(spyFn).toHaveBeenCalled();
            });
        });

        describe('hideMobileModal method', () => {
            let spyMobileVerifyModalFn;
            let spyDispatch;

            beforeEach(() => {
                spyMobileVerifyModalFn = spyOn(component.mobileVerifyModal, 'hide');
                spyDispatch = spyOn(store, 'dispatch');
            });

            it('should call hide method of spyMobileVerifyModal object if hideMobileModal is invoked', () => {
                component.hideMobileModal();

                expect(spyMobileVerifyModalFn).toHaveBeenCalled();
            });

            it('should dispatch ResetSignupWithMobileState login action if hideMobileModal is invoked', () => {
                component.hideMobileModal();

                expect(spyDispatch).toHaveBeenCalled();
            });
        });

        describe('showTwoWayAuthModal method', () => {
            let spyFn;

            beforeEach(() => {
                spyFn = spyOn(component.twoWayAuthModal, 'show');
            });

            it('should invoke this.twoWayAuthModal.show method if showTwoWayAuthModal method is called', () => {
                component.showTwoWayAuthModal();

                expect(spyFn).toHaveBeenCalled();
            });
        });

        describe('hideTowWayAuthModal method', () => {
            let spyFn;

            beforeEach(() => {
                spyFn = spyOn(component.twoWayAuthModal, 'hide');
            });

            it('should invoke this.twoWayAuthModal.hide method if hideTowWayAuthModal method is called', () => {
                component.hideTowWayAuthModal();

                expect(spyFn).toHaveBeenCalled();
            });
        });

        describe('resetTwoWayAuthModal method', () => {
            let spyHideTowWayAuthModalFn;
            let spyDispatch;

            beforeEach(() => {
                spyHideTowWayAuthModalFn = spyOn(component, 'hideTowWayAuthModal');
                spyDispatch = spyOn(store, 'dispatch');
            });

            it('should call hideTowWayAuthModal method if resetTwoWayAuthModal is invoked', () => {
                component.resetTwoWayAuthModal();

                expect(spyHideTowWayAuthModalFn).toHaveBeenCalled();
            });

            it('should dispatch SetLoginStatus login action if resetTwoWayAuthModal is invoked', () => {
                component.resetTwoWayAuthModal();

                expect(spyDispatch).toHaveBeenCalled();
            });
        });

        describe('showForgotPasswordModal method', () => {
            it('should display login heading text in h1', async(() => {
                component.showForgotPasswordModal();

                expect(
                    fixture.debugElement.query(By.css('h1.mrB3')).nativeElement.innerText
                ).toContain('Login to your secure accounting space');
            }));

            it('should display forgot password form if showForgotPasswordModal is called', () => {
                component.showForgotPasswordModal();

                expect(
                    fixture.debugElement.query(By.css('form[name="forgotPassword"'))
                ).toBeDefined();
            });
        });

        describe('signInWithProviders method', () => {
            let spyDispatch;
            let spyAuthService;

            beforeEach(() => {
                spyDispatch = spyOn(store, 'dispatch');
                spyAuthService = spyOn(authService, 'signIn');
            });

            it('should dispatch resetSocialLogoutAttempt login action if signInWithProviders is invoked', () => {
                component.signInWithProviders('google');

                expect(spyDispatch).toHaveBeenCalled();
            });

            it('should call this.authService.signIn method is if signInWithProviders is invoked', () => {
                component.signInWithProviders('google');

                expect(spyAuthService).toHaveBeenCalled();
            });
        });
    });
});

function createState(
    loginState: AuthenticationState,
    sessionState: SessionState
) {
    return {
        router: {},
        general: {},
        home: {},
        login: loginState,
        session: sessionState,
        company: {},
        sales: {},
        groupwithaccounts: {},
        verifyMobile: {},
        inventory: {},
        search: {},
        auditlog: {},
        permission: {},
        flyAccounts: {},
        invoice: {},
        invoiceTemplate: {},
        tlPl: {},
        ledger: {},
        settings: {},
        manufacturing: {},
        invoicePurchase: {},
        daybook: {},
        userLoggedInSessions: {},
        importExcel: {},
        inventoryInOutState: {},
        inventoryBranchTransfer: {},
        newVsOldInvoices: {},
        agingreport: {},
        companyImportExport: {},
        gstReconcile: {},
        receipt: {},
        gstR: {},
        subscriptions: {}
    } as AppState;
}
