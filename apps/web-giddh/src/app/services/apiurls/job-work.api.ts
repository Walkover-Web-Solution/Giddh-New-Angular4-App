const JOB_WORK_BASE = 'v2/company/:companyUniqueName/job-work-orders';

export const JOB_WORK_API = {
    CREATE: JOB_WORK_BASE,
    UPDATE: JOB_WORK_BASE + '/:orderUniqueName',
    GET: JOB_WORK_BASE + '/:orderUniqueName',
    LIST: JOB_WORK_BASE + '/list',
    CHALLAN: JOB_WORK_BASE + '/:orderUniqueName/challan',
    RETURNS: JOB_WORK_BASE + '/:orderUniqueName/returns',
    VERSIONS: JOB_WORK_BASE + '/:orderUniqueName/versions',
    ACTION: JOB_WORK_BASE + '/action'
};
