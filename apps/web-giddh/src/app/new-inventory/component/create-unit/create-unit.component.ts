import { Component, OnInit, ViewChildren } from '@angular/core';
import { ShSelectComponent } from '../../../theme/ng-virtual-select/sh-select.component';

@Component({
    selector: 'aside-create-new-unit',
    templateUrl: './create-unit.component.html',
    styleUrls: ['./create-unit.component.scss'],

})

export class CreateNewUnitComponent implements OnInit {
    @ViewChildren('unitNameType') public unitNameType: ShSelectComponent;
    public isDivide: boolean = false;
    public changeType(ev) {
        this.isDivide = ev;
    }
    public ngOnInit() {

    }
}
