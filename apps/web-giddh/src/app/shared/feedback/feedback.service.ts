import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment.generated';
import { userLoginStateEnum } from '../../models/user-login-state';
import { GeneralService } from '../../services/general.service';
import { AppState } from '../../store';
import { FeedbackDialogComponent } from './feedback-dialog/feedback-dialog.component';

export interface StewardFeedbackUser {
    id: string;
    email: string;
    name: string;
    company: string;
    plan: string;
}

export interface StewardFeedbackPage {
    url: string;
    title: string;
}

export interface StewardFeedbackMeta {
    app_version: string;
}

export const STEWARD_FEEDBACK_URL = 'https://steward.embarko.app/api/v1/feedback';

export interface StewardFeedbackPayload {
    text: string;
    user: StewardFeedbackUser;
    page: StewardFeedbackPage;
    meta: StewardFeedbackMeta;
}

@Injectable({
    providedIn: 'root'
})
export class FeedbackService {
    private readonly http = inject(HttpClient);
    private readonly store = inject(Store<AppState>);
    private readonly generalService = inject(GeneralService);
    private readonly dialog = inject(MatDialog);

    /** True if signed-in user session is active */
    public readonly isLoggedIn = signal<boolean>(false);

    /** True if Steward feedback key is configured */
    public readonly isConfigured = signal<boolean>(Boolean(environment.stewardFeedbackKey));

    /** Tracks whether primary sidebar is present in current layout */
    public readonly sidebarPresent = signal<boolean>(false);

    /** Active dialog reference */
    private dialogRef: MatDialogRef<FeedbackDialogComponent> | null = null;

    constructor() {
        this.store.pipe(
            select(state => state.session.userLoginState),
            takeUntilDestroyed()
        ).subscribe(loginState => {
            const loggedIn = loginState === userLoginStateEnum.userLoggedIn ||
                loginState === userLoginStateEnum.newUserLoggedIn ||
                Boolean(this.generalService.user?.email);
            this.isLoggedIn.set(loggedIn);
        });
    }

    /**
     * Updates sidebar presence state
     */
    public setSidebarPresent(present: boolean): void {
        this.sidebarPresent.set(present);
    }

    /**
     * Determines whether sidebar is visible in DOM
     */
    public isSidebarVisible(): boolean {
        if (!this.sidebarPresent()) {
            return false;
        }
        if (typeof document === 'undefined') {
            return false;
        }
        const navLeftBar = document.querySelector('.nav-left-bar');
        if (!navLeftBar) {
            return false;
        }
        if (navLeftBar.classList.contains('hide-sidebar') || navLeftBar.classList.contains('visibility-hidden')) {
            return false;
        }
        return true;
    }

    /**
     * Opens the native feedback dialog
     */
    public openFeedbackDialog(): MatDialogRef<FeedbackDialogComponent> | null {
        if (!this.isConfigured()) {
            return null;
        }

        if (this.dialogRef) {
            return this.dialogRef;
        }

        this.dialogRef = this.dialog.open(FeedbackDialogComponent, {
            width: '460px',
            maxWidth: '92vw',
            panelClass: 'feedback-dialog-panel',
            autoFocus: true,
            restoreFocus: true
        });

        this.dialogRef.afterClosed().subscribe(() => {
            this.dialogRef = null;
        });

        return this.dialogRef;
    }

    /**
     * Submits feedback payload to Steward feedback endpoint
     */
    public submitFeedback(text: string): Observable<HttpResponse<unknown>> {
        const user = this.generalService.user;
        const activeCompany = this.generalService.activeCompany;

        const payload: StewardFeedbackPayload = {
            text: text.trim(),
            user: {
                id: user?.uniqueName || (user as unknown as { id?: string })?.id || '',
                email: user?.email || '',
                name: user?.name || '',
                company: activeCompany?.name || activeCompany?.uniqueName || this.generalService.companyUniqueName || '',
                plan: activeCompany?.subscription?.planDetails?.name || activeCompany?.subscription?.planDetails?.uniqueName || ''
            },
            page: {
                url: typeof window !== 'undefined' ? window.location.href : '',
                title: typeof document !== 'undefined' ? document.title : ''
            },
            meta: {
                app_version: environment.appVersion || '11.0.2'
            }
        };

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Steward-Key': environment.stewardFeedbackKey
        });

        return this.http.post<unknown>(STEWARD_FEEDBACK_URL, payload, {
            headers,
            observe: 'response'
        });
    }
}
