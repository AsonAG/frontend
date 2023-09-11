import { Outlet, useLoaderData, useRouteLoaderData } from "react-router-dom";
import { Stack } from "@mui/material";
import Header from "../../components/Header";

function EmployeeView() {
    const employee = useLoaderData();
    const data = useRouteLoaderData("root");
    const header = employee.firstName + " " + employee.lastName;
    return (
        // <Stack useFlexGap p={4} sx={{height: "100%", overflowX: 'hidden'}}>
        //     <Header title={header} />
            <Outlet context={data} />
        // </Stack>
    );
}

export default EmployeeView;