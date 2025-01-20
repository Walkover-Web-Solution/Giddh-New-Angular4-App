import { Component, OnInit, ViewChild, ElementRef, ViewChildren, TemplateRef } from '@angular/core';
import { GeneralService } from '../../../services/general.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ShSelectComponent } from '../../../theme/ng-virtual-select/sh-select.component';
@Component({
    selector: 'adjust-group',
    templateUrl: './adjust-group.component.html',
    styleUrls: ['./adjust-group.component.scss'],

})

export class AdjustGroupComponent implements OnInit {
    /* Aside pane state*/
    public asideMenuState: string = 'out';
    /* This will store modal reference */
    public modalRef: BsModalRef;
    /* this will store image path*/
    public imgPath: string = '';

    /* sh-select view child */
    @ViewChildren('selectAccount') public selectAccount: ShSelectComponent;

    constructor(
        private generalService: GeneralService,
        private modalService: BsModalService
    ) { }

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
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template,
            Object.assign({}, { class: 'modal-xl' })
        );
    }

    public ngOnInit() {
        /* added image path */
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
    }
}
