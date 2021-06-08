import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'all-features',
    styleUrls: ['./all-features.component.scss'],
    templateUrl: './all-features.component.html'
})

export class AllFeaturesComponent implements OnInit {
    @Output() public closeEvent = new EventEmitter<boolean>();
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor() {

    }

    public ngOnInit() {

    }

    public closePopup() {
        this.closeEvent.emit(true);
    }
}
