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

		payout_sum: "Payout {{amount}}"
	},
};

export default translations;
