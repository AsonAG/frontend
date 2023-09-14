import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";

function TableComponent({
  tableData,
  columns,
  initialState,
  ...props
}){
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

      }}
    >
      <DataGrid
        rows={tableDataFiltered}
        columns={columns}
        disableColumnMenu
        components={{ Toolbar: QuickSearchToolbar }}
        componentsProps={{
          toolbar: {
            value: searchText,
            onChange: (event) => requestSearch(event.target.value),
            clearSearch: () => requestSearch(""),
          },
        }}
        sx={{
          "& .MuiDataGrid-cell:focus": {
            outline: 'none'
          },
          "& .MuiDataGrid-cell:focus-within": {
            outline: 'none'
          },
          "& .MuiDataGrid-columnHeader:focus": {
            outline: 'none'
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "primary.hover"
          }
        }}
        initialState={initialState}
        {...props}
      />
    </Box>
  );
};

export default TableComponent;
