import { Observable } from 'rxjs';
import { IOption } from '../../app.constant';

/**
 * Shared utility for branch mapping in report components
 * Used across report components for consistent branch handling
 */
export class BranchMappingHelper {
    /**
     * Maps branches and adds company as first option
     * Subscribes to branch changes and updates the provided branches array
     * 
     * @param currentCompanyBranches$ Observable of branches from store
     * @param currentCompanyBranches Array to store mapped branches
     * @param activeCompany Active company object
     * @param callback Optional callback to execute after mapping
     */
    public static setupBranchMapping(
        currentCompanyBranches$: Observable<any>,
        currentCompanyBranches: IOption[],
        activeCompany: any,
        callback?: (branches: IOption[], currentBranchUniqueName?: string) => void
    ): void {
        currentCompanyBranches$.subscribe(response => {
            if (response && response.length) {
                const mappedBranches = response.map(branch => ({
                    label: branch?.name,
                    value: branch?.uniqueName,
                    name: branch?.name,
                    parentBranch: branch?.parentBranch,
                    consolidatedBranch: branch?.consolidatedBranch
                }));
                
                mappedBranches.unshift({
                    label: activeCompany ? activeCompany.name : '',
                    name: activeCompany ? activeCompany.name : '',
                    value: activeCompany ? activeCompany.uniqueName : '',
                    isCompany: true
                });

                // Update the reference array
                currentCompanyBranches.length = 0;
                currentCompanyBranches.push(...mappedBranches);

                if (callback) {
                    callback(mappedBranches);
                }
            }
        });
    }
}
