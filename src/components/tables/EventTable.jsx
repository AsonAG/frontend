import { React } from "react";
import { useOutletContext } from "react-router-dom";
import TableView from "./TableView";
import { createDateColumns } from "./caseValueDateColumns";
import { useTranslation } from "react-i18next";

export function EventTable({ defaultTitle }) {
  const title = useOutletContext() || defaultTitle;
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