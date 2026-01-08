import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { tapResponse } from "@ngrx/operators";
import { ToasterService } from "../../services/toaster.service";
import { catchError, EMPTY, Observable, switchMap } from "rxjs";
import { EmailForwardingService } from "../services/email-forwarding.service";
import { 
    EmailForwardingRequest, 
    EmailForwardingResponse, 
} from "../models/email-forwarding.model";
import { SalesService } from "../../services/sales.service";
import { BaseResponse } from "../../models/api-models/BaseResponse";

export interface BankStatementState {
    emailForwardingList: EmailForwardingResponse[] | null;
    emailForwardingDetails: EmailForwardingResponse | null;
    generatedEmail: string | null;
    isLoading: boolean;
    isEmailForwardingDetailsLoading: boolean;
    isGeneratingEmail: boolean;
    createUpdateEmailForwardingIsSuccess: any;
    deleteEmailForwardingIsSuccess: boolean;
    accountSearch: any;
}

const DEFAULT_STATE: BankStatementState = {
    emailForwardingList: null,
    emailForwardingDetails: null,
    generatedEmail: null,
    isLoading: false,
    isEmailForwardingDetailsLoading: false,
    isGeneratingEmail: false,
    createUpdateEmailForwardingIsSuccess: null,
    deleteEmailForwardingIsSuccess: false,
    accountSearch: null
};

@Injectable({
    providedIn: 'root'
})
export class EmailForwardingComponentStore extends ComponentStore<BankStatementState> {

    constructor(
        private toaster: ToasterService,
        private emailForwardingService: EmailForwardingService,
        private salesService: SalesService
    ) {
        super(DEFAULT_STATE);
    }

    // Selectors
    public emailForwardingList$ = this.select((state) => state.emailForwardingList);
    public emailForwardingDetails$ = this.select((state) => state.emailForwardingDetails);
    public generatedEmail$ = this.select((state) => state.generatedEmail);
    public isLoading$ = this.select((state) => state.isLoading);
    public isEmailForwardingDetailsLoading$ = this.select((state) => state.isEmailForwardingDetailsLoading);
    public isGeneratingEmail$ = this.select((state) => state.isGeneratingEmail);
    public createUpdateEmailForwardingIsSuccess$ = this.select((state) => state.createUpdateEmailForwardingIsSuccess);
    public deleteEmailForwardingIsSuccess$ = this.select((state) => state.deleteEmailForwardingIsSuccess);
    public accountSearch$ = this.select((state) => state.accountSearch);

    /**
     * Generate email communication
     *
     * @memberof EmailForwardingComponentStore
     */
    readonly generateEmail = this.effect((data: Observable<void>) => {
        return data.pipe(
            switchMap(() => {
                this.patchState({ isGeneratingEmail: true, generatedEmail: null });
                return this.emailForwardingService.generateEmail().pipe(
                    tapResponse(
                        (res: any) => {
                            if (res?.status === "success") {
                                // res?.body && this.toaster.showSnackBar("success", "Email generated successfully");
                                return this.patchState({ 
                                    generatedEmail: res.body, 
                                    isGeneratingEmail: false 
                                });
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res.message);
                                return this.patchState({ 
                                    generatedEmail: null, 
                                    isGeneratingEmail: false 
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({ 
                                generatedEmail: null, 
                                isGeneratingEmail: false 
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * Get all email forwarding configurations
     *
     * @memberof EmailForwardingComponentStore
     */
    readonly getAllEmailForwarding = this.effect((data: Observable<void>) => {
        return data.pipe(
            switchMap(() => {
                this.patchState({ emailForwardingList: null, isLoading: true });
                return this.emailForwardingService.getAllEmailForwarding().pipe(
                    tapResponse(
                        (res: any) => {
                            if (res?.status === "success" && res?.body) {
                                return this.patchState({ 
                                    emailForwardingList: res.body, 
                                    isLoading: false 
                                });
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res.message);
                                return this.patchState({ 
                                    emailForwardingList: undefined, 
                                    isLoading: false 
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({ 
                                emailForwardingList: [], 
                                isLoading: false 
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * Get email forwarding details by unique name
     *
     * @memberof EmailForwardingComponentStore
     */
    readonly getEmailForwardingDetails = this.effect((data: Observable<string>) => {
        return data.pipe(
            switchMap((uniqueName) => {
                this.patchState({ emailForwardingDetails: null, isEmailForwardingDetailsLoading: true });
                return this.emailForwardingService.getEmailForwarding(uniqueName).pipe(
                    tapResponse(
                        (res: any) => {
                            if (res?.status === "success" && res?.body) {
                                return this.patchState({ 
                                    emailForwardingDetails: res.body, 
                                    isEmailForwardingDetailsLoading: false 
                                });
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res.message);
                                return this.patchState({ 
                                    emailForwardingDetails: undefined, 
                                    isEmailForwardingDetailsLoading: false 
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({ 
                                emailForwardingDetails: null, 
                                isEmailForwardingDetailsLoading: false 
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * Create email forwarding configuration
     *
     * @memberof EmailForwardingComponentStore
     */
    readonly createEmailForwarding = this.effect((data: Observable<EmailForwardingRequest>) => {
        return data.pipe(
            switchMap((model) => {
                this.patchState({ createUpdateEmailForwardingIsSuccess: null });
                return this.emailForwardingService.createEmailForwarding(model).pipe(
                    tapResponse(
                        (res: any) => {
                            if (res?.status === "success") {
                                this.toaster.showSnackBar("success", "Email forwarding configuration created successfully");
                                return this.patchState({ createUpdateEmailForwardingIsSuccess: res.body });
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res.message);
                                return this.patchState({ createUpdateEmailForwardingIsSuccess: false });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({ createUpdateEmailForwardingIsSuccess: false });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * Update email forwarding configuration
     *
     * @memberof EmailForwardingComponentStore
     */
    readonly updateEmailForwarding = this.effect((data: Observable<{model: EmailForwardingRequest, uniqueName: string}>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ createUpdateEmailForwardingIsSuccess: null });
                return this.emailForwardingService.updateEmailForwarding(req.uniqueName, req.model).pipe(
                    tapResponse(
                        (res: any) => {
                            if (res?.status === "success") {
                                this.toaster.showSnackBar("success", "Email forwarding configuration updated successfully");
                                return this.patchState({ createUpdateEmailForwardingIsSuccess:  { uniqueName: req.uniqueName } });
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res.message);
                                return this.patchState({ createUpdateEmailForwardingIsSuccess: false });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({ createUpdateEmailForwardingIsSuccess: false });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * Delete email forwarding configuration
     *
     * @memberof EmailForwardingComponentStore
     */
    readonly deleteEmailForwarding = this.effect((data: Observable<string>) => {
        return data.pipe(
            switchMap((uniqueName) => {
                this.patchState({ deleteEmailForwardingIsSuccess: null });
                return this.emailForwardingService.deleteEmailForwarding(uniqueName).pipe(
                    tapResponse(
                        (res: any) => {
                            if (res?.status === "success") {
                                this.toaster.showSnackBar("success", "Email forwarding configuration deleted successfully");
                                return this.patchState({ deleteEmailForwardingIsSuccess: true });
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res.message);
                                return this.patchState({ deleteEmailForwardingIsSuccess: false });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({ deleteEmailForwardingIsSuccess: false });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });
    
    /**
     * Clear generated email
     *
     * @memberof EmailForwardingComponentStore
     */
    readonly clearGeneratedEmail = this.effect((data: Observable<void>) => {
        return data.pipe(
            switchMap(() => {
                this.patchState({ generatedEmail: null });
                return EMPTY;
            })
        );
    });

    /**
     * Search for bank accounts using the sales service
     *
     * @memberof EmailForwardingComponentStore
     */
    readonly searchAccount = this.effect((data: Observable<string>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ accountSearch: null });
                return this.salesService.getAccountsWithCurrency(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                this.patchState({ 
                                    accountSearch: {
                                        results: res.body?.results,
                                        count: res.body?.count
                                    }
                                });
                            } else {
                                res?.message && this.toaster.showSnackBar('error', res.message);
                                this.patchState({ accountSearch: null });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({ accountSearch: null });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });
}
