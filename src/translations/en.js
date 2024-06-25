const translations = {
	// i18next uses the `translation` namespace by default.
	translation: {
		no_employees_selected: "No employees $t(selected)",
		all_employees_selected: "All employees $t(selected)",
		employee_name_selected:
			"{{employee.firstName}} {{employee.lastName}} ({{employee.identifier}}) $t(selected)",
		n_employees_selected: "{{count}} employees $t(selected)",
		delete_document_text: "Do you really want to delete the document '{{documentName}}'?",
		"import_tenant_button": "Import {{fileName}}",
		"delete_tenant_description": "Are you sure you want to permanently delete the tenant '{{tenantName}}'?",
		"confirm_tenant_deletion": "Please confirm by typing the name of the tenant",
		"PayrunJobStatus.Draft": "Draft",
		"PayrunJobStatus.Release": "Released",
		"PayrunJobStatus.Process": "Processing",
		"PayrunJobStatus.Complete": "Completed",
		"PayrunJobStatus.Forecast": "Forecast",
		"PayrunJobStatus.Abort": "Aborted",
		"PayrunJobStatus.Cancel": "Cancelled",
	},
};

export default translations;
