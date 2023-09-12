import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";

const TableComponent = ({
  tableData,
  loading,
  columns,
  initialState,
  ...props
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchText, setSearchText] = useState("");
  const [tableDataFiltered, setTableDataFiltered] = useState([]);


  useEffect(() => {
    setTableDataFiltered(tableData);
  }, [tableData])

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
    const filteredRows = tableData.filter((row) => {
      return Object.keys(row).some((field) => {
        return searchRegex.test(row[field].toString());
      });
    });
    setTableDataFiltered(filteredRows);
  };

  return (
    <Box
      sx={{
        flex: 1,
        "& .MuiDataGrid-root": {
          //   border: "none",
        },
        "& .MuiDataGrid-cell": {
          //   borderBottom: "none",
        },
        "& .name-column--cell": {
          //   color: colors.greenAccent[300],
          marginLeft: "5px",
        },
        "& .MuiDataGrid-columnHeaderTitle": {
          color: colors.blueAccent,
          marginLeft: "5px",
          fontWeight: "bold",
        },
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: colors.primary[400],
          //   borderBottom: "none",
        },
        "& .MuiDataGrid-virtualScroller": {
          backgroundColor: colors.primary[500],
        },
        "& .MuiDataGrid-footerContainer": {
          //   borderTop: "none",
          backgroundColor: colors.primary[500],
        },
        "& .MuiCheckbox-root": {
          color: `${colors.blueAccent} !important`,
        },
        "& .name-column--cell:hover": {
          color: `${colors.blueAccentReverse} !important`,
        },
      }}
    >
      <DataGrid
        loading={loading}
        rows={tableDataFiltered}
        columns={columns}
        components={{ Toolbar: QuickSearchToolbar }}
        componentsProps={{
          toolbar: {
            value: searchText,
            onChange: (event) => requestSearch(event.target.value),
            clearSearch: () => requestSearch(""),
          },
        }}
        initialState={initialState}
        {...props}
      />
    </Box>
  );
};

export default TableComponent;
