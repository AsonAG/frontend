import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined';
import TasksApi from "../../api/TasksApi";
import ApiClient from "../../ApiClient";
import Header from "../../components/Header";
import { React, useEffect, useState } from "react";


const Tasks = () => {
  const [tasksData, setTasksData] = useState([]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const tasksApi = new TasksApi(ApiClient);

  const columns = [
    // { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      headerAlign: "left",
      flex: 3,
      cellClassName: "name-column--cell",
    },
    {
      field: "action",
      headerName: "Action",
      headerAlign: "center",
      flex: 2,
      renderCell: ({ row: { access } }) => {
        return (
          <Box
            width="80px"
            m="0 auto"
            p="6px"
            display="flex"
            justifyContent="center"
            backgroundColor={colors.blueAccent[800]}
            borderRadius="4px"
          >
            <Typography color={colors.grey[100]} sx={{ m: "0 2px" }}>
              Proceed
            </Typography>
            <NavigateNextOutlinedIcon />
          </Box>
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
            name: element["name"],
            link: ApiClient.basePath + "/" + encodeURIComponent(element["name"]),
            access: "user"
          },
        ];
      });
      console.log("Table data loaded: " + JSON.stringify(tableData, null, 2));
      setTasksData(tableData);
    }
  };

  useEffect(() => {
    tasksApi.getCaseTasks(callback);
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
            marginLeft: "5px"
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            marginLeft: "5px"
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
        <DataGrid rows={tasksData} columns={columns} />
      </Box>
    </Box>
  );
};

export default Tasks;
