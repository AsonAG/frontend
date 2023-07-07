import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbar,
} from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { React, useState, useEffect, useMemo, useContext } from "react";
import EmployeesApi from "../../api/EmployeesApi";
import EmployeeSelectorOptions from "../selectors/EmployeeSelectorOptions";
import { EmployeeSelectionContext, UserContext } from "../../App";
import ApiClient from "../../api/ApiClient";
import ErrorBar from "../errors/ErrorBar";
import TableWrapper from "./TableWrapper";
import { EmployeeButtons } from "../buttons/EmployeeButtons";

const EmployeesTable = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [employeeDataLoaded, setEmployeeDataLoaded] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const { employee, setEmployee } = useContext(EmployeeSelectionContext);
  const employeesApi = useMemo(
    () => new EmployeesApi(ApiClient, user.tenantId, user.currentDivisionId),
    [user]
  );
  const [error, setError] = useState();

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
    setEmployee(employee);
    // window.sessionStorage.setItem("employee", JSON.stringify(employee));
  };

  const callback = function (error, data, response) {
    let tableData = [];
    if (error) {
      console.error(error);
      setError(error);
      setEmployeeDataLoaded(true);
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
      setError(null);
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
      headerName: "",
      flex: 3,
      headerAlign: "left",
      align: "left",
      hideable: false,
      sortable: false,
      renderCell: ({ row: { employeeId } }) => {
        return (
          <EmployeeButtons
            employee={employeeData.find((x) => x.employeeId === employeeId)}
            setEmployeeChoice={handleEmployeeSelection}
            key={"employee-buttons-"+employeeId}
          ></EmployeeButtons>
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
    <TableWrapper error={error} setError={setError}>
      <DataGrid
        // disableSelectionOnClick
        // disableColumnFilter
        // disableColumnSelector
        // disableDensitySelector
        loading={!employeeDataLoaded}
        rows={employeeDataFiltered}
        columns={columns}
        // justifyContent="center"
        // alignItems="center"
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
    </TableWrapper>
  );
};

export default EmployeesTable;
