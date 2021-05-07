import { Component, EventEmitter, Output, Input, ChangeDetectionStrategy } from '@angular/core';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { Router } from '@angular/router';
import { GstReport } from '../constants/gst.constant';
@Component({
    selector: 'gstr-sidebar',
    templateUrl: './gst-sidebar.component.html',
    styleUrls: ['gst-sidebar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GstrSidebarComponent {
    /** this is store mobile screen boolean value */
    public isMobileScreen: boolean = true;
    /** Returns the enum to be used in template */
    public get GstReport() {
        return GstReport;
    }
    /* Event emitter for close sidebar popup event */
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    /** this is store navigate event */
    @Output() public navigateEvent: EventEmitter<string> = new EventEmitter();
    /** this is store actvie company gst number */
    @Input() public activeCompanyGstNumber: EventEmitter<boolean> = new EventEmitter(true);
    /** Stores the selected GST module */
    @Input() public selectedGstModule: string = 'dashboard';

    constructor(
        private router: Router,
        private generalService: GeneralService
    ) {}

    /**
    * This will close the settings popup if clicked outside and is mobile screen
    *
    * @param {*} [event]
    * @memberof GstrSidebarComponent
    */
    public closeAsidePaneIfMobile(event?): void {
        if (this.isMobileScreen && event && event.target.className !== "icon-bar") {
            this.closeAsideEvent.emit(event);
        }
    }
    /**
    * This will navigate the user to previous page
    *
    * @memberof GstrSidebarComponent
    */
    public goToPreviousPage(): void {
        if (this.generalService.getSessionStorage("previousPage") && !this.router.url.includes("/dummy")) {
            this.router.navigateByUrl(this.generalService.getSessionStorage("previousPage"));
        } else {
            this.router.navigate(['/pages/home']);
        }
    }

    /**
    * This is navigate menu item
    *
    * @memberof GstrSidebarComponent
    */
    public navigate(type) {
        this.selectedGstModule = type;
        this.navigateEvent.emit(type);
    }

}
