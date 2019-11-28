
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
    selector: 'new-branch-transfer-list',
    templateUrl: './new.branch.transfer.list.component.html',
    styleUrls: ['./new.branch.transfer.component.scss'],

})

export class NewBranchTransfListComponent implements OnInit, OnDestroy {


    reportTableDatas = [
        {
            serialNo: "1",
            Date: "21/11/19",
            VoucherType: "Delivery Challan",
            VoucherNo: "DC/BR/20193-8",
            SenderReciver: "Branch 1",
            TotalAmount: "3000",
            Action: "Select Action"

        },
        {
            serialNo: "2",
            Date: "21/11/19",
            VoucherType: "Delivery Challan",
            VoucherNo: "DC/BR/20193-8",
            SenderReciver: "Branch 1",
            TotalAmount: "3000",
            Action: "Select Action"
        },
        {
            serialNo: "3",
            Date: "21/11/19",
            VoucherType: "Delivery Challan",
            VoucherNo: "DC/BR/20193-8",
            SenderReciver: "Branch 1",
            TotalAmount: "3000",
            Action: "Select Action"
        },
        {
            serialNo: "4",
            Date: "21/11/19",
            VoucherType: "Delivery Challan",
            VoucherNo: "DC/BR/20193-8",
            SenderReciver: "Branch 1",
            TotalAmount: "3000",
            Action: "Select Action"
        }


    ]

    public ngOnInit() {

    }

    public ngOnDestroy() {

    }

}
