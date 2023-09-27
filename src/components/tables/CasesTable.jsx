import { React } from "react";
import { useLoaderData, useNavigate, useOutletContext } from "react-router-dom";
import TableView from "./TableView";
import { useTranslation } from "react-i18next";


const CasesTable = ({defaultTitle}) => {
  const title = useOutletContext() || defaultTitle;
  const cases = useLoaderData();
  const navigate = useNavigate();
  const { t } = useTranslation(); 


  const columns = [
    {
      field: "displayName",
      headerName: t("Name"),
      headerAlign: "left",
      cellClassName: "name-column--cell",
      hideable: false,
      flex: 1,
    },
    {
      field: "description",
      headerName: t("Description"),
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
    <TableView 
      title={title}
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
      onRowClick={params => navigate(params.row.name)}
    />
  );
};

export default CasesTable;
