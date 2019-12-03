import {
    Component,
    TemplateRef,
    Input,
    OnDestroy,
    OnInit
} from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";

@Component({
    selector: "new-branch-transfer-list",
    templateUrl: "./new.branch.transfer.list.component.html",
    styleUrls: ["./new.branch.transfer.component.scss"]
})
export class NewBranchTransferListComponent implements OnInit, OnDestroy {
    modalRef: BsModalRef;
    constructor(private modalService: BsModalService) {}

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    reportTableDatas = [
        {
            serialNo: "1",
            Date: "21/11/19",
            VoucherType: "Delivery Challan",
            VoucherNo: "DC/BR/20193-8",
            SenderReciver: "Branch 1",
            wareHouse: "Warehouse 1",
            TotalAmount: "3000",
            Action: "Select Action"
        },
        {
            serialNo: "2",
            Date: "21/11/19",
            VoucherType: "Delivery Challan",
            VoucherNo: "DC/BR/20193-8",
            SenderReciver: "Branch 1",
            wareHouse: "Warehouse 2",
            TotalAmount: "3000",
            Action: "Select Action"
        },
        {
            serialNo: "3",
            Date: "21/11/19",
            VoucherType: "Delivery Challan",
            VoucherNo: "DC/BR/20193-8",
            SenderReciver: "Branch 1",
            wareHouse: "Warehouse 3",
            TotalAmount: "3000",
            Action: "Select Action"
        },
        {
            serialNo: "4",
            Date: "21/11/19",
            VoucherType: "Delivery Challan",
            VoucherNo: "DC/BR/20193-8",
            SenderReciver: "Branch 1",
            wareHouse: "Warehouse 4",
            TotalAmount: "3000",
            Action: "Select Action"
        }
    ];

    public voucherType = [
        { label: "demo 1", value: "demo 1" },
        { label: "demo 2", value: "demo 2" },
        { label: "demo 3", value: "demo 3" }
    ];

    public totalAmount = [
        { label: "Greater Than", value: "Greater Than" },
        { label: "Less Than", value: "Less Than" },
        { label: "Greater Than or Equals", value: "Greater Than or Equals" },
        { label: "Less Than or Equals", value: "Less Than or Equals" },
        { label: "Equals", value: "Equals" }
    ];

    public ngOnInit() {}

    public ngOnDestroy() {}
}
