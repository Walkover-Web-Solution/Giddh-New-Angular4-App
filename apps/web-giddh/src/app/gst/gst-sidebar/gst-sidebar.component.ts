import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AppState } from 'apps/web-giddh/src/app/store';

@Component({
    selector: 'gstr-sidebar',
    templateUrl: './gst-sidebar.component.html',
    styleUrls: ['gst-sidebar.component.scss'],
})
export class GstrSidebarComponent implements OnInit {

    public isMobileScreen: boolean = true;

    constructor(private generalService: GeneralService, private router: Router, private store: Store<AppState>) {

    }


    /* Event emitter for close sidebar popup event */
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    /**
    * This will close the settings popup if clicked outside and is mobile screen
    *
    * @param {*} [event]
    * @memberof AsideSettingComponent
    */
    public closeAsidePaneIfMobile(event?): void {
        if (this.isMobileScreen && event && event.target.className !== "icon-bar") {
            this.closeAsideEvent.emit(event);
        }
    }
    /**
    * This will navigate the user to previous page
    *
    * @memberof AsideSettingComponent
    */
    public goToPreviousPage(): void {
        if (this.generalService.getSessionStorage("previousPage") && !this.router.url.includes("/dummy")) {
            this.router.navigateByUrl(this.generalService.getSessionStorage("previousPage"));
        } else {
            this.router.navigate(['/pages/home']);
        }
    }
    public ngOnInit() {

    }
}
