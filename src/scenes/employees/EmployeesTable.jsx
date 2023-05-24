import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbar,
} from "@mui/x-data-grid";
import { Box, IconButton, useTheme } from "@mui/material";
import { React, useState, useEffect, useMemo, useContext } from "react";
import EmployeesApi from "../../api/EmployeesApi";
import { tokens } from "../../theme";
import EmployeesSplitButton from "./EmployeesSplitButton";
import { EmployeeSelectionContext, UserContext } from "../../App";
import ApiClient from "../../api/ApiClient";


const EmployeesTable = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [employeeDataLoaded, setEmployeeDataLoaded] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user, setUser } = useContext(UserContext);
  const {employee, setEmployee} = useContext(EmployeeSelectionContext);
  const employeesApi = useMemo(() => new EmployeesApi(ApiClient, user), [user]);


  useEffect(() => {
    setEmployeeData([]);
    setEmployeeDataLoaded(false);
    setEmployeeDataFiltered([]);
    employeesApi.getEmployees(callback);
  }, [user]);

/**
 * set Employee object in session storage
 */
const handleEmployeeSelection = (employee) => {
  setEmployee(employee)
  // window.sessionStorage.setItem("employee", JSON.stringify(employee));
};

  const callback = function (error, data, response) {
    let tableData = [];
    if (error) {
      console.error(error);
    } else {
      data.forEach((element, index) => {
        tableData = [
          ...tableData,
          {
            id: element["id"],
            employeeId: element["id"],
            firstName: element["firstName"],
            lastName: element["lastName"],
            divisions: element["divisions"],
            statuts: element["statuts"],
            email: element["identifier"],
            // ApiClient.basePath + "/" + encodeURIComponent(element["name"]),
          },
        ];
      });
      console.log(
        "API called successfully. Table data loaded: " +
          JSON.stringify(tableData, null, 2)
      );
      setEmployeeData(tableData);
      setEmployeeDataLoaded(true);
      setEmployeeDataFiltered(tableData);
    }
  };

  // const handleRowClick = (params) => {
  //   console.log(params.row.caseName + " row clicked.");
  //   updateCaseName(params.row.caseName);
  //   navigate("/case");
  // };

  const columns = [
    {
      field: "firstName",
      headerName: "First name",
      flex: 3,
      cellClassName: "name-column--cell",
    },
    {
      field: "lastName",
      headerName: "Last name",
      flex: 3,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 3,
    },
    {
      field: "divisions",
      headerName: "Division",
      flex: 3,
    },
    {
      field: "employeeId",
      headerName: "Cases",
      flex: 3,
      headerAlign: "left",
      align: "center",
      renderCell: ({ row: { employeeId } }) => {
        return (
          <EmployeesSplitButton
            employee={employeeData.find((x) => x.employeeId === employeeId)}
            setEmployeeChoice={handleEmployeeSelection}
          ></EmployeesSplitButton>
        );
      },
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

  const [searchText, setSearchText] = useState("");
  const [employeeDataFiltered, setEmployeeDataFiltered] =
    useState(employeeData);

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
    const filteredRows = employeeData.filter((row) => {
      return Object.keys(row).some((field) => {
        return searchRegex.test(row[field].toString());
      });
    });
    setEmployeeDataFiltered(filteredRows);
  };

  return (
    <Box
      //       display="flex"
      justifyContent="space-between"
      alignItems="center"
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
      <DataGrid
        // disableSelectionOnClick
        // disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        loading={!employeeDataLoaded}
        rows={employeeDataFiltered}
        columns={columns}
        justifyContent="center"
        alignItems="center"
        // slots={{
        //   Toolbar: GridToolbar
        // // toolbar: QuickSearchToolbar
        // }}
        // slotProps={{
        //   toolbar: {
        //     showQuickFilter: true,
        //     quickFilterProps: { debounceMs: 500 },
        //   },
        // }}
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
            sortModel: [{ field: "firstName", sort: "asc" }],
          },
        }}
      />
    </Box>
  );
};

export default EmployeesTable;
