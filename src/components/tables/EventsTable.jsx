import { React } from "react";
import { useLoaderData, useOutletContext } from "react-router-dom";
import TableView from "./TableView";
import { dateColumns } from "./caseValueDateColumns";

function EventsTable({ defaultTitle }) {
  const title = useOutletContext() || defaultTitle;
  const events = useLoaderData();

  const columns = [
    {
      field: "caseName",
      headerName: "Case",
      flex: 3,
    },
    {
      field: "caseFieldName",
      headerName: "Field",
      flex: 3,
    },
    {
      field: "value",
      headerName: "Value",
      flex: 3,
    },
    ...dateColumns
  ];

  return (
    <TableView
      title={title}
      tableData={events}
      columns={columns}
      rowHeight={25}
      initialState={{
        sorting: {
          sortModel: [{ field: "created", sort: "desc" }],
        },
      }}
    />
  );
};

export default EventsTable;
