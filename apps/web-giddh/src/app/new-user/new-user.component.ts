import { AfterViewInit, Component } from '@angular/core';
import { GeneralService } from '../services/general.service';


@Component({
    selector: 'new-user',
    template: `
    <div id="main">
      <app-header></app-header>
      <layout-main>
      </layout-main>
    </div>
  `
})
export class NewUserComponent implements AfterViewInit {
    constructor(private generalService: GeneralService) {
        //
    }

    public ngAfterViewInit() {
        this.generalService.IAmLoaded.next(true);
    }

}
