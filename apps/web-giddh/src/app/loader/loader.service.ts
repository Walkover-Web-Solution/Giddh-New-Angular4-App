import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoaderState } from './loader';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})

/**
 * LoaderService service
 * Provides loader related business logic and data operations
 */
export class LoaderService {

    public loaderSubject = new BehaviorSubject<LoaderState>({ show: false } as LoaderState);
    public loaderState = this.loaderSubject;

    /**
     * Shows  element
     */
    public show() {
        this.loaderSubject.next({ show: true } as LoaderState);
    }

    /**
     * Hides  element
     */
    public hide() {
        this.loaderSubject.next({ show: false } as LoaderState);
    }
}
