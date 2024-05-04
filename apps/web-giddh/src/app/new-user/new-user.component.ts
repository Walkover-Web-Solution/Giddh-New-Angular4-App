import { AfterViewInit, Component } from '@angular/core';
import { GeneralService } from '../services/general.service';

@Component({
    selector: 'new-user',
    templateUrl: './new-user.component.html'
})
export class NewUserComponent implements AfterViewInit {
    constructor(private generalService: GeneralService) {
        
    }

    public ngAfterViewInit() {
        this.generalService.IAmLoaded.next(true);
    }
}