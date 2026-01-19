import { MatMenuTrigger } from '@angular/material/menu';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from './defaultDateFormat';

/**
 * Shared utility for universal datepicker methods
 * Used across multiple components with datepicker functionality
 */
export class DatepickerMethodsHelper {
    /**
     * Toggles the universal datepicker menu
     *
     * @param trigger MatMenuTrigger reference
     * @param isOpen Whether to open or close the menu
     */
    public static toggleGiddhDatepicker(trigger: MatMenuTrigger, isOpen: boolean = true): void {
        if (isOpen) {
            trigger?.openMenu();
        } else {
            trigger?.closeMenu();
        }
    }

    /**
     * Call back function for date/range selection in datepicker
     * Updates the component's date-related properties
     *
     * @param value Selected date range value
     * @param component Component instance with date properties
     * @param trigger MatMenuTrigger reference
     */
    public static dateSelectedCallback(
        value: any,
        component: {
            selectedRangeLabel: string;
            selectedDateRange: any;
            selectedDateRangeUi: string;
            fromDate: string;
            toDate: string;
        },
        trigger: MatMenuTrigger
    ): void {
        if (value && value.event === "cancel") {
            DatepickerMethodsHelper.toggleGiddhDatepicker(trigger, false);
            return;
        }
        component.selectedRangeLabel = "";

        if (value && value.name) {
            component.selectedRangeLabel = value.name;
        }
        DatepickerMethodsHelper.toggleGiddhDatepicker(trigger, false);
        if (value && value.startDate && value.endDate) {
            component.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            component.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            component.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            component.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
        }
    }
}
