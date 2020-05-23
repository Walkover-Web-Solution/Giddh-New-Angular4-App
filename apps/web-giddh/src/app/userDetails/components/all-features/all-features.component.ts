import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'all-features',
	styleUrls: ['./all-features.component.scss'],
	templateUrl: './all-features.component.html'
})

export class AllFeaturesComponent implements OnInit {
    @Output() public closeEvent = new EventEmitter<boolean>();

	constructor() {

    }
    
    public ngOnInit() {

    }

    public closePopup() {
        this.closeEvent.emit(true);
    }
}
