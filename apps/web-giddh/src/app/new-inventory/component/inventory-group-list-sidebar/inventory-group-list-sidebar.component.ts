import { Component, OnInit, HostListener } from '@angular/core';

@Component({
    selector: 'inventory-group-list-sidebar',
    templateUrl: './inventory-group-list-sidebar.component.html',
    styleUrls: ['./inventory-group-list-sidebar.component.scss'],

})

export class InventoryGroupListSidebar implements OnInit {
    /*sub sidebar open*/
    public subSidebarOpen: boolean = true;

    public openSubSidebar() {
        this.subSidebarOpen = !this.subSidebarOpen;
        if (document.getElementsByClassName("right-side-content")) {
            document.querySelector('body').classList.toggle('hide-sub-sidebar');
        }
    }
    @HostListener('window:scroll', [])
    onWindowScroll() {
        if (document.body?.scrollTop > 10 ||
            document.documentElement.scrollTop > 10) {
            document.getElementById('inventory-sub-sidebar').classList.add('fixed-sidebar-top');
        }
        else {
            document.getElementById('inventory-sub-sidebar').classList.remove('fixed-sidebar-top');
        }
    }


    public ngOnInit() {

    }
    public ngOnDestroy() {
        document.querySelector('body').classList.remove('hide-sub-sidebar');

    }
}
