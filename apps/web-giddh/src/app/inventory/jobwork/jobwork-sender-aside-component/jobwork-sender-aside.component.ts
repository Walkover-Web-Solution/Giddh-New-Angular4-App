import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
@Component({
    selector: 'job-work-sender-aside',
    templateUrl: './jobwork-sender-aside.component.html',
    styleUrls: ['./jobwork-sender-aside.component.scss'],

})

export class JobWorkSenderAsidePane implements OnInit {
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);

    public closeAsidePane(event) {
        this.closeAsideEvent.emit(event);

    }


    public ngOnInit() { }


}
