import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { IOption } from '../../../../theme/ng-virtual-select/sh-options.interface';
import { Store } from '@ngrx/store';
import { InventoryAction } from '../../../../actions/inventory/inventory.actions';
import { AppState } from '../../../../store';
import * as _ from '../../../../lodash-optimized';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { SettingsBranchActions } from '../../../../actions/settings/branch/settings.branch.action';
import { ShSelectComponent } from '../../../../theme/ng-virtual-select/sh-select.component';
import { IStocksItem } from '../../../../models/interfaces/stocksItem.interface';
import { BranchTransferEntity, TransferDestinationRequest, TransferProductsRequest } from '../../../../models/api-models/BranchTransfer';

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
      width: 580px;
      z-index: 1045;
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
      width: 580px;
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
  @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
  @ViewChild('sourceSelect') public sourceSelect: ShSelectComponent;
  public form: FormGroup;
  public mode: 'destination' | 'product' = 'destination';
  public today = new Date();
  public stockListBackUp: IStocksItem[] = [];
  public stockListOptions: IOption[];
  public branches: IOption[];
  public otherBranches: IOption[];
  public selectedProduct: IStocksItem = null;

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

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _fb: FormBuilder, private _store: Store<AppState>, private _inventoryAction: InventoryAction, private settingsBranchActions: SettingsBranchActions) {
    this._store.dispatch(this.settingsBranchActions.GetALLBranches());
    this._store.dispatch(this._inventoryAction.GetStock());
    this.initializeForm();

    this._store.select(state => state.settings.branches).takeUntil(this.destroyed$).subscribe(branches => {
      if (branches) {
        if (branches.results.length) {
          _.each(branches.results, (branch) => {
            if (branch.gstDetails && branch.gstDetails.length) {
              branch.gstDetails = [_.find(branch.gstDetails, (gst) => gst.addressList && gst.addressList[0] && gst.addressList[0].isDefault)];
            }
          });
          this.branches = branches.results.map(b => ({label: b.name, value: b.uniqueName}));
          this.otherBranches = _.cloneDeep(this.branches);
        }
      }
    });
  }

  public ngOnInit() {
    this._store
      .select(p => p.inventory.stocksList && p.inventory.stocksList.results).subscribe(s => {
      if (s) {
        this.stockListBackUp = s;
        this.stockListOptions = s.map(p => ({label: p.name, value: p.uniqueName}));
      }
    });
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
    let rate = 0;
    let stockUnit = '';

    if (this.mode === 'destination' && this.selectedProduct) {
      rate = this.selectedProduct.rate;
      stockUnit = this.selectedProduct.stockUnit.code;
    }

    const transfer = this._fb.group({
      entityDetails: [''],
      quantity: [0, Validators.required],
      rate: [rate, Validators.required],
      stockUnit: [stockUnit, Validators.required],
      value: [0],
    });
    items.push(transfer);
  }

  public sourceChanged(option: IOption) {
    this.otherBranches = this.branches.filter(oth => oth.value !== option.value);
  }

  public productChanged(option: IOption, item?: AbstractControl) {
    if (this.mode === 'destination') {
      this.selectedProduct = this.stockListBackUp.find(slb => {
        return slb.uniqueName === option.value;
      });

      this.transfers.controls.map((trn: AbstractControl) => {
        trn.get('stockUnit').patchValue(_.get(this.selectedProduct, 'stockUnit.code'));
        trn.get('rate').patchValue(_.get(this.selectedProduct, 'rate', 0));
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
      rate.patchValue(_.get(selectedProduct, 'rate', 0));
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
    this.modeChanged('destination');
    this.closeAsideEvent.emit();
  }

  public save() {
    if (this.form.valid) {
      let value: TransferDestinationRequest | TransferProductsRequest;

      if (this.mode === 'destination') {
        value = new TransferDestinationRequest();
        value.source = new BranchTransferEntity(this.source.value, 'company');
        value.description = this.description.value;
        value.product = new BranchTransferEntity(this.productName.value, 'stock');
        value.transferDate = moment(this.transferDate.value, 'DD-MM-YYYY').format('DD-MM-YYYY');

        let rawValues = this.transfers.getRawValue();
        rawValues.map(rv => {
          delete rv['value'];
          rv.entityDetails = {
            uniqueName: rv.entityDetails,
            entity: 'company'
          };
        });
        value.transfers = rawValues;
      } else {
        value = new TransferProductsRequest();
        value.source = new BranchTransferEntity(this.source.value, 'company');
        value.description = this.description.value;
        value.destination = new BranchTransferEntity(this.destination.value, 'company');
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

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
