import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { SalesOtherTaxesCalculationMethodEnum, SalesOtherTaxesModal } from '../../models/api-models/Sales';
import { TaxResponse } from '../../models/api-models/Company';
import { IOption } from '../../theme/ng-select/option.interface';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

@Component({
    selector: 'app-aside-menu-other-taxes',
    templateUrl: './aside-menu-other-taxes.html',
    styleUrls: ['./aside-menu-other-taxes.scss'],
    host: { 'class': 'app-aside-menu-other-taxes' },
})
export class AsideMenuOtherTaxes implements OnInit, OnChanges, OnDestroy {
    @Output() public closeModal: EventEmitter<boolean> = new EventEmitter();
    @Input() public otherTaxesModal: SalesOtherTaxesModal;
    @Input() public taxes: TaxResponse[] = [];
    @Output() public applyTaxes: EventEmitter<SalesOtherTaxesModal> = new EventEmitter();
    public taxesOptions: IOption[] = [];
    public selectedTaxUniqueName: string;
    public calculationMethodOptions: IOption[] = [];
    /** True if mobile screen */
    public isMobileScreen: boolean;
    /** To unsubscribe from subscription */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};

    constructor(
        private breakPointObservar: BreakpointObserver
    ) {
        this.breakPointObservar.observe([
            '(max-width:1024px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
        });
    }

    public ngOnInit(): void {
        document.querySelector('body').classList.add('aside-menu-othertax-open');
        this.taxesOptions = this.taxes
            ?.filter(f => ['tcsrc', 'tcspay', 'tdsrc', 'tdspay'].includes(f.taxType))
            .map(m => {
                return { label: m.name, value: m.uniqueName };
            })

        this.calculationMethodOptions = [
            { label: this.commonLocaleData?.app_on_taxable_value, value: 'OnTaxableAmount' },
            { label: this.commonLocaleData?.app_on_total_value, value: 'OnTotalAmount' },
        ];
    }

    public hideListItems(): void {
        this.saveTaxes();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if ('otherTaxesModal' in changes && changes.otherTaxesModal.currentValue !== changes.otherTaxesModal.previousValue) {
            this.otherTaxesModal = changes.otherTaxesModal.currentValue;
            if (this.otherTaxesModal.appliedOtherTax) {
                this.selectedTaxUniqueName = this.otherTaxesModal.appliedOtherTax.uniqueName;
                this.applyTax({ label: this.otherTaxesModal.appliedOtherTax.name, value: this.otherTaxesModal.appliedOtherTax.uniqueName });
            }
        }
    }

    public applyTax(tax: IOption): void {
        if (tax && tax.value) {
            this.otherTaxesModal.appliedOtherTax = { name: tax.label, uniqueName: tax.value };
            let taxType = this.taxes.find(f => f?.uniqueName === tax.value).taxType;
            const isTdsTax = ['tdsrc', 'tdspay'].includes(taxType);
            if (!isTdsTax) {
                this.otherTaxesModal.tcsCalculationMethod = SalesOtherTaxesCalculationMethodEnum.OnTotalAmount;
            } else {
                this.otherTaxesModal.tcsCalculationMethod = SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount;
            }
        }
    }

    public onClear(): void {
        this.otherTaxesModal.appliedOtherTax = null;
        this.otherTaxesModal.tcsCalculationMethod = SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount;
    }

    public saveTaxes(): void {
        this.applyTaxes.emit(this.otherTaxesModal);
    }

    /**
     * Unsubscribes to listeners
     *
     * @memberof AsideMenuOtherTaxes
     */
    public ngOnDestroy(): void {
        document.querySelector('body').classList.remove('aside-menu-othertax-open');
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
