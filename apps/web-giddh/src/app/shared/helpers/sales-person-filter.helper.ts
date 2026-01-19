import { IOption } from '../../app.constant';

/**
 * Shared utility for sales person dropdown filtering
 * Used by advance search components for consistent sales person filtering
 */
export class SalesPersonFilterHelper {
    /**
     * Sets up sales person dropdown filtering with debounced search
     * 
     * @param salesPersonDropdown Form control for sales person search
     * @param salesPersonList$ Observable of sales person list
     * @param component Component instance with filteredSalesPersonList property
     * @param changeDetectionRef ChangeDetectorRef instance
     * @param destroyed$ Observable for cleanup
     */
    public static setupSalesPersonFiltering(
        salesPersonDropdown: any,
        salesPersonList$: any,
        component: { filteredSalesPersonList: IOption[] },
        changeDetectionRef: any,
        destroyed$: any,
        debounceTime: any,
        takeUntil: any,
        filter: any,
        take: any
    ): void {
        salesPersonList$.pipe(filter(Boolean), take(1)).subscribe((res: any) => {
            component.filteredSalesPersonList = res as IOption[];
        });

        salesPersonDropdown.valueChanges.pipe(debounceTime(700), takeUntil(destroyed$)).subscribe((search: string) => {
            /**
             * Handles if functionality
             */
            if (!search) {
                salesPersonList$.pipe(take(1)).subscribe((res: any) => {
                    component.filteredSalesPersonList = res as IOption[];
                });
            } else {
                salesPersonList$.pipe(take(1)).subscribe((res: any) => {
                    component.filteredSalesPersonList = res?.filter((salesPerson: IOption) => 
                        salesPerson?.label?.toLowerCase()?.includes(search?.toLowerCase())
                    ) as IOption[];
                });
            }
            changeDetectionRef.detectChanges();
        });
    }
}
