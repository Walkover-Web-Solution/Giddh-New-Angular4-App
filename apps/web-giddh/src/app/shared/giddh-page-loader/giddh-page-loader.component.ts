import { Component, Input } from "@angular/core";

@Component({
    styleUrls: ['./giddh-page-loader.component.scss']
})

export class GiddhPageLoaderComponent {
    /** This will hold css classes */
    @Input() public cssClass: string = "";

    constructor() {

    }
}
