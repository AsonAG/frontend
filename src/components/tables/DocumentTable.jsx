import {
  Backdrop,
  Box,
  CircularProgress,
  Stack,
  Typography,
  Button
} from "@mui/material";
import { React, useState } from "react";
import TableView from "./TableView";
import { FileIcon, defaultStyles } from "react-file-icon";
import { useOutletContext, useParams } from "react-router-dom";
import { getDocument } from "../../api/FetchClient";
import { createDateColumns } from "./caseValueDateColumns";
import { useTranslation } from "react-i18next";


export function DocumentTable({ defaultTitle }) {
  const title = useOutletContext() || defaultTitle;
  const params = useParams();
  const [backdropOpen, setBackdropOpen] = useState(false);
  const { t } = useTranslation();

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
      headerName: t("Name (event field name)"),
      flex: 2,
    },
    {
      field: "documents",
      headerName: t("Documents"),
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
    ...createDateColumns()
  ];

  return (
    <>
      <TableView
        title={title}
        columns={columns}
        initialState={{
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