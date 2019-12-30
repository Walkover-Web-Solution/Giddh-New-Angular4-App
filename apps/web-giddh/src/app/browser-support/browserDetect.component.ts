import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

// import { GeneralService } from './services/general.service';

@Component({
    selector: 'browser-support',
    styleUrls: ['./browserDetect.component.scss'],
    templateUrl: './browserDetect.component.html'
})
export class BrowserDetectComponent implements OnInit {
    public apkVersion: string;
    constructor(private _authService: AuthenticationService) {
        //
    }

    public ngOnInit() {
        this.getElectronAppVersion();
    }

    private getElectronAppVersion() {
        this._authService.GetElectronAppVersion().subscribe((res: string) => {
            if (res && typeof res === 'string') {
                let version = res.split('files')[0];
                let versNum = version.split(' ')[1];
                this.apkVersion = versNum;
            }
        });
    }

}
