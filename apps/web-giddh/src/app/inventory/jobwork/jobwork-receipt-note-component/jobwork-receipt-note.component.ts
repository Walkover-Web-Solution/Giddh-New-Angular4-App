import { Component, OnInit, Input } from '@angular/core';
@Component({
    selector: 'job-work-receipt-note',
    templateUrl: './jobwork-receipt-note.component.html',
    styleUrls: ['./jobwork-receipt-note.component.scss'],

})
export class JobworkReceiptNote implements OnInit {
    @Input() public branchTransferMode: string;
    public ngOnInit() {

    }
}

