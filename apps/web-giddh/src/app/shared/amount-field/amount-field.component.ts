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
    @Input() public ratePrecision: boolean = true;

    /** this will store direction */
    public direction: string = "ltr";

    constructor(private generalService: GeneralService) {

    }

    public ngOnInit(): void {
        /** detect direction method calling */
        this.detectDirection();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        /** detect direction method calling */
        this.detectDirection();
    }

    /** this will detect direction of the text */
    public detectDirection(): void {
        if (this.currencyCode) {
            let isRtlCurrency = this.generalService.isRtlCurrency(this.currencyCode);
            if (isRtlCurrency) {
                this.direction = "rtl";
            }
            else {
                this.direction = "ltr";
            }
        }
    }
}
