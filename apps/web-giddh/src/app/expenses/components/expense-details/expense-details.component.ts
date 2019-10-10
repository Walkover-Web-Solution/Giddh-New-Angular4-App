import { Component, OnInit, TemplateRef, EventEmitter, Output, ChangeDetectorRef, OnChanges, SimpleChanges, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ExpenseResults, ActionPettycashRequest, ExpenseActionRequest } from '../../../models/api-models/Expences';
import { ToasterService } from '../../../services/toaster.service';
import { ExpenseService } from '../../../services/expences.service';
import { ExpencesAction } from '../../../actions/expences/expence.action';
import { AppState } from '../../../store';
import { Store } from '@ngrx/store';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-expense-details',
  templateUrl: './expense-details.component.html',
  styleUrls: ['./expense-details.component.scss'],
})

export class ExpenseDetailsComponent implements OnInit, OnChanges {

  public modalRef: BsModalRef;
  public message: string;
  public actionPettyCashRequestBody: ExpenseActionRequest = new ExpenseActionRequest();
  @Output() public toggleDetailsMode: EventEmitter<boolean> = new EventEmitter();
  @Output() public selectedDetailedRowInput: EventEmitter<ExpenseResults> = new EventEmitter();
  @Input() public selectedRowItem: string;
  public selectedItem: ExpenseResults;
  public rejectReason = new FormControl();
  public actionPettycashRequest: ActionPettycashRequest = new ActionPettycashRequest();

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

  public submitReject(): void {
    this.actionPettyCashRequestBody.message = this.rejectReason.value;
    this.actionPettycashRequest.actionType = 'reject';
    this.actionPettycashRequest.uniqueName = this.selectedItem.uniqueName;
    this.pettyCashAction(this.actionPettycashRequest);
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
    this.pettyCashAction(actionType);
    // this.expenseService.actionPettycashReports(actionType, this.actionPettyCashRequestBody).subscribe(res => {
    //   if (res.status === 'success') {
    //     this.modalService.hide(0);
    //     this._toasty.successToast('reverted successfully');
    //   } else {
    //     this._toasty.successToast(res.message);
    //   }
    // });
  }
  public pettyCashAction(actionType: ActionPettycashRequest) {
    this.expenseService.actionPettycashReports(actionType, this.actionPettyCashRequestBody).subscribe(res => {
      if (res.status === 'success') {
        this._toasty.successToast(res.body);
        this.closeDetailsMode();
      } else {
        this._toasty.errorToast(res.body);
      }
      this.modalRef.hide();
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedRowItem']) {
      this.selectedItem = changes['selectedRowItem'].currentValue;
    }

  }

}
