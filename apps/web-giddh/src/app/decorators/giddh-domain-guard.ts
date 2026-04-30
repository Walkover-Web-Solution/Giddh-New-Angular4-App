import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GeneralService } from '../services/general.service';

/**
 * Route guard that only allows access if the application is running on Giddh domain.
 * Redirects to home page if not on Giddh domain.
 *
 * @returns {boolean} True if on Giddh domain, false otherwise (triggers redirect)
 */
export const GiddhDomainGuard: CanActivateFn = () => {
    const generalService = inject(GeneralService);
    const router = inject(Router);

    if (generalService.isGiddhDomain()) {
        return true;
    }

    router.navigate(['/pages/home']);
    return false;
};
