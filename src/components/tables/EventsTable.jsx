import { React } from "react";
import dayjs from "dayjs";
import { useLoaderData, useOutletContext } from "react-router-dom";
import TableView from "./TableView";

function EventsTable({ defaultTitle }) {
  const title = useOutletContext() || defaultTitle;
  const events = useLoaderData();

  const dateTimeFormatter = (params) =>
    params?.value ? dayjs(params.value).format("YYYY-MM-DD HH:mm") : null;

  const dateFormatter = (params) =>
    params?.value ? dayjs(params.value).format("YYYY-MM-DD") : null;

    // TODO AJO localization
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
    {
      field: "start",
      headerName: "Start",
      flex: 3,
      valueFormatter: dateFormatter,
    },
    {
      field: "end",
      headerName: "End",
      flex: 3,
      valueFormatter: dateFormatter,
    },
    {
      field: "created",
      headerName: "Created",
      flex: 3,
      valueFormatter: dateTimeFormatter,
    },
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
