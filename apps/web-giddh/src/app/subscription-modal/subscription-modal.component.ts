import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
    selector: 'app-subscription-modal',
    styleUrls: ['./subscription-modal.component.css'],
    templateUrl: './subscription-modal.component.html'
})

export class SubscriptionModalComponent implements OnInit, OnDestroy {

    modalRef: BsModalRef;
    constructor(private modalService: BsModalService) { }

    public ngOnInit() { }
    public ngOnDestroy() { }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

}
