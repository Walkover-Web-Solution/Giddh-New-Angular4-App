export const TALLY_SYNC_API = {
	INPROGRESS: '/tally_logs/current_day?page=:page&count=20&sort=:sortBy',
	COMPLETED: 'company/:companyUniqueName/tally_logs/completed?from=:from&to=:to&page=:page&count=:count&sort=:sortBy',
	ERROR_LOG: 'company/:companyUniqueName/tally_logs/:tally_logs_id/error_report',
};
