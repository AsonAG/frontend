import { React } from "react";
import TableView from "./TableView";
import { EmployeeButtons } from "../buttons/EmployeeButtons";
import { useTranslation } from "react-i18next";

export function EmployeeTable() {
  const { t } = useTranslation();

  const columns = [
    {
      field: "firstName",
      headerName: t("First name"),
      flex: 3,
    },
    {
      field: "lastName",
      headerName: t("Last name"),
      flex: 3,
    },
    {
      field: "identifier",
      headerName: t("Email"),
      flex: 3,
    },
    {
      field: "divisions",
      headerName: t("Division"),
      flex: 3,
    },
    {
      field: "id",
      headerName: "",
      headerAlign: "left",
      align: "left",
      hideable: false,
      sortable: false,
      width: 160,
      renderCell: ({ row: { id } }) => <EmployeeButtons employeeId={id} />,
    },
  ];

  return (
    <TableView
      title={t("Employees")}
      columns={columns}
      rowHeight={50}
      initialState={{
        columns: {
          columnVisibilityModel: {
            divisions: false,
          },
        },
        sorting: {
          sortModel: [{ field: "firstName", sort: "asc" }],
        },
      }}
    />
  );
};