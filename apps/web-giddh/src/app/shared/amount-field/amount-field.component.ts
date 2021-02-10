import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GeneralService } from '../../services/general.service';

@Component({
    selector: 'amount-field',
    templateUrl: './amount-field.component.html',
    styleUrls: ['./amount-field.component.scss']
})

export class AmountFieldComponent implements OnInit, OnChanges {
    @Input() public amount: any;
    @Input() public currencySymbol: string;
    @Input() public currencyCode: string;
    public direction: string = "ltr";

    constructor(private generalService: GeneralService) {

    }

    public ngOnInit(): void {
        this.detectDirection();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.detectDirection();
    }

    public detectDirection(): void {
        if (this.currencyCode) {
            let isRtlCurrency = this.generalService.isRtlCurrency(this.currencyCode);
            if (isRtlCurrency) {
                this.direction = "rtl";
            }
        }
    }
}
