import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'activity-log-sidebar',
	styleUrls: ['./activity-log-sidebar.component.scss'],
	templateUrl: './activity-log-sidebar.component.html'
})

export class ActiveLogSidebarComponent implements OnInit {
    @Output() public closeEvent: EventEmitter<boolean> = new EventEmitter();

	constructor() {
    }
    public ngOnInit() {
    }
}
