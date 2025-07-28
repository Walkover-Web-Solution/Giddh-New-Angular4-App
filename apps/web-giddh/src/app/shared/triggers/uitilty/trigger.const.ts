/** Trigger list interface */
export interface ITriggerList {
    title: string;
    entity: string;
    entityUniqueNames: string[];
    voucherTypes: string[];
    emailSubject: string;
    triggerModule: string;
    to: string[];
    cc: string[];
    bcc: string[];
    conditionMap: {
        DUE_BY: { key: string; value: number };
        DUE_AMOUNT: { key: string; value: number };
    };
    executionTime: {
        time: string;
        dayOfWeek?: string;
        dayOfMonth?: string;
    };
    actions: string[];
    html: string;
    disabled: boolean;
}