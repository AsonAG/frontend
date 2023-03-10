import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LinearProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import TasksApi from "../../api/TasksApi";
import ApiClient from "../../ApiClient";
import Header from "../../components/Header";

const Tasks = ({ updateCaseName }) => {
  const [tasksData, setTasksData] = useState([]);
  const [tasksDataLoaded, setTasksDataLoaded] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const tasksApi = new TasksApi(ApiClient);
  const columns = [
    // { field: "id", headerName: "ID" },
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
        console.log(caseName);

        return (
          <IconButton
            component={Link}
            to="/case"
            variant="outlined"
            color="secondary"
            size="medium"
            // endIcon={<SendIcon />}
            onClick={() => updateCaseName(caseName)}
          >
            <SendIcon />
          </IconButton>
        );
      },
    },
  ];

  const callback = function (error, data, response) {
    let tableData = [];
    if (error) {
      console.error(error);
    } else {
      console.log("API called successfully. Returned data: " + data);
      data.forEach((element, index) => {
        tableData = [
          ...tableData,
          {
            id: index,
            displayName: element["name"],
            caseName: element["name"],
            // ApiClient.basePath + "/" + encodeURIComponent(element["name"]),
          },
        ];
      });
      console.log("Table data loaded: " + JSON.stringify(tableData, null, 2));
      setTasksData(tableData);
      setTasksDataLoaded(true);
    }
  };

  useEffect(() => {
    tasksApi.getCaseTasksMOCK(callback);
  }, []);

  return (
    <Box m="25px">
      {/* HEADER */}
      <Header title="TASKS" subtitle="Finish your tasks" />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        m="40px 0 0 0"
        height="75vh"
        width="55vw"
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
          loading={!tasksDataLoaded}
          rows={tasksData}
          columns={columns}
          justifyContent="center"
          alignItems="center"
        />
      </Box>
    </Box>
  );
};

export default Tasks;
