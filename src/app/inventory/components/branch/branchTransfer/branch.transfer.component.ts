import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  public asideClose: boolean;

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

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _fb: FormBuilder, private _store: Store<AppState>, private _inventoryAction: InventoryAction, private settingsBranchActions: SettingsBranchActions) {
    this._store.dispatch(this.settingsBranchActions.GetALLBranches());
    this._store.dispatch(this._inventoryAction.GetStock());
    this.form = this._fb.group({
      transferDate: [moment().format('DD-MM-YYYY'), Validators.required],
      source: ['', Validators.required],
      productName: ['', Validators.required],
      destination: [''],
      transfers: this._fb.array([], Validators.required),
      description: ['']
    });

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

    this.addEntry();
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
    if (mode === 'destination') {
      this.destination.setValidators(null);
      this.productName.setValidators(Validators.required);
    } else {
      this.productName.setValidators(null);
      this.destination.setValidators(Validators.required);
    }
    this.transfers.controls.map((t, i) => {
      if (i === 0) {
        this.transfers.controls[0].reset();
      } else {
        this.transfers.removeAt(i);
      }
    });
    this.selectedProduct = null;
    this.form.reset();
    this.sourceSelect.clear();
  }

  public addEntry(control?: FormGroup) {
    if (control) {
      if (!control.valid) {
        return;
      } else if (!(control.get('entityDetails').value)) {
        return;
      }
    }
    const items = this.form.get('transfers') as FormArray;
    // let value: BranchTransfersArray = new BranchTransfersArray(
    //   new BranchTransferEntity('', this.mode === 'destination' ? 'warehouse' : 'stock'),
    //   0,
    //   0,
    //   ''
    // );
    const transfer = this._fb.group({
      entityDetails: [''],
      quantity: ['', Validators.required],
      rate: ['', Validators.required],
      stockUnit: ['', Validators.required],
      value: [''],
      product: [this.mode === 'destination' ? this.selectedProduct : null]
    });
    items.push(transfer);
  }

  public sourceChanged(option: IOption) {
    this.otherBranches = this.branches.filter(oth => oth.value !== option.value);
  }

  public productChanged(option: IOption) {
    this.selectedProduct = this.stockListBackUp.find(slb => {
      return slb.uniqueName === option.value;
    });
  }

  public deleteEntry(index: number) {
    const items = this.form.get('transfers') as FormArray;
    items.removeAt(index);
  }

  public closeAsidePane(event?) {
    this.closeAsideEvent.emit();
    this.asideClose = true;
    setTimeout(() => {
      this.asideClose = false;
    }, 500);
  }

  public save() {
    if (this.form.valid) {
      // this._store.dispatch(INVENTORY_BRANCH_TRANSFER.CREATE_TRANSFER(this.form.value as ));
    }
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
