import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * KeyboardService service
 * Provides keyboard related business logic and data operations
 */
export class KeyboardService {

    public keyInformation: Subject<KeyboardEvent> = new Subject();

    /**
     * Sets key value
     */
    public setKey(event: KeyboardEvent) {
        this.keyInformation.next(event);
    }
}
