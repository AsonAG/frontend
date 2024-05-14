export type Employee = {
  id: number,
  firstName: string,
  lastName: string,
  identifier: string
}

export function getEmployeeDisplayString(employee: Employee) {
  return `${employee.firstName} ${employee.lastName} (${employee.identifier})`;
}
