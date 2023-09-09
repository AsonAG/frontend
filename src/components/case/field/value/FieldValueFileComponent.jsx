import { Box, IconButton, Stack, Typography } from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { FieldContext } from "../FieldComponent";
import { useContext, useState, useEffect } from "react";
import { toBase64 } from "../../../../services/converters/BinaryConverter";


// TODO AJO fix file upload
function FieldValueFileComponent() {
  const { field, isReadonly, displayName, attachments } = useContext(FieldContext);
  const extensions = field.attributes?.["input.attachmentExtensions"];
  // const required = attributes?.["input.attachment"] === "Mandatory";
  const required = true;
  const [attachmentFiles, setAttachmentFiles] = useState([]);

  useEffect(() => {
    attachments[field.id] = attachmentFiles;
  }, [attachmentFiles]);


  const handleUpload = async (event) => {
    const files = event.target.files;
    const attachments = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const data = await toBase64(file);
      attachments.push({
        name: file.name,
        contentType: file.type,
        content: data
      });
    }

    setAttachmentFiles(current => [
      ...current,
      ...attachments
    ]);

  };

  // TODO: refactor color to separate style files
  return (
    <Stack marginLeft="14px" marginBottom="5px">
      <Typography color="rgba(0, 0, 0, 0.6)">
        {displayName + (required ? "*" : "")}
      </Typography>
      <Box width="160px">
        <IconButton
          variant="contained"
          component="label"
        >
          <FileUploadOutlinedIcon />
            <input
              disabled={isReadonly}
              type="file"
              onChange={handleUpload}
              accept={extensions}
              multiple
              required={required}
            />
        </IconButton>
      </Box>
    </Stack>
  );
};
export default FieldValueFileComponent;
