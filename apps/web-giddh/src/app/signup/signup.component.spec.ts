import { Observable, of } from 'rxjs';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
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
import { AuthService } from '../theme/ng-social-login-module/index';

import { SignupComponent } from './signup.component';
import { MockStore, provideMockStore, TestingModule } from '../../testing/utils';
import { AuthenticationState, SessionState } from '../store/authentication/authentication.reducer';
import { AppState } from '../store';
import { SocialUser } from '../theme/ng-social-login-module/entities/user';
import { CreatedBy, SignupWithMobile, UserDetails, VerifyEmailResponseModel } from 'apps/web-giddh/src/app/models/api-models/loginModels';

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
    public SignupWithPasswdRequest(value) {
        return {
            type: LoginActions.SignupWithPasswdRequest,
            payload: value
        };
    }

    public VerifyEmailRequest(value) {
        return {
            type: LoginActions.VerifyEmailRequest,
            payload: value
        };
    }

    public SignupWithEmailRequest(value) {
        return {
            type: LoginActions.SignupWithEmailRequest,
            payload: value
        };
    }

    public VerifyMobileRequest(value) {
        return {
            type: LoginActions.VerifyMobileRequest,
            payload: value
        };
    }

    public ResetSignupWithEmailState() {
        return {
            type: LoginActions.ResetSignupWithEmailState
        };
    }

    public SetLoginStatus(value) {
        return {
            type: LoginActions.SetLoginStatus,
            payload: value
        };
    }

    public ResetSignupWithMobileState() {
        return {
            type: LoginActions.ResetSignupWithMobileState
        };
    }

    public resetSocialLogoutAttempt() {
        return {
            type: LoginActions.RESET_SOCIAL_LOGOUT_ATTEMPT
        };
    }

    public SignupWithMobileRequest(value: SignupWithMobile) {
        return {
            type: LoginActions.SignupWithMobileRequest,
            payload: value
        };
    }

    public VerifyTwoWayAuthRequest(value) {
        return {
            type: LoginActions.VerifyTwoWayAuthRequest,
            payload: value
        };
    }
}

class MockToastService {
    public errorToast(value) {
        return value;
    }
}

describe('Signup Component', () => {
    let fixture: ComponentFixture<SignupComponent>;
    let component: SignupComponent;
    let store: MockStore<AppState>;
    let mockToast: ToasterService;
    let authService: AuthService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SignupComponent],
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
                        component: SignupComponent
                    }
                ]),
                TestingModule
            ],
            providers: [
                provideMockStore,
                { provide: LoginActions, useClass: MockLoginActions },
                { provide: AuthService, useClass: MockAuthService },
                { provide: ToasterService, useClass: MockToastService },
                { provide: AuthenticationService, useClass: MockAuthenticationService }
            ]
        });
    }));

    beforeEach(inject(
        [Store, ToasterService, AuthService],
        (testStore: MockStore<AppState>, toastService, mockService) => {
            mockToast = toastService;
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

            fixture = TestBed.createComponent(SignupComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        }
    ));

    describe('Unit test cases for ', () => {
        describe('basic test cases for component', () => {
            it('should component exists', () => {
                expect(component).toBeTruthy();
            });
        });

        describe('validatePwd method', () => {
            it('should set this.showPwdHint value to false if validatePwd method is invoked', () => {
                component.validatePwd('myPassword');

                expect(component.showPwdHint).toBeTruthy();
            });
        });

        describe('signupWithPasswd method', () => {
            let spyToast;
            let spyDispatch;

            beforeEach(() => {
                spyToast = spyOn(mockToast, 'errorToast');
                spyDispatch = spyOn(store, 'dispatch');
            });

            it('should call errorToast function if password is invalid', () => {
                fixture.componentInstance.signUpWithPasswdForm.controls[
                    'password'
                ].setValue('123456');

                component.SignupWithPasswd(
                    fixture.componentInstance.signUpWithPasswdForm
                );

                expect(spyToast).toHaveBeenCalled();
            });

            it('should dispatch SignupWithPasswdRequest login action function if SignupWithPasswd is invoked', () => {
                fixture.componentInstance.signUpWithPasswdForm.controls[
                    'password'
                ].setValue('Admin123');

                component.SignupWithPasswd(
                    fixture.componentInstance.signUpWithPasswdForm
                );

                expect(spyDispatch).toHaveBeenCalled();
            });
        });

        describe('generateRandomBanner method', () => {
            it('should set value of selectedBanner if generateRandomBanner method is invoked', () => {
                component.generateRandomBanner();

                expect(component.selectedBanner).toBeDefined();
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

        describe('getOtp method', () => {
            let spyDispatch;

            beforeEach(() => {
                spyDispatch = spyOn(store, 'dispatch');
            });

            it('should dispatch SignupWithMobileRequest login action if getOtp method is invoked', () => {
                component.getOtp('9874563210', '91');

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

        describe('verifyEmail method', () => {
            let spyDispatch;

            beforeEach(() => {
                spyDispatch = spyOn(store, 'dispatch');
            });

            it('should dispatch "loginAction.SignupWithEmailRequest"', () => {
                component.VerifyEmail('test@example.com', '1234');

                expect(spyDispatch).toHaveBeenCalled();
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
    });

    describe('UI test cases for', () => {
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

        describe('hideEmailModal method', () => {
            let spyEmailVerifyModalFn;
            let spyDispatch;

            beforeEach(() => {
                spyEmailVerifyModalFn = spyOn(component.emailVerifyModal, 'hide');
                spyDispatch = spyOn(store, 'dispatch');
            });

            it('should call hide method of spyEmailVerifyModal object if hideEmailModal is invoked', () => {
                component.hideEmailModal();

                expect(spyEmailVerifyModalFn).toHaveBeenCalled();
            });

            it('should dispatch ResetSignupWithEmailState login action if hideEmailModal is invoked', () => {
                component.hideEmailModal();

                expect(spyDispatch).toHaveBeenCalled();
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
