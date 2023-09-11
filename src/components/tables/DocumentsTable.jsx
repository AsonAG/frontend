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
import { Link, useLoaderData, useParams } from "react-router-dom";
import { getDocument } from "../../api/FetchClient";

// TODO AJO localized formatting
const dateTimeFormatter = (params) =>
  params?.value ? dayjs(params.value).format("YYYY-MM-DD HH:mm") : null;

const dateFormatter = (params) =>
  params?.value ? dayjs(params.value).format("YYYY-MM-DD") : null;

const DocumentsTable = () => {
  // TODO AJO localization
  const events = useLoaderData();
  const params = useParams();
  const [backdropOpen, setBackdropOpen] = useState(false);

  const handleFileClick = async (documentId, caseValueId) => {
    setBackdropOpen(true);
    try {
      console.log(params);
      const document = await getDocument(params.tenantId, caseValueId, documentId, params.employeeId);
      downloadBase64File(document.content, document.contentType, document.name);
    }
    finally {
      setBackdropOpen(false);
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
      renderCell: ({ row: caseValue }) => {
        if (Array.isArray(caseValue.documents)) {
          return (
            <Stack spacing={2}>
              {caseValue.documents.map((doc) => {
                const extension = doc.name?.split(".").pop();
                return (
                  <Box
                    display="inline-flex"
                    onClick={() => handleFileClick(doc.id, caseValue.id)}
                    component={Link}
                    alignItems="center"
                  >
                    <Box width="30px" marginRight="15px">
                      <FileIcon
                        extension={extension}
                        {...defaultStyles[extension]}
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
