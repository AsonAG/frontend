import { React } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import TableComponent from "./TableComponent";

const CasesTable = () => {
  const cases = useLoaderData();
  const navigate = useNavigate();
  
  // TODO AJO can we do this better? i.e links
  const handleRowClick = (params) => {
    navigate(params.row.name);
  };

  const columns = [
    {
      field: "displayName",
      headerName: "Name",
      headerAlign: "left",
      cellClassName: "name-column--cell",
      hideable: false,
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
      headerAlign: "left",
      flex: 1,
    },
    {
      field: "clusters",
      headerName: "Clusters",
      flex: 1,
      renderCell: ({ row: { cluster } }) => {
        if (Array.isArray(cluster)) return cluster.combine(", ");
      },
    },
  ];

  return (
    <TableComponent 
        tableData={cases}
        columns={columns}
        initialState={{
          columns: {
            columnVisibilityModel: {
              clusters: false,
              description: false,
            },
          },
          sorting: {
            sortModel: [{ field: "displayName", sort: "asc" }],
          },
        }}
        disableSelectionOnClick
        onRowClick={handleRowClick}
      />
  );
};

export default CasesTable;
