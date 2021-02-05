import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

// import { GeneralService } from './services/general.service';

@Component({
    selector: 'browser-support',
    styleUrls: ['./browserDetect.component.scss'],
    templateUrl: './browserDetect.component.html'
})
export class BrowserDetectComponent implements OnInit, OnDestroy {
    public apkVersion: string;
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private _authService: AuthenticationService) {
        //
    }

    public ngOnInit() {
        this.getElectronAppVersion();
    }

    private getElectronAppVersion() {
        this._authService.GetElectronAppVersion().pipe(takeUntil(this.destroyed$)).subscribe((res: string) => {
            if (res && typeof res === 'string') {
                let version = res.split('files')[0];
                let versNum = version.split(' ')[1];
                this.apkVersion = versNum;
            }
        });
    }

    /**
     * Releases memory
     *
     * @memberof BrowserDetectComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
