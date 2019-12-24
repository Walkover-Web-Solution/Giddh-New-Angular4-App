import { AfterViewInit, Component } from '@angular/core';
import { GeneralService } from './services/general.service';

@Component({
    selector: 'new-user',
    template: `
    <div id="main">
      <app-header></app-header>
      <layout-main>
      </layout-main>
      <!-- <app-footer></app-footer> -->
    </div>
  `
})
export class NewUserComponent implements AfterViewInit {
    constructor(private _generalService: GeneralService) {
        //
    }

    public ngAfterViewInit() {
        this._generalService.IAmLoaded.next(true);
    }

}
