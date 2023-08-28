import { Component, Input } from '@angular/core';

@Component({
    selector: 'layout-main',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})

export class LayoutComponent {
    @Input() public sideMenu: { isopen: boolean, isExpanded: boolean } = { isopen: true, isExpanded: false };
}