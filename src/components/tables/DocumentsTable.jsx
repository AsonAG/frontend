import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { React, useState, useEffect, useMemo, useContext } from "react";
import { UserContext } from "../../App";
import ApiClient from "../../api/ApiClient";
import ValuesApi from "../../api/ValuesApi";
import { format } from "date-fns";
import TableComponent from "./TableComponent";
import { getLanguageCode } from "../../services/converters/LanguageConverter";
import { FileIcon, defaultStyles } from "react-file-icon";
import { Link } from "react-router-dom";
import DocumentsApi from "../../api/DocumentsApi";
import CasesApi from "../../api/CasesApi";
import { DownloadOutlined } from "@mui/icons-material";

const DocumentsTable = ({ caseType, employeeId, clusterName }) => {
  const [tableData, setTableData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const valuesApi = useMemo(() => new ValuesApi(ApiClient, user), [user]);
  const casesApi = useMemo(() => new CasesApi(ApiClient, user), [user]);
  const documentsApi = useMemo(() => new DocumentsApi(ApiClient, user), [user]);
  const [error, setError] = useState();
  const [backdropOpen, setBackdropOpen] = useState(false);

  const langCode = getLanguageCode(user.language);

  useEffect(() => {
    setTableData([]);
    setIsDataLoaded(false);
    casesApi.getCaseValues(callback, caseType, employeeId, clusterName);
  }, [user]);

  const callback = function (error, data, response) {
    let tableData = [];
    if (error) {
      setError(error);
      console.error(JSON.stringify(error, null, 2));
      setIsDataLoaded(true);
    } else {
      data.forEach((element) => {
        // if (element["valueType"] === "Document") {
        tableData = [
          ...tableData,
          {
            id: element["id"],
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
            documents: element["documents"],
          },
        ];
        // }
      });
      console.log(
        "API called successfully. Table data loaded: " +
          JSON.stringify(tableData, null, 2)
      );
      setTableData(tableData);
      setIsDataLoaded(true);
      setError(null);
    }
  };

  const dateTimeFormatter = (params) =>
    params?.value ? format(new Date(params?.value), "yyyy-MM-dd HH:mm") : null;

  const dateFormatter = (params) =>
    params?.value ? format(new Date(params?.value), "yyyy-MM-dd") : null;

  const handleFileClick = (docId, row) => {
    setBackdropOpen(true);
    documentsApi.getDocument(
      docId,
      row.id,
      caseType,
      employeeId,
      getFileCallback
    );
  };

  const handleClose = () => {
    setBackdropOpen(false);
  };

  const getFileCallback = (error, data, response) => {
    if (error) {
      setError(error);
      console.error(JSON.stringify(error, null, 2));
      setBackdropOpen(false);
    } else {
      downloadBase64File(data.content, data.contentType, data.name);
      setBackdropOpen(false);
      setError(null);
    }
  };

  const columns = [
    {
      field: "caseFieldName",
      headerName: "Name (event field name)",
      flex: 3,
    },
    {
      field: "caseName",
      headerName: "Case",
      flex: 3,
    },
    {
      field: "documents",
      headerName: "Documents",
      flex: 3,
      renderCell: ({ row }) => {
        if (Array.isArray(row.documents)) {
          const rowCopy = row;
          return (
            <Stack spacing={2}>
              {row.documents.map((doc) => {
                const contentType = doc.name?.split(".").pop();
                return (
                  <Box
                    display="inline-flex"
                    onClick={() => handleFileClick(doc.id, rowCopy)}
                    component={Link}
                    alignItems="center"
                  >
                    <Box width="30px" marginRight="15px">
                      <FileIcon
                        extension={contentType}
                        {...defaultStyles[contentType]}
                      />
                    </Box>
                    <Typography>{doc.name}</Typography>
                  </Box>
                );
              })}
            </Stack>
          );
        }
      },
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
    <Box>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={backdropOpen}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <TableComponent
        error={error}
        setError={setError}
        loading={!isDataLoaded}
        tableData={tableData}
        columns={columns}
        initialState={{
          columns: {
            columnVisibilityModel: {
              caseName: false,
            },
          },
          sorting: {
            sortModel: [{ field: "created", sort: "desc" }],
          },
        }}
        getRowHeight={() => "auto"}
        sx={{
          "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": { py: "8px" },
          "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
            py: "12px",
          },
          "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
            py: "22px",
          },
        }}
      />
    </Box>
  );
};

function downloadBase64File(base64Data, contentType, fileName) {
  const linkSource = `data:${contentType};base64,${base64Data}`;
  const downloadLink = document.createElement("a");
  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
}

export default DocumentsTable;
