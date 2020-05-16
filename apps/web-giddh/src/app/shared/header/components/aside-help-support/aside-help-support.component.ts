import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'apps/web-giddh/src/app/store';
import { GeneralActions } from 'apps/web-giddh/src/app/actions/general/general.actions';
@Component({
    selector: 'aside-help-support',
    templateUrl: './aside-help-support.component.html',
    styleUrls: [`./aside-help-support.component.scss`],
})

export class AsideHelpSupportComponent implements OnInit {
    //Event emitter to close the Aside panel
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);

    constructor(private store: Store<AppState>, private generalActions: GeneralActions) {

    }

    public ngOnInit() {

    }

    public closeAsidePane(event?) {
        this.closeAsideEvent.emit(event);
    }

    public scheduleNow(event) {
        this.closeAsidePane(event);

        if (isElectron) {
            (window as any).require("electron").shell.openExternal('https://calendly.com/sales-accounting-software/talk-to-sale');
        } else if (isCordova) {
            // todo: scheduleNow in cordova
        } else {
            this.openScheduleCalendlyModel();
        }
        return false;
    }

    public openScheduleCalendlyModel() {
        this.store.dispatch(this.generalActions.isOpenCalendlyModel(true));
    }
}