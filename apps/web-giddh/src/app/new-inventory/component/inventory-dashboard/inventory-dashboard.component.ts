import { Component, OnInit } from '@angular/core';
@Component({
    selector: 'inventory-dashboard',
    templateUrl: './inventory-dashboard.component.html',
    styleUrls: ['./inventory-dashboard.component.scss'],
})

export class InventoryDashboardComponent implements OnInit {

    constructor() {
    }

    /* This will hold the value out/in to open/close setting sidebar popup */
    public asideInventorySidebarMenuState: boolean = true;
    
    public ngOnInit() {
    }
}
