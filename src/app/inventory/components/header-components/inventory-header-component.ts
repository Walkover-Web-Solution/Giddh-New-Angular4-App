import {
  Component,
  OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'inventory-header',
  styles: [`
  `],
  template: `
  <div class="stock-bar" style="border-bottom:none;">
  <div class="top_row clearfix">
    <div class="pull-right">
      <button ng-click="stock.loadPage('custom-stock')" type="button" class="btn btn-primary mrL1">Custom Stock Unit</button>
      <button type="button" class="btn btn-primary mrL1" ng-click="stock.loadPage('add-group')">Add Group</button>
    </div>
  </div>
</div>
  `
})
export class InventoryHearderComponent implements OnInit {

  public ngOnInit() {
    //
  }
}
