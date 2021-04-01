import { Component, EventEmitter, Output, Input, ChangeDetectionStrategy } from '@angular/core';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { Router } from '@angular/router';
@Component({
    selector: 'gstr-sidebar',
    templateUrl: './gst-sidebar.component.html',
    styleUrls: ['gst-sidebar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GstrSidebarComponent {

    public isMobileScreen: boolean = true;
    /* Event emitter for close sidebar popup event */
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    @Output() public navigateEvent: EventEmitter<string> = new EventEmitter();
    @Input() public activeCompanyGstNumber: EventEmitter<boolean> = new EventEmitter(true);

    constructor(
        private router: Router,
        private generalService: GeneralService
    ) {}

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

    /**
    * navigateToOverview
    */
    public navigate(type) {
        this.navigateEvent.emit(type);
    }

}
