import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import TasksApi from "../../api/TasksApi";
import ApiClient from "../../ApiClient";

const mockDataTeam = [
  {
    id: 1,
    name: "Onboarding",
    date: "12.05.2023",
    access: "admin"
  },{
    id: 2,
    name: "Quellensteuer vervollstaedigen",
    date: "20.04.2023",
    access: "user"
  }
];

let tableData = [];

const tasksArrayToTableArray = function(tasksArray){

}

const callback = function (error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log("API called successfully. Returned data: " + data);
    data.forEach(element => {
      tableData.push({"name": element["name"]})
    });
  }
};

const Tasks = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const tasksApi = new TasksApi(ApiClient);
  tasksApi.getCaseTasks(callback);
  console.log("Table data loaded: " + tableData);


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
      field: "accessLevel",
      headerName: "Access Level",
      headerAlign: "center",
      flex: 2,
      renderCell: ({ row: { access } }) => {
        return (
          <Box
            width="50%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              access === "admin"
                ? colors.greenAccent[600]
                : access === "manager"
                ? colors.greenAccent[700]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {access === "admin" && <AdminPanelSettingsOutlinedIcon />}
            {access === "manager" && <SecurityOutlinedIcon />}
            {access === "user" && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {access}
            </Typography>
          </Box>
        );
      },
    },
  ];

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
            color: colors.greenAccent[300],
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
        <DataGrid rows={mockDataTeam} columns={columns} />
      </Box>
    </Box>
  );
};

export default Tasks;
