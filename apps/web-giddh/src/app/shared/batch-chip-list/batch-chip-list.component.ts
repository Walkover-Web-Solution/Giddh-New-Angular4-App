import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { VoucherSelectedBatch } from "../../models/interfaces/batch-report.interface";

@Component({
    selector: "batch-chip-list",
    templateUrl: "./batch-chip-list.component.html",
    styleUrls: ["./batch-chip-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule]
})
export class BatchChipListComponent {
    /** Selected batches to render. */
    @Input() public batches: VoucherSelectedBatch[] | null | undefined;
    /** Locale strings for batch labels. */
    @Input() public localeData: any = {};
    /** Common locale strings for Edit. */
    @Input() public commonLocaleData: any = {};
    /** False hides the Edit action. */
    @Input() public showEdit: boolean = true;
    /** Emits when Edit is clicked. */
    @Output() public edit: EventEmitter<Event> = new EventEmitter();

    /**
     * Normalized selected batches.
     *
     * @return {*}  {VoucherSelectedBatch[]}
     * @memberof BatchChipListComponent
     */
    public get selectedBatches(): VoucherSelectedBatch[] {
        return Array.isArray(this.batches) ? this.batches : [];
    }

    /**
     * Count of batches issued beyond available stock.
     *
     * @return {*}  {number}
     * @memberof BatchChipListComponent
     */
    public get negativeCount(): number {
        return this.selectedBatches.filter(batch => {
            const quantity = Number(batch?.quantity) || 0;
            const available = Number(batch?.availableQuantity) || 0;
            return quantity > available;
        }).length;
    }

    /**
     * Label for the batch count chip.
     *
     * @return {*}  {string}
     * @memberof BatchChipListComponent
     */
    public get countLabel(): string {
        return this.interpolateLocale(this.localeData?.n_batches, { COUNT: this.selectedBatches.length });
    }

    /**
     * Label for the negative-stock chip.
     *
     * @return {*}  {string}
     * @memberof BatchChipListComponent
     */
    public get negativeLabel(): string {
        return this.interpolateLocale(
            this.negativeCount === 1 ? this.localeData?.one_batch_negative : this.localeData?.n_batches_negative,
            { COUNT: this.negativeCount }
        );
    }

    /**
     * Replace placeholders in a locale string.
     *
     * @private
     * @param {string} [text]
     * @param {Record<string, string | number>} values
     * @return {*}  {string}
     * @memberof BatchChipListComponent
     */
    private interpolateLocale(text: string | undefined, values: Record<string, string | number>): string {
        return Object.keys(values).reduce((result, key) => result.replace(`[${key}]`, String(values[key])), text ?? "");
    }
}
