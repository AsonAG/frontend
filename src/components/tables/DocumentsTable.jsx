import {
  Backdrop,
  Box,
  CircularProgress,
  Stack,
  Typography,
  Button
} from "@mui/material";
import { React, useState } from "react";
import dayjs from "dayjs";
import TableView from "./TableView";
import { FileIcon, defaultStyles } from "react-file-icon";
import { Link, useLoaderData, useOutletContext, useParams } from "react-router-dom";
import { getDocument } from "../../api/FetchClient";

// TODO AJO localized formatting
const dateTimeFormatter = (params) =>
  params?.value ? dayjs(params.value).format("YYYY-MM-DD HH:mm") : null;

const dateFormatter = (params) =>
  params?.value ? dayjs(params.value).format("YYYY-MM-DD") : null;

function DocumentsTable({ defaultTitle }) {
  // TODO AJO localization
  const title = useOutletContext() || defaultTitle;
  const events = useLoaderData();
  const params = useParams();
  const [backdropOpen, setBackdropOpen] = useState(false);

  const handleFileClick = async (documentId, caseValueId) => {
    setBackdropOpen(true);
    try {
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
            <Stack>
              {caseValue.documents.map((doc) => {
                const extension = doc.name?.split(".").pop();
                return (
                  <Stack
                    sx={{py: 1}}
                    direction="row"
                    spacing={1}
                    onClick={() => handleFileClick(doc.id, caseValue.id)}
                    component={Button}
                    alignItems="center"
                    key={doc.id}
                  >
                    <Box width="24px">
                      <FileIcon extension={extension} {...defaultStyles[extension]}/>
                    </Box>
                    <Typography>{doc.name}</Typography>
                  </Stack>
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
    <>
      <TableView
        title={title}
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
      />
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={backdropOpen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
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
