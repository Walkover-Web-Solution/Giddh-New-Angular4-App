import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
@Component({
    selector: 'aside-help-support',
    templateUrl: './aside-help-support.component.html',
    styleUrls: [`./aside-help-support.component.scss`],
})

export class AsideHelpSupportComponent implements OnInit {
    //Event emitter to close the Aside panel
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    public closeAsidePane(event?) {
        this.closeAsideEvent.emit(event);
    }
    public ngOnInit() {
    }

}