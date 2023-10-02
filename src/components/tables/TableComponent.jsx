import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAsyncValue } from "react-router-dom";

function TableComponent({
  columns,
  initialState,
  ...props
}){
  const tableData = useAsyncValue();
  const [searchText, setSearchText] = useState("");
  const [tableDataFiltered, setTableDataFiltered] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    setTableDataFiltered(tableData);
  }, [tableData])

  function QuickSearchToolbar() {
    return (
      <Box
        sx={{
          pt: 1,
          pl: 1,
          pb: 0,
        }}
      >
        <GridToolbarQuickFilter placeholder={t("Search...")} />
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
          pagination: {
            labelRowsPerPage: t('Rows per page:')
          }
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
