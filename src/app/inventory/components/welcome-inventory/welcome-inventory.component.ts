import { AfterViewInit, Component, OnDestroy, OnInit, Input } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'welcome-inventory',  // <home></home>
  templateUrl: './welcome-inventory.component.html'
})
export class InventoryWelcomeComponent implements OnInit, OnDestroy {

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor() {
    //
  }

  public ngOnInit() {
    //
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
