import { Injectable } from "@angular/core";
import { CustomActions } from '../../store/customActions';
import { OnBoardingType } from '../../app.constant';

/**
 * Actions related to item on boarding
 *
 * @export
 * @class ItemOnBoardingActions
 */
@Injectable()
export class ItemOnBoardingActions {
    public static readonly SET_ON_BOARDING_TYPE: string = 'SET_ON_BOARDING_TYPE';
    public static readonly SET_ON_BOARDING_STATUS: string = 'SET_ON_BOARDING_STATUS';

    getOnBoardingTypeAction(value: OnBoardingType): CustomActions {
        return { type: ItemOnBoardingActions.SET_ON_BOARDING_TYPE, payload: value };
    }

    getOnBoardingStatusAction(value: boolean): CustomActions {
        return { type: ItemOnBoardingActions.SET_ON_BOARDING_STATUS, payload: value };
    }
}
