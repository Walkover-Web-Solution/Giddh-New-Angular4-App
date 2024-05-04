import { Injectable } from "@angular/core";
import { CustomActions } from '../../store/custom-actions';
import { OnBoardingType } from '../../app.constant';

/**
 * Actions related to item on boarding
 *
 * @export
 * @class ItemOnBoardingActions
 */
@Injectable()
export class ItemOnBoardingActions {
    /** Action type to set the on boarding type of any item */
    public static readonly SET_ON_BOARDING_TYPE: string = 'SET_ON_BOARDING_TYPE';
    /** Action type to set the on boarding status of any item */
    public static readonly SET_ON_BOARDING_STATUS: string = 'SET_ON_BOARDING_STATUS';
    /** Action type to reset the on boarding status of any item */
    public static readonly RESET_ON_BOARDING: string = 'RESET_ON_BOARDING';
    /** Action type to set the item update status for any item */
    public static readonly SET_ITEM_UPDATE_PROGRESS: string = 'SET_ITEM_UPDATE_IN_PROGRESS';

    /**
     * Returns the action to set the on boarding type of any item
     *
     * @param {OnBoardingType} value Payload value
     * @returns {CustomActions} Action to set the on boarding type of any item
     * @memberof ItemOnBoardingActions
     */
    getOnBoardingTypeAction(value: OnBoardingType): CustomActions {
        return { type: ItemOnBoardingActions.SET_ON_BOARDING_TYPE, payload: value };
    }

    /**
     * Returns the action to set the on boarding status of any item
     *
     * @param {OnBoardingType} value Payload value
     * @returns {CustomActions} Action to set the on boarding status of any item
     * @memberof ItemOnBoardingActions
     */
    getOnBoardingStatusAction(value: boolean): CustomActions {
        return { type: ItemOnBoardingActions.SET_ON_BOARDING_STATUS, payload: value };
    }

    /**
     * Returns the action to reset the on boarding type of any item
     *
     * @param {OnBoardingType} value Payload value
     * @returns {CustomActions} Action to reset the on boarding type of any item
     * @memberof ItemOnBoardingActions
     */
    getOnBoardingResetAction(): CustomActions {
        return { type: ItemOnBoardingActions.RESET_ON_BOARDING };
    }

    /**
     * Returns the action to set the item update status of any item
     *
     * @param {OnBoardingType} value Payload value
     * @returns {CustomActions} Action to set the item update status of any item
     * @memberof ItemOnBoardingActions
     */
    getItemUpdateAction(value: boolean): CustomActions {
        return { type: ItemOnBoardingActions.SET_ITEM_UPDATE_PROGRESS, payload: value };
    }
}
