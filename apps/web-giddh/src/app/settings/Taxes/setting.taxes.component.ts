import { Observable, of as observableOf, ReplaySubject } from 'rxjs';

import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { GIDDH_DATE_FORMAT } from './../../shared/helpers/defaultDateFormat';
import { select, Store } from '@ngrx/store';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../store';
import * as _ from '../../lodash-optimized';
import * as moment from 'moment/moment';
import { CompanyActions } from '../../actions/company.actions';
import { TaxResponse } from '../../models/api-models/Company';
import { SettingsTaxesActions } from '../../actions/settings/taxes/settings.taxes.action';
import { AccountService } from '../../services/account.service';
import { ModalDirective } from 'ngx-bootstrap';
import { IOption } from '../../theme/ng-select/ng-select';
import { ToasterService } from '../../services/toaster.service';
import { IForceClear } from '../../models/api-models/Sales';
import { animate, state, style, transition, trigger } from '@angular/animations';

const taxesType = [
    { label: 'GST', value: 'GST' },
    { label: 'InputGST', value: 'InputGST' },
    { label: 'Others', value: 'others' }
];

const taxDuration = [
    { label: 'Monthly', value: 'MONTHLY' },
    { label: 'Quarterly', value: 'QUARTERLY' },
    { label: 'Half-Yearly', value: 'HALFYEARLY' },
    { label: 'Yearly', value: 'YEARLY' }
];

@Component({
    selector: 'setting-taxes',
    templateUrl: './setting.taxes.component.html',
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
    ],
    styleUrls: ['./setting.taxes.component.scss'],
})
export class SettingTaxesComponent implements OnInit {

    @ViewChild('taxConfirmationModel') public taxConfirmationModel: ModalDirective;

    public availableTaxes: TaxResponse[] = [];
    public newTaxObj: TaxResponse = new TaxResponse();
    public moment = moment;
    public days: IOption[] = [];
    public records = []; // This array is just for generating dynamic ngModel
    public taxToEdit = []; // It is for edit toogle
    public showFromDatePicker: boolean = false;
    public showDatePickerInTable: boolean = false;
    public selectedTax: TaxResponse = null;
    public confirmationMessage: string;
    public confirmationFor: string;
    public accounts$: IOption[];
    public taxList: IOption[] = taxesType;
    public duration: IOption[] = taxDuration;
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    public taxAsideMenuState: string = 'out';
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private router: Router,
        private store: Store<AppState>,
        private _companyActions: CompanyActions,
        private _accountService: AccountService,
        private _settingsTaxesActions: SettingsTaxesActions,
        private _toaster: ToasterService
    ) {
        for (let i = 1; i <= 31; i++) {
            let day = i.toString();
            this.days.push({ label: day, value: day });
        }

        this.store.dispatch(this._companyActions.getTax());
    }

    public ngOnInit() {
        this.store.select(p => p.company).pipe(takeUntil(this.destroyed$)).subscribe((o) => {
            if (o.taxes) {
                this.forceClear$ = observableOf({ status: true });
                _.map(o.taxes, (tax) => {
                    _.each(tax.taxDetail, (t) => {
                        t.date = moment(t.date, GIDDH_DATE_FORMAT);
                    });
                });
                this.onCancel();
                this.availableTaxes = _.cloneDeep(o.taxes);
            }
        });
        this.getFlattenAccounts('');

        this.store.select((st: AppState) => st.general.addAndManageClosed).subscribe((bool) => {
            if (bool) {
                this.getFlattenAccounts('');
            }
        });

        this.store
            .pipe(select(p => p.company.isTaxCreatedSuccessfully), takeUntil(this.destroyed$))
            .subscribe(result => {
                if (result && this.taxAsideMenuState === 'in') {
                    this.toggleTaxAsidePane();
                }
            });
    }

    public onSubmit(data) {
        let dataToSave = _.cloneDeep(data);
        dataToSave.taxDetail = [{
            taxValue: dataToSave.taxValue,
            date: dataToSave.date
        }];

        if (dataToSave.taxType === 'others') {
            if (!dataToSave.accounts) {
                dataToSave.accounts = [];
            }
            this.accounts$.forEach((obj) => {
                if (obj.value === dataToSave.account) {
                    let accountObj = obj.label.split(' - ');
                    dataToSave.accounts.push({ name: accountObj[0], uniqueName: obj.value });
                }
            });
        }

        dataToSave.date = moment(dataToSave.date).format('DD-MM-YYYY');
        dataToSave.accounts = dataToSave.accounts ? dataToSave.accounts : [];
        dataToSave.taxDetail = [{ date: dataToSave.date, taxValue: dataToSave.taxValue }];
        if (dataToSave.duration) {
            this.store.dispatch(this._settingsTaxesActions.CreateTax(dataToSave));
        } else {
            this._toaster.errorToast('Please select tax duration.', 'Validation');
        }
    }

    public deleteTax(taxToDelete) {
        this.newTaxObj = taxToDelete;
        this.selectedTax = this.availableTaxes.find((tax) => tax.uniqueName === taxToDelete.uniqueName);
        this.confirmationMessage = `Are you sure you want to delete ${this.selectedTax.name}?`;
        this.confirmationFor = 'delete';
        this.taxConfirmationModel.show();
    }

    public updateTax(taxIndex: number) {
        let selectedTax = _.cloneDeep(this.availableTaxes[taxIndex]);
        this.newTaxObj = selectedTax;
        this.confirmationMessage = `Are you sure want to update ${selectedTax.name}?`;
        this.confirmationFor = 'edit';
        this.taxConfirmationModel.show();
    }

    public onCancel() {
        this.newTaxObj = new TaxResponse();
    }

    public userConfirmation(userResponse: boolean) {
        this.taxConfirmationModel.hide();
        if (userResponse) {
            if (this.confirmationFor === 'delete') {
                this.store.dispatch(this._settingsTaxesActions.DeleteTax(this.newTaxObj.uniqueName));
            } else if (this.confirmationFor === 'edit') {
                _.each(this.newTaxObj.taxDetail, (tax) => {
                    tax.date = moment(tax.date).format(GIDDH_DATE_FORMAT);
                });
                this.store.dispatch(this._settingsTaxesActions.UpdateTax(this.newTaxObj));
            }
        }
    }

    public addMoreDateAndPercentage(taxIndex: number) {
        let taxes = _.cloneDeep(this.availableTaxes);
        taxes[taxIndex].taxDetail.push({ date: null, taxValue: null });
        this.availableTaxes = taxes;
    }

    public removeDateAndPercentage(parentIndex: number, childIndex: number) {
        let taxes = _.cloneDeep(this.availableTaxes);
        taxes[parentIndex].taxDetail.splice(childIndex, 1);
        this.availableTaxes = taxes;
    }

    public reloadTaxList() {
        this.store.select(p => p.company).pipe(take(1)).subscribe((o) => {
            if (o.taxes) {
                this.onCancel();
                this.availableTaxes = _.cloneDeep(o.taxes);
            }
        });
    }

    public getFlattenAccounts(value) {
        let query = value || '';
        // get flattern accounts
        this._accountService.getFlattenAccounts(query, '').pipe(debounceTime(100), takeUntil(this.destroyed$)).subscribe(data => {
            if (data.status === 'success') {
                let accounts: IOption[] = [];
                data.body.results.map(d => {
                    accounts.push({ label: `${d.name} - (${d.uniqueName})`, value: d.uniqueName });
                    // `${d.name} (${d.uniqueName})`
                });
                this.accounts$ = accounts;
            }
        });
    }

    public customAccountFilter(term: string, item: IOption) {
        return (item.label.toLocaleLowerCase().indexOf(term) > -1 || item.value.toLocaleLowerCase().indexOf(term) > -1);
    }

    public customDateSorting(a: IOption, b: IOption) {
        return (parseInt(a.label) - parseInt(b.label));
    }

    public toggleTaxAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.taxAsideMenuState = this.taxAsideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    public toggleBodyClass() {
        if (this.taxAsideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

}
