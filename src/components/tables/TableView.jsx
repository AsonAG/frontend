import { Stack } from "@mui/material"
import TableComponent from "./TableComponent"
import Header from "../Header";


function TableView({title, ...tableProps}) {
    return (
        <Stack p={4} gap={2} useFlexGap sx={{height: "100%"}}>
            <Header title={title} />
            <TableComponent {...tableProps} />
        </Stack>
    )
}

export default TableView;