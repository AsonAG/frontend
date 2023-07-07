import { Box, IconButton, useTheme } from "@mui/material";
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { React, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import CasesApi from "../../api/CasesApi";
import ApiClient from "../../api/ApiClient";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../App";
import { useErrorBoundary } from "react-error-boundary";
import ErrorBar from "../errors/ErrorBar";
import TableWrapper from "./TableWrapper";

/**
 * Returns a table component representation of list of available cases.
 * @param caseType of CaseType type [Employee/Company/Global/National].
 * @returns {CasesTable} The a table component representation of list of available cases.
 */
const CasesTable = ({ caseType, employeeId, clusterName, navigateTo }) => {
  const [caseData, setCaseData] = useState([]);
  const [caseDataLoaded, setCaseDataLoaded] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const casesApi = useMemo(() => new CasesApi(ApiClient, user), [user]);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [caseDataFiltered, setCaseDataFiltered] = useState(caseData);
  const [error, setError] = useState();

  useEffect(() => {
    setCaseData([]);
    casesApi.getCases(callback, caseType, employeeId, clusterName);
  }, [user]);

  const callback = function (error, data, response) {
    let tableData = [];
    if (error) {
      setError(error);
      console.error(JSON.stringify(error, null, 2));
      setCaseDataLoaded(true);
    } else {
      data.forEach((element, index) => {
        tableData = [
          ...tableData,
          {
            id: index,
            displayName: element["displayName"],
            caseName: element["name"],
            clusters: element["clusters"],
            description: element["description"],
            // ApiClient.basePath + "/" + encodeURIComponent(element["name"]),
          },
        ];
      });
      console.log(
        "API called successfully. Table data loaded: " +
          JSON.stringify(tableData, null, 2)
      );
      setCaseData(tableData);
      setCaseDataLoaded(true);
      setCaseDataFiltered(tableData);
      setError(null);
    }
  };

  const handleCaseSelection = (caseName) => {
    window.sessionStorage.setItem("caseName", caseName);
  };

  const handleRowClick = (params) => {
    console.log(params.row.caseName + " row clicked.");
    handleCaseSelection(params.row.caseName);
    navigate(navigateTo);
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

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
    const filteredRows = caseData.filter((row) => {
      return Object.keys(row).some((field) => {
        return searchRegex.test(row[field].toString());
      });
    });
    setCaseDataFiltered(filteredRows);
  };

  return (
    <TableWrapper error={error} setError={setError}>
      <DataGrid
        disableSelectionOnClick
        loading={!caseDataLoaded}
        rows={caseData}
        columns={columns}
        // justifyContent="center"
        // alignItems="center"
        onRowClick={handleRowClick}
        components={{ Toolbar: QuickSearchToolbar }}
        componentsProps={{
          toolbar: {
            value: searchText,
            onChange: (event) => requestSearch(event.target.value),
            clearSearch: () => requestSearch(""),
          },
        }}
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
      />
    </TableWrapper>
  );
};

function QuickSearchToolbar() {
  return (
    <Box
      sx={{
        p: 0.5,
        pb: 0,
      }}
    >
      <GridToolbarQuickFilter />
    </Box>
  );
}

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

export default CasesTable;
