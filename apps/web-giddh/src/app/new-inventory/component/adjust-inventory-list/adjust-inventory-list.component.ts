import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GeneralService } from '../../../services/general.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
    selector: 'adjust-inventory-list',
    templateUrl: './adjust-inventory-list.component.html',
    styleUrls: ['./adjust-inventory-list.component.scss'],

})

export class AdjustInventoryComponent implements OnInit {
    /* This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /* This will store modal reference */
    public modalRef: BsModalRef;
    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;

    /*datepicker funcation*/
    public showGiddhDatepicker(element: any): void {
        if (element) {
            this.dateFieldPosition = this.generalService.getPosition(element.target);
        }
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, { class: 'modal-lg giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: false })
        );
    }

    /* Aside pane state*/
    public asideMenuState: string = 'out';

    /* Aside pane toggle fixed class */
    public toggleBodyClass(): void {
        if (this.asideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    /* Create combo aside pane open function */
    public adjustInventory(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.asideMenuState = this.asideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }


    constructor(
        private generalService: GeneralService,
        private modalService: BsModalService
    ){ }
    public ngOnInit() {

    }
}
