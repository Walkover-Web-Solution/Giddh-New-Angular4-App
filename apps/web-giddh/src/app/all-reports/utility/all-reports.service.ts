import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpWrapperService } from '../../services/http-wrapper.service';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { GiddhErrorHandler } from '../../services/catchManager/catchmanger';
import { GeneralService } from '../../services/general.service';
import { IServiceConfigArgs, ServiceConfig } from '../../services/service.config';
import { ALL_REPORTS_API } from './all-reports.api';
import { AllReportsResponse, ReportItem } from './all-reports.model';

@Injectable({
    providedIn: 'root'
})
export class AllReportsService {
    private errorHandler = inject(GiddhErrorHandler);
    private http = inject(HttpWrapperService);
    private generalService = inject(GeneralService);
    private config = inject<IServiceConfigArgs>(ServiceConfig);

    public res = this.getAllReports();

    getAllReportsData() {
        const response = {
                "status": "success",
                "body": {
                    "reportList": [
                        {
                            "name": "SALES_REGISTER_BY_DURATION",
                            "uniqueName": "/pages/reports/sales-register?groupBy=duration&required=groupBy"
                        },
                        {
                            "name": "SALES_REGISTER_BY_SALES_PERSON",
                            "uniqueName": "/pages/reports/sales-register?groupBy=salesPerson&required=groupBy"
                        },
                        {
                            "name": "SALES_REGISTER_BY_STATE",
                            "uniqueName": "/pages/reports/sales-register?groupBy=state&required=groupBy"
                        },
                        {
                            "name": "SALES_REGISTER_BY_COUNTRY",
                            "uniqueName": "/pages/reports/sales-register?groupBy=country&required=groupBy"
                        },
                        {
                            "name": "AGING_REPORT_SALES",
                            "uniqueName": "/pages/contact/sales?tab=sales-aging-report&tabIndex=1"
                        },
                        {
                            "name": "PURCHASE_REGISTER_BY_DURATION",
                            "uniqueName": "/pages/reports/purchase-register?groupBy=duration"
                        },
                        {
                            "name": "PURCHASE_REGISTER_BY_SALES_PERSON",
                            "uniqueName": "/pages/reports/purchase-register?groupBy=salesPerson"
                        },
                        {
                            "name": "PURCHASE_REGISTER_BY_STATE",
                            "uniqueName": "/pages/reports/purchase-register?groupBy=state"
                        },
                        {
                            "name": "PURCHASE_REGISTER_BY_COUNTRY",
                            "uniqueName": "/pages/reports/purchase-register?groupBy=country"
                        },
                        {
                            "name": "AGING_REPORT_PURCHASE",
                            "uniqueName": "/pages/contact/purchase?tab=purchase-aging-report&tabIndex=1"
                        },
                        {
                            "name": "TRIAL_BALANCE",
                            "uniqueName": "/pages/trial-balance-and-profit-loss?tab=trial-balance&tabIndex=0"
                        },
                        {
                            "name": "PROFIT_AND_LOSS",
                            "uniqueName": "/pages/trial-balance-and-profit-loss?tab=profit-loss&tabIndex=1"
                        },
                        {
                            "name": "BALANCE_SHEET",
                            "uniqueName": "/pages/trial-balance-and-profit-loss?tab=balance-sheet&tabIndex=2"
                        },
                        {
                            "name": "GST",
                            "uniqueName": "/pages/gstfiling"
                        },
                        {
                            "name": "COLUMNAR_REPORT",
                            "uniqueName": "/pages/reports/monthly-columnar-report"
                        },
                        {
                            "name": "RATE_WISE",
                            "uniqueName": "/pages/settings/reports/rate-wise"
                        },
                        {
                            "name": "ACCOUNT_WISE",
                            "uniqueName": "/pages/settings/reports/account-wise"
                        },
                        {
                            "name": "VAT_REPORT",
                            "uniqueName": "/pages/vat-report"
                        },
                        {
                            "name": "VAT_OBLIGATION",
                            "uniqueName": "/pages/vat-report/obligations"
                        },
                        {
                            "name": "VAT_PAYMENT",
                            "uniqueName": "/pages/vat-report/payments"
                        },
                        {
                            "name": "VAT_LIABILITIES",
                            "uniqueName": "/pages/vat-report/liabilities"
                        },
                        {
                            "name": "DAYBOOK",
                            "uniqueName": "/pages/daybook"
                        },
                        {
                            "name": "CASH_FLOW_STATEMENT",
                            "uniqueName": "/pages/reports/cash-flow-statement"
                        },
                        {
                            "name": "INVENTORY_STOCK_WISE",
                            "uniqueName": "/pages/inventory/v2/reports/product/stock"
                        },
                        {
                            "name": "INVENTORY_GROUP_WISE",
                            "uniqueName": "/pages/inventory/v2/reports/product/group"
                        },
                        {
                            "name": "INVENTORY_VARIANT_WISE",
                            "uniqueName": "/pages/inventory/v2/reports/product/variant"
                        },
                        {
                            "name": "INVENTORY_PRODUCT_TRANSACTION",
                            "uniqueName": "/pages/inventory/v2/reports/product/transaction"
                        },
                        {
                            "name": "INVENTORY_SERVICE_STOCK",
                            "uniqueName": "/pages/inventory/v2/reports/service/stock"
                        },
                        {
                            "name": "INVENTORY_SERVICE_GROUP",
                            "uniqueName": "/pages/inventory/v2/reports/service/group"
                        },
                        {
                            "name": "INVENTORY_SERVICE_VARIANT",
                            "uniqueName": "/pages/inventory/v2/reports/service/variant"
                        },
                        {
                            "name": "INVENTORY_SERVICE_TRANSACTION",
                            "uniqueName": "/pages/inventory/v2/reports/service/transaction"
                        },
                        {
                            "name": "INVENTORY_FIXEDASSETS_STOCK",
                            "uniqueName": "/pages/inventory/v2/reports/fixedassets/stock"
                        },
                        {
                            "name": "INVENTORY_FIXEDASSETS_GROUP",
                            "uniqueName": "/pages/inventory/v2/reports/fixedassets/group"
                        },
                        {
                            "name": "INVENTORY_FIXEDASSETS_VARIANT",
                            "uniqueName": "/pages/inventory/v2/reports/fixedassets/variant"
                        },
                        {
                            "name": "INVENTORY_FIXEDASSETS_TRANSACTION",
                            "uniqueName": "/pages/inventory/v2/reports/fixedassets/transaction"
                        },
                        {
                            "name": "INVENTORY_PRICE_CUSTOMER_WISE",
                            "uniqueName": "/pages/inventory/v2/price/customer-wise"
                        },
                        {
                            "name": "INVENTORY_PRICE_VENDOR_WISE",
                            "uniqueName": "/pages/inventory/v2/price/vendor-wise"
                        },
                        {
                            "name": "INVENTORY_PRODUCT_BULK_STOCK",
                            "uniqueName": "/pages/inventory/v2/product/bulk-stock-edit"
                        },
                        {
                            "name": "INVENTORY_BRANCH_TRANSFER",
                            "uniqueName": "/pages/inventory/v2/branch-transfer/list"
                        }
                    ],
                    "favoriteReportList": [
                        {
                            "name": "INVENTORY_MANUFACTURING",
                            "uniqueName": "/pages/inventory/v2/manufacturing/list"
                        },
                        {
                            "name": "INVENTORY_FIXEDASSETS_BULK_STOCK",
                            "uniqueName": "/pages/inventory/v2/fixedassets/bulk-stock-edit"
                        },
                        {
                            "name": "INVENTORY_SERVICE_BULK_STOCK",
                            "uniqueName": "/pages/inventory/v2/service/bulk-stock-edit"
                        }
                    ],
                    "filterOption": [
                        {
                            "name": "Sales",
                            "reports": [
                                "SALES_REGISTER_BY_DURATION",
                                "SALES_REGISTER_BY_SALES_PERSON",
                                "SALES_REGISTER_BY_STATE",
                                "SALES_REGISTER_BY_COUNTRY"
                            ]
                        },
                        {
                            "name": "Purchase",
                            "reports": [
                                "PURCHASE_REGISTER_BY_DURATION",
                                "PURCHASE_REGISTER_BY_SALES_PERSON",
                                "PURCHASE_REGISTER_BY_STATE",
                                "PURCHASE_REGISTER_BY_COUNTRY"
                            ]
                        },
                        {
                            "name": "Customers",
                            "reports": [
                                "AGING_REPORT_SALES",
                                "AGING_REPORT_PURCHASE"
                            ]
                        },
                        {
                            "name": "Financial",
                            "reports": [
                                "TRIAL_BALANCE",
                                "PROFIT_AND_LOSS",
                                "BALANCE_SHEET",
                                "GST",
                                "COLUMNAR_REPORT",
                                "RATE_WISE",
                                "ACCOUNT_WISE"
                            ]
                        },
                        {
                            "name": "Accounting",
                            "reports": [
                                "DAYBOOK"
                            ]
                        },
                        {
                            "name": "Inventory",
                            "reports": [
                                "INVENTORY_STOCK_WISE",
                                "INVENTORY_GROUP_WISE",
                                "INVENTORY_VARIANT_WISE",
                                "INVENTORY_PRODUCT_TRANSACTION",
                                "INVENTORY_SERVICE_STOCK",
                                "INVENTORY_SERVICE_GROUP",
                                "INVENTORY_SERVICE_VARIANT",
                                "INVENTORY_SERVICE_TRANSACTION",
                                "INVENTORY_FIXEDASSETS_STOCK",
                                "INVENTORY_FIXEDASSETS_GROUP",
                                "INVENTORY_FIXEDASSETS_VARIANT",
                                "INVENTORY_FIXEDASSETS_TRANSACTION",
                                "INVENTORY_PRICE_CUSTOMER_WISE",
                                "INVENTORY_PRICE_VENDOR_WISE",
                                "INVENTORY_PRODUCT_BULK_STOCK",
                                "INVENTORY_SERVICE_BULK_STOCK",
                                "INVENTORY_FIXEDASSETS_BULK_STOCK",
                                "INVENTORY_BRANCH_TRANSFER",
                                "INVENTORY_MANUFACTURING"
                            ]
                        },
                        {
                            "name": "Cash Flow",
                            "reports": [
                                "CASH_FLOW_STATEMENT"
                            ]
                        }
                    ]
                }
            };
        return response;
    }

    /**
     * Fetches all reports and favorite reports list.
     */
    public getAllReports(): Observable<BaseResponse<AllReportsResponse, any>> {
        const url = this.config.apiUrl + ALL_REPORTS_API.GET_ALL
            .replace(':companyUniqueName', encodeURIComponent(this.generalService.companyUniqueName));
        return this.http.get(url).pipe(
            map((res) => this.res as BaseResponse<AllReportsResponse, any>),
            catchError((e) => this.errorHandler.HandleCatch<AllReportsResponse, any>(e, null, ''))
        );
    }

    /**
     * Saves the favorite reports list.
     */
    public saveFavoriteReports(favorites: ReportItem[]): Observable<BaseResponse<string, ReportItem[]>> {
        const url = this.config.apiUrl + ALL_REPORTS_API.SAVE_FAVORITES
            .replace(':companyUniqueName', encodeURIComponent(this.generalService.companyUniqueName));
        return this.http.post(url, favorites).pipe(
            map((res) => res as BaseResponse<string, ReportItem[]>),
            catchError((e) => this.errorHandler.HandleCatch<string, ReportItem[]>(e, favorites, ''))
        );
    }
}
