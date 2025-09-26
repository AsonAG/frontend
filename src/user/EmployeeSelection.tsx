import { Autocomplete, TextField } from "@mui/material";
import { t } from "i18next";
import { Employee, getEmployeeDisplayString } from "../models/Employee";

type EmployeeSelectionProps = {
	employee: Employee | null;
	onChange: (employee: Employee | null) => void;
	employees: Array<Employee>;
	disabled?: boolean;
};

export function EmployeeSelection({
	employee,
	onChange,
	employees,
	disabled,
}: EmployeeSelectionProps) {
	return (
		<Autocomplete
			disabled={disabled}
			disablePortal
			value={employee}
			onChange={(event, newValue) => onChange(newValue)}
			getOptionLabel={getEmployeeDisplayString}
			id="select_employee"
			options={employees}
			sx={{ py: 1 }}
			renderInput={(params) => <TextField {...params} label={t("Employee")} />}
			size="medium"
		/>
	);
}
