import { React, useState } from "react";
import TableView from "./TableView";
import { EmployeeButtons } from "../buttons/EmployeeButtons";
import { useLoaderData } from "react-router-dom";

const EmployeesTable = () => {
  const employees = useLoaderData();

  const columns = [
    {
      field: "firstName",
      headerName: "First name",
      flex: 3,
    },
    {
      field: "lastName",
      headerName: "Last name",
      flex: 3,
    },
    {
      field: "identifier",
      headerName: "Email",
      flex: 3,
    },
    {
      field: "divisions",
      headerName: "Division",
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
      title="Employees"
      tableData={employees}
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

export default EmployeesTable;
