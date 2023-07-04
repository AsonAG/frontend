import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { CaseContext } from "../../scenes/global/CasesForm";
import { useContext } from "react";
import { Markup } from "interweave";
import FieldDescriptionComponent from "./FieldDescriptionComponent";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { useState } from "react";
import { FieldAttachmentFileContext } from "./FieldComponent";

const FieldValueFileComponent = (
  fieldDisplayName,
  fieldDescription,
  fieldValue,
  handleTextValueChange,
  handleTextBlur,
  fieldValueType,
  fieldKey,
  slotInputProps,
  attributes
) => {
  //   const caseIsReadOnly = useContext(CaseContext);
  const extensions = attributes?.["input.attachmentExtensions"];
  const required = attributes?.["input.attachment"] === "Mandatory";
  const [attachmentFiles, setAttachmentFiles] = useContext(FieldAttachmentFileContext);

  const handleUpload = (event) => {
//     setFiles((current) => [...current, event.target.files[0]]);
        setAttachmentFiles(event.target.files);
  };

  // TODO: refactor color to separate style files
  return (
    <Stack marginLeft="14px" marginBottom="5px">
      <Typography color="rgba(0, 0, 0, 0.6)">
        {fieldDisplayName + (required ? "*" : "")}
      </Typography>
      {/* <Box width="160px"> */}
        <IconButton variant="contained" component="label">
          <FileUploadOutlinedIcon />
          <input
            type="file"
            onChange={handleUpload}
            accept={extensions}
            multiple
            //     hidden
            required={required}
          />
          
        </IconButton>
      {/* </Box> */}
      {FieldDescriptionComponent(fieldDescription)}
    </Stack>
  );
};
export default FieldValueFileComponent;
