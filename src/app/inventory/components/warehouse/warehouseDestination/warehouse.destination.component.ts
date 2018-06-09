import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { IOption } from '../../../../theme/ng-virtual-select/sh-options.interface';
import { Store } from '@ngrx/store';
import { InventoryAction } from '../../../../actions/inventory/inventory.actions';
import { AppState } from '../../../../store';
import * as _ from '../../../../lodash-optimized';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { SettingsBranchActions } from '../../../../actions/settings/branch/settings.branch.action';

@Component({
  selector: 'warehouse-destination',
  templateUrl: './warehouse.destination.component.html',
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
export class WarehouseDestinationComponent implements OnInit, OnDestroy {
  @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);

  public form: FormGroup;
  public mode: 'sender' | 'product' = 'sender';
  public today = new Date();
  public stockListOptions: IOption[];
  public branches: IOption[];
  public asideClose: boolean;

  public get transferDate(): FormControl {
    return this.form.get('transferDate') as FormControl;
  }

  public get transfers(): FormArray {
    return this.form.get('transfers') as FormArray;
  }

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _fb: FormBuilder, private _store: Store<AppState>, private _inventoryAction: InventoryAction, private settingsBranchActions: SettingsBranchActions,) {
    this._store.dispatch(this.settingsBranchActions.GetALLBranches());
    this._store.dispatch(this._inventoryAction.GetStock());
    this.form = this._fb.group({
      transferDate: [moment().format('DD-MM-YYYY'), Validators.required],
      source: ['', Validators.required],
      productName: ['', Validators.required],
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
        }
      }
    });

    this.addEntry();
  }

  public ngOnInit() {
    this._store
      .select(p => p.inventory.stocksList && p.inventory.stocksList.results).subscribe(s => {
      if (s) {
        this.stockListOptions = s.map(p => ({label: p.name, value: p.uniqueName}));
      }
    });
  }

  public addEntry() {
    const items = this.form.get('transfers') as FormArray;
    const value = items.length > 0 ? items.at(0).value : {
      entityDetails: '',
      quantity: '',
      stockUnit: '',
      rate: '',
    };
    const transfer = this._fb.group({
      entityDetails: [''],
      quantity: ['', Validators.required],
      rate: ['', Validators.required],
      stockUnit: [value.stockUnit, Validators.required]
    });
    items.push(transfer);
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
      // const inventoryEntryDate = moment(this.form.value.inventoryEntryDate).format('DD-MM-YYYY');
      // this.onSave.emit({ ...this.form.value, inventoryEntryDate });
    }
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
