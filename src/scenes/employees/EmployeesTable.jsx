import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, useTheme } from "@mui/material";
import { React, useState, useEffect } from "react";
import EmployeesApi from "../../api/EmployeesApi";
import ApiClient from "../../ApiClient";
import { tokens } from "../../theme";

const EmployeesTable = ({ updateCaseName }) => {
  const [employeeData, setEmployeeData] = useState([]);
  const [employeeDataLoaded, setEmployeeDataLoaded] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const employeesApi = new EmployeesApi(ApiClient);
  const navigate = useNavigate();

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
    }
  };

  useEffect(() => {
    employeesApi.getEmployees(callback);
  }, []);

  const handleRowClick = (params) => {
    console.log(params.row.caseName + " row clicked.");
    updateCaseName(params.row.caseName);
    navigate("/case");
  };

  const columns = [
        {
          field: "firstName",
          headerName: "First name",
          headerAlign: "left",
          flex: 3,
          cellClassName: "name-column--cell",
        },
        {
          field: "lastName",
          headerName: "Last name",
          flex: 3,
          headerAlign: "left",
        },
        {
          field: "email",
          headerName: "Email",
          flex: 3,
          headerAlign: "left",
        },
    {
      field: "caseName",
      headerName: "Cases",
      flex: 1,
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

  return (
    <Box
//       display="flex"
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
        loading={!employeeDataLoaded}
        rows={employeeData}
        columns={columns}
        justifyContent="center"
        alignItems="center"
        onRowClick={handleRowClick}
      />
    </Box>
  );
};

export default EmployeesTable;
