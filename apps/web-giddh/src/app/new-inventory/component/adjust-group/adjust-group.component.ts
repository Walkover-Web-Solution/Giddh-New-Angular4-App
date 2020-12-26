import { Component, OnInit, ViewChild, ElementRef, ViewChildren, TemplateRef} from '@angular/core';
import { GeneralService } from '../../../services/general.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ShSelectComponent } from '../../../theme/ng-virtual-select/sh-select.component';
@Component({
    selector: 'adjust-group',
    templateUrl: './adjust-group.component.html',
    styleUrls: ['./adjust-group.component.scss'],

})

export class AdjustGroupComponent implements OnInit {
    /* This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /* This will store modal reference */
    public modalRef: BsModalRef;
    /* Aside pane state*/
    public asideMenuState: string = 'out';

    @ViewChildren('selectAccount') public selectAccount: ShSelectComponent;

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



    /* Aside pane toggle fixed class */
    public toggleBodyClass(): void {
        if (this.asideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    /* Create combo aside pane open function */
    public addAdjustment(event?): void {
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

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template,
            Object.assign({}, { class: 'modal-xl' })
        );
    }

    public ngOnInit() {

    }
}
