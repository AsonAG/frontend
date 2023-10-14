import { Outlet, useRouteLoaderData } from "react-router-dom";

function EmployeeView({ routeLoaderDataName }) {
    const { employee } = useRouteLoaderData(routeLoaderDataName);
    const header = employee.firstName + " " + employee.lastName;
    return <Outlet context={header} />;
}

export default EmployeeView;