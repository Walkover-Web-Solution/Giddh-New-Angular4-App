import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";

@Component({
  selector: "inventory-master",
  templateUrl: "./inventory-master.component.html",
  styleUrls: ["./inventory-master.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryMasterComponent implements OnInit, OnDestroy {
  public asideCreateUnitMenuState: string = 'out';
  public asideCreateGroupMenuState: string = 'out';

  /* Create unit aside pane open function */
  public createUnitToggleAsidePane(): void {
    this.asideCreateUnitMenuState = this.asideCreateUnitMenuState === 'out' ? 'in' : 'out';
    this.toggleBodyClass();
  }
  /* Create unit aside pane open function */
  public createGroupToggleAsidePane(): void {
    this.asideCreateGroupMenuState = this.asideCreateGroupMenuState === 'out' ? 'in' : 'out';
    this.toggleBodyClass();
  }
  /* Aside pane toggle fixed class */
  public toggleBodyClass(): void {
    if (this.asideCreateUnitMenuState === 'in' || this.asideCreateGroupMenuState === 'in') {
      document.querySelector('body').classList.add('fixed');
    } else {
      document.querySelector('body').classList.remove('fixed');
    }
  }
  public ngOnInit(): void {
    document.querySelector('body').classList.add('custom-units');
  }
  public ngOnDestroy(): void{
    document.querySelector('body').classList.remove('custom-units');
  }
}