import { Component, OnInit, ViewChildren } from '@angular/core';
import { ShSelectComponent } from '../../../theme/ng-virtual-select/sh-select.component';

@Component({
    selector: 'about-product-service-detail',
    templateUrl: './about-product-service-detail.component.html',
    styleUrls: ['./about-product-service-detail.component.scss'],

})

export class AboutProductServiceDetailComponent implements OnInit {

    public productContent: boolean = true;
    public ngOnInit() {

    }
}
