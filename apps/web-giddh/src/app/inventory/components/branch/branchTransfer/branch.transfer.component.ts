import { takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { IOption } from '../../../../theme/ng-virtual-select/sh-options.interface';
import { Store } from '@ngrx/store';
import { InventoryAction } from '../../../../actions/inventory/inventory.actions';
import { AppState } from '../../../../store';
import * as _ from '../../../../lodash-optimized';
import { Observable, ReplaySubject } from 'rxjs';
import { ShSelectComponent } from '../../../../theme/ng-virtual-select/sh-select.component';
import { IStocksItem } from '../../../../models/interfaces/stocksItem.interface';
import { BranchTransferEntity, ILinkedStocksResult, LinkedStocksResponse, LinkedStocksVM, TransferDestinationRequest, TransferProductsRequest } from '../../../../models/api-models/BranchTransfer';
import { SidebarAction } from '../../../../actions/inventory/sidebar.actions';

@Component({
    selector: 'branch-destination',
    templateUrl: './branch.transfer.component.html',
    styles: [`
    :host {
      position: fixed;
      left: auto;
      top: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      max-width:580px;
      z-index: 99999;
    }

    #close {
      display: none;
    }

    :host.in #close {
      display: block;
      position: fixed;
      left: -41px;
      top: 0;
      z-index: 5;
      border: 0;
      border-radius: 0;
    }

    :host .container-fluid {
      padding-left: 0;
      padding-right: 0;
    }

    :host .aside-pane {
      width: 100%;
      max-width:580px;
      background: #fff;
    }

    .aside-pane {
      width: 100%;
    }

    .flexy-child {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .flexy-child-1 {
      flex-grow: 1;
    }

    .vmiddle {
      position: absolute;
      top: 50%;
      bottom: 0;
      left: 0;
      display: table;
      width: 100%;
      right: 0;
      transform: translateY(-50%);
      text-align: center;
      margin: 0 auto;
    }
  `],
})
export class BranchTransferComponent implements OnInit, OnDestroy {
    // @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    @ViewChild('sourceSelect') public sourceSelect: ShSelectComponent;
    public form: FormGroup;
    public mode: 'destination' | 'product' = 'destination';
    public today = new Date();
    public stockListBackUp: IStocksItem[] = [];
    public stockListOptions: IOption[];
    public branches: IOption[];
    public otherBranches: IOption[];
    public selectedProduct: IStocksItem = null;
    public isBranchCreationInProcess$: Observable<boolean>;
    public isBranchCreationSuccess$: Observable<boolean>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private _fb: FormBuilder, private _store: Store<AppState>, private _inventoryAction: InventoryAction, private sidebarAction: SidebarAction) {
        this._store.dispatch(this._inventoryAction.GetAllLinkedStocks());
        this.initializeForm();
        this.isBranchCreationInProcess$ = this._store.select(state => state.inventoryBranchTransfer.isBranchTransferInProcess).pipe(takeUntil(this.destroyed$));
        this.isBranchCreationSuccess$ = this._store.select(state => state.inventoryBranchTransfer.isBranchTransferSuccess).pipe(takeUntil(this.destroyed$));

        this._store.select(state => state.inventoryBranchTransfer.linkedStocks).pipe(takeUntil(this.destroyed$)).subscribe((branches: LinkedStocksResponse) => {
            if (branches) {
                if (branches.results.length) {
                    this.branches = this.linkedStocksVM(branches.results).map(b => ({ label: b.name, value: b.uniqueName, additional: b }));
                    this.otherBranches = _.cloneDeep(this.branches);
                }
            }
        });
    }

    public get transferDate(): FormControl {
        return this.form.get('transferDate') as FormControl;
    }

    public get source(): FormControl {
        return this.form.get('source') as FormControl;
    }

    public get productName(): FormControl {
        return this.form.get('productName') as FormControl;
    }

    public get destination(): FormControl {
        return this.form.get('destination') as FormControl;
    }

    public get transfers(): FormArray {
        return this.form.get('transfers') as FormArray;
    }

    public get description(): FormControl {
        return this.form.get('description') as FormControl;
    }

    public ngOnInit() {
        this._store
            .select(p => p.inventory.stocksList && p.inventory.stocksList.results).subscribe(s => {
                if (s) {
                    this.stockListBackUp = s;
                    this.stockListOptions = s.map(p => ({ label: p.name, value: p.uniqueName }));
                }
            });

        this.isBranchCreationSuccess$.subscribe(s => {
            if (s) {
                this.closeAsidePane();
            }
        });
    }

    public linkedStocksVM(data: ILinkedStocksResult[]): LinkedStocksVM[] {
        let finalArr: LinkedStocksVM[] = [];

        data.forEach(d => {
            finalArr.push(new LinkedStocksVM(d.name, d.uniqueName));

            if (d.warehouses.length) {
                finalArr.push.apply(finalArr, d.warehouses.map(w => new LinkedStocksVM(w.name, w.uniqueName, true)));
            }
        });

        return finalArr;
    }

    public modeChanged(mode: 'destination' | 'product') {
        this.mode = mode;
        this.selectedProduct = null;
        this.transferDate.reset();
        this.sourceSelect.clear();
        this.initializeForm();

        if (mode === 'destination') {
            this.destination.clearValidators();
            this.productName.setValidators(Validators.required);
        } else {
            this.productName.clearValidators();
            this.destination.setValidators(Validators.required);
        }
    }

    public initializeForm() {
        this.form = this._fb.group({
            transferDate: [moment().format('DD-MM-YYYY'), Validators.required],
            source: ['', Validators.required],
            productName: ['', Validators.required],
            destination: [''],
            transfers: this._fb.array([], Validators.required),
            description: ['']
        });

        this.addEntry();
    }

    public addEntry(control?: AbstractControl) {
        if (control) {
            if (!control.valid) {
                return;
            } else if (!(control.get('entityDetails').value)) {
                return;
            }
        }
        const items = this.form.get('transfers') as FormArray;
        let rate = 1;
        let stockUnit = '';

        if (this.mode === 'destination' && this.selectedProduct) {
            rate = this.selectedProduct.rate;
            stockUnit = this.selectedProduct.stockUnit.code;
        }

        const transfer = this._fb.group({
            entityDetails: [''],
            quantity: [1, Validators.required],
            rate: [rate, Validators.required],
            stockUnit: [stockUnit, Validators.required],
            value: [1],
        });
        items.push(transfer);
    }

    public sourceChanged(option: IOption) {
        if (!option.value) {
            return;
        }
        this.otherBranches = this.branches.filter(oth => oth.value !== option.value);
        this._store.dispatch(this._inventoryAction.GetStock(option.value));
    }

    public productChanged(option: IOption, item?: AbstractControl) {
        if (this.mode === 'destination') {
            this.selectedProduct = this.stockListBackUp.find(slb => {
                return slb.uniqueName === option.value;
            });

            this.transfers.controls.map((trn: AbstractControl) => {
                trn.get('stockUnit').patchValue(_.get(this.selectedProduct, 'stockUnit.code'));
                trn.get('rate').patchValue(_.get(this.selectedProduct, 'rate', 1));
                this.valueChanged(trn);
            });
        } else {
            this.selectedProduct = null;
            let selectedProduct = this.stockListBackUp.find(slb => {
                return slb.uniqueName === option.value;
            });
            const stockUnit = item.get('stockUnit');
            const rate = item.get('rate');

            stockUnit.patchValue(_.get(selectedProduct, 'stockUnit.code'));
            rate.patchValue(_.get(selectedProduct, 'rate', 1));
        }
    }

    public valueChanged(item: AbstractControl) {
        const quantity = item.get('quantity');
        const rate = item.get('rate');
        const value = item.get('value');

        value.patchValue(parseFloat(quantity.value) * parseFloat(rate.value));
    }

    public deleteEntry(index: number) {
        const items = this.form.get('transfers') as FormArray;
        items.removeAt(index);
    }

    public closeAsidePane() {
        this._store.dispatch(this._inventoryAction.ResetBranchTransferState());
        this.modeChanged('destination');
        this._store.dispatch(this.sidebarAction.ShowBranchScreenSideBar(false));
        // this.closeAsideEvent.emit();
    }

    public save() {
        if (this.form.valid) {
            let value: TransferDestinationRequest | TransferProductsRequest;

            if (this.mode === 'destination') {
                value = new TransferDestinationRequest();
                value.source = new BranchTransferEntity(this.source.value, this.getEntityType(this.source.value));
                value.description = this.description.value;
                value.product = new BranchTransferEntity(this.productName.value, 'stock');
                value.transferDate = moment(this.transferDate.value, 'DD-MM-YYYY').format('DD-MM-YYYY');

                let rawValues = this.transfers.getRawValue();
                rawValues.map(rv => {
                    delete rv['value'];
                    rv.entityDetails = {
                        uniqueName: rv.entityDetails,
                        entity: this.getEntityType(rv.entityDetails)
                    };
                });
                value.transfers = rawValues;
            } else {
                value = new TransferProductsRequest();
                value.source = new BranchTransferEntity(this.source.value, this.getEntityType(this.source.value));
                value.description = this.description.value;
                value.destination = new BranchTransferEntity(this.destination.value, this.getEntityType(this.destination.value));
                value.transferDate = moment(this.transferDate.value, 'DD-MM-YYYY').format('DD-MM-YYYY');

                let rawValues = this.transfers.getRawValue();
                rawValues.map(rv => {
                    delete rv['value'];
                    rv.entityDetails = {
                        uniqueName: rv.entityDetails,
                        entity: 'stock'
                    };
                });
                value.transfers = rawValues;
            }
            this._store.dispatch(this._inventoryAction.CreateBranchTransfer(value));
        }
    }

    public getEntityType(uniqueName: string): 'warehouse' | 'stock' | 'company' {
        let result = this.branches.find(f => f.value === uniqueName);
        return result.additional.isWareHouse ? 'warehouse' : 'company';
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
