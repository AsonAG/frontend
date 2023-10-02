import { Stack } from "@mui/material"
import TableComponent from "./TableComponent"
import Header from "../Header";
import { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";
import { Loading } from "../Loading";
import { ErrorView } from "../ErrorView";

function TableView({title, ...tableProps}) {
    const routeData = useLoaderData();
    return (
        <Stack p={4} gap={2} useFlexGap sx={{height: "100%"}}>
            <Header title={title} />
            <Suspense fallback={<Loading />}>
                <Await resolve={routeData.data} errorElement={<ErrorView />}>
                    <TableComponent {...tableProps} />
                </Await>
            </Suspense>
            
        </Stack>
    )
}

export default TableView;