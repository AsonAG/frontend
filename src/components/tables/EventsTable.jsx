import { React } from "react";
import { useLoaderData, useOutletContext } from "react-router-dom";
import TableView from "./TableView";
import { createDateColumns } from "./caseValueDateColumns";
import { useTranslation } from "react-i18next";

function EventsTable({ defaultTitle }) {
  const title = useOutletContext() || defaultTitle;
  const events = useLoaderData();
  const { t } = useTranslation();

  const columns = [
    {
      field: "caseName",
      headerName: t("Case"),
      flex: 3,
    },
    {
      field: "caseFieldName",
      headerName: t("Field"),
      flex: 3,
    },
    {
      field: "value",
      headerName: t("Value"),
      flex: 3,
    },
    ...createDateColumns()
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
