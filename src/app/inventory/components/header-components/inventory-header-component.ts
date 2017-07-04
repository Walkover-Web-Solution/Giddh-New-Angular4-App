import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { InventoryAction } from '../../../services/actions/inventory/inventory.actions';

@Component({
  selector: 'inventory-header',
  styles: [`
  `],
  template: `
  <div class="stock-bar" style="border-bottom:none;">
  <div class="top_row clearfix">
    <div class="pull-right">
      <button [routerLink]="['custom-stock']" type="button" class="btn btn-primary mrL1">Custom Stock Unit</button>
      <button type="button" class="btn btn-primary mrL1" (click)="goToAddGroup()">Add Group</button>
    </div>
  </div>
</div>
  `
})
export class InventoryHearderComponent implements OnInit {

  constructor(private router: Router, private store: Store<AppState>, private inventoryAction: InventoryAction) {}
  public ngOnInit() {
    //
  }

  public goToAddGroup() {
    this.store.dispatch(this.inventoryAction.resetActiveGroup());
    this.router.navigate(['/pages', 'inventory', 'add-group']);
  }
}
