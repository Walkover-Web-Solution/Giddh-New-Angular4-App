import { Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Store } from "@ngrx/store";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { BaseResponse } from "../../models/api-models/BaseResponse";
import { CustomTemplateResponse } from "../../models/api-models/Invoice";
import { IDiscountList } from "../../models/api-models/SettingsDiscount";
import { ProformaFilter } from "../../models/api-models/proforma";
import { InvoiceReceiptFilter } from "../../models/api-models/recipt";
import { InvoiceSetting } from "../../models/interfaces/invoice.setting.interface";
import { SettingsDiscountService } from "../../services/settings.discount.service";
import { ToasterService } from "../../services/toaster.service";
import { VoucherService } from "../../services/voucher.service";
import { AppState } from "../../store";
import { LedgerService } from "../../services/ledger.service";
import { IVariant } from "../../models/api-models/Ledger";
import { CommonService } from "../../services/common.service";
import { LastVouchersResponse } from "../../models/api-models/Voucher";
import { AccountService } from "../../services/account.service";
import { SearchService } from "../../services/search.service";

export interface VoucherState {
    isLoading: boolean;
    createUpdateInProgress: boolean;
    deleteAttachmentInProgress: boolean;
    deleteAttachmentIsSuccess: boolean;
    getLastVouchersInProgress: boolean;
    discountsList: IDiscountList[];
    invoiceSettings: InvoiceSetting;
    lastVouchers: LastVouchersResponse;
    createdTemplates: CustomTemplateResponse[];
    stockVariants: any;
    barcodeData: any;
    exchangeRate: number;
    briefAccounts: any[];
    accountDetails: any;
    countryData: any;
    vendorPurchaseOrders: any[];
    linkedPoOrders: any[];
    particularDetails: any;
    voucherDetails: any;
}

const DEFAULT_STATE: VoucherState = {
    isLoading: false,
    createUpdateInProgress: null,
    deleteAttachmentInProgress: null,
    deleteAttachmentIsSuccess: null,
    getLastVouchersInProgress: null,
    discountsList: null,
    invoiceSettings: null,
    lastVouchers: null,
    createdTemplates: null,
    stockVariants: null,
    barcodeData: null,
    exchangeRate: null,
    briefAccounts: null,
    accountDetails: null,
    countryData: null,
    vendorPurchaseOrders: null,
    linkedPoOrders: null,
    particularDetails: null,
    voucherDetails: null
};

@Injectable()
export class VoucherComponentStore extends ComponentStore<VoucherState> {

    constructor(
        private store: Store<AppState>,
        private toaster: ToasterService,
        private settingsDiscountService: SettingsDiscountService,
        private voucherService: VoucherService,
        private ledgerService: LedgerService,
        private commonService: CommonService,
        private accountService: AccountService,
        private searchService: SearchService
    ) {
        super(DEFAULT_STATE);
    }

    public isLoading$ = this.select((state) => state.isLoading);
    public createUpdateInProgress$ = this.select((state) => state.createUpdateInProgress);
    public getLastVouchersInProgress$ = this.select((state) => state.getLastVouchersInProgress);
    public discountsList$ = this.select((state) => state.discountsList);
    public invoiceSettings$ = this.select((state) => state.invoiceSettings);
    public createdTemplates$ = this.select((state) => state.createdTemplates);
    public lastVouchers$ = this.select((state) => state.lastVouchers);
    public stockVariants$ = this.select((state) => state.stockVariants);
    public exchangeRate$ = this.select((state) => state.exchangeRate);
    public briefAccounts$ = this.select((state) => state.briefAccounts);
    public accountDetails$ = this.select((state) => state.accountDetails);
    public countryData$ = this.select((state) => state.countryData);
    public vendorPurchaseOrders$ = this.select((state) => state.vendorPurchaseOrders);
    public linkedPoOrders$ = this.select((state) => state.linkedPoOrders);
    public particularDetails$ = this.select((state) => state.particularDetails);
    public voucherDetails$ = this.select((state) => state.voucherDetails);

    public companyProfile$: Observable<any> = this.select(this.store.select(state => state.settings.profile), (response) => response);
    public activeCompany$: Observable<any> = this.select(this.store.select(state => state.session.activeCompany), (response) => response);
    public onboardingForm$: Observable<any> = this.select(this.store.select(state => state.common.onboardingform), (response) => response);
    public isTcsTdsApplicable$: Observable<any> = this.select(this.store.select(state => state.company), (response) => response.isTcsTdsApplicable);
    public companyTaxes$: Observable<any> = this.select(this.store.select(state => state.company.taxes), (response) => response);
    public warehouseList$: Observable<any> = this.select(this.store.select(state => state.warehouse.warehouses), (response) => response);
    public branchList$: Observable<any> = this.select(this.store.select(state => state.settings.branches), (response) => response);
    public hasSavedChanges$: Observable<any> = this.select(this.store.select(state => state.groupwithaccounts.hasUnsavedChanges), (response) => response);
    public newAccountDetails$: Observable<any> = this.select(this.store.select(state => state.sales.createdAccountDetails), (response) => response);
    public updatedAccountDetails$: Observable<any> = this.select(this.store.select(state => state.sales.updatedAccountDetails), (response) => response);
    public universalDate$: Observable<any> = this.select(this.store.select(state => state.session.applicationDate), (response) => response);

    readonly getDiscountsList = this.effect((data: Observable<void>) => {
        return data.pipe(
            switchMap(() => {
                return this.settingsDiscountService.GetDiscounts().pipe(
                    tapResponse(
                        (res: BaseResponse<IDiscountList[], any>) => {
                            return this.patchState({
                                discountsList: res?.body ?? []
                            });
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                discountsList: []
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly getInvoiceSettings = this.effect((data: Observable<void>) => {
        return data.pipe(
            switchMap(() => {
                this.patchState({ isLoading: true });
                return this.voucherService.getInvoiceSettings().pipe(
                    tapResponse(
                        (res: BaseResponse<InvoiceSetting, any>) => {
                            return this.patchState({
                                isLoading: false,
                                invoiceSettings: res?.body ?? null
                            });
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                isLoading: false,
                                invoiceSettings: null
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly getPreviousVouchers = this.effect((data: Observable<{ model: InvoiceReceiptFilter, type: string }>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ getLastVouchersInProgress: true });
                return this.voucherService.getAllVouchers(req.model, req.type).pipe(
                    tapResponse(
                        (res: BaseResponse<LastVouchersResponse, any>) => {
                            return this.patchState({
                                getLastVouchersInProgress: false,
                                lastVouchers: res?.body ?? {}
                            });
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                getLastVouchersInProgress: false,
                                lastVouchers: null
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly getPreviousProformaEstimates = this.effect((data: Observable<{ model: ProformaFilter, type: string }>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ getLastVouchersInProgress: true });
                return this.voucherService.getAllProformaEstimate(req.model, req.type).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            return this.patchState({
                                getLastVouchersInProgress: false,
                                lastVouchers: res?.body ?? {}
                            });
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                getLastVouchersInProgress: false,
                                lastVouchers: {}
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly getCreatedTemplates = this.effect((data: Observable<string>) => {
        return data.pipe(
            switchMap((req) => {
                return this.voucherService.getAllCreatedTemplates(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            return this.patchState({
                                createdTemplates: res?.body ?? []
                            });
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                createdTemplates: []
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly getStockVariants = this.effect((data: Observable<{ q: any, index: number }>) => {
        return data.pipe(
            switchMap((req) => {
                return this.ledgerService.loadStockVariants(req.q).pipe(
                    tapResponse(
                        (res: Array<IVariant>) => {
                            return this.patchState({
                                stockVariants: { results: res?.map(res => { return { label: res.name, value: res.uniqueName } }) ?? [], entryIndex: req.index }
                            });
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                stockVariants: { results: [], entryIndex: req.index }
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly getBarcodeData = this.effect((data: Observable<{ barcodeValue: string, params: any }>) => {
        return data.pipe(
            switchMap((req) => {
                return this.commonService.getBarcodeScanData(req.barcodeValue, req.params).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            return this.patchState({
                                barcodeData: res?.body ?? {}
                            });
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                barcodeData: {}
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly deleteAttachment = this.effect((data: Observable<string>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ deleteAttachmentInProgress: true, deleteAttachmentIsSuccess: false });
                return this.ledgerService.removeAttachment(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            return this.patchState({
                                deleteAttachmentInProgress: false,
                                deleteAttachmentIsSuccess: true
                            });
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                deleteAttachmentInProgress: false,
                                deleteAttachmentIsSuccess: false
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly getExchangeRate = this.effect((data: Observable<{ fromCurrency: string, toCurrency: string, date: string }>) => {
        return data.pipe(
            switchMap((req) => {
                return this.ledgerService.GetCurrencyRateNewApi(req.fromCurrency, req.toCurrency, req.date).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            return this.patchState({
                                exchangeRate: res?.body ?? 1
                            });
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                exchangeRate: 1
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly getBriefAccounts = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                return this.voucherService.getBriefAccounts(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            return this.patchState({
                                briefAccounts: res?.body?.results?.map(res => { return { label: res.name, value: res.uniqueName, additional: { currency: res?.currency } } }) ?? []
                            });
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                briefAccounts: []
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly getAccountDetails = this.effect((data: Observable<string>) => {
        return data.pipe(
            switchMap((req) => {
                return this.accountService.GetAccountDetailsV2(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            return this.patchState({
                                accountDetails: res?.body ?? {}
                            });
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                accountDetails: {}
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly getCountryStates = this.effect((data: Observable<string>) => {
        return data.pipe(
            switchMap((req) => {
                return this.commonService.getCountryStates(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            return this.patchState({
                                countryData: res?.body ?? {}
                            });
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                countryData: {}
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly getVendorPurchaseOrders = this.effect((data: Observable<{ request: any, payload: any, commonLocaleData: any }>) => {
        return data.pipe(
            switchMap((req) => {
                return this.voucherService.getVendorPurchaseOrders(req.request, req.payload).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            let vendorPurchaseOrders = [];
                            let linkedPoOrders = [];

                            res.body.forEach(item => {
                                let pending = [];
                                let totalPending = 0;

                                if (item.pendingDetails.stocks) {
                                    pending.push(item.pendingDetails.stocks + ((item.pendingDetails.stocks === 1) ? " " + req.commonLocaleData?.app_product : " " + req.commonLocaleData?.app_products));
                                    totalPending += item.pendingDetails.stocks;
                                }
                                if (item.pendingDetails.services) {
                                    pending.push(item.pendingDetails.services + ((item.pendingDetails.services === 1) ? " " + req.commonLocaleData?.app_service : " " + req.commonLocaleData?.app_services));
                                    totalPending += item.pendingDetails.services;
                                }

                                vendorPurchaseOrders.push({ label: item.number, value: item?.uniqueName, additional: { grandTotal: item.pendingDetails.grandTotal, pending: pending.join(", "), totalPending: totalPending } });

                                linkedPoOrders[item?.uniqueName] = [];
                                linkedPoOrders[item?.uniqueName]['voucherNumber'] = item.number;
                                linkedPoOrders[item?.uniqueName]['items'] = [];
                            });

                            return this.patchState({
                                vendorPurchaseOrders: vendorPurchaseOrders,
                                linkedPoOrders: linkedPoOrders
                            });
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                vendorPurchaseOrders: [],
                                linkedPoOrders: []
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly getParticularDetails = this.effect((data: Observable<{ accountUniqueName: string, payload: any, entryIndex: number }>) => {
        return data.pipe(
            switchMap((req) => {
                return this.searchService.loadDetails(req.accountUniqueName, req.payload).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            return this.patchState({
                                particularDetails: { body: res?.body ?? {}, entryIndex: req.entryIndex }
                            });
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                particularDetails: { body: {}, entryIndex: req.entryIndex }
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly getVoucherDetails = this.effect((data: Observable<{ isCopy: boolean, accountUniqueName: string, payload: any }>) => {
        return data.pipe(
            switchMap((req) => {
                return this.voucherService.getVoucherDetails(req.accountUniqueName, req.payload).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            return this.patchState({
                                voucherDetails: res?.body ?? {}
                            });
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                voucherDetails: {}
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly printVoucher = this.effect((pdfContainer$: Observable<any>) => {
        return pdfContainer$.pipe(
            switchMap((pdfContainer) => {
                const window = pdfContainer?.nativeElement?.contentWindow;
                if (window) {
                    window.focus();
                    setTimeout(() => {
                        window.print();
                    }, 200);
                }
                return EMPTY;
            })
        );
    });

}