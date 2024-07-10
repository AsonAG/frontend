import { UUID } from "crypto";
import { StatusEnum } from "./StatusEnum";

export type Employee = {
	id: UUID;
	status: StatusEnum;
	firstName: string;
	lastName: string;
	identifier: string;
	divisions: Array<string>;
};

export function getEmployeeDisplayString(employee: Employee) {
	return `${employee.firstName} ${employee.lastName} (${employee.identifier})`;
}
