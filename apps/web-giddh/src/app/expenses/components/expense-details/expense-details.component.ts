import { Component, OnInit, TemplateRef, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ExpenseResults, ActionPettycashRequest, ExpenseActionRequest } from '../../../models/api-models/Expences';
import { ToasterService } from '../../../services/toaster.service';
import { ExpenseService } from '../../../services/expences.service';
import { ExpencesAction } from '../../../actions/expences/expence.action';
import { AppState } from '../../../store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-expense-details',
  templateUrl: './expense-details.component.html',
  styleUrls: ['./expense-details.component.scss'],
})

export class ExpenseDetailsComponent implements OnInit {

  public modalRef: BsModalRef;
  public message: string;
  public actionPettyCashRequestBody: ExpenseActionRequest = new ExpenseActionRequest();
  @Output() public toggleDetailsMode: EventEmitter<boolean> = new EventEmitter();


  constructor(private modalService: BsModalService,
    private _toasty: ToasterService,
    private store: Store<AppState>,
    private _expenceActions: ExpencesAction,
    private expenseService: ExpenseService,
    private _cdRf: ChangeDetectorRef
  ) { }

  openModal(RejectionReason: TemplateRef<any>) {
    this.modalRef = this.modalService.show(RejectionReason, { class: 'modal-md' });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.modalRef.hide();
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }

  public ngOnInit() {
  }
  public closeDetailsMode() {
    this.toggleDetailsMode.emit(true);
  }
  public approvedActionClicked(item: ExpenseResults) {
    let actionType: ActionPettycashRequest = {
      actionType: 'approve',
      uniqueName: item.uniqueName
    };
    this.expenseService.actionPettycashReports(actionType, this.actionPettyCashRequestBody).subscribe(res => {
      if (res.status === 'success') {
        this._toasty.successToast('reverted successfully');
      } else {
        this._toasty.successToast(res.message);
      }
    });
  }

}
