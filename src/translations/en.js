const translations = {
	// i18next uses the `translation` namespace by default.
	translation: {
		no_employees_selected: "No employees $t(selected)",
		all_employees_selected: "All employees $t(selected)",
		employee_name_selected:
			"{{employee.firstName}} {{employee.lastName}} ({{employee.identifier}}) $t(selected)",
		n_employees_selected: "{{count}} employees $t(selected)",
		delete_document_text: "Do you really want to delete the document '{{documentName}}'?",
		"import_organization_button": "Import {{fileName}}",
		"delete_organization_description": "Are you sure you want to permanently delete the organization '{{orgName}}'?",
		"confirm_organization_deletion": "Please confirm by typing the name of the organization",
		"PayrunJobStatus.Draft": "Draft",
		"PayrunJobStatus.Release": "Released",
		"PayrunJobStatus.Process": "Processing",
		"PayrunJobStatus.Complete": "Completed",
		"PayrunJobStatus.Forecast": "Forecast",
		"PayrunJobStatus.Abort": "Aborted",
		"PayrunJobStatus.Cancel": "Cancelled",
		"accounting_data_regulation": "Chart of accounts",

		payout_sum: "Payout {{amount}}",
		"payrun_period_calculating": "Calculating",
		"payrun_period_controlling": "Controlling",
		"payrun_period_wage_controlling": "Wage Controlling",
		"payrun_period_ready": "Ready to pay out",
		"payrun_period_paid_out": "Paid out",
		"payrun_period_former_employees": "Former employees",
		"payrun_period_no_wage": "Employed but without wage",
		"payrun_period_error": "With errors (the support has been informed)",
		"dashboard_payout_header": "Payout",
		"inactive_collector_chip": "{{count}} inactive collectors...",
		"date_accounting_start_date_validation": "Date has to be greater than or equal to the payroll accounting start date ({{accountingStartDate}})",
		"date_start_before_end_validation": "Start date must be before the end date"
	},
};

export default translations;
