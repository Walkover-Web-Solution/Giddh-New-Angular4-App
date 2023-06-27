import { NeedsAuthorization } from './needAuthorization';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { NeedsAuthentication } from './needsAuthentication';
import { UserAuthenticated } from './UserAuthenticated';
import { NewUserAuthGuard } from './newUserGuard';
import { PageLeaveConfirmationGuard } from './page-leave-confirmation-guard';

@NgModule({
    imports: [],
    exports: []
})
export class DecoratorsModule {
    public static forRoot(): ModuleWithProviders<DecoratorsModule> {
        return {
            ngModule: DecoratorsModule,
            providers: [
                NeedsAuthentication,
                UserAuthenticated,
                NewUserAuthGuard,
                NeedsAuthorization,
                PageLeaveConfirmationGuard
            ]
        };
    }
}
