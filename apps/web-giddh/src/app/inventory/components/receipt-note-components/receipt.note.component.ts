import { Observable, of as observableOf, ReplaySubject, Subscription, combineLatest } from 'rxjs';

import { distinctUntilChanged, filter, take, takeUntil, auditTime } from 'rxjs/operators';
import { AppState } from '../../../store';
import { Store, select } from '@ngrx/store';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild, OnChanges, ElementRef, Output, EventEmitter, NgZone, ChangeDetectorRef, SimpleChange, SimpleChanges, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarAction } from '../../../actions/inventory/sidebar.actions';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { InventoryService } from '../../../services/inventory.service';
import { StockGroupRequest, StockGroupResponse } from '../../../models/api-models/Inventory';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groupsWithStocks.interface';
import { uniqueNameInvalidStringReplace, giddhRoundOff } from '../../../shared/helpers/helperFunctions';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { IForceClear, IStockUnit, VoucherTypeEnum, VoucherClass, GenericRequestForGenerateSCD, VOUCHER_TYPE_LIST, ActionTypeAfterVoucherGenerateOrUpdate, AccountDetailsClass, SalesEntryClass, SalesTransactionItemClass, SalesOtherTaxesModal, SalesAddBulkStockItems, SalesOtherTaxesCalculationMethodEnum, SalesEntryClassMulticurrency, AmountClassMulticurrency, TransactionClassMulticurrency, CodeStockMulticurrency, DiscountMulticurrency, VoucherDetailsClass, GstDetailsClass } from '../../../models/api-models/Sales';
import * as _ from 'lodash';
import { InvViewService } from "../../inv.view.service";
import { ProformaGetRequest, ProformaResponse, PreviousInvoicesVm, ProformaFilter } from '../../../models/api-models/proforma';
import { ElementViewContainerRef } from '../../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { ModalDirective, ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { DiscountListComponent } from '../../../sales/discount-list/discountList.component';
import { TaxControlComponent } from '../../../theme/tax-control/tax-control.component';
import { ShSelectComponent } from '../../../theme/ng-virtual-select/sh-select.component';
import { IContentCommon } from '../../../models/api-models/Invoice';
import { TaxResponse, StateDetailsRequest } from '../../../models/api-models/Company';
import { INameUniqueName } from '../../../models/interfaces/nameUniqueName.interface';
import { AccountResponseV2, AddAccountRequest, UpdateAccountRequest } from '../../../models/api-models/Account';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { IFlattenAccountsResultItem } from '../../../models/interfaces/flattenAccountsResultItem.interface';
import * as moment from 'moment/moment';
import { UploaderOptions, UploadInput, UploadOutput } from 'ngx-uploader';
import { ReciptResponse, InvoiceReceiptFilter } from '../../../models/api-models/recipt';
import { AccountService } from '../../../services/account.service';
import { SalesActions } from '../../../actions/sales/sales.action';
import { CompanyActions } from '../../../actions/company.actions';
import { LedgerActions } from '../../../actions/ledger/ledger.actions';
import { SalesService } from '../../../services/sales.service';
import { ToasterService } from '../../../services/toaster.service';
import { GeneralActions } from '../../../actions/general/general.actions';
import { InvoiceActions } from '../../../actions/invoice/invoice.actions';
import { SettingsDiscountActions } from '../../../actions/settings/discount/settings.discount.action';
import { InvoiceReceiptActions } from '../../../actions/invoice/receipt/receipt.actions';
import { SettingsProfileActions } from '../../../actions/settings/profile/settings.profile.action';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ProformaActions } from '../../../actions/proforma/proforma.actions';
import { LedgerService } from '../../../services/ledger.service';
import { GeneralService } from '../../../services/general.service';
import { LoaderService } from '../../../loader/loader.service';
import { LoaderState } from '../../../loader/loader';
import { cloneDeep, isEqual } from '../../../lodash-optimized';
import { SalesShSelectComponent } from '../../../theme/sales-ng-virtual-select/sh-select.component';
import { InvoiceSetting } from '../../../models/interfaces/invoice.setting.interface';
import { EMAIL_REGEX_PATTERN } from '../../../shared/helpers/universalValidations';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { Configuration } from '../../../app.constant';
import { LEDGER_API } from '../../../services/apiurls/ledger.api';
import { LedgerDiscountClass } from '../../../models/api-models/SettingsDiscount';
import { LedgerResponseDiscountClass } from '../../../models/api-models/Ledger';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
    selector: 'receipt-note',  // <home></home>
    templateUrl: './receipt.note.component.html',
    styleUrls: ['./receipt.note.component.scss'],
    animations: [
        trigger('slideInOut', [
            state('in', style({
                transform: 'translate3d(0, 0, 0)'
            })),
            state('out', style({
                transform: 'translate3d(100%, 0, 0)'
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
        ]),
    ]
})

export class ReceiptNoteComponent {
    public asideMenuState: string = 'out';
    public selectedAction: string = 'Multiple Products';
    public sendersOptions = [{
        label: 'Shalinee', value: 'Shalinee'
    }, {
        label: 'Shalinee12', value: 'Shalinee12'
    }];

    public gstinOptions = [
        { label: 'GSTIN1', value: 'GSTIN1' },
        { label: 'GSTIN2', value: 'GSTIN1' }
    ];

    public selectRefDoc = [
        { label: 'Ref doc 1', vaue: 'Ref doc 1' },
        { label: 'Ref doc 2', vaue: 'Ref doc 2' }
    ];

    public recGstinOptions = [
        { label: '23KSJDOS48293K', value: '23KSJDOS48293K' },
        { label: '23KSJDOS48293S', value: '23KSJDOS48293S' }
    ];
    public selectRecivers = [
        { label: 'Shalinee01', value: 'Shalinee01' },
        { label: 'Shalinee02', value: 'Shalinee02' }
    ];

    public hideSenderReciverDetails = false;
    constructor(private _router: Router, private invViewService: InvViewService) {

    }
    public backToInv() {
        this.invViewService.setActiveView(null, null);
        this._router.navigate(['/pages/inventory']);
    }

    public toggleBodyClass() {
        if (this.asideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    public toggleAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.asideMenuState = this.asideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }
}

