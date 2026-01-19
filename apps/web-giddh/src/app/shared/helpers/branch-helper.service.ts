import { Injectable } from '@angular/core';
import { OrganizationType } from '../../models/user-login-state';
import { GeneralService } from '../../services/general.service';
import { cloneDeep } from '../../lodash-optimized';

/**
 * Helper service for branch-related operations
 * Eliminates duplication across 24+ components with branch selection logic
 */
@Injectable({
    providedIn: 'root'
})
export class BranchHelperService {

    constructor(private generalService: GeneralService) { }

    /**
     * Gets current branch based on organization type
     * 
     * @param {any[]} branches - List of branches
     * @param {any} activeCompany - Active company object
     * @param {OrganizationType} currentOrganizationType - Organization type
     * @returns {any} Current branch object
     * @memberof BranchHelperService
     */
    public getCurrentBranch(
        branches: any[],
        activeCompany: any,
        currentOrganizationType: OrganizationType
    ): any {
        if (currentOrganizationType === OrganizationType.Branch) {
            const currentBranchUniqueName = this.generalService.currentBranchUniqueName;
            return cloneDeep(branches?.find(branch => branch?.uniqueName === currentBranchUniqueName)) || {
                name: '',
                uniqueName: '',
                alias: ''
            };
        } else {
            return {
                name: activeCompany?.name || '',
                uniqueName: activeCompany?.uniqueName || '',
                alias: activeCompany?.nameAlias || ''
            };
        }
    }

    /**
     * Maps branches to dropdown options with active company prepended
     * 
     * @param {any[]} branches - List of branches
     * @param {any} activeCompany - Active company to prepend
     * @returns {any[]} Mapped branch options
     * @memberof BranchHelperService
     */
    public mapBranchesToOptions(branches: any[], activeCompany: any): any[] {
        if (!branches || !Array.isArray(branches)) {
            return [];
        }

        const options = branches.map(branch => ({
            label: branch.name,
            value: branch?.uniqueName,
            name: branch.name,
            parentBranch: branch.parentBranch,
            consolidatedBranch: branch?.consolidatedBranch
        }));

        options.unshift({
            label: activeCompany?.name || '',
            name: activeCompany?.name || '',
            value: activeCompany?.uniqueName || '',
            parentBranch: null,
            consolidatedBranch: false
        });

        return options;
    }

    /**
     * Gets current branch unique name based on organization type
     * 
     * @param {any} activeCompany - Active company object
     * @param {OrganizationType} currentOrganizationType - Organization type
     * @returns {string} Current branch unique name
     * @memberof BranchHelperService
     */
    public getCurrentBranchUniqueName(
        activeCompany: any,
        currentOrganizationType: OrganizationType
    ): string {
        if (currentOrganizationType === OrganizationType.Branch) {
            return this.generalService.currentBranchUniqueName || '';
        } else {
            return activeCompany?.uniqueName || '';
        }
    }
}
