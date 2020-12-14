import {
    Component,
    TemplateRef,
    OnDestroy,
    OnInit,
    ViewChild,
    ElementRef,
    HostListener
} from "@angular/core";
import { BsModalService, BsModalRef, ModalDirective } from "ngx-bootstrap/modal";
import { InventoryService } from '../../../services/inventory.service';
import { ReplaySubject, Observable, of as observableOf } from 'rxjs';
import { Store, select, createSelector } from '@ngrx/store';
import { AppState } from '../../../store';
import { takeUntil, take } from 'rxjs/operators';
import { NewBranchTransferListResponse, NewBranchTransferListPostRequestParams, NewBranchTransferListGetRequestParams, NewBranchTransferDownloadRequest } from '../../../models/api-models/BranchTransfer';
import { branchTransferVoucherTypes, branchTransferAmountOperators } from "../../../shared/helpers/branchTransferFilters";
import { IOption } from '../../../theme/ng-select/ng-select';
import * as moment from 'moment/moment';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { GeneralService } from '../../../services/general.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ToasterService } from '../../../services/toaster.service';
import { IForceClear } from '../../../models/api-models/Sales';
import { saveAs } from "file-saver";
import { ESCAPE } from '@angular/cdk/keycodes';
import { BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import { SettingsBranchActions } from '../../../actions/settings/branch/settings.branch.action';
import { OrganizationType } from '../../../models/user-login-state';

@Component({
    selector: "new-branch-transfer-list",
    templateUrl: "./new.branch.transfer.list.component.html",
    styleUrls: ["./new.branch.transfer.component.scss"],
    animations: [
        trigger('slideInOut', [
            state('in', style({
                transform: 'translate3d(0, 0, 0);'
            })),
            state('out', style({
                transform: 'translate3d(100%, 0, 0);'
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
        ]),
    ]
})

export class NewBranchTransferListComponent implements OnInit, OnDestroy {
    @ViewChild('branchtransfertemplate', {static: true}) public branchtransfertemplate: ElementRef;
    @ViewChild('deleteBranchTransferModal', {static: true}) public deleteBranchTransferModal: ModalDirective;
    @ViewChild('senderReceiverField', {static: true}) public senderReceiverField;
    @ViewChild('warehouseNameField', {static: true}) public warehouseNameField;

    public modalRef: BsModalRef;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public activeCompany: any = {};
    public voucherTypes: IOption[] = [];
    public amountOperators: IOption[] = [];
    public branchTransferResponse: NewBranchTransferListResponse;
    public universalDate$: Observable<any>;
    public datePicker: any[] = [];
    public moment = moment;
    public asidePaneState: string = 'out';
    public asideTransferPaneState: string = 'out';
    public branchTransferMode: string = '';
    public inlineSearch: any = '';
    public timeout: any;
    public selectedBranchTransfer: any = '';
    public selectedBranchTransferType: any = '';
    public editBranchTransferUniqueName: string = '';
    public isLoading: boolean = false;
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    public clearFilter: boolean = false;
    public selectedVoucherType: string = '';

    public branchTransferGetRequestParams: NewBranchTransferListGetRequestParams = {
        from: '',
        to: '',
        page: 1,
        count: 50,
        sort: '',
        sortBy: '',
        branchUniqueName: ''
    };
    public branchTransferPostRequestParams: NewBranchTransferListPostRequestParams = {
        amountOperator: null,
        amount: null,
        voucherType: null,
        date: null,
        voucherNo: null,
        senderReceiver: null,
        warehouseName: null
    };
    public branchTransferTempPostRequestParams: any = {
        amountOperator: null,
        amount: null,
        voucherType: null
    };
    public bsConfig: Partial<BsDaterangepickerConfig> = { showWeekNumbers: false, dateInputFormat: GIDDH_DATE_FORMAT, rangeInputFormat: GIDDH_DATE_FORMAT };

    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Stores the current branch */
    public currentBranch: any = { name: '', uniqueName: '' };
    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;

    constructor(
        private _generalService: GeneralService,
        private modalService: BsModalService,
        private store: Store<AppState>,
        private inventoryService: InventoryService,
        private _toasty: ToasterService,
        private settingsBranchAction: SettingsBranchActions
    ) {
        this.store.pipe(select(p => p.settings.profile), takeUntil(this.destroyed$)).subscribe((o) => {
            if (o && !_.isEmpty(o)) {
                let companyInfo = _.cloneDeep(o);
                this.activeCompany = companyInfo;
            }
        });
        this.currentOrganizationType = this._generalService.currentOrganizationType;
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
    }

    public ngOnInit(): void {
        this.initBranchTransferListResponse();

        branchTransferVoucherTypes.map(voucherType => {
            this.voucherTypes.push({ label: voucherType.label, value: voucherType.value });
        });

        branchTransferAmountOperators.map(amountOperator => {
            this.amountOperators.push({ label: amountOperator.label, value: amountOperator.value });
        });

        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe((dateObj) => {
            if (dateObj) {
                let universalDate = _.cloneDeep(dateObj);
                this.datePicker = [moment(universalDate[0], GIDDH_DATE_FORMAT).toDate(), moment(universalDate[1], GIDDH_DATE_FORMAT).toDate()];

                this.branchTransferGetRequestParams.from = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.branchTransferGetRequestParams.to = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);
            }
        });
        this.store.pipe(
            select(state => state.session.companies), take(1)
        ).subscribe(companies => {
            companies = companies || [];
            this.activeCompany = companies.find(company => company.uniqueName === this._generalService.companyUniqueName);
        });
        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        this.currentCompanyBranches$.subscribe(response => {
            if (response && response.length) {
                this.currentCompanyBranches = response.map(branch => ({
                    label: branch.alias,
                    value: branch.uniqueName,
                    name: branch.name,
                    parentBranch: branch.parentBranch
                }));
                this.currentCompanyBranches.unshift({
                    label: this.activeCompany ? this.activeCompany.nameAlias || this.activeCompany.name : '',
                    name: this.activeCompany ? this.activeCompany.name : '',
                    value: this.activeCompany ? this.activeCompany.uniqueName : '',
                    isCompany: true
                });
                let currentBranchUniqueName;
                if (this._generalService.currentOrganizationType === OrganizationType.Branch) {
                    currentBranchUniqueName = this._generalService.currentBranchUniqueName;
                    this.currentBranch = _.cloneDeep(response.find(branch => branch.uniqueName === currentBranchUniqueName));
                } else {
                    currentBranchUniqueName = this.activeCompany ? this.activeCompany.uniqueName : '';
                    this.currentBranch = {
                        name: this.activeCompany ? this.activeCompany.name : '',
                        alias: this.activeCompany ? this.activeCompany.nameAlias || this.activeCompany.name : '',
                        uniqueName: this.activeCompany ? this.activeCompany.uniqueName : '',
                    };
                }
                this.branchTransferGetRequestParams.branchUniqueName = this.currentBranch.uniqueName;
            } else {
                if (this._generalService.companyUniqueName) {
                    // Avoid API call if new user is onboarded
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({from: '', to: ''}));
                }
            }
        });
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public openSearchModal(template: TemplateRef<any>): void {
        this.modalRef = this.modalService.show(template);

        setTimeout(() => {
            if (this.clearFilter) {
                this.forceClear$ = observableOf({ status: true });
                this.clearFilter = false;
            }
        }, 100);
    }

    public initBranchTransferListResponse(): void {
        this.branchTransferResponse = {
            items: null,
            fromDate: null,
            toDate: null,
            page: null,
            count: null,
            totalPages: null,
            totalItems: null,
        };
    }

    public getBranchTransferList(resetPage: boolean): void {
        this.isLoading = true;

        if (resetPage) {
            this.branchTransferGetRequestParams.page = 1;
        }

        this.inventoryService.getBranchTransferList(this.branchTransferGetRequestParams, this.branchTransferPostRequestParams).subscribe((response) => {
            if (response.status === "success") {
                this.branchTransferResponse = response.body;
            } else {
                this.initBranchTransferListResponse();
            }
            this.isLoading = false;
        });
    }

    public pageChanged(event: any): void {
        this.branchTransferResponse.items = [];
        this.branchTransferGetRequestParams.page = event.page;
        this.getBranchTransferList(false);
    }

    public changeFilterDate(date): void {
        if (date) {
            this.branchTransferGetRequestParams.from = moment(date[0]).format(GIDDH_DATE_FORMAT);
            this.branchTransferGetRequestParams.to = moment(date[1]).format(GIDDH_DATE_FORMAT);
            this.getBranchTransferList(true);
        }
    }

    public search(): void {
        this.branchTransferPostRequestParams.voucherType = this.branchTransferTempPostRequestParams.voucherType;
        this.branchTransferPostRequestParams.amountOperator = this.branchTransferTempPostRequestParams.amountOperator;
        this.branchTransferPostRequestParams.amount = this.branchTransferTempPostRequestParams.amount;
        this.getBranchTransferList(true);
        this.modalRef.hide();
    }

    public toggleTransferAsidePane(event?): void {
        this.editBranchTransferUniqueName = '';

        if (event) {
            event.preventDefault();
        }
        this.asideTransferPaneState = this.asideTransferPaneState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    public toggleBodyClass(): void {
        if (this.asidePaneState === 'in' || this.asideTransferPaneState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    public openModal(): void {
        this.modalRef = this.modalService.show(
            this.branchtransfertemplate,
            Object.assign({}, { class: 'modal-lg receipt-note-modal  mb-0 pt-85' })
        );
    }

    public hideModal(refreshList: boolean): void {
        if (refreshList) {
            this.getBranchTransferList(true);
        }
        this.modalRef.hide();
    }

    public columnSearch(): void {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() => {
            this.getBranchTransferList(true);
        }, 700);
    }

    public deleteNewBranchTransfer(): void {
        this.hideBranchTransferModal();
        this.inventoryService.deleteNewBranchTransfer(this.selectedBranchTransfer).subscribe((response) => {
            if (response.status === "success") {
                this._toasty.successToast(response.body);
                this.getBranchTransferList(false);
            } else {
                this._toasty.errorToast(response.body);
            }
        });
    }

    public showDeleteBranchTransferModal(item): void {
        this.selectedBranchTransfer = item.uniqueName;
        this.selectedBranchTransferType = (item.voucherType === "receiptnote") ? "Receipt Note" : "Delivery Challan";
        this.deleteBranchTransferModal.show();
    }

    public hideBranchTransferModal(): void {
        this.deleteBranchTransferModal.hide();
    }

    public sortBranchTransferList(sortBy): void {
        let sort = "asc";

        if (this.branchTransferGetRequestParams.sortBy === sortBy) {
            sort = (this.branchTransferGetRequestParams.sort === "asc") ? "desc" : "asc";
        } else {
            sort = "asc";
        }

        this.branchTransferGetRequestParams.sort = sort;
        this.branchTransferGetRequestParams.sortBy = sortBy;

        this.getBranchTransferList(true);
    }

    public showEditBranchTransferPopup(item): void {
        this.branchTransferMode = item.voucherType;
        this.editBranchTransferUniqueName = item.uniqueName;
        this.openModal();
    }

    public clearFilters(): void {
        this.branchTransferPostRequestParams.senderReceiver = null;
        this.branchTransferPostRequestParams.warehouseName = null;
        this.branchTransferPostRequestParams.voucherType = null;
        this.branchTransferPostRequestParams.amountOperator = null;
        this.branchTransferPostRequestParams.amount = null;
        this.branchTransferTempPostRequestParams.voucherType = null;
        this.branchTransferTempPostRequestParams.amountOperator = null;
        this.branchTransferTempPostRequestParams.amount = null;
        this.branchTransferGetRequestParams.sort = "";
        this.branchTransferGetRequestParams.sortBy = "";

        this.clearFilter = true;
        this.getBranchTransferList(true);
    }

    public checkIfFiltersApplied(): boolean {
        if (this.branchTransferPostRequestParams.senderReceiver || this.branchTransferPostRequestParams.warehouseName || this.branchTransferPostRequestParams.voucherType || this.branchTransferPostRequestParams.amountOperator || this.branchTransferPostRequestParams.amount) {
            return true;
        } else {
            return false;
        }
    }

    public checkIfAmountEmpty(): void {
        if (this.branchTransferPostRequestParams.amountOperator && !this.branchTransferPostRequestParams.amount) {
            this.branchTransferPostRequestParams.amount = 0;
        }
    }

    public openBranchTransferPopup(event): void {
        this.branchTransferMode = event;
        this.toggleTransferAsidePane();
        this.openModal();
    }

    public refreshTempPostParams(): void {
        this.branchTransferTempPostRequestParams.voucherType = this.branchTransferPostRequestParams.voucherType;
        this.branchTransferTempPostRequestParams.amountOperator = this.branchTransferPostRequestParams.amountOperator;
        this.branchTransferTempPostRequestParams.amount = this.branchTransferPostRequestParams.amount;
    }

    public downloadBranchTransfer(item): void {
        let downloadBranchTransferRequest = new NewBranchTransferDownloadRequest();
        downloadBranchTransferRequest.uniqueName = item.uniqueName;

        this.inventoryService.downloadBranchTransfer(this.activeCompany.uniqueName, downloadBranchTransferRequest).subscribe((res) => {
            if (res.status === "success") {
                let blob = this._generalService.base64ToBlob(res.body, 'application/pdf', 512);
                return saveAs(blob, item.voucherNo + `.pdf`);
            } else {
                this._toasty.clearAllToaster();
                this._toasty.errorToast(res.message);
            }
        });
    }

    /**
     * Branch change handler
     *
     * @memberof NewBranchTransferListComponent
     */
    public handleBranchChange(selectedEntity: any): void {
        this.currentBranch.name = selectedEntity.label;
        this.branchTransferGetRequestParams.branchUniqueName = selectedEntity.value;
        this.getBranchTransferList(true);
    }

    @HostListener('document:keyup', ['$event'])
    public handleKeyboardEvent(event: KeyboardEvent) {
        if (event.altKey && event.which === 78) { // Alt + N
            event.preventDefault();
            event.stopPropagation();
            this.toggleTransferAsidePane();
        }

        if (event.which === ESCAPE) {
            this.editBranchTransferUniqueName = '';
            this.asideTransferPaneState = 'out';
            this.toggleBodyClass();
        }
    }

    public focusOnColumnSearch(inlineSearch) {
        this.inlineSearch = inlineSearch;

        setTimeout(() => {
            if (this.inlineSearch === 'senderReceiver') {
                this.senderReceiverField.nativeElement.focus();
            } else if (this.inlineSearch === 'warehouseName') {
                this.warehouseNameField.nativeElement.focus();
            }
        }, 200);
    }
}
