import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbar,
} from "@mui/x-data-grid";
import { Box, IconButton, useTheme } from "@mui/material";
import { React, useState, useEffect, useMemo, useContext } from "react";
import EmployeesApi from "../../api/EmployeesApi";
import { tokens } from "../../theme";
import EmployeesSplitButton from "../buttons/EmployeesSplitButton";
import { EmployeeSelectionContext, UserContext } from "../../App";
import ApiClient from "../../api/ApiClient";
import ErrorBar from "../errors/ErrorBar";
import CasesApi from "../../api/CasesApi";
import { format } from "date-fns";

const EventsTable = ({ caseType, employeeId, clusterName }) => {
  const [caseData, setCaseData] = useState([]);
  const [caseDataLoaded, setCaseDataLoaded] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user, setUser } = useContext(UserContext);
  const casesApi = useMemo(() => new CasesApi(ApiClient, user), [user]);
  const [error, setError] = useState();
  const [searchText, setSearchText] = useState("");
  const [caseDataFiltered, setCaseDataFiltered] = useState(caseData);

  useEffect(() => {
    setCaseData([]);
    casesApi.getCaseValues(callback, caseType, employeeId, clusterName);
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
            caseName: element["caseName"],
            caseFieldName: element["caseFieldName"],
            value: element["value"],
            valueType: element["valueType"],
            start: element["start"],
            end: element["end"],
            created: element["created"],
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

  const dateTimeFormatter = (params) =>
    format(new Date(params?.value), "yyyy-MM-dd hh:mm");

  const dateFormatter = (params) =>
    format(new Date(params?.value), "yyyy-MM-dd");

  const columns = [
    {
      field: "caseName",
      headerName: "Case",
      flex: 3,
      cellClassName: "name-column--cell",
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
//     {
//       field: "valueType",
//       headerName: "Value Type",
//       flex: 3,
//     },
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
      headerName: "created",
      flex: 3,
      valueFormatter: dateTimeFormatter,
    },
  ];
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
    <Box
      height="75vh"
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
      {error && (
        <ErrorBar error={error} resetErrorBoundary={() => setError(null)} />
      )}
      <DataGrid
        // disableColumnSelector
        // disableDensitySelector
        loading={!caseDataLoaded}
        rows={caseDataFiltered}
        columns={columns}
        justifyContent="center"
        alignItems="center"
        components={{ Toolbar: QuickSearchToolbar }}
        componentsProps={{
          toolbar: {
            value: searchText,
            onChange: (event) => requestSearch(event.target.value),
            clearSearch: () => requestSearch(""),
          },
        }}
        initialState={{
          sorting: {
            sortModel: [{ field: "created", sort: "asc" }],
          },
        }}
        rowHeight={25}
        // getRowHeight={() => 'auto'}
      />
    </Box>
  );
};

export default EventsTable;
