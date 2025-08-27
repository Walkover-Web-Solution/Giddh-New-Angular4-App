import { Component, OnInit, ViewChildren, TemplateRef, Inject } from '@angular/core';
import { ServiceConfig } from '../../../services/service.config';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
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

    constructor(
        @Inject(ServiceConfig) private serviceConfig,
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
        this.imgPath = isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || AppUrl) + APP_FOLDER + 'assets/images/';
    }
}
