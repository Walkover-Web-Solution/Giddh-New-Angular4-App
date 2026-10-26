interface TriggerFormFields {
    title: unknown;
    condition: {
        action: readonly unknown[] | string;
        entity: unknown;
        subConditions: readonly { action: readonly unknown[] | string }[];
    };
    campaignDetails: {
        campaignName: unknown;
        to?: readonly unknown[] | null;
    };
}

interface TriggerFormError {
    field: 'title' | 'condition' | 'entity' | 'subConditions' | 'campaignSlug' | 'triggerToChiplist';
    message: 'invalid_title' | 'invalid_action' | 'invalid_entity' | 'invalid_sub_entity' | 'invalid_slug' | 'invalid_to';
}

/** Keep the same first-error order across campaign and advanced-trigger forms. */
export function getTriggerFormError(trigger: TriggerFormFields): TriggerFormError | undefined {
    if (!trigger.title) {
        return { field: 'title', message: 'invalid_title' };
    }
    if (!trigger.condition.action[0]) {
        return { field: 'condition', message: 'invalid_action' };
    }
    if (!trigger.condition.entity) {
        return { field: 'entity', message: 'invalid_entity' };
    }
    if (!trigger.condition.subConditions[0]?.action[0]) {
        return { field: 'subConditions', message: 'invalid_sub_entity' };
    }
    if (!trigger.campaignDetails.campaignName) {
        return { field: 'campaignSlug', message: 'invalid_slug' };
    }
    if (!trigger.campaignDetails.to?.length) {
        return { field: 'triggerToChiplist', message: 'invalid_to' };
    }
    return undefined;
}
