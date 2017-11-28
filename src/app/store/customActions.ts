import { Action } from '@ngrx/store';

export class CustomActions implements Action {
  public type: string;
  public payload?: any;
}
