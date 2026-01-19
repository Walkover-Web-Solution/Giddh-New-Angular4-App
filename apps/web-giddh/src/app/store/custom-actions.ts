import { Action } from '@ngrx/store';

/**
 * CustomActions class
 * Implements CustomActions functionality
 */
export class CustomActions implements Action {
    public type: string;
    public payload?: any;
}
