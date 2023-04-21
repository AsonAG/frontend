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

/**
 * Returns a table component representation of list of available cases.
 * @param updateCaseName setCaseName parent funciton.
 * @param caseType of CaseType type [Employee/Company/Global/National].
 * @returns {CasesTable} The a table component representation of list of available cases.
 */
const CasesTable = ({ updateCaseName, caseType, employee, clusterName }) => {
  const [caseData, setCaseData] = useState([]);
  const [caseDataLoaded, setCaseDataLoaded] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user, setUser } = useContext(UserContext);
  const casesApi = useMemo(() => new CasesApi(ApiClient, user), [user]);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [caseDataFiltered, setCaseDataFiltered] = useState(caseData);

  useEffect(() => {
    setCaseData([]);
    casesApi.getCases(callback, caseType, employee?.employeeId, clusterName);
  }, [user]);


  const callback = function (error, data, response) {
    let tableData = [];
    if (error) {
      console.error(error);
    } else {
      data.forEach((element, index) => {
        tableData = [
          ...tableData,
          {
            id: index,
            displayName: element["displayName"],
            caseName: element["name"],
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
    }
  };

  const handleRowClick = (params) => {
    console.log(params.row.caseName + " row clicked.");
    updateCaseName(params.row.caseName);
    navigate("/case");
  };
  
  const columns = [
    {
      field: "displayName",
      headerName: "Name",
      headerAlign: "left",
      flex: 3,
      cellClassName: "name-column--cell",
    },
    {
      field: "caseName",
      headerName: "Proceed",
      flex: 2,
      align: "center",
      renderCell: ({ row: { caseName } }) => {
        return (
          <IconButton
            component={Link}
            to="/case"
            variant="outlined"
            color="secondary"
            size="medium"
            onClick={() => updateCaseName(caseName)}
          >
            <SendIcon />
          </IconButton>
        );
      },
    },
  ];  

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = caseData.filter((row) => {
      return Object.keys(row).some((field) => {
        return searchRegex.test(row[field].toString());
      });
    });
    setCaseDataFiltered(filteredRows);
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      height="75vh"
      // width="55vw"
      sx={{
        "& .MuiDataGrid-root": {
          border: "none",
        },
        "& .MuiDataGrid-cell": {
          // borderBottom: "none",
        },
        "& .name-column--cell": {
          // color: colors.greenAccent[300],
          marginLeft: "5px",
        },
        "& .MuiDataGrid-columnHeaderTitle": {
          marginLeft: "5px",
        },
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: colors.blueAccent[800],
          borderBottom: "none",
        },
        "& .MuiDataGrid-virtualScroller": {
          backgroundColor: colors.primary[400],
        },
        "& .MuiDataGrid-footerContainer": {
          borderTop: "none",
          backgroundColor: colors.blueAccent[800],
        },
        "& .MuiCheckbox-root": {
          color: `${colors.greenAccent[200]} !important`,
        },
      }}
    >
      <DataGrid
        disableSelectionOnClick
        loading={!caseDataLoaded}
        rows={caseData}
        columns={columns}
        justifyContent="center"
        alignItems="center"
        onRowClick={handleRowClick}
        components={{ Toolbar: QuickSearchToolbar }}
        componentsProps={{
          toolbar: {
            value: searchText,
            onChange: (event) => requestSearch(event.target.value),
            clearSearch: () => requestSearch(''),
          },
        }}
      />
    </Box>
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
};

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export default CasesTable;
