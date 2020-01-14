import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { ReplaySubject } from 'rxjs';

@Component({
    selector: 'aside-menu-product-service',
    styleUrls: ['./component.scss'],
    templateUrl: './component.html'
})
export class AsideMenuProductServiceComponent {

    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    @Output() public animatePAside: EventEmitter<any> = new EventEmitter();
    @Input() public selectedVouchertype: string;
    public autoFocusInChild: boolean = true;

    // public
    public isAddStockOpen: boolean = false;
    public isAddServiceOpen: boolean = false;
    public hideFirstStep: boolean = false;

    // private below
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private store: Store<AppState>
    ) {
        // constructor methods
    }

    public toggleStockPane() {
        this.hideFirstStep = true;
        this.isAddServiceOpen = false;
        this.isAddStockOpen = !this.isAddStockOpen;
    }

    public toggleServicePane() {
        this.hideFirstStep = true;
        this.isAddStockOpen = false;
        this.isAddServiceOpen = !this.isAddServiceOpen;
    }

    public closeAsidePane(e?: any) {
        this.hideFirstStep = false;
        this.isAddStockOpen = false;
        this.isAddServiceOpen = false;
        if (e) {
            //
        } else {
            this.closeAsideEvent.emit();
        }
    }

    public animateAside(e: any) {
        this.animatePAside.emit(e);
    }
    public backButtonPressed() {
        this.hideFirstStep = false;
        this.isAddStockOpen = false;
        this.isAddServiceOpen = false;
    }
}
