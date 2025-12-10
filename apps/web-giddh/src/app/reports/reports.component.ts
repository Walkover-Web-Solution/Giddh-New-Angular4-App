import { Component } from '@angular/core';

@Component({
    selector: 'reports',
    templateUrl: './reports.component.html',
standalone: false,
    template: '<router-outlet></router-outlet>'
})
export class ReportsComponent {
    constructor() { }
}
