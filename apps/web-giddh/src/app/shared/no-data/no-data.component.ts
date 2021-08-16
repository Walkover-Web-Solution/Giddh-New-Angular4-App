import { ChangeDetectionStrategy, Component, Input, OnInit} from "@angular/core";
import { LocaleService } from "../../services/locale.service";

@Component({
    selector: 'no-data',
    templateUrl: './no-data.component.html',
    styleUrls: ['./no-data.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
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
    constructor(
        private localeService: LocaleService
    ) {}

    /**
     * Initializes the component message
     *
     * @memberof NoDataComponent
     */
    public ngOnInit(): void {
        if (!this.primaryMessage) {
            this.primaryMessage = this.localeService.translate("app_no_entries_found");
        }
        if (!this.secondaryMessage) {
            this.secondaryMessage = this.localeService.translate("app_search_suggestion");
        }
    }
}
