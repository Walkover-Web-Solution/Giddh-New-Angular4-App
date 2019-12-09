import { NeedsAuthorization } from './needAuthorization';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { NeedsAuthentication } from './needsAuthentication';
import { UserAuthenticated } from './UserAuthenticated';
import { NewUserAuthGuard } from './newUserGuard';
import { CheckIfPublicPath } from './checkIfPublicPath';
import { BrowserSupported } from './BrowserSupported';

@NgModule({
    imports: [],
    exports: []
})
export class DecoratorsModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: DecoratorsModule,
            providers: [
                NeedsAuthentication,
                UserAuthenticated,
                NewUserAuthGuard,
                NeedsAuthorization,
                CheckIfPublicPath,
                BrowserSupported
            ]
        };
    }
}
