import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { React, useState, useEffect, useMemo, useContext } from "react";
import { UserContext } from "../../App";
import ApiClient from "../../api/ApiClient";
import ErrorBar from "../errors/ErrorBar";
import ValuesApi from "../../api/ValuesApi";
import { format } from "date-fns";
import TableWrapper from "./TableWrapper";
import { getLanguageCode } from "../../api/converter/LanguageConverter";

const EventsTable = ({ caseType, employeeId, clusterName }) => {
  const [caseData, setCaseData] = useState([]);
  const [caseDataLoaded, setCaseDataLoaded] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const valuesApi = useMemo(() => new ValuesApi(ApiClient, user), [user]);
  const [error, setError] = useState();
  const [searchText, setSearchText] = useState("");
  const [caseDataFiltered, setCaseDataFiltered] = useState(caseData);

  const langCode = getLanguageCode(user.language);

  useEffect(() => {
    setCaseData([]);
    valuesApi.getCaseValues(callback, caseType, employeeId, clusterName);
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
            caseName:
              langCode && element["caseNameLocalizations"][langCode]
                ? element["caseNameLocalizations"][langCode]
                : element["caseName"],
            caseFieldName:
              langCode && element["caseFieldNameLocalizations"][langCode]
                ? element["caseFieldNameLocalizations"][langCode]
                : element["caseFieldName"],
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
    params?.value ? format(new Date(params?.value), "yyyy-MM-dd HH:mm") : null;

  const dateFormatter = (params) =>
    params?.value ? format(new Date(params?.value), "yyyy-MM-dd") : null;

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
      headerName: "Created",
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
    <TableWrapper error={error} setError={setError}>
      <DataGrid
        // disableColumnSelector
        // disableDensitySelector
        loading={!caseDataLoaded}
        rows={caseDataFiltered}
        columns={columns}
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
            sortModel: [{ field: "created", sort: "desc" }],
          },
        }}
        rowHeight={25}
        // getRowHeight={() => 'auto'}
      />
    </TableWrapper>
  );
};

export default EventsTable;
