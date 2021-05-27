import { Component, Input } from "@angular/core";

@Component({
    selector: 'giddh-page-loader',
    templateUrl: './giddh-page-loader.component.html'
})

export class GiddhPageLoaderComponent {
    /** This will hold css classes */
    @Input() public cssClass: string = "";

    constructor() {

    }
}
