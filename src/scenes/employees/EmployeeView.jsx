import { Outlet, useLoaderData } from "react-router-dom";

function EmployeeView() {
    const employee = useLoaderData();
    const header = employee.firstName + " " + employee.lastName;
    return <Outlet context={header} />;
}

export default EmployeeView;