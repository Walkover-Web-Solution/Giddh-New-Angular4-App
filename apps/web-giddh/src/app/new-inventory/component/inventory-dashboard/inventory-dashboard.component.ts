import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
    selector: 'inventory-dashboard',
    templateUrl: './inventory-dashboard.component.html',
    styleUrls: ['./inventory-dashboard.component.scss'],

})

export class InventoryDashboardComponent implements OnInit {

    constructor(private _router: Router) {

    }

    /* This will hold the value out/in to open/close setting sidebar popup */
    public asideInventorySidebarMenuState: string = 'in';

    /* Aside pane state*/
    public asideMenuState: string = 'out';

    /**
    * This will toggle the settings popup
    *
    * @param {*} [event]
    * @memberof SettingsComponent
    */

    /* Aside pane toggle fixed class */
    public toggleBodyClass(): void {
        if (this.asideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }
    /* Aside pane open function */
    public toggleAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.asideMenuState = this.asideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }
    public ngOnInit() {
    }
}
