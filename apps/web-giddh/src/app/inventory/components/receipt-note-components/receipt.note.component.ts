import { Observable, of as observableOf, ReplaySubject, Subscription } from 'rxjs';

import { distinctUntilChanged, filter, take, takeUntil } from 'rxjs/operators';
import { AppState } from '../../../store';
import { Store } from '@ngrx/store';
import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarAction } from '../../../actions/inventory/sidebar.actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from '../../../services/inventory.service';
import { StockGroupRequest, StockGroupResponse } from '../../../models/api-models/Inventory';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groupsWithStocks.interface';
import { uniqueNameInvalidStringReplace } from '../../../shared/helpers/helperFunctions';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { IForceClear } from '../../../models/api-models/Sales';
import * as _ from 'lodash';
import {InvViewService} from "../../inv.view.service";

@Component({
  selector: 'receipt-note',  // <home></home>
  templateUrl: './receipt.note.component.html'
})
export class ReceiptNoteComponent {
  constructor(private _router: Router, private invViewService: InvViewService){

  }
  public backToInv(){
    this.invViewService.setActiveView(null, null);
    this._router.navigate(['/pages/inventory']);
  }
}
