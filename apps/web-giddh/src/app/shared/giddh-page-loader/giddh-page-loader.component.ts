import { Component, Input } from "@angular/core";

@Component({
    selector: 'giddh-page-loader',
    standalone: false,
    templateUrl: './giddh-page-loader.component.html',
    styleUrls: ['./giddh-page-loader.component.scss']
})

export class GiddhPageLoaderComponent {
    /** This will hold css classes */
    @Input() public cssClass: string = "";

    constructor() {

    }
}
