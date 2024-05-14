const translations = {
	// i18next uses the `translation` namespace by default.
	translation: {
		no_employees_selected: "No employees $t(selected)",
		all_employees_selected: "All employees $t(selected)",
		employee_name_selected:
			"{{employee.firstName}} {{employee.lastName}} ({{employee.identifier}}) $t(selected)",
		n_employees_selected: "{{count}} employees $t(selected)",
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
