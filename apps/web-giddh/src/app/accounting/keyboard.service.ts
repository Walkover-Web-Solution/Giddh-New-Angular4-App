import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class KeyboardService {

    public keyInformation: Subject<KeyboardEvent> = new Subject();

    public setKey(event: KeyboardEvent) {
        this.keyInformation.next(event);
    }
}
