import { React, useState, useEffect, useMemo, useContext } from "react";
import { UserContext } from "../../App";
import ApiClient from "../../api/ApiClient";
import ValuesApi from "../../api/ValuesApi";
import dayjs from "dayjs";
import TableComponent from "./TableComponent";
import { getLanguageCode } from "../../services/converters/LanguageConverter";

const EventsTable = ({ caseType, employeeId, clusterName }) => {
  const [caseData, setCaseData] = useState([]);
  const [caseDataLoaded, setCaseDataLoaded] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const valuesApi = useMemo(() => new ValuesApi(ApiClient, user), [user]);
  const [error, setError] = useState();

  const langCode = getLanguageCode(user.language);

  useEffect(() => {
    setCaseDataLoaded(false);
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
      // setCaseDataFiltered(tableData);
      setError(null);
    }
  };

  const dateTimeFormatter = (params) =>
    params?.value ? dayjs(params.value).format("YYYY-MM-DD HH:mm") : null;

  const dateFormatter = (params) =>
    params?.value ? dayjs(params.value).format("YYYY-MM-DD") : null;

  const columns = [
    {
      field: "caseName",
      headerName: "Case",
      flex: 3,
      // uncomment if you want to highlight on hover
      // cellClassName: "name-column--cell",  
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

  return (
    <TableComponent error={error} setError={setError}
        tableData={caseData}
        columns={columns}
        loading={!caseDataLoaded}
        rowHeight={25}
        initialState={{
          sorting: {
            sortModel: [{ field: "created", sort: "desc" }],
          },
        }}
      />
  );
};

export default EventsTable;
