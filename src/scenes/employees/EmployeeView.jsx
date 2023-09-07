import { Outlet, useLoaderData, useRouteLoaderData } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "../../components/Header";

function EmployeeView() {
    const employee = useLoaderData();
    const data = useRouteLoaderData("root");
    const header = employee.firstName + " " + employee.lastName;
    return (
        <Box m="25px">
            <Header title={header} />
            <Outlet context={data}/>
        </Box>
    );
}

export default EmployeeView;