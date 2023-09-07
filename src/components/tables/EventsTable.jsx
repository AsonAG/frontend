import { React } from "react";
import dayjs from "dayjs";
import TableComponent from "./TableComponent";
import { useLoaderData } from "react-router-dom";

const EventsTable = () => {
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
    <TableComponent
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
