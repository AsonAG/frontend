import {
  Backdrop,
  Box,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { React, useState } from "react";
import dayjs from "dayjs";
import TableComponent from "./TableComponent";
import { FileIcon, defaultStyles } from "react-file-icon";
import { Link, useLoaderData } from "react-router-dom";

const DocumentsTable = () => {
  // TODO AJO localization
  const events = useLoaderData();
  // TODO AJO document downloading
  // const documentsApi = useMemo(() => new DocumentsApi(ApiClient), []);
  const [backdropOpen, setBackdropOpen] = useState(false);

  // TODO AJO localized formatting
  const dateTimeFormatter = (params) =>
    params?.value ? dayjs(params.value).format("yyyy-MM-dd HH:mm") : null;

  const dateFormatter = (params) =>
    params?.value ? dayjs(params.value).format("yyyy-MM-dd") : null;

  const handleFileClick = (docId, row) => {
    setBackdropOpen(true);
    // documentsApi.getDocument(
    //   docId,
    //   row.id,
    //   caseType,
    //   employeeId,
    //   getFileCallback
    // );
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
        tableData={events}
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
