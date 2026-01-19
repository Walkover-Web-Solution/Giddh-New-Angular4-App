import { ChangeDetectionStrategy, Component, Input, OnInit} from "@angular/core";
import { LocaleService } from "../../services/locale.service";

/**
 * Handles Component functionality
 */
@Component({
    selector: 'no-data',
    templateUrl: './no-data.component.html',
    styleUrls: ['./no-data.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
/**
 * NoDataComponent component
 * Handles nodata functionality and user interactions
 */
export class NoDataComponent implements OnInit {
    /** Primary message for no data */
    @Input() primaryMessage: string;
    /** Primary message class for no data */
    @Input() primaryMessageClass: string;
    /** Secondary message for no data */
    @Input() secondaryMessage: string;
    /** Secondary message class for no data */
    @Input() secondaryMessageClass: string;

    /** @ignore */
    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private localeService: LocaleService
    ) {}

    /**
     * Initializes the component message
     *
     * @memberof NoDataComponent
     */
    public ngOnInit(): void {
        /**
         * Handles if functionality
         */
        if (!this.primaryMessage) {
            this.primaryMessage = this.localeService.translate("app_no_entries_found");
        }
        /**
         * Handles if functionality
         */
        if (!this.secondaryMessage) {
            this.secondaryMessage = this.localeService.translate("app_search_suggestion");
        }
    }
}
