import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";

@Component({
  selector: "inventory-master",
  templateUrl: "./inventory-master.component.html",
  styleUrls: ["./inventory-master.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryMasterComponent  {
  public createUpdateStock: string = 'out';
  public createUpdateGroup: string = 'out';

  public config: PerfectScrollbarConfigInterface = { suppressScrollX: false, suppressScrollY: false };
  /* Create unit aside pane open function */
  public createStockToggleAsidePane(): void {
    this.createUpdateStock = this.createUpdateStock === 'out' ? 'in' : 'out';
    this.toggleBodyClass();
  }
  /* Create unit aside pane open function */
  public createGroupToggleAsidePane(): void {
    this.createUpdateGroup = this.createUpdateGroup === 'out' ? 'in' : 'out';
    this.toggleBodyClass();
  }
  /* Aside pane toggle fixed class */
  public toggleBodyClass(): void {
    if (this.createUpdateStock === 'in' || this.createUpdateGroup === 'in') {
      document.querySelector('body').classList.add('fixed');
    } else {
      document.querySelector('body').classList.remove('fixed');
    }
  }
}