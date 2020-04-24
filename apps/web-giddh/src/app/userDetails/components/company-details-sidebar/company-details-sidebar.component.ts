import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'company-details-sidebar',
	styleUrls: ['./company-details-sidebar.component.scss'],
	templateUrl: './company-details-sidebar.component.html'
})

export class CompanyDetailsSidebarComponent implements OnInit {

	@Output() public closeEvent: EventEmitter<boolean> = new EventEmitter();

	constructor() {
    }
    public ngOnInit() {
    }
}
