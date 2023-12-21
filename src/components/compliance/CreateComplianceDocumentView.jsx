import { Box, Divider, Stack, Typography } from "@mui/material";
import { ContentLayout } from "../ContentLayout";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styled from "@emotion/styled";
import { toBase64 } from "../../services/converters/BinaryConverter";
import { useSubmit } from "react-router-dom";

const Dropzone = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isDragActive"
})(({theme, isDragActive}) => {
  return {
    height: 300,
    cursor: "pointer",
    borderRadius: theme.spacing(1.5),
    padding: theme.spacing(2),
    borderStyle: "dashed",
    borderColor: theme.palette.divider,
    borderWidth: "thin",
    backgroundColor: isDragActive ? theme.palette.primary.hover : undefined
  };
});

export function CreateComplianceDocumentView() {
  const { t } = useTranslation();
  return (
    <ContentLayout title={t("New document")} height="100%">
      <Stack spacing={3}>
        <Typography variant="h6">{t("Generate document")}</Typography>
        <Divider>{t("OR")}</Divider>
        <Typography variant="h6">{t("Upload document")}</Typography>
        <UploadComplianceDocumentView />
      </Stack>
    </ContentLayout>
  );
}

function UploadComplianceDocumentView() {
  const submit = useSubmit();
  const onDrop = useCallback(acceptedFiles => {
    const upload = async () => {
      if (acceptedFiles.length !== 1)
        return;
      const file = acceptedFiles[0];
      const data = await toBase64(file);
      const document = {
        name: file.name,
        contentType: file.type,
        content: data
      };
      
      submit(document, { method: "post", encType: "application/json" })
    }
    upload();
  }, []);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, maxFiles: 1});

  return (
    <Dropzone {...getRootProps({isDragActive})}>
      <input {...getInputProps()} />
      <Stack justifyContent="center" height="100%">
        {
          isDragActive ?
            <Typography alignSelf="center">Drop the files here ...</Typography> :
            <Typography alignSelf="center">Drag and drop your compliance documents here, or click to select files</Typography>
        }
      </Stack>
    </Dropzone>
  )
}
