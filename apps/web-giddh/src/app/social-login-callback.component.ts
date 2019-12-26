import { Component } from '@angular/core';
import { AuthService } from 'ng2-ui-auth';

@Component({
    selector: 'social-login-callback',
    template: `
    in social callback
  `
})
export class SocialLoginCallbackComponent {
    constructor(private auth: AuthService) {
    }

}
