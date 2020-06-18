import { TemplateRef,Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { IOption } from '../../../../theme/ng-select/option.interface';
@Component({
    selector: 'receipt-entry',
    templateUrl: './receipt-entry-modal.component.html',
    styleUrls: [ './receipt-entry-modal.component.scss'],
})
export class ReceiptEntryModalComponent implements OnInit {
    public showInvNo:false;
    modalRef: BsModalRef;
    
    constructor(
        private modalService: BsModalService
    ){}
    public selectRef: IOption[] = [
        { label: "Receipt", value: "Receipt"}, 
        { label: "Advance Receipt", value: "Advance Receipt"}, 
        { label: "Against  Reference", value: "Against  Reference"} 
        ];
    public selectTax: IOption[] = [
            { label: "Receipt", value: "Receipt"}, 
            { label: "Advance Receipt", value: "Advance Receipt"}, 
            { label: "Against  Reference", value: "Against  Reference"} 
        ];
    public selectCrDr: IOption[] = [
            { label: "To/Cr", value: "To/Cr"}, 
            { label: "To/Dr", value: "To/Dr"}
    ];

    public SelectInvNoDateAmount:  IOption[] = [
        { label: "84358; 25/06/2020; 5000 cr.", value: "84358; 25/06/2020; 5000 cr."}, 
        { label: "848; 25/06/2020; 5000 cr", value: "848; 25/06/2020; 5000 cr."}
    ];
    public ngOnInit(){
        
    }


}