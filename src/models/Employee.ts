import { IdType } from "./IdType";
import { StatusEnum } from "./StatusEnum";

export type Employee = {
	id: IdType;
	status: StatusEnum;
	firstName: string;
	lastName: string;
	identifier: string;
	divisions: Array<string>;
};

export type EmployeeSet = Employee & {
	leavingDate: string | null
	isEmployed: boolean
}

export function getEmployeeDisplayString(employee: { firstName: string, lastName: string, identifier: string }) {
	return `${employee.firstName} ${employee.lastName} (${employee.identifier})`;
}
